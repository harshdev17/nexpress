"use client";
import { useState, useEffect } from "react";
import ProductsFilterSidebar from "@/components/common/ProductsFilterSidebar";

export default function MobileFilters({ data, products }) {
  const [open, setOpen] = useState(false);

  // Close on route change (URL updates when filters change)
  useEffect(() => {
    const onPop = () => setOpen(false);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <>
      {/* Sticky mobile bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          <button
            onClick={() => setOpen(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M4 8h16M6 12h12M8 16h8M10 20h4" />
            </svg>
            Filters
          </button>
          <a href="#product-list" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18" />
            </svg>
            Sort/Show
          </a>
        </div>
      </div>

      {/* Drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex items-center justify-between">
              <h3 className="m-0 text-base font-semibold">Filters</h3>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm"
              >
                Close
              </button>
            </div>
            <div className="p-3">
              <ProductsFilterSidebar data={data} products={products} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}


