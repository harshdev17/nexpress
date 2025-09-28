import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/common/ProductCard';
import ProductDetail from '@/components/common/ProductDetail';
import ProductsFilterSidebar from '@/components/common/ProductsFilterSidebar';
import ProductsToolbar from '@/components/common/ProductsToolbar';
import NoProductsFound from '@/components/common/NoProductsFound';
import { db, old_db } from '@/lib/db';
import BrandLogo from '@/components/common/BrandLogo';

async function runQuery(sql, params = []) {
  const pools = [db, old_db].filter(Boolean);
  let last;
  for (const p of pools) {
    try {
      if (p?.promise) {
        const [rows] = await p.promise().query(sql, params);
        return rows;
      }
      if (p?.query) {
        const rows = await new Promise((resolve, reject) => p.query(sql, params, (e, r) => e ? reject(e) : resolve(r)));
        return rows;
      }
    } catch (e) { last = e; }
  }
  if (last) throw last;
  return [];
}

export default async function ProductsByCategoryPage({ params: paramsPromise, searchParams }) {
  const { slug } = await paramsPromise;
  const parts = Array.isArray(slug) ? slug : [];
  const target = decodeURIComponent(parts[parts.length - 1] || '').toLowerCase();
  const isSubCategory = parts.length > 1; // two-level URL => subcategory
  const allCats = await runQuery(`SELECT id, CatName, PageName FROM categories WHERE Visible=1 AND Deleted=0`);
  const slugify = (p, name) => {
    const s = (p && String(p).trim()) || '';
    if (s) return s.toLowerCase();
    return String(name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  // Try to resolve last slug as product PageName first; if found, render detail view.
  const productBySlug = await runQuery(
    `SELECT id, ItemName, ItemDesc, ItemShortDesc, ItemPrice, ItemSalePrice, ItemIsOnSale, ItemMainImage, Brand, PageName
     FROM products
     WHERE (LOWER(PageName)=LOWER(?) OR LOWER(PageName)=LOWER(?)) AND Visible=1 AND Deleted=0
     LIMIT 1`,
    [target, `${target}.html`]
  );
  let resolvedProduct = productBySlug?.[0];
  const baseUrlImg = (process.env.BACKEND_URL || 'http://localhost:8010').replace(/\/+$/, '');
  
  if (!resolvedProduct) {
    // Fallback: search by slugified ItemName within parent category
    let parentSlug;
    if (parts.length === 2) {
      // products/cat/productslug - category is parts[0]
      parentSlug = decodeURIComponent(parts[0] || '').toLowerCase();
    } else if (parts.length === 3) {
      // products/cat/subcat/productslug - subcategory is parts[1]
      parentSlug = decodeURIComponent(parts[1] || '').toLowerCase();
    } else {
      // Fallback to first part
      parentSlug = decodeURIComponent(parts[0] || '').toLowerCase();
    }
    
    const parentCat = (allCats || []).find(c => slugify(c.PageName, c.CatName) === parentSlug);
    
    if (parentCat && parentCat.id) {
      const candidates = await runQuery(
        `SELECT p.id, p.ItemName, p.ItemDesc, p.ItemShortDesc, p.ItemPrice, p.ItemSalePrice, p.ItemIsOnSale, p.ItemMainImage, p.Brand, p.PageName
         FROM products p
         WHERE p.Visible=1 AND p.Deleted=0 AND (p.CategoryID2 = ? OR p.CategoryID1 = ?)
         ORDER BY p.Featured DESC, p.id DESC
         LIMIT 1000`,
        [parentCat.id, parentCat.id]
      );
      
      resolvedProduct = (candidates || []).find(p => {
        const slugified = slugify(p.PageName, p.ItemName);
        return slugified === target || slugified === target.replace('.html', '');
      }) || null;
    }
  }
  
  if (resolvedProduct) {
    // Get product's category for breadcrumb
    const productCategory = await runQuery(
      `SELECT c.id, c.CatName, c.PageName
       FROM categories c
       WHERE c.id = (SELECT CategoryID1 FROM products WHERE id = ?)
       LIMIT 1`,
      [resolvedProduct.id]
    );
    const category = productCategory?.[0];

    // Get related products from same category
    const relatedProducts = await runQuery(
      `SELECT p.id, p.ItemName, p.ItemPrice, p.ItemMainImage, p.PageName, p.Brand, p.ItemShortDesc
       FROM products p
       WHERE p.Visible=1 AND p.Deleted=0 AND p.id != ? 
       AND (p.CategoryID1 = ? OR p.CategoryID2 = ?)
       ORDER BY p.Featured DESC, p.id DESC
       LIMIT 4`,
      [resolvedProduct.id, resolvedProduct.CategoryID1 || 0, resolvedProduct.CategoryID2 || 0]
    );

    // Get product composition details from old_db (with fallback)
    let productComposition = [];
    try {
      productComposition = await runQuery(
        `SELECT pdf.DisplayCaption, pdv.Value
         FROM products_details_values pdv
         JOIN products_details_fields pdf ON pdv.FieldID = pdf.id
         WHERE pdv.ProductID = ? AND pdv.Deleted = 0 AND pdf.Deleted = 0
         ORDER BY pdf.id ASC`,
        [resolvedProduct.id]
      );
    } catch (error) {
      console.log('Composition table not found, using fallback data');
      // Fallback: Use basic product info for composition
      productComposition = [
        { DisplayCaption: 'Weight per pack', Value: `${resolvedProduct.ItemWeight || 'N/A'} kg` },
        { DisplayCaption: 'Package Size', Value: resolvedProduct.ItemPackageSizeText || 'N/A' },
        { DisplayCaption: 'Material', Value: resolvedProduct.Material || 'N/A' },
        { DisplayCaption: 'Brand', Value: resolvedProduct.Brand || 'N/A' },
        { DisplayCaption: 'Manufacturer', Value: resolvedProduct.Manufacturer || 'N/A' }
      ].filter(item => item.Value !== 'N/A');
    }

    return <ProductDetail 
      product={resolvedProduct} 
      category={category} 
      relatedProducts={relatedProducts}
      composition={productComposition}
    />;
  }
  
  // LISTING MODE: resolve category based on last slug (cat or subcat)
  const category = allCats.find(c => slugify(c.PageName, c.CatName) === target);
  if (!category) {
    return <div className="max-w-5xl mx-auto p-6">No products found.</div>;
  }
//   const whereClause = isSubCategory
//     ? 'p.CategoryID2 = ? OR p.CategoryID1 = ?'
//     : 'p.CategoryID1 = ? OR p.CategoryID2 = ?';
  const where = isSubCategory ? 'p.CategoryID2 = ?' : 'p.CategoryID1 = ?';
  const rawProducts = await runQuery(
    `SELECT DISTINCT p.id, p.ItemName, p.ItemShortDesc, p.ItemPrice, p.ItemMainImage, p.Brand, p.Featured, p.IsSoldOut,
            p.ItemSalePrice, p.ItemIsOnSale, p.PageName,
            pp.Price as discount_price, pp.PriceType, pp.MinQtyForPrice
     FROM products p
     LEFT JOIN product_pricing pp ON p.id = pp.ProductID AND pp.Deleted = 0
     WHERE p.Visible=1 AND p.Deleted=0 AND (p.CategoryID2 = ? OR p.CategoryID1 = ?)
     ORDER BY p.Featured DESC, p.id DESC
     LIMIT 200`,
    [category.id, category.id]
  );
  // Load main categories and subcategories for sidebar
  const mainCats = await runQuery(
    `SELECT c1.id, c1.CatName, c1.PageName, c1.ParentId,
            (SELECT COUNT(1) FROM categories c2 WHERE c2.ParentId = c1.id AND c2.Visible=1 AND c2.Deleted=0) AS ChildCount
     FROM categories c1
     WHERE c1.Visible=1 AND c1.Deleted=0 AND (c1.ParentId = 0 OR c1.ParentId IS NULL)
     ORDER BY c1.Priority ASC, c1.id ASC`
  );
  const subCats = await runQuery(
    `SELECT id, CatName, PageName, ParentId
     FROM categories
     WHERE Visible=1 AND Deleted=0 AND ParentId = ?
     ORDER BY Priority ASC, id ASC`,
    [category.id]
  );
  const base = (process.env.BACKEND_URL || 'http://localhost:8010').replace(/\/+$/, '');
  let products = rawProducts.map(p => {
    const originalPrice = parseFloat(p.ItemPrice) || 0;
    let salePrice = 0;
    let isOnSale = false;
    
    // Handle product_pricing discount
    if (p.discount_price && p.discount_price > 0) {
      if (p.PriceType === 'Fixed') {
        // Fixed discount: subtract the discount amount from original price
        salePrice = Math.max(0, originalPrice - parseFloat(p.discount_price));
        isOnSale = true;
      } else if (p.PriceType === 'Percentage') {
        // Percentage discount: subtract percentage from original price
        const discountPercent = parseFloat(p.discount_price);
        salePrice = originalPrice * (1 - discountPercent / 100);
        isOnSale = true;
      }
    }
    
    // Fallback to ItemSalePrice if no product_pricing discount
    if (!isOnSale && p.ItemSalePrice && parseFloat(p.ItemSalePrice) > 0) {
      salePrice = parseFloat(p.ItemSalePrice);
      isOnSale = p.ItemIsOnSale === 1;
    }
    
    return {
      ...p,
      ItemPrice: originalPrice,
      salePrice: salePrice,
      discountPercentage: 0, // Calculate from price difference if needed
      isOnSale: isOnSale,
      ItemMainImage: /^https?:\/\//i.test(p.ItemMainImage || '') ? p.ItemMainImage : `${base}/product/${String(p.ItemMainImage||'').replace(/^\/+/, '')}`
    };
  });
  // Apply price range filtering
  const minPrice = parseFloat(searchParams?.minPrice) || 0;
  const maxPrice = parseFloat(searchParams?.maxPrice) || 1000;
  const inStock = searchParams?.inStock === '1';
  const discounted = searchParams?.discounted === '1';
  const packagingFilter = (searchParams?.packaging || '').split(',').filter(Boolean);
  const waterTypeFilter = (searchParams?.waterTypes || '').split(',').filter(Boolean);
  
  let filteredProducts = products.filter(p => {
    const price = p.isOnSale && p.salePrice > 0 ? p.salePrice : p.ItemPrice;
    const priceMatch = price >= minPrice && price <= maxPrice;
    const stockMatch = !inStock || !p.IsSoldOut;
    const discountMatch = !discounted || (p.isOnSale && p.salePrice > 0);
    
    // Packaging filter
    const packagingMatch = packagingFilter.length === 0 || packagingFilter.some(filter => {
      const name = (p.ItemName || '').toLowerCase();
      const description = (p.ItemShortDesc || '').toLowerCase();
      
      if (filter === 'Glass') {
        return name.includes('glass') || description.includes('glass') || 
               (name.includes('bottle') && (name.includes('glass') || description.includes('glass'))) ||
               name.includes('jar') || description.includes('jar') ||
               name.includes('vial') || description.includes('vial');
      }
      if (filter === 'Plastic') {
        return name.includes('plastic') || description.includes('plastic') || 
               (name.includes('bottle') && (name.includes('plastic') || description.includes('plastic'))) ||
               name.includes('pet') || description.includes('pet') ||
               name.includes('pvc') || description.includes('pvc') ||
               (name.includes('container') && (name.includes('plastic') || description.includes('plastic')));
      }
      if (filter === 'Carton/Can') {
        return name.includes('carton') || description.includes('carton') || 
               name.includes('can') || description.includes('can') ||
               name.includes('tin') || description.includes('tin') ||
               name.includes('aluminum') || description.includes('aluminum') ||
               name.includes('aluminium') || description.includes('aluminium') ||
               name.includes('tetra') || description.includes('tetra') ||
               (name.includes('box') && (name.includes('carton') || description.includes('carton')));
      }
      return false;
    });
    
    // Water type filter
    const waterTypeMatch = waterTypeFilter.length === 0 || waterTypeFilter.some(filter => {
      const name = (p.ItemName || '').toLowerCase();
      const description = (p.ItemShortDesc || '').toLowerCase();
      
      if (filter === 'Still') {
        return name.includes('still') || description.includes('still') ||
               name.includes('natural') || description.includes('natural') ||
               name.includes('spring') || description.includes('spring') ||
               name.includes('mineral') || description.includes('mineral') ||
               name.includes('purified') || description.includes('purified') ||
               name.includes('distilled') || description.includes('distilled') ||
               name.includes('filtered') || description.includes('filtered');
      }
      if (filter === 'Sparkling') {
        return name.includes('sparkling') || description.includes('sparkling') ||
               name.includes('carbonated') || description.includes('carbonated') ||
               name.includes('fizzy') || description.includes('fizzy') ||
               name.includes('bubbly') || description.includes('bubbly') ||
               name.includes('soda') || description.includes('soda') ||
               name.includes('effervescent') || description.includes('effervescent') ||
               name.includes('bubbles') || description.includes('bubbles');
      }
      return false;
    });
    
    return priceMatch && stockMatch && discountMatch && packagingMatch && waterTypeMatch;
  });

  // Apply sorting based on query
  const sort = String(searchParams?.sort || '').toLowerCase();
  if (sort === 'az') {
    filteredProducts = filteredProducts.slice().sort((a,b) => String(a.ItemName||'').localeCompare(String(b.ItemName||'')));
  } else if (sort === 'za') {
    filteredProducts = filteredProducts.slice().sort((a,b) => String(b.ItemName||'').localeCompare(String(a.ItemName||'')));
  } else if (sort === 'plow') {
    filteredProducts = filteredProducts.slice().sort((a,b) => {
      const priceA = a.isOnSale && a.salePrice > 0 ? a.salePrice : a.ItemPrice;
      const priceB = b.isOnSale && b.salePrice > 0 ? b.salePrice : b.ItemPrice;
      return priceA - priceB;
    });
  } else if (sort === 'phigh') {
    filteredProducts = filteredProducts.slice().sort((a,b) => {
      const priceA = a.isOnSale && a.salePrice > 0 ? a.salePrice : a.ItemPrice;
      const priceB = b.isOnSale && b.salePrice > 0 ? b.salePrice : b.ItemPrice;
      return priceB - priceA;
    });
  } else if (sort === 'new') {
    filteredProducts = filteredProducts.slice().sort((a,b) => (b.id||0) - (a.id||0));
  }
  const showCount = Math.max(1, Math.min(60, parseInt(searchParams?.show || '18', 10) || 18));
  const visibleProducts = filteredProducts.slice(0, showCount);
  // Debug: Check for products with discounts
  const discountedProducts = products.filter(p => p.isOnSale && p.salePrice > 0);
  const priceRange = {
    min: Math.min(...products.map(p => {
      const price = p.isOnSale && p.salePrice > 0 ? p.salePrice : p.ItemPrice;
      return Number(price) || 0;
    }), 0),
    max: Math.max(...products.map(p => {
      const price = p.isOnSale && p.salePrice > 0 ? p.salePrice : p.ItemPrice;
      return Number(price) || 0;
    }), 100)
  };
  console.log("Total products:", products.length);
  console.log("Discounted products:", discountedProducts.length);
  console.log("Price range:", priceRange);
  return (
    <>
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/">Home</Link> / <Link href={`/categories/${encodeURIComponent(category.PageName)}`} className="text-[#368899]">{category.CatName}</Link>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-[#368899] mb-6">{category.CatName}</h1>
      <div className="lg:grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <ProductsFilterSidebar
            data={{
              categories: mainCats.map(c => ({ id: c.id, name: c.CatName, slug: slugify(c.PageName, c.CatName), hasChildren: Number(c.ChildCount) > 0 })),
              subCategories: subCats.map(c => ({ id: c.id, name: c.CatName, slug: slugify(c.PageName, c.CatName) })),
              countries: [],
              packagingOptions: [], // Will be dynamically generated
              waterTypeOptions: [], // Will be dynamically generated
              price: priceRange,
            }}
            products={products}
          />
        </div>
        <div className="lg:col-span-9">
          <ProductsToolbar />
          {visibleProducts.length === 0 ? (
            <NoProductsFound type="filter" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {visibleProducts.map(p => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  title={p.ItemName}
                  description={p.ItemShortDesc || 'Product description'}
                  originalPrice={p.isOnSale && p.salePrice > 0 ? `£${p.ItemPrice.toFixed(2)}` : `£${p.ItemPrice.toFixed(2)}`}
                  discountedPrice={p.isOnSale && p.salePrice > 0 ? `£${p.salePrice.toFixed(2)}` : `£${p.ItemPrice.toFixed(2)}`}
                  isOnSale={p.isOnSale && p.salePrice > 0}
                  salePrice={p.salePrice}
                  imageSrc={p.ItemMainImage || '/products/1.jpg'}
                  brand={p.Brand}
                  isSoldOut={p.IsSoldOut === 1}
                  category={category.CatName}
                  href={`/products/${encodeURIComponent(slugify(category.PageName, category.CatName))}/${encodeURIComponent(p.PageName)}`}
                  product={p}
                />
              ))}
            </div>
          )}
        </div>
      </div>

    
    </div>
      <BrandLogo />
      </>
  );
}


