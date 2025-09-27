import { NextResponse } from 'next/server';
import { db, old_db } from '@/lib/db';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function runQuery(sql, params = []) {
  const tryPools = [old_db, db].filter(Boolean);
  let lastError = null;
  for (const pool of tryPools) {
    try {
      if (typeof pool.query === 'function') {
        const results = await new Promise((resolve, reject) => {
          pool.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
        });
        return results;
      }
      if (typeof pool.promise === 'function') {
        const [rows] = await pool.promise().query(sql, params);
        return rows;
      }
    } catch (e) {
      lastError = e;
    }
  }
  if (lastError) throw lastError;
  throw new Error('No available database pool to execute query');
}

export async function GET() {
  try {
    const rows = await runQuery(`
      SELECT id, CatName, ParentId, PageName, CatImage, Priority
      FROM categories
      WHERE ShowInMenu = 1 AND Visible = 1 AND Deleted = 0
      ORDER BY ParentId ASC, Priority ASC, CatName ASC
    `);

    // Build tree
    const byId = new Map(rows.map(r => [r.id, { ...r, children: [] }]));
    const roots = [];
    for (const row of rows) {
      const node = byId.get(row.id);
      if (row.ParentId && byId.has(row.ParentId)) {
        byId.get(row.ParentId).children.push(node);
      } else {
        roots.push(node);
      }
    }

    return NextResponse.json({ success: true, categories: roots });
  } catch (e) {
    console.error('Categories API error:', e);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories', details: e?.message || String(e) }, { status: 500 });
  }
}



