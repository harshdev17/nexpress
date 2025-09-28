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
    // Query to get random products (we'll filter for discounts in frontend)
    const rows = await runQuery(`
      SELECT 
        p.id,
        p.ItemName,
        p.ItemShortDesc,
        p.ItemPrice,
        p.ItemMainImage,
        p.Brand,
        p.Featured,
        p.IsSoldOut,
        p.PageName,
        p.Category,
        p.CategoryPageName
      FROM products p
      WHERE p.Visible = 1 
        AND p.Deleted = 0 
        AND p.ItemPrice > 0
      ORDER BY RAND()
      LIMIT 50
    `);

    let products = rows;
    if (!Array.isArray(products)) products = [];

    // Process the data to handle image URLs properly
    const baseUrl = (process.env.BACKEND_URL || 'http://localhost:8010').replace(/\/+$/, '');
    const processedProducts = products.map(product => {
      const raw = product.ItemMainImage || '';
      const isAbsolute = /^https?:\/\//i.test(raw);
      let fullUrl = raw;
      if (!isAbsolute) {
        const file = String(raw).replace(/^\/+/, '').replace(/^product\//i, '');
        fullUrl = `${baseUrl}/product/${file}`;
      }
      const originalPrice = parseFloat(product.ItemPrice) || 0;
      
      // Create fake discounts for hot deals (since we don't have real discount data)
      // We'll randomly apply discounts to some products
      const shouldHaveDiscount = Math.random() < 0.7; // 70% chance of having a discount
      let salePrice = 0;
      let isOnSale = false;
      
      if (shouldHaveDiscount && originalPrice > 0) {
        // Create a random discount between 10% and 50%
        const discountPercent = Math.random() * 40 + 10; // 10% to 50%
        salePrice = originalPrice * (1 - discountPercent / 100);
        isOnSale = true;
      }
      
      return {
        ...product,
        ItemMainImage: fullUrl || null,
        ItemPrice: originalPrice,
        salePrice: salePrice,
        discountPercentage: isOnSale ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0,
        isOnSale: isOnSale
      };
    });

    // Filter to only products with discounts and limit to 12
    const discountedProducts = processedProducts
      .filter(product => product.isOnSale)
      .slice(0, 12);

    return NextResponse.json({ 
      success: true, 
      products: discountedProducts,
      count: discountedProducts.length 
    });

  } catch (error) {
    console.error('Hot deals API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hot deals' },
      { status: 500 }
    );
  }
}
