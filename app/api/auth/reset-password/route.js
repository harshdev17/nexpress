import { NextResponse } from 'next/server';
import { user_db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { token, password, confirmPassword } = await request.json();
    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: 'Passwords do not match' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Find valid token
    const [rows] = await user_db.promise().query(
      'SELECT id, user_id, expires_at, used FROM password_reset_tokens WHERE token = ? LIMIT 1',
      [token]
    );
    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 400 });
    }
    const entry = rows[0];
    if (entry.used === 1 || new Date(entry.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 400 });
    }

    // Update password
    const saltRounds = 12;
    const hashed = await bcrypt.hash(password, saltRounds);
    await user_db.promise().query('UPDATE user_db SET password = ? WHERE id = ? LIMIT 1', [hashed, entry.user_id]);

    // Mark token as used
    await user_db.promise().query('UPDATE password_reset_tokens SET used = 1 WHERE id = ?', [entry.id]);

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ success: false, error: 'Unable to reset password' }, { status: 500 });
  }
}


