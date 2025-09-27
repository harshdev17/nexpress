import { NextResponse } from 'next/server';
import { db, old_db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function runQuery(sql, params = []) {
  const pools = [old_db, db].filter(Boolean);
  let last;
  for (const p of pools) {
    try {
      if (typeof p.query === 'function') {
        const rows = await new Promise((resolve, reject) => {
          p.query(sql, params, (err, res) => (err ? reject(err) : resolve(res)));
        });
        return rows;
      }
      if (typeof p.promise === 'function') {
        const [rows] = await p.promise().query(sql, params);
        return rows;
      }
    } catch (e) {
      last = e;
    }
  }
  if (last) throw last;
  throw new Error('No DB pool');
}

export async function GET(request, ctx) {
  try {
    const { slug: rawSlug } = await ctx.params;
    const slug = decodeURIComponent(rawSlug || '').toLowerCase();
    if (!slug) return NextResponse.json({ success: false, error: 'Missing slug' }, { status: 400 });

    const catRows = await runQuery(
      `SELECT id, CatName, PageName, ParentId, CatImage
       FROM categories
       WHERE LOWER(PageName) = LOWER(?) AND Visible = 1 AND Deleted = 0
       LIMIT 1`,
      [slug]
    );

    if (!catRows || !catRows.length) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    const category = catRows[0];

    const children = await runQuery(
      `SELECT id, CatName, PageName, ParentId, CatImage
       FROM categories
       WHERE ParentId = ? AND Visible = 1 AND Deleted = 0
       ORDER BY Priority ASC, CatName ASC`,
      [category.id]
    );

    return NextResponse.json({ success: true, category, children });
  } catch (e) {
    console.error('Category by slug API error:', e);
    return NextResponse.json({ success: false, error: 'Failed to fetch category', details: e?.message || String(e) }, { status: 500 });
  }
}


