"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ProductsToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = (searchParams.get("sort") || "az").toLowerCase();
  const currentShow = parseInt(searchParams.get("show") || "18", 10) || 18;

  const update = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, String(value));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">Sort by</span>
        <select
          className="border border-slate-300 rounded-md px-2 py-1 text-sm"
          value={currentSort}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="az">A to Z</option>
          <option value="za">Z to A</option>
          <option value="plow">Price Lowest First</option>
          <option value="phigh">Price Highest First</option>
          <option value="new">Newest</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">Show</span>
        <select
          className="border border-slate-300 rounded-md px-2 py-1 text-sm"
          value={currentShow}
          onChange={(e) => update("show", e.target.value)}
        >
          {[12, 18, 24, 36, 48, 60].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
    </div>
  );
}



