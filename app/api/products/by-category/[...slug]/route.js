import { NextResponse } from 'next/server';
import { db, old_db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function runQuery(poolSql, params = []) {
  const pools = [old_db, db].filter(Boolean);
  let last;
  for (const p of pools) {
    try {
      if (typeof p.query === 'function') {
        const rows = await new Promise((resolve, reject) => {
          p.query(poolSql, params, (err, res) => (err ? reject(err) : resolve(res)));
        });
        return rows;
      }
      if (typeof p.promise === 'function') {
        const [rows] = await p.promise().query(poolSql, params);
        return rows;
      }
    } catch (e) { last = e; }
  }
  if (last) throw last;
  throw new Error('No DB pool');
}

export async function GET(req, { params }) {
  try {
    const segments = Array.isArray(params.slug) ? params.slug : [];
    if (!segments.length) {
      return NextResponse.json({ success: false, error: 'Missing slug' }, { status: 400 });
    }
    const targetSlug = decodeURIComponent(segments[segments.length - 1]).toLowerCase();

    // Resolve category by PageName
    const catRows = await runQuery(
      `SELECT id, CatName, PageName, ParentId FROM categories WHERE LOWER(PageName) = LOWER(?) AND Visible=1 AND Deleted=0 LIMIT 1`,
      [targetSlug]
    );
    if (!catRows || !catRows.length) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    const category = catRows[0];

    // Fetch products linked to this category (support both CategoryID1/2 and link table)
    const products = await runQuery(
      `SELECT DISTINCT p.id, p.ItemName, p.ItemShortDesc, p.ItemPrice, p.ItemMainImage, p.Brand, p.Featured, p.IsSoldOut
       FROM products p
       LEFT JOIN products_categories pc ON pc.ProductID = p.id
       WHERE p.Visible = 1 AND p.Deleted = 0 AND (
         p.CategoryID1 = ? OR p.CategoryID2 = ? OR pc.CategoryID = ?
       )
       ORDER BY p.Featured DESC, p.id DESC
       LIMIT 48`,
      [category.id, category.id, category.id]
    );

    // Prefix images
    const base = (process.env.BACKEND_URL || 'http://localhost:8010').replace(/\/+$/, '');
    const mapped = products.map(pr => {
      const raw = pr.ItemMainImage || '';
      const abs = /^https?:\/\//i.test(raw);
      return {
        ...pr,
        ItemPrice: parseFloat(pr.ItemPrice) || 0,
        ItemMainImage: abs ? raw : `${base}/product/${String(raw).replace(/^\/+/, '')}`
      };
    });

    return NextResponse.json({ success: true, category, products: mapped });
  } catch (e) {
    console.error('Products by category API error:', e);
    return NextResponse.json({ success: false, error: 'Failed to fetch products', details: e?.message || String(e) }, { status: 500 });
  }
}


