import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { old_db } from '@/lib/db';

export async function GET(request) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.user.userId;

    // Fetch orders from old database
    const [orders] = await old_db.promise().query(`
      SELECT 
        o.id,
        o.id as OrderNumber,
        o.OrderDateTime,
        o.ProcessStatus as OrderStatus,
        o.OrderTotal as TotalAmount,
        o.CreatedDateTime
      FROM orders o
      WHERE o.CustomerId = ? AND o.Deleted = 0
      ORDER BY o.OrderDateTime DESC
      LIMIT 50
    `, [userId]);

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      try {
        const [items] = await old_db.promise().query(`
          SELECT 
            ol.id,
            ol.ProductId as ProductID,
            ol.Quantity,
            ol.UnitPrice,
            ol.ItemPrice as TotalPrice,
            ol.ItemName as ProductName,
            ol.ItemCode as ProductSKU,
            p.ItemMainImage,
            p.ItemShortDesc
          FROM orderlines ol
          LEFT JOIN products p ON ol.ProductId = p.id
          WHERE ol.OrderId = ? AND ol.Deleted = 0
        `, [order.id]);

        return {
          ...order,
          items: items.map(item => ({
            id: item.id,
            productId: item.ProductID,
            productName: item.ProductName || 'Unknown Product',
            productSKU: item.ProductSKU,
            quantity: item.Quantity,
            unitPrice: parseFloat(item.UnitPrice || 0),
            totalPrice: parseFloat(item.TotalPrice || 0),
            image: item.ItemMainImage ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${item.ItemMainImage}` : null,
            description: item.ItemShortDesc
          }))
        };
      } catch (error) {
        console.error('Error fetching order items:', error);
        return {
          ...order,
          items: []
        };
      }
    }));

    // Calculate totals
    const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.TotalAmount || 0), 0);

    return NextResponse.json({
      success: true,
      orders: ordersWithItems,
      totalSpent: totalSpent.toFixed(2),
      totalOrders: orders.length
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch orders',
      details: error.message 
    }, { status: 500 });
  }
}
