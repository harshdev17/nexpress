import jwt from 'jsonwebtoken';
import { old_db } from './db.js';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = '24h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// Device and Browser Detection
function parseUserAgent(userAgent) {
  const ua = userAgent || '';
  
  // Device Type Detection
  let deviceType = 'desktop';
  if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    deviceType = 'mobile';
  } else if (/Tablet|iPad/i.test(ua)) {
    deviceType = 'tablet';
  }
  
  // Browser Detection
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  
  if (ua.includes('Chrome')) {
    browserName = 'Chrome';
    const match = ua.match(/Chrome\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('Firefox')) {
    browserName = 'Firefox';
    const match = ua.match(/Firefox\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browserName = 'Safari';
    const match = ua.match(/Version\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('Edge')) {
    browserName = 'Edge';
    const match = ua.match(/Edge\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  }
  
  // OS Detection
  let osName = 'Unknown';
  let osVersion = 'Unknown';
  
  if (ua.includes('Windows')) {
    osName = 'Windows';
    if (ua.includes('Windows NT 10.0')) osVersion = '10';
    else if (ua.includes('Windows NT 6.3')) osVersion = '8.1';
    else if (ua.includes('Windows NT 6.1')) osVersion = '7';
  } else if (ua.includes('Mac OS X')) {
    osName = 'macOS';
    const match = ua.match(/Mac OS X (\d+[._]\d+)/);
    if (match) osVersion = match[1].replace('_', '.');
  } else if (ua.includes('Linux')) {
    osName = 'Linux';
  } else if (ua.includes('Android')) {
    osName = 'Android';
    const match = ua.match(/Android (\d+\.\d+)/);
    if (match) osVersion = match[1];
  } else if (ua.includes('iOS')) {
    osName = 'iOS';
    const match = ua.match(/OS (\d+[._]\d+)/);
    if (match) osVersion = match[1].replace('_', '.');
  }
  
  return {
    deviceType,
    browserName,
    browserVersion,
    osName,
    osVersion
  };
}

// IP and Location Detection (simplified - in production use a proper service)
function getClientInfo(request) {
  const hdrs = request.headers;
  
  // Get IP Address (respect proxies, take first in list)
  const forwarded = hdrs.get('x-forwarded-for') || '';
  const realIp = hdrs.get('x-real-ip') || '';
  const cfIp = hdrs.get('cf-connecting-ip') || '';
  let ip = forwarded.split(',')[0].trim() || realIp || cfIp || request.ip || '127.0.0.1';
  if (ip === '::1') ip = '127.0.0.1';
  
  // Get User Agent
  const userAgent = hdrs.get('user-agent') || '';
  
  // Parse device info
  const deviceInfo = parseUserAgent(userAgent);
  
  return {
    ipAddress: ip,
    userAgent,
    ...deviceInfo
  };
}

// Generate JWT Tokens
export function generateTokens(userId, username) {
  const payload = {
    userId,
    username,
    iat: Math.floor(Date.now() / 1000)
  };
  
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  
  return { accessToken, refreshToken };
}

// Verify JWT Token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Create Session in Database
export async function createSession(userId, request, loginSource = 'direct') {
  try {
    const clientInfo = getClientInfo(request);
    const { accessToken, refreshToken } = generateTokens(userId, '');
    
    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    // If an active session exists for same user, same device and same IP, reuse it (avoid duplicates)
    const [existing] = await old_db.promise().query(
      `SELECT id FROM user_sessions 
       WHERE user_id = ? AND is_active = 1 AND ip_address = ? AND user_agent = ?
       ORDER BY last_activity DESC LIMIT 1`,
      [userId, clientInfo.ipAddress, clientInfo.userAgent]
    );

    if (existing.length > 0) {
      const existingId = existing[0].id;
      await old_db.promise().query(
        `UPDATE user_sessions 
         SET session_token = ?, refresh_token = ?, browser_name = ?, browser_version = ?,
             os_name = ?, os_version = ?, device_type = ?, login_source = ?,
             expires_at = ?, last_activity = NOW()
         WHERE id = ?`,
        [
          accessToken, refreshToken, clientInfo.browserName, clientInfo.browserVersion,
          clientInfo.osName, clientInfo.osVersion, clientInfo.deviceType, loginSource,
          expiresAt, existingId
        ]
      );

      // Deactivate any other active sessions for the same device/IP to avoid duplicates
      await old_db.promise().query(
        `UPDATE user_sessions SET is_active = 0
         WHERE user_id = ? AND is_active = 1 AND user_agent = ? AND ip_address = ? AND id <> ?`,
        [userId, clientInfo.userAgent, clientInfo.ipAddress, existingId]
      );

      await createLoginAnalytics(userId, existingId, clientInfo);

      return {
        sessionId: existingId,
        accessToken,
        refreshToken,
        expiresAt
      };
    }
    
    // Insert new session
    const [result] = await old_db.promise().query(`
      INSERT INTO user_sessions (
        user_id, session_token, refresh_token, user_agent, device_type,
        browser_name, browser_version, os_name, os_version, ip_address,
        expires_at, login_source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId, accessToken, refreshToken, clientInfo.userAgent, clientInfo.deviceType,
      clientInfo.browserName, clientInfo.browserVersion, clientInfo.osName, clientInfo.osVersion,
      clientInfo.ipAddress, expiresAt, loginSource
    ]);

    // Deactivate any other active sessions for the same device/IP to avoid duplicates
    await old_db.promise().query(
      `UPDATE user_sessions SET is_active = 0
       WHERE user_id = ? AND is_active = 1 AND user_agent = ? AND ip_address = ? AND id <> ?`,
      [userId, clientInfo.userAgent, clientInfo.ipAddress, result.insertId]
    );
    
    // Create analytics entry
    await createLoginAnalytics(userId, result.insertId, clientInfo);
    
    return {
      sessionId: result.insertId,
      accessToken,
      refreshToken,
      expiresAt
    };
    
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

// Create Login Analytics
async function createLoginAnalytics(userId, sessionId, clientInfo) {
  try {
    const now = new Date();
    
    await old_db.promise().query(`
      INSERT INTO login_analytics (
        session_id, login_success, login_time_ms
      ) VALUES (?, ?, ?)
    `, [
      sessionId, 0, 0
    ]);
    
  } catch (error) {
    console.error('Error creating login analytics:', error);
  }
}

// Validate Session
export async function validateSession(sessionToken) {
  try {
    // Ensure sessionToken is a string
    if (typeof sessionToken !== 'string') {
      return null;
    }
    
    // Verify JWT token
    const decoded = verifyToken(sessionToken);
    if (!decoded) return null;
    
    // Check session in database
    const [sessions] = await old_db.promise().query(`
      SELECT s.*, c.Username, c.Forename, c.Surname, c.Email, c.Active, c.Deleted
      FROM user_sessions s
      JOIN customers c ON s.user_id = c.id
      WHERE s.session_token = ? AND s.is_active = 1 AND s.expires_at > NOW()
    `, [sessionToken]);
    
    if (sessions.length === 0) return null;
    
    const session = sessions[0];
    
    // Update last activity
    await old_db.promise().query(`
      UPDATE user_sessions SET last_activity = NOW() WHERE id = ?
    `, [session.id]);
    
    return {
      sessionId: session.id,
      userId: session.user_id,
      username: session.Username,
      firstName: session.Forename,
      lastName: session.Surname,
      email: session.Email,
      loginTime: session.login_time,
      lastActivity: session.last_activity,
      deviceType: session.device_type,
      browserName: session.browser_name,
      ipAddress: session.ip_address
    };
    
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
}

// Logout Session
export async function logoutSession(sessionToken, reason = 'user_logout') {
  try {
    await old_db.promise().query(`
      UPDATE user_sessions 
      SET is_active = 0
      WHERE session_token = ?
    `, [sessionToken]);
    
    return true;
  } catch (error) {
    console.error('Error logging out session:', error);
    return false;
  }
}

// Get User Sessions
export async function getUserSessions(userId) {
  try {
    const [sessions] = await old_db.promise().query(`
      SELECT id, device_type, browser_name, os_name, ip_address, 
             login_time, last_activity, is_active
      FROM user_sessions 
      WHERE user_id = ? 
      ORDER BY login_time DESC
      LIMIT 10
    `, [userId]);
    
    return sessions;
  } catch (error) {
    console.error('Error getting user sessions:', error);
    return [];
  }
}

// Security Event Logging
export async function logSecurityEvent(userId, sessionId, eventType, eventSeverity, description, request = null) {
  try {
    const clientInfo = request ? getClientInfo(request) : {};
    
    await old_db.promise().query(`
      INSERT INTO security_events (
        user_id, session_id, event_type, severity, description,
        ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      userId, sessionId, eventType, eventSeverity, description,
      clientInfo.ipAddress || null, clientInfo.userAgent || null
    ]);
    
  } catch (error) {
    console.error('Error logging security event:', error);
  }
}
