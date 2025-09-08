import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/session';

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Session token is required' },
        { status: 400 }
      );
    }

    // Validate session
    const sessionData = await validateSession(sessionToken);
    
    if (sessionData) {
      return NextResponse.json({
        success: true,
        message: 'Session is valid',
        session: sessionData
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { success: false, error: 'Session validation failed' },
      { status: 500 }
    );
  }
}
