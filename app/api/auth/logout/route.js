import { NextResponse } from 'next/server';
import { logoutSession, logSecurityEvent } from '@/lib/session';
import { old_db } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionToken, reason = 'user_logout', sessionId = null } = body;

    if (!sessionToken && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session token or sessionId is required' },
        { status: 400 }
      );
    }

    if (sessionId) {
      // Logout by sessionId
      await old_db.promise().query(
        `UPDATE user_sessions SET is_active = 0 WHERE id = ?`,
        [sessionId]
      );
      await logSecurityEvent(null, sessionId, 'user_logout', 'low', `User logged out session ${sessionId}: ${reason}`, request);
      
      // Clear session cookie
      const response = NextResponse.json({ success: true, message: 'Session logged out successfully' });
      response.cookies.set('sessionToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });
      return response;
    }

    // Logout by token (default)
    const success = await logoutSession(sessionToken, reason);
    
    if (success) {
      await logSecurityEvent(null, null, 'user_logout', 'low', `User logged out: ${reason}`, request);
      
      // Clear session cookie
      const response = NextResponse.json({ success: true, message: 'Logout successful' });
      response.cookies.set('sessionToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });
      return response;
    } else {
      return NextResponse.json(
        { success: false, error: 'Logout failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed. Please try again.' },
      { status: 500 }
    );
  }
}
