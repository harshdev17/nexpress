import { NextResponse } from 'next/server';
import { getUserSessions, validateSession } from '@/lib/session';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get('sessionToken');

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Session token is required' },
        { status: 400 }
      );
    }

    // Validate session first
    const sessionData = await validateSession(sessionToken);
    
    if (!sessionData) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Get user sessions
    const sessions = await getUserSessions(sessionData.userId);
    
    return NextResponse.json({
      success: true,
      message: 'User sessions retrieved successfully',
      sessions: sessions,
      currentSession: {
        id: sessionData.sessionId,
        deviceType: sessionData.deviceType,
        browserName: sessionData.browserName,
        ipAddress: sessionData.ipAddress,
        loginTime: sessionData.loginTime,
        lastActivity: sessionData.lastActivity
      }
    });

  } catch (error) {
    console.error('Get user sessions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve user sessions' },
      { status: 500 }
    );
  }
}
