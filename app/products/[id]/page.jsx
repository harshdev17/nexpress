"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/common/ProductCard";

export default function ProductDetailPage({ params }) {
  const { id } = React.use(params);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const [pRes, rRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch(`/api/products/${id}/related`)
        ]);
        const pData = await pRes.json();
        const rData = await rRes.json();
        if (!pData?.success) throw new Error(pData?.error || "Failed to load product");
        if (mounted) {
          setProduct(pData.product);
          setRelated(Array.isArray(rData?.products) ? rData.products : []);
        }
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load product");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#368899]"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow border border-gray-200 text-center max-w-md">
          <p className="text-red-600 font-medium">{error || "Product not found"}</p>
          <Link href="/products" className="mt-4 inline-block text-[#368899] hover:text-[#2d7a8a]">Back to products</Link>
        </div>
      </div>
    );
  }

  const defaultImageSrc = "/products/1.jpg";
  const getSafeImageSrc = (src) => {
    if (typeof src !== "string") return defaultImageSrc;
    const trimmed = src.trim();
    if (!trimmed) return defaultImageSrc;
    const normalized = trimmed.replace(/\\\\/g, "/").replace(/\\/g, "/");
    if (normalized.startsWith("http://") || normalized.startsWith("https://") || normalized.startsWith("/")) {
      return normalized;
    }
    return `/${normalized}`;
  };
  const imageSrc = getSafeImageSrc(product.ItemMainImage || defaultImageSrc);
  const title = product.ItemName || "Product";
  const description = product.ItemDesc || product.ItemShortDesc || "";

  return (
    <main className="bg-white">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div>
            <div className="relative w-full h-96 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image src={imageSrc} alt={title} fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h1>
            {product.Brand && (
              <p className="text-sm text-gray-500 mb-2">Brand: <span className="font-medium text-gray-700">{product.Brand}</span></p>
            )}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-2xl font-bold text-[#368899]">£{Number(product.ItemPrice).toFixed(2)}</span>
              {product.IsSoldOut === 1 && (
                <span className="px-3 py-1 text-xs font-semibold bg-red-50 text-red-600 rounded-full border border-red-200">Sold out</span>
              )}
              {product.Featured === 1 && (
                <span className="px-3 py-1 text-xs font-semibold bg-yellow-50 text-yellow-700 rounded-full border border-yellow-200">Featured</span>
              )}
            </div>

            {description && (
              <div
                className="prose max-w-none text-gray-700 leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {product.AvailabilityText && (
              <p className="text-sm text-gray-600 mb-2">Availability: {product.AvailabilityText}</p>
            )}
            {typeof product.ItemStock === "number" && (
              <p className="text-sm text-gray-600 mb-6">Stock: {product.ItemStock}</p>
            )}

            <button disabled={product.IsSoldOut === 1}
              className="px-6 py-3 rounded-xl text-white bg-[#368899] hover:bg-[#2d7a8a] disabled:opacity-50">
              Add to cart
            </button>
          </div>
        </div>
      </div>

      {/* Composition / Info tables - shown only if fields exist */}
      {(product.ItemCode || product.Category || product.CountryOfOrigin) && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              {description ? (
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <p className="text-gray-700">No description provided.</p>
              )}
              {product.ItemCode && (
                <p className="mt-4 text-sm text-gray-500">Item code: {product.ItemCode}</p>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Information</h2>
              <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                {product.Category && (
                  <div className="flex justify-between p-4 bg-white"><span className="text-gray-700">Category</span><span className="text-gray-900 font-medium">{product.Category}</span></div>
                )}
                {product.Brand && (
                  <div className="flex justify-between p-4 bg-white"><span className="text-gray-700">Brand</span><span className="text-gray-900 font-medium">{product.Brand}</span></div>
                )}
                {typeof product.ItemStock === "number" && (
                  <div className="flex justify-between p-4 bg-white"><span className="text-gray-700">Stock</span><span className="text-gray-900 font-medium">{product.ItemStock}</span></div>
                )}
                {product.AvailabilityText && (
                  <div className="flex justify-between p-4 bg-white"><span className="text-gray-700">Packaging</span><span className="text-gray-900 font-medium">{product.AvailabilityText}</span></div>
                )}
              </div>
              <p className="text-xs text-red-600 mt-6">
                Whilst every care is taken to ensure all our information is correct, products are constantly being reformulated so
                ingredients, nutrition content, dietary and allergen information may change at any time. Please double check with
                the manufacturer or read the product label as Nexpress Delivery accepts no liability for any errors or omissions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                title={p.ItemName}
                description={p.ItemShortDesc || "Product description"}
                price={p.ItemPrice}
                imageSrc={p.ItemMainImage || "/products/1.jpg"}
                brand={p.Brand}
                isSoldOut={p.IsSoldOut === 1}
                href={`/products/${p.id}`}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}


