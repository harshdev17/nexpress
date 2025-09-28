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
    // First try to get up to 12 featured products randomly
    const featuredRows = await runQuery(`
      SELECT 
        p.id,
        p.ItemName,
        p.ItemShortDesc,
        p.ItemPrice,
        p.ItemMainImage,
        p.Brand,
        p.Featured,
        p.IsSoldOut,
        p.ItemSalePrice,
        p.ItemIsOnSale,
        p.PageName,
        pp.Price as discount_price, pp.PriceType, pp.MinQtyForPrice
      FROM products p
      LEFT JOIN product_pricing pp ON p.id = pp.ProductID AND pp.Deleted = 0
      WHERE p.Visible = 1 AND p.Deleted = 0 AND p.Featured = 1
      ORDER BY RAND()
      LIMIT 12
    `);

    let rows = featuredRows;
    if (!Array.isArray(rows)) rows = [];

    // If fewer than 12 featured exist, top up with non-featured random products
    if (rows.length < 12) {
      const remaining = 12 - rows.length;
      const excludeIds = rows.map(r => r.id);
      const placeholders = excludeIds.length ? excludeIds.map(() => '?').join(',') : '';
      const exclusionSQL = excludeIds.length ? `AND id NOT IN (${placeholders})` : '';
      const topUp = await runQuery(`
        SELECT 
          p.id,
          p.ItemName,
          p.ItemShortDesc,
          p.ItemPrice,
          p.ItemMainImage,
          p.Brand,
          p.Featured,
          p.IsSoldOut,
          p.ItemSalePrice,
          p.ItemIsOnSale,
          p.PageName,
          pp.Price as discount_price, pp.PriceType, pp.MinQtyForPrice
        FROM products p
        LEFT JOIN product_pricing pp ON p.id = pp.ProductID AND pp.Deleted = 0
        WHERE p.Visible = 1 AND p.Deleted = 0 AND (p.Featured = 0 OR p.Featured IS NULL)
        ${exclusionSQL}
        ORDER BY RAND()
        LIMIT ${remaining}
      `, excludeIds);
      rows = rows.concat(topUp || []);
    }

    // Process the data to handle image URLs properly
    // Build absolute image URL from admin backend
    const baseUrl = (process.env.BACKEND_URL || 'http://localhost:8010').replace(/\/+$/, '');
    const processedProducts = rows.map(product => {
      const raw = product.ItemMainImage || '';
      const isAbsolute = /^https?:\/\//i.test(raw);
      let fullUrl = raw;
      if (!isAbsolute) {
        const file = String(raw).replace(/^\/+/, '').replace(/^product\//i, '');
        fullUrl = `${baseUrl}/product/${file}`;
      }
      const originalPrice = parseFloat(product.ItemPrice) || 0;
      let salePrice = 0;
      let isOnSale = false;
      
      // Handle product_pricing discount
      if (product.discount_price && product.discount_price > 0) {
        if (product.PriceType === 'Fixed') {
          // Fixed discount: subtract the discount amount from original price
          salePrice = Math.max(0, originalPrice - parseFloat(product.discount_price));
          isOnSale = true;
        } else if (product.PriceType === 'Percentage') {
          // Percentage discount: subtract percentage from original price
          const discountPercent = parseFloat(product.discount_price);
          salePrice = originalPrice * (1 - discountPercent / 100);
          isOnSale = true;
        }
      }
      
      // Fallback to ItemSalePrice if no product_pricing discount
      if (!isOnSale && product.ItemSalePrice && parseFloat(product.ItemSalePrice) > 0) {
        salePrice = parseFloat(product.ItemSalePrice);
        isOnSale = product.ItemIsOnSale === 1;
      }
      
      return {
        ...product,
        ItemMainImage: fullUrl || null,
        ItemPrice: originalPrice,
        salePrice: salePrice,
        discountPercentage: 0, // Calculate from price difference if needed
        isOnSale: isOnSale
      };
    });

    return NextResponse.json({ 
      success: true, 
      products: processedProducts,
      count: processedProducts.length 
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
