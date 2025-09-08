import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_req, context) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid product id' }, { status: 400 });
    }

    // Get anchor product
    const [rows] = await db.promise().query('SELECT Brand, Category FROM products WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ success: true, products: [] });
    }
    const { Brand, Category } = rows[0];

    const [related] = await db.promise().query(`
      SELECT id, ItemName, ItemShortDesc, ItemPrice, ItemMainImage, Brand, Featured, IsSoldOut
      FROM products
      WHERE Deleted = 0 AND Visible = 1 AND id <> ? AND (
        (Brand IS NOT NULL AND Brand <> '' AND Brand = ?) OR
        (Category IS NOT NULL AND Category <> '' AND Category = ?)
      )
      ORDER BY Featured DESC, id DESC
      LIMIT 8
    `, [id, Brand || '', Category || '']);

    const processed = related.map(p => ({
      ...p,
      ItemMainImage: p.ItemMainImage || null,
      ItemPrice: parseFloat(p.ItemPrice) || 0
    }));

    return NextResponse.json({ success: true, products: processed });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch related products' }, { status: 500 });
  }
}


