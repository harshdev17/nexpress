import { NextResponse } from 'next/server';
import { user_db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createSession, logSecurityEvent } from '@/lib/session';

export async function POST(request) {
  const startTime = Date.now();
  let userId = null;
  let sessionId = null;
  
  try {
    const body = await request.json();
    const { email, password, loginSource = 'direct' } = body;

    console.log(`Login attempt for email: ${email}`);

    // Validate input
    if (!email || !password) {
      await logSecurityEvent(null, null, 'invalid_input', 'low', 'Missing email or password', request);
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const [users] = await user_db.promise().query(
      'SELECT id, username, password, first_name, last_name, email, active, deleted FROM user_db WHERE email = ? AND deleted = 0',
      [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
      await logSecurityEvent(null, null, 'failed_login', 'medium', `Login attempt with non-existent email: ${email}`, request);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];
    userId = user.id;

    // Check if user is active
    if (!user.active) {
      await logSecurityEvent(userId, null, 'account_deactivated', 'high', 'Login attempt on deactivated account', request);
      return NextResponse.json(
        { success: false, error: 'Account is deactivated. Please contact support.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await logSecurityEvent(userId, null, 'failed_login', 'medium', 'Invalid password attempt', request);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    const sessionData = await createSession(userId, request, loginSource);
    sessionId = sessionData.sessionId;

    // Log successful login
    await logSecurityEvent(userId, sessionId, 'successful_login', 'low', 'User logged in successfully', request);

    const loginTime = Date.now() - startTime;
    console.log(`✅ Login successful for user: ${user.username} (ID: ${userId}) in ${loginTime}ms`);

    // Update login analytics with performance data
    await user_db.promise().query(`
      UPDATE login_analytics 
      SET login_success = 1, login_time_ms = ?
      WHERE session_id = ?
    `, [loginTime, sessionId]);

    // Login successful
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      session: {
        accessToken: sessionData.accessToken,
        refreshToken: sessionData.refreshToken,
        expiresAt: sessionData.expiresAt
      },
      user: {
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      },
      loginTime: loginTime
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Log error event
    await logSecurityEvent(userId, sessionId, 'login_error', 'high', `Login system error: ${error.message}`, request);
    
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}