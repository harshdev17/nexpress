"use client";
import { useCart } from '@/contexts/CartContext';

export default function ReorderButton({ items = [], className = "" }) {
  const { addToCart } = useCart();

  const handleReorder = () => {
    try {
      items.forEach((item) => {
        const product = {
          id: item.productId || item.id,
          ItemName: item.productName || item.name,
          ItemPrice: Number(item.unitPrice ?? 0),
          ItemMainImage: item.image || '',
          Brand: item.brand || ''
        };
        const qty = Number(item.quantity ?? 1);
        if (product.id) addToCart(product, qty);
      });
    } catch {}
  };

  return (
    <button onClick={handleReorder} className={className || "inline-flex items-center px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"}>
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      Reorder
    </button>
  );
}


