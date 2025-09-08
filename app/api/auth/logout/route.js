import { NextResponse } from 'next/server';
import { logoutSession, logSecurityEvent } from '@/lib/session';
import { user_db } from '@/lib/db';

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
      await user_db.promise().query(
        `UPDATE user_sessions SET is_active = 0, logout_time = NOW(), logout_reason = ? WHERE id = ?`,
        [reason, sessionId]
      );
      await logSecurityEvent(null, sessionId, 'user_logout', 'low', `User logged out session ${sessionId}: ${reason}`, request);
      return NextResponse.json({ success: true, message: 'Session logged out successfully' });
    }

    // Logout by token (default)
    const success = await logoutSession(sessionToken, reason);
    
    if (success) {
      await logSecurityEvent(null, null, 'user_logout', 'low', `User logged out: ${reason}`, request);
      return NextResponse.json({ success: true, message: 'Logout successful' });
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
