"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";
import { useInventory, DEFAULT_KIT_WARRANTY } from "@/context/InventoryContext";
import { formatPKR, defaultVariant } from "@/data/products";
import {
  IconSearch, IconClose, IconArrowRight, IconStar, IconMenu, IconCheck,
  IconBolt, IconShield, IconTruck, IconLeaf,
} from "@/components/Icons";

const PRICE_BUCKETS = [
  { id: "all", label: "Any price", test: () => true },
  { id: "u5", label: "Under Rs 5,000", test: (p) => p.price < 5000 },
  { id: "5-10", label: "Rs 5,000 – 10,000", test: (p) => p.price >= 5000 && p.price < 10000 },
  { id: "10-15", label: "Rs 10,000 – 15,000", test: (p) => p.price >= 10000 && p.price < 15000 },
  { id: "o15", label: "Above Rs 15,000", test: (p) => p.price >= 15000 },
];

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "low", label: "Price: Low to High" },
  { id: "high", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
  { id: "discount", label: "Biggest Discount" },
];

const PAGE = 8;

export default function ProductsPage() {
  const { allProducts, ready } = useInventory();
  const { addToCart } = useCart();

  const [query, setQuery] = useState("");
  const [cats, setCats] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [bucket, setBucket] = useState("all");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState("grid");
  const [shown, setShown] = useState(PAGE);
  const [drawer, setDrawer] = useState(false);

  const catCounts = useMemo(() => {
    const m = {};
    for (const p of allProducts) m[p.category] = (m[p.category] || 0) + 1;
    return m;
  }, [allProducts]);

  const toggle = (arr, setArr, v) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const bucketFn = PRICE_BUCKETS.find((b) => b.id === bucket)?.test ?? (() => true);

    let l = allProducts.filter(
      (p) =>
        (!q ||
          p.name.toLowerCase().includes(q) ||
          (p.color || "").toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)) &&
        (!cats.length || cats.includes(p.category)) &&
        (!warranties.length || warranties.includes(p.warranty)) &&
        bucketFn(p)
    );

    const disc = (p) => (p.oldPrice ? (p.oldPrice - p.price) / p.oldPrice : 0);
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    if (sort === "discount") l = [...l].sort((a, b) => disc(b) - disc(a));
    return l;
  }, [allProducts, query, cats, warranties, bucket, sort]);

  useEffect(() => setShown(PAGE), [query, cats, warranties, bucket, sort]);

  const activeChips = [
    ...cats.map((c) => ({ label: c, clear: () => toggle(cats, setCats, c) })),
    ...warranties.map((w) => ({ label: w + " warranty", clear: () => toggle(warranties, setWarranties, w) })),
    ...(bucket !== "all"
      ? [{ label: PRICE_BUCKETS.find((b) => b.id === bucket).label, clear: () => setBucket("all") }]
      : []),
    ...(query ? [{ label: `“${query}”`, clear: () => setQuery("") }] : []),
  ];

  const clearAll = () => {
    setCats([]); setWarranties([]); setBucket("all"); setQuery("");
  };

  const Filters = (
    <>
      <div className="filter-block">
        <h4>Search</h4>
        <div className="input-wrap">
          <span className="input-icon"><IconSearch /></span>
          <input
            className="input"
            style={{ paddingLeft: 38 }}
            placeholder="Search fans…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-block">
        <h4>Category</h4>
        <ul className="filter-list">
          {Object.entries(catCounts).sort().map(([c, n]) => (
            <li key={c}>
              <label className="check">
                <input type="checkbox" checked={cats.includes(c)} onChange={() => toggle(cats, setCats, c)} />
                <span className="box"><IconCheck size={13} /></span>
                <span className="lbl">{c}</span>
                <span className="cnt">{n}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-block">
        <h4>Price</h4>
        <ul className="filter-list">
          {PRICE_BUCKETS.map((b) => (
            <li key={b.id}>
              <label className="check radio">
                <input type="radio" name="price" checked={bucket === b.id} onChange={() => setBucket(b.id)} />
                <span className="box" />
                <span className="lbl">{b.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-block">
        <h4>Warranty</h4>
        <ul className="filter-list">
          <li><span className="lbl" style={{ opacity: 0.85 }}>Lifetime motor warranty</span></li>
          <li><span className="lbl" style={{ opacity: 0.85 }}>1 year kit warranty</span></li>
        </ul>
      </div>

      <button className="btn btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={clearAll}>
        Clear all filters
      </button>
    </>
  );

  if (!ready) {
    return <div className="container page-head">Loading fans…</div>;
  }

  return (
    <div className="container shop-wrap">
      {/* header */}
      <div className="shop-head">
        <nav className="breadcrumb">
          <Link href="/">Home</Link> <span>/</span> <span style={{ color: "var(--ink)" }}>Products</span>
        </nav>

        <div className="shop-hero-band">
          <span className="eyebrow">Our Collection</span>
          <h1>
            Explore <span className="red">Every</span> <span className="blue">Sitara</span> Fan
          </h1>
          <p>
            Ceiling, designer, pedestal and industrial fans — every unit built
            in-house with pure copper motors and backed by a real warranty.
          </p>
          <div className="shop-trust">
            <span><IconLeaf size={16} /> Up to 75% Less Energy</span>
            <span><IconBolt size={16} /> 100% Pure Copper Motor</span>
            <span><IconShield size={16} /> Lifetime Motor Warranty</span>
            <span><IconTruck size={16} /> Free Delivery</span>
          </div>
        </div>

        <div className="shop-quick">
          <button className={cats.length === 0 ? "on" : ""} onClick={() => setCats([])}>
            All Fans <em>{allProducts.length}</em>
          </button>
          {Object.entries(catCounts).sort().map(([c, n]) => (
            <button
              key={c}
              className={cats.includes(c) ? "on" : ""}
              onClick={() => toggle(cats, setCats, c)}
            >
              {c} <em>{n}</em>
            </button>
          ))}
        </div>
      </div>

      <div className="shop-layout">
        {/* ---------- sidebar ---------- */}
        <aside className="shop-filters">{Filters}</aside>

        {/* ---------- results ---------- */}
        <div className="shop-main">
          <div className="shop-toolbar">
            <button className="btn btn-sm filter-toggle" onClick={() => setDrawer(true)}>
              <IconMenu size={16} /> Filters
              {activeChips.length > 0 && <em className="chip-count">{activeChips.length}</em>}
            </button>

            <p className="shop-count">
              Showing <strong>{Math.min(shown, filtered.length)}</strong> of{" "}
              <strong>{filtered.length}</strong> fans
            </p>

            <div className="shop-tools">
              <div className="view-toggle" role="group" aria-label="View">
                {["grid", "list"].map((v) => (
                  <button
                    key={v}
                    className={view === v ? "active" : ""}
                    onClick={() => setView(v)}
                    aria-pressed={view === v}
                  >
                    {v === "grid" ? "Grid" : "List"}
                  </button>
                ))}
              </div>
              <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: "auto" }}>
                {SORTS.map((s) => <option key={s.id} value={s.id}>Sort: {s.label}</option>)}
              </select>
            </div>
          </div>

          {/* active filter chips */}
          {activeChips.length > 0 && (
            <div className="chip-row">
              {activeChips.map((c) => (
                <button key={c.label} className="chip" onClick={c.clear}>
                  {c.label} <IconClose size={13} />
                </button>
              ))}
              <button className="chip clear" onClick={clearAll}>Clear all</button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="admin-empty" style={{ marginTop: 10 }}>
              <IconSearch size={36} />
              <h3>No fans match those filters</h3>
              <p>Try widening your price range or clearing a filter.</p>
              <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={clearAll}>
                Clear all filters
              </button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-3">
              {filtered.slice(0, shown).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="list-view">
              {filtered.slice(0, shown).map((p) => {
                const dv = defaultVariant(p);
                const price = dv ? dv.price : p.price;
                const addOpts = dv ? { variant: dv.label, price: dv.price } : {};
                return (
                <article key={p.id} className="list-card">
                  <Link href={`/products/${p.id}`} className="list-media">
                    <ProductImage product={p} />
                  </Link>
                  <div className="list-body">
                    <span className="product-meta">
                      {p.category}
                      <span className="rate"><IconStar size={13} /> {p.rating}</span>
                    </span>
                    <Link href={`/products/${p.id}`}><h3>{p.name}</h3></Link>
                    <p>{p.short || p.tagline}</p>
                    <ul className="list-specs">
                      {p.sweep && <li>{p.sweep} sweep</li>}
                      {p.speed && <li>{p.speed}</li>}
                      <li>{p.kitWarranty || DEFAULT_KIT_WARRANTY} kit warranty</li>
                      {p.color && <li>{p.color}</li>}
                    </ul>
                  </div>
                  <div className="list-buy">
                    <div className="product-price">
                      {formatPKR(price)}
                      {dv && <span className="price-type"> · {dv.label}</span>}
                    </div>
                    {p.oldPrice && p.oldPrice > price && <s>{formatPKR(p.oldPrice)}</s>}
                    <button className="btn btn-primary btn-sm" onClick={() => addToCart(p, 1, addOpts)}>
                      Add to Cart
                    </button>
                    <Link href={`/products/${p.id}`} className="btn btn-sm">View details</Link>
                  </div>
                </article>
                );
              })}
            </div>
          )}

          {shown < filtered.length && (
            <div className="center" style={{ marginTop: 34 }}>
              <button className="btn btn-blue" onClick={() => setShown((s) => s + PAGE)}>
                Load more fans <IconArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---------- mobile filter drawer ---------- */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="drawer-scrim" onClick={() => setDrawer(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="filter-drawer"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}>
              <div className="drawer-head">
                <h3>Filters</h3>
                <button className="iconbtn" onClick={() => setDrawer(false)} aria-label="Close filters">
                  <IconClose />
                </button>
              </div>
              <div className="drawer-body">{Filters}</div>
              <div className="drawer-foot">
                <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setDrawer(false)}>
                  Show {filtered.length} results
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
