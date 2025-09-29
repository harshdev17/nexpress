import Link from 'next/link';
import Products from '@/components/index/Products';

export default async function OrderDetailPage({ params }) {
  const orderId = params.id;
  // Placeholder: fetch order details from old_db via API when available
  // For now show scaffold UI and Reorder CTA wired to /cart via client actions elsewhere
  return (
    <main className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order #{orderId}</h1>
          <Link href="/customer/account/orders" className="text-[#368899] hover:text-[#2d7a8a]">Back to Orders</Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border p-6">
              <h2 className="text-lg font-semibold mb-4">Items</h2>
              <p className="text-sm text-gray-500">Order items will appear here once API is connected.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between"><span>Subtotal</span><span>—</span></div>
                <div className="flex justify-between"><span>VAT</span><span>—</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>—</span></div>
                <div className="border-t pt-2 flex justify-between font-bold"><span>Total</span><span>—</span></div>
              </div>
              <button className="mt-4 w-full bg-[#368899] text-white py-3 rounded-xl font-semibold">Reorder Items</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


