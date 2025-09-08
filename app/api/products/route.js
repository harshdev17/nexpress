import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        id,
        ItemName,
        Category,
        ItemShortDesc,
        ItemPrice,
        ItemMainImage,
        Brand,
        Featured,
        IsSoldOut
      FROM products 
      WHERE Visible = 1 AND Deleted = 0
      ORDER BY Featured DESC, id DESC
      LIMIT 12
    `);

    // Process the data to handle image URLs properly
    const processedProducts = rows.map(product => ({
      ...product,
      // Keep original image path from database
      ItemMainImage: product.ItemMainImage || null,
      // Ensure price is properly formatted
      ItemPrice: parseFloat(product.ItemPrice) || 0
    }));

    return NextResponse.json({ 
      success: true, 
      products: processedProducts,
      count: processedProducts.length 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
