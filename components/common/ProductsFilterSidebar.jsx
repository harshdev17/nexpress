"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="mb-3 rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 text-left rounded-t-xl"
      >
        <span className="font-semibold text-slate-700 tracking-wide">{title}</span>
        <span className={`transition-transform text-slate-500 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="px-4 py-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductsFilterSidebar({ data, products = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const slugify = (p, name) => {
    const s = (p && String(p).trim()) || '';
    if (s) return s.toLowerCase();
    return String(name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Helpers to parse keywords from product text
  const textOf = (p) => `${(p.ItemName||'')} ${(p.ItemShortDesc||'')} ${(p.Brand||'')}`.toLowerCase();

  const detectPackSize = (p) => {
    const t = textOf(p);
    const match = t.match(/(\b\d{1,2})\s*[x×]\s*\d+/i) || t.match(/pack\s*(of)?\s*(\d{1,2})/i);
    const n = match ? parseInt(match[1] || match[2], 10) : null;
    if (!n) return null;
    if (n <= 6) return 'Up to 6';
    if (n <= 12) return '7-12';
    if (n <= 24) return '13-24';
    return '25+';
  };

  const detectVolumeMl = (p) => {
    const t = textOf(p);
    // match e.g., 330ml, 1l, 1.5 l, 2L
    const ml = t.match(/(\d+(?:\.\d+)?)\s*ml/);
    const l = t.match(/(\d+(?:\.\d+)?)\s*l(?!b)/);
    let volMl = null;
    if (ml) volMl = parseFloat(ml[1]);
    else if (l) volMl = parseFloat(l[1]) * 1000;
    return volMl;
  };

  const detectFlavour = (p) => {
    const t = textOf(p);
    const flavours = ['lemon','orange','mango','strawberry','chocolate','vanilla','mint','berry','lime','peach'];
    for (const f of flavours) { if (t.includes(f)) return f[0].toUpperCase()+f.slice(1); }
    return 'Plain';
  };

  const detectDietary = (p) => {
    const t = textOf(p);
    const tags = [];
    if (t.includes('sugar free') || t.includes('sugar-free') || t.includes('zero sugar')) tags.push('Sugar Free');
    if (t.includes('low sugar')) tags.push('Low Sugar');
    if (t.includes('vegan')) tags.push('Vegan');
    return tags;
  };

  const initialState = useMemo(() => ({
    inStock: searchParams.get("inStock") === "1",
    discounted: searchParams.get("discounted") === "1",
    newArrivals: searchParams.get("newArrivals") === "1",
    featured: searchParams.get("featured") === "1",
    includeSoldOut: searchParams.get("includeSoldOut") === "1",
    onSaleOnly: searchParams.get("onSaleOnly") === "1",
    brands: new Set((searchParams.get("brands") || "").split(",").filter(Boolean)),
    packs: new Set((searchParams.get("packs") || "").split(",").filter(Boolean)),
    volumes: new Set((searchParams.get("vol") || "").split(",").filter(Boolean)),
    flavours: new Set((searchParams.get("flavours") || "").split(",").filter(Boolean)),
    dietary: new Set((searchParams.get("dietary") || "").split(",").filter(Boolean)),
    packaging: new Set((searchParams.get("packaging") || "").split(",").filter(Boolean)),
    waterTypes: new Set((searchParams.get("waterTypes") || "").split(",").filter(Boolean)),
    countries: new Set((searchParams.get("countries") || "").split(",").filter(Boolean)),
    minPrice: parseFloat(searchParams.get("minPrice")) || (data?.price?.min ?? 0),
    maxPrice: parseFloat(searchParams.get("maxPrice")) || (data?.price?.max ?? 100),
  }), [searchParams, data?.price?.min, data?.price?.max]);

  const [state, setState] = useState(initialState);
  const [openCatSlug, setOpenCatSlug] = useState(null);
  const [childrenBySlug, setChildrenBySlug] = useState({});

  useEffect(() => {
    setState(initialState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState.inStock, initialState.discounted, initialState.newArrivals, initialState.minPrice, initialState.maxPrice]);

  const updateUrl = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("inStock", state.inStock ? "1" : "0");
    params.set("discounted", state.discounted ? "1" : "0");
    params.set("newArrivals", state.newArrivals ? "1" : "0");
    params.set("featured", state.featured ? "1" : "0");
    params.set("includeSoldOut", state.includeSoldOut ? "1" : "0");
    params.set("onSaleOnly", state.onSaleOnly ? "1" : "0");
    params.set("minPrice", String(state.minPrice ?? ""));
    params.set("maxPrice", String(state.maxPrice ?? ""));

    const setFrom = (key, set) => {
      const v = Array.from(set.values()).join(",");
      if (v) params.set(key, v); else params.delete(key);
    };
    setFrom("brands", state.brands);
    setFrom("packs", state.packs);
    setFrom("vol", state.volumes);
    setFrom("flavours", state.flavours);
    setFrom("dietary", state.dietary);
    setFrom("packaging", state.packaging);
    setFrom("waterTypes", state.waterTypes);
    setFrom("countries", state.countries);

    router.push(`${pathname}?${params.toString()}`);
  };

  // Instant apply (debounced)
  useEffect(() => {
    const id = setTimeout(() => updateUrl(), 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const clearAll = () => {
    const params = new URLSearchParams();
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleInSet = (set, value) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value); else next.add(value);
    return next;
  };

  // Dynamic options
  const brandOptions = useMemo(() => {
    const s = new Set();
    (products||[]).forEach(p => { const b = (p.Brand||'').trim(); if (b) s.add(b); });
    return Array.from(s).sort((a,b)=>a.localeCompare(b));
  }, [products]);

  const packOptions = useMemo(() => {
    const s = new Set();
    (products||[]).forEach(p => { const v = detectPackSize(p); if (v) s.add(v); });
    return Array.from(s).sort();
  }, [products]);

  const volumeOptions = ['0-330ml','331-750ml','751-1500ml','1501ml+'];

  const flavourOptions = useMemo(() => {
    const s = new Set();
    (products||[]).forEach(p => s.add(detectFlavour(p)));
    return Array.from(s).sort();
  }, [products]);

  const dietaryOptions = useMemo(() => {
    const s = new Set();
    (products||[]).forEach(p => detectDietary(p).forEach(t=>s.add(t)));
    return Array.from(s).sort();
  }, [products]);

  // Existing dynamic packaging and water type options
  const getDynamicPackagingOptions = () => {
    if (!Array.isArray(products) || products.length === 0) {
      return data?.packagingOptions || [];
    }

    const packagingSet = new Set();
    
    products.forEach(product => {
      const name = (product.ItemName || '').toLowerCase();
      const description = (product.ItemShortDesc || '').toLowerCase();
      const brand = (product.Brand || '').toLowerCase();
      
      if (name.includes('glass') || description.includes('glass') || 
          name.includes('bottle') && (name.includes('glass') || description.includes('glass')) ||
          name.includes('jar') || description.includes('jar') ||
          name.includes('vial') || description.includes('vial')) {
        packagingSet.add('Glass');
      }
      if (name.includes('plastic') || description.includes('plastic') || 
          name.includes('bottle') && (name.includes('plastic') || description.includes('plastic')) ||
          name.includes('pet') || description.includes('pet') ||
          name.includes('pvc') || description.includes('pvc') ||
          name.includes('container') && (name.includes('plastic') || description.includes('plastic'))) {
        packagingSet.add('Plastic');
      }
      if (name.includes('carton') || description.includes('carton') || 
          name.includes('can') || description.includes('can') ||
          name.includes('tin') || description.includes('tin') ||
          name.includes('aluminum') || description.includes('aluminum') ||
          name.includes('aluminium') || description.includes('aluminium') ||
          name.includes('tetra') || description.includes('tetra') ||
          name.includes('box') && (name.includes('carton') || description.includes('carton'))) {
        packagingSet.add('Carton/Can');
      }
    });

    return Array.from(packagingSet).sort();
  };

  const getDynamicWaterTypeOptions = () => {
    if (!Array.isArray(products) || products.length === 0) {
      return data?.waterTypeOptions || [];
    }

    const waterTypeSet = new Set();
    
    products.forEach(product => {
      const name = (product.ItemName || '').toLowerCase();
      const description = (product.ItemShortDesc || '').toLowerCase();
      
      if (name.includes('still') || description.includes('still') ||
          name.includes('natural') || description.includes('natural') ||
          name.includes('spring') || description.includes('spring') ||
          name.includes('mineral') || description.includes('mineral') ||
          name.includes('purified') || description.includes('purified') ||
          name.includes('distilled') || description.includes('distilled') ||
          name.includes('filtered') || description.includes('filtered')) {
        waterTypeSet.add('Still');
      }
      if (name.includes('sparkling') || description.includes('sparkling') ||
          name.includes('carbonated') || description.includes('carbonated') ||
          name.includes('fizzy') || description.includes('fizzy') ||
          name.includes('bubbly') || description.includes('bubbly') ||
          name.includes('soda') || description.includes('soda') ||
          name.includes('effervescent') || description.includes('effervescent') ||
          name.includes('bubbles') || description.includes('bubbles')) {
        waterTypeSet.add('Sparkling');
      }
    });

    return Array.from(waterTypeSet).sort();
  };

  const dynamicPackagingOptions = getDynamicPackagingOptions();
  const dynamicWaterTypeOptions = getDynamicWaterTypeOptions();

  // Compute selected chips
  const chips = [];
  if (state.inStock) chips.push({ k: 'In stock' });
  if (state.discounted) chips.push({ k: 'Discounted' });
  if (state.newArrivals) chips.push({ k: 'New' });
  if (state.featured) chips.push({ k: 'Featured' });
  if (state.onSaleOnly) chips.push({ k: 'On sale' });
  Array.from(state.brands).forEach(v => chips.push({ k: v }));
  Array.from(state.packs).forEach(v => chips.push({ k: `${v} pack` }));
  Array.from(state.volumes).forEach(v => chips.push({ k: v }));
  Array.from(state.flavours).forEach(v => chips.push({ k: v }));
  Array.from(state.dietary).forEach(v => chips.push({ k: v }));
  Array.from(state.packaging).forEach(v => chips.push({ k: v }));
  Array.from(state.waterTypes).forEach(v => chips.push({ k: v }));
  Array.from(state.countries).forEach(v => chips.push({ k: v }));
  if (state.minPrice > (data?.price?.min ?? 0) || state.maxPrice < (data?.price?.max ?? 100)) {
    chips.push({ k: `£${state.minPrice.toFixed(0)}–£${state.maxPrice.toFixed(0)}` });
  }

  return (
    <aside className="lg:pr-3 lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-3">
        <h2 className="m-0 text-base font-semibold text-slate-700">Filters</h2>
        <button className="text-[#368899] hover:underline" onClick={clearAll}>Clear all</button>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {chips.map((c, i) => (
            <span key={`${c.k}-${i}`} className="px-2.5 py-1 rounded-full text-xs bg-teal-50 text-teal-700 border border-teal-200">{c.k}</span>
          ))}
        </div>
      )}

      <Section title="Options">
        <label className="flex items-center gap-2 mb-2 cursor-pointer hover:text-teal-700">
          <input type="checkbox" checked={state.inStock} onChange={(e) => setState(s => ({ ...s, inStock: e.target.checked }))} />
          <span>Show in stock only</span>
        </label>
        <label className="flex items-center gap-2 mb-2 cursor-pointer hover:text-teal-700">
          <input type="checkbox" checked={state.onSaleOnly} onChange={(e) => setState(s => ({ ...s, onSaleOnly: e.target.checked }))} />
          <span>On sale only</span>
        </label>
        <label className="flex items-center gap-2 mb-2 cursor-pointer hover:text-teal-700">
          <input type="checkbox" checked={state.featured} onChange={(e) => setState(s => ({ ...s, featured: e.target.checked }))} />
          <span>Featured only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:text-teal-700">
          <input type="checkbox" checked={state.includeSoldOut} onChange={(e) => setState(s => ({ ...s, includeSoldOut: e.target.checked }))} />
          <span>Include sold out</span>
        </label>
      </Section>

      {brandOptions.length > 0 && (
        <Section title="Brand" defaultOpen={true}>
          {brandOptions.map(b => (
            <label key={b} className="flex items-center gap-2 mb-2 cursor-pointer hover:text-teal-700">
              <input type="checkbox" checked={state.brands.has(b)} onChange={() => setState(s => ({ ...s, brands: toggleInSet(s.brands, b) }))} />
              <span>{b}</span>
            </label>
          ))}
        </Section>
      )}

      {Array.isArray(data?.categories) && data.categories.length > 0 && (
        <Section title="Browse Categories" defaultOpen={false}>
          <ul className="m-0 p-0 list-none">
            {data.categories.map(c => {
              const cslug = c.slug || slugify(null, c.name);
              const isOpen = openCatSlug === cslug;
              const children = childrenBySlug[cslug] || [];
              const childrenKnown = Object.prototype.hasOwnProperty.call(childrenBySlug, cslug);
              const showArrow = (c.hasChildren === true) || (!childrenKnown ? (c.hasChildren === undefined) : (children && children.length > 0));
              return (
                <li key={c.id} className="py-2">
                  <div className="flex items-center justify-between px-2">
                    <button
                      type="button"
                      onClick={() => router.push(`/categories/${encodeURIComponent(cslug)}`)}
                      className="text-left flex-1 truncate hover:text-[#368899] cursor-pointer"
                    >
                      {c.name}
                    </button>
                    {showArrow && (
                      <button
                        type="button"
                        aria-label="Toggle subcategories"
                        className={`ml-2 text-slate-500 transition-transform cursor-pointer ${isOpen ? 'rotate-90' : ''}`}
                        onClick={async () => {
                          if (!isOpen && !childrenKnown) {
                            try {
                              const res = await fetch(`/api/categories/${encodeURIComponent(cslug)}`);
                              const json = await res.json();
                              if (json?.success && Array.isArray(json.children)) {
                                setChildrenBySlug(prev => ({ ...prev, [cslug]: json.children.map(ch => ({ id: ch.id, name: ch.CatName, slug: slugify(ch.PageName, ch.CatName) })) }));
                              } else {
                                setChildrenBySlug(prev => ({ ...prev, [cslug]: [] }));
                              }
                            } catch {
                              setChildrenBySlug(prev => ({ ...prev, [cslug]: [] }));
                            }
                          }
                          setOpenCatSlug(isOpen ? null : cslug);
                        }}
                      >
                        ›
                      </button>
                    )}
                  </div>
                  {isOpen && children.length > 0 && (
                    <ul className="mt-2 ml-3 border-l border-slate-200">
                      {children.map(sc => (
                        <li key={sc.id} className="py-1 pl-3">
                          <button
                            type="button"
                            className="text-left w-full truncate hover:text-[#368899] cursor-pointer"
                            onClick={() => router.push(`/products/${encodeURIComponent(cslug)}/${encodeURIComponent(sc.slug || sc.name)}`)}
                          >
                            {sc.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {dynamicPackagingOptions.length > 0 && (
        <Section title="Packaging" defaultOpen={true}>
          {dynamicPackagingOptions.map(opt => (
            <label className="flex items-center gap-2 mb-2 cursor-pointer hover:text-teal-700" key={opt}>
              <input
                type="checkbox"
                checked={state.packaging.has(opt)}
                onChange={() => setState(s => ({ ...s, packaging: toggleInSet(s.packaging, opt) }))}
              />
              <span>{opt}</span>
            </label>
          ))}
        </Section>
      )}

      {dynamicWaterTypeOptions.length > 0 && (
        <Section title="Water Type" defaultOpen={false}>
          {dynamicWaterTypeOptions.map(opt => (
            <label className="flex items-center gap-2 mb-2 cursor-pointer hover:text-teal-700" key={opt}>
              <input
                type="checkbox"
                checked={state.waterTypes.has(opt)}
                onChange={() => setState(s => ({ ...s, waterTypes: toggleInSet(s.waterTypes, opt) }))}
              />
              <span>{opt}</span>
            </label>
          ))}
        </Section>
      )}

      {packOptions.length > 0 && (
        <Section title="Pack Size" defaultOpen={false}>
          {packOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 mb-2 cursor-pointer hover:text-teal-700">
              <input type="checkbox" checked={state.packs.has(opt)} onChange={() => setState(s => ({ ...s, packs: toggleInSet(s.packs, opt) }))} />
              <span>{opt}</span>
            </label>
          ))}
        </Section>
      )}

      <Section title="Volume" defaultOpen={false}>
        {volumeOptions.map(opt => (
          <label key={opt} className="flex items-center gap-2 mb-2 cursor-pointer hover:text-teal-700">
            <input type="checkbox" checked={state.volumes.has(opt)} onChange={() => setState(s => ({ ...s, volumes: toggleInSet(s.volumes, opt) }))} />
            <span>{opt}</span>
          </label>
        ))}
      </Section>

      {flavourOptions.length > 0 && (
        <Section title="Flavour" defaultOpen={false}>
          {flavourOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 mb-2 cursor-pointer hover:text-teal-700">
              <input type="checkbox" checked={state.flavours.has(opt)} onChange={() => setState(s => ({ ...s, flavours: toggleInSet(s.flavours, opt) }))} />
              <span>{opt}</span>
            </label>
          ))}
        </Section>
      )}

      {dietaryOptions.length > 0 && (
        <Section title="Dietary" defaultOpen={false}>
          {dietaryOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 mb-2 cursor-pointer hover:text-teal-700">
              <input type="checkbox" checked={state.dietary.has(opt)} onChange={() => setState(s => ({ ...s, dietary: toggleInSet(s.dietary, opt) }))} />
              <span>{opt}</span>
            </label>
          ))}
        </Section>
      )}

      {Array.isArray(data?.countries) && data.countries.length > 0 && (
        <Section title="Country of Origin" defaultOpen={false}>
          {data.countries.map(opt => (
            <label className="flex items-center gap-2 mb-2 cursor-pointer hover:text-teal-700" key={opt}>
              <input
                type="checkbox"
                checked={state.countries.has(opt)}
                onChange={() => setState(s => ({ ...s, countries: toggleInSet(s.countries, opt) }))}
              />
              <span>{opt}</span>
            </label>
          ))}
        </Section>
      )}

      <Section title="Price Range" defaultOpen={true}>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-medium text-slate-700">
            <span>£{state.minPrice.toFixed(0)}</span>
            <span>£{state.maxPrice.toFixed(0)}</span>
          </div>
          <div className="relative h-6">
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-200 rounded-lg transform -translate-y-1/2"></div>
            <div 
              className="absolute top-1/2 h-2 bg-[#368899] rounded-lg transform -translate-y-1/2"
              style={{
                left: `${((state.minPrice - (data?.price?.min ?? 0)) / ((data?.price?.max ?? 100) - (data?.price?.min ?? 0))) * 100}%`,
                width: `${((state.maxPrice - state.minPrice) / ((data?.price?.max ?? 100) - (data?.price?.min ?? 0))) * 100}%`,
              }}
            ></div>
            <input
              type="range"
              min={data?.price?.min ?? 0}
              max={data?.price?.max ?? 100}
              step="0.5"
              value={state.minPrice}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (val <= state.maxPrice) {
                  setState(s => ({ ...s, minPrice: val }));
                }
              }}
              className="absolute top-1/2 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer transform -translate-y-1/2 z-10"
              style={{ background: 'transparent', WebkitAppearance: 'none', appearance: 'none' }}
            />
            <input
              type="range"
              min={data?.price?.min ?? 0}
              max={data?.price?.max ?? 100}
              step="0.5"
              value={state.maxPrice}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (val >= state.minPrice) {
                  setState(s => ({ ...s, maxPrice: val }));
                }
              }}
              className="absolute top-1/2 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer transform -translate-y-1/2 z-20"
              style={{ background: 'transparent', WebkitAppearance: 'none', appearance: 'none' }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>£{data?.price?.min ?? 0}</span>
            <span>£{data?.price?.max ?? 100}</span>
          </div>
        </div>
      </Section>
      
    </aside>
  );
}

// Custom CSS for range sliders
const sliderStyles = `
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #368899;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  input[type="range"]::-webkit-slider-track {
    background: transparent;
    height: 8px;
    border-radius: 4px;
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #368899;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  input[type="range"]::-moz-range-track {
    background: transparent;
    height: 8px;
    border-radius: 4px;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sliderStyles;
  document.head.appendChild(styleSheet);
}



