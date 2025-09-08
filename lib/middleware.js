import { validateSession } from './session.js';

// Middleware to protect routes that require authentication
export async function requireAuth(request) {
  try {
    // Get session token from Authorization header or cookies
    const authHeader = request.headers.get('authorization');
    const sessionToken = authHeader?.replace('Bearer ', '') || 
                        request.cookies.get('sessionToken')?.value;

    if (!sessionToken) {
      return {
        success: false,
        error: 'No session token provided',
        status: 401
      };
    }

    // Validate session
    const sessionData = await validateSession(sessionToken);
    
    if (!sessionData) {
      return {
        success: false,
        error: 'Invalid or expired session',
        status: 401
      };
    }

    return {
      success: true,
      user: sessionData
    };

  } catch (error) {
    console.error('Auth middleware error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      status: 500
    };
  }
}

// Middleware to check if user is admin
export async function requireAdmin(request) {
  const authResult = await requireAuth(request);
  
  if (!authResult.success) {
    return authResult;
  }

  // Check if user is admin (you can modify this logic based on your admin criteria)
  if (authResult.user.type !== 'admin') {
    return {
      success: false,
      error: 'Admin access required',
      status: 403
    };
  }

  return authResult;
}

// Middleware to log API requests
export function logRequest(request, response, user = null) {
  const timestamp = new Date().toISOString();
  const method = request.method;
  const url = request.url;
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'Unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User: ${user?.username || 'Anonymous'} - UA: ${userAgent}`);
}

// Rate limiting middleware (simple implementation)
const rateLimitMap = new Map();

export function rateLimit(identifier, maxRequests = 100, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean old entries
  for (const [key, data] of rateLimitMap.entries()) {
    if (data.timestamp < windowStart) {
      rateLimitMap.delete(key);
    }
  }
  
  // Check current requests
  const current = rateLimitMap.get(identifier) || { count: 0, timestamp: now };
  
  if (current.timestamp < windowStart) {
    current.count = 1;
    current.timestamp = now;
  } else {
    current.count++;
  }
  
  rateLimitMap.set(identifier, current);
  
  if (current.count > maxRequests) {
    return {
      success: false,
      error: 'Rate limit exceeded',
      status: 429
    };
  }
  
  return { success: true };
}
