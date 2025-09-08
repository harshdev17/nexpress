import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { user_db } from '@/lib/db';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists and is active, not deleted
    const [users] = await user_db.promise().query(
      'SELECT id, email, active, deleted FROM user_db WHERE email = ? LIMIT 1',
      [normalizedEmail]
    );

    // For security, do not reveal if user exists; proceed with token generation only if exists and active
    if (users.length === 0 || users[0].deleted === 1 || users[0].active === 0) {
      // Still respond success
      return NextResponse.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
    }

    const userId = users[0].id;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    // Ensure table exists (idempotent)
    await user_db.promise().query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        token VARCHAR(128) NOT NULL,
        expires_at DATETIME NOT NULL,
        used TINYINT(1) NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        INDEX idx_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Invalidate previous tokens for this user
    await user_db.promise().query(
      'UPDATE password_reset_tokens SET used = 1 WHERE user_id = ? AND used = 0',
      [userId]
    );

    await user_db.promise().query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at, used) VALUES (?, ?, ?, 0)',
      [userId, token, expiresAt]
    );

    // TODO: send email. For now, return token so the front-end can redirect to reset page.
    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, error: 'Unable to process request' }, { status: 500 });
  }
}


