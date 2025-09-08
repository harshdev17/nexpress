import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_req, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid product id' }, { status: 400 });
    }

    const [rows] = await db.promise().query(`
      SELECT 
        id,
        ItemName,
        CategoryID1,
        CategoryID2,
        Category,
        ItemCode,
        ItemDesc,
        ItemShortDesc,
        ItemPrice,
        ItemMainImage,
        Brand,
        ItemStock,
        AvailabilityText,
        Featured,
        IsSoldOut,
        Visible,
        Deleted,
        added_on,
        updated_on
      FROM products
      WHERE id = ? AND Deleted = 0
      LIMIT 1
    `, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const product = rows[0];
    const processed = {
      ...product,
      ItemMainImage: product.ItemMainImage || null,
      ItemPrice: parseFloat(product.ItemPrice) || 0
    };

    return NextResponse.json({ success: true, product: processed });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}


