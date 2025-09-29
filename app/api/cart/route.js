import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { old_db } from '@/lib/db';

async function ensureTable() {
  await old_db.promise().query(`
    CREATE TABLE IF NOT EXISTS user_carts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      items JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

export async function GET(request) {
  const auth = await requireAuth(request);
  if (!auth.success) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  await ensureTable();
  const [rows] = await old_db.promise().query('SELECT items FROM user_carts WHERE user_id = ? LIMIT 1', [auth.user.userId]);
  const items = rows.length ? JSON.parse(rows[0].items || '[]') : [];
  return NextResponse.json({ success: true, items });
}

export async function PUT(request) {
  const auth = await requireAuth(request);
  if (!auth.success) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  await ensureTable();
  const body = await request.json();
  const items = Array.isArray(body.items) ? body.items : [];
  await old_db.promise().query(
    'INSERT INTO user_carts (user_id, items) VALUES (?, ?) ON DUPLICATE KEY UPDATE items = VALUES(items), updated_at = CURRENT_TIMESTAMP',
    [auth.user.userId, JSON.stringify(items)]
  );
  return NextResponse.json({ success: true });
}


