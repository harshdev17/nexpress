import { NextResponse } from 'next/server';
import { db, old_db } from '@/lib/db';

export async function GET(_req, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid product id' }, { status: 400 });
    }

    const query = `
      SELECT id, ItemName, ItemShortDesc, ItemDesc, ItemPrice, ItemMainImage, Brand,
             ItemStock, AvailabilityText, Featured, IsSoldOut, Visible, Deleted
      FROM products WHERE id = ? AND Deleted = 0 LIMIT 1`;

    async function run(pool) {
      if (pool?.promise) {
        const [rows] = await pool.promise().query(query, [id]);
        return rows;
      }
      if (pool?.query) {
        return await new Promise((resolve, reject) => {
          pool.query(query, [id], (err, rows) => (err ? reject(err) : resolve(rows)));
        });
      }
      return [];
    }

    let rows = [];
    try { rows = await run(old_db); } catch {}
    if (!rows?.length) { try { rows = await run(db); } catch {} }
    if (!rows?.length) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const base = (process.env.BACKEND_URL || 'http://localhost:8010').replace(/\/+$/, '');
    const product = rows[0];
    const processed = {
      ...product,
      ItemMainImage: /^https?:\/\//i.test(product.ItemMainImage || '')
        ? product.ItemMainImage
        : `${base}/product/${String(product.ItemMainImage || '').replace(/^\/+/, '')}`,
      ItemPrice: parseFloat(product.ItemPrice) || 0
    };

    return NextResponse.json({ success: true, product: processed });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}


