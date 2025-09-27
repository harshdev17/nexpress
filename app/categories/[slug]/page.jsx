import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { old_db } from '@/lib/db';

async function runQuery(sql, params = []) {
  const pools = [old_db];
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

function Card({ name, href, image }) {
  const base = (process.env.BACKEND_URL || 'http://localhost:8010').replace(/\/+$/, '');
  const src = image ? (image.startsWith('http') ? image : `${base}/category/${image.replace(/^\/+/, '')}`) : '/products/1.jpg';
  return (
    <Link href={href} className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
      <div className="w-full h-44 relative flex items-center justify-center bg-gray-50">
        <Image src={src} alt={name} fill style={{ objectFit: 'contain' }} unoptimized />
      </div>
      <div className="p-4 text-center text-[#368899] font-semibold">{name}</div>
    </Link>
  );
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const cats = await runQuery(`SELECT id, CatName, PageName, CatShortDesc FROM categories WHERE LOWER(PageName)=LOWER(?) AND Visible=1 AND Deleted=0 LIMIT 1`, [slug]);
  if (!cats?.length) return <div className="max-w-5xl mx-auto p-6">Category not found.</div>;
  const category = cats[0];
  const children = await runQuery(`SELECT id, CatName, PageName, CatImage FROM categories WHERE ParentId=? AND Visible=1 AND Deleted=0 ORDER BY Priority ASC, CatName ASC`, [category.id]);
  if (!children || children.length === 0) {
    // No subcategories → redirect to products listing for this category
    return redirect(`/products/${encodeURIComponent(category.PageName)}`);
  }
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fallbackSlug = (category.PageName && category.PageName.trim()) ? category.PageName : category.CatName.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const canonical = `${site.replace(/\/+$/, '')}/categories/${encodeURIComponent(fallbackSlug)}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site },
      { '@type': 'ListItem', position: 2, name: category.CatName, item: canonical },
    ],
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* SEO basics */}
      <link rel="canonical" href={canonical} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/">Home</Link> / <span className="text-[#368899]">{category.CatName}</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-[#368899] mb-6">{category.CatName}</h1>
      {category.CatShortDesc && (
        <p className="text-gray-600 mb-6">{category.CatShortDesc}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {children.map((c) => (
          <Card key={c.id} name={c.CatName} href={`/products/${encodeURIComponent(fallbackSlug)}/${encodeURIComponent((c.PageName && c.PageName.trim()) ? c.PageName : c.CatName.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''))}`} image={c.CatImage} />
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const rows = await runQuery(`SELECT PageTitle, MetaDescription, CatName, CatImage FROM categories WHERE LOWER(PageName)=LOWER(?) LIMIT 1`, [slug]);
    if (!rows?.length) return {};
    const category = rows[0];
    const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const canonical = `${site.replace(/\/+$/, '')}/categories/${encodeURIComponent(slug)}`;
    const base = (process.env.BACKEND_URL || 'http://localhost:8010').replace(/\/+$/, '');
    const ogImage = category?.CatImage ? `${base}/category/${String(category.CatImage).replace(/^\/+/, '')}` : undefined;
    return {
      title: category.PageTitle || category.CatName,
      description: category.MetaDescription || category.CatShortDesc || undefined,
      alternates: { canonical },
      openGraph: {
        title: category.PageTitle || category.CatName,
        description: category.MetaDescription || category.CatShortDesc || undefined,
        url: canonical,
        images: ogImage ? [{ url: ogImage }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: category.PageTitle || category.CatName,
        description: category.MetaDescription || category.CatShortDesc || undefined,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch {
    return {};
  }
}


