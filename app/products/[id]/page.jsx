"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useInventory } from "@/context/InventoryContext";
import { formatPKR } from "@/data/products";
import { IconStar, IconCart, IconBolt, IconPackage } from "@/components/Icons";

export default function ProductDetail({ params }) {
  const { allProducts: products, ready } = useInventory();
  const product = products.find((p) => p.id === params.id);
  const { addToCart } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [colorIdx, setColorIdx] = useState(-1); // -1 = main image
  const [powerType, setPowerType] = useState(null); // selected type/variant label

  if (!ready) {
    return <div className="container page-head">Loading…</div>;
  }

  if (!product) {
    return (
      <div className="container">
        <div className="glass empty-state" style={{ marginTop: 40 }}>
          <div className="empty-icon"><IconPackage size={40} /></div>
          <h3>Product not found</h3>
          <Link href="/products" className="btn btn-primary mt-40">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const filler = products.filter((p) => p.id !== product.id).slice(0, 4);
  const suggestions = (related.length ? related : filler).slice(0, 4);

  // ---- colour variants (any colour that has a photo; name optional) ----
  const colors = Array.isArray(product.colors) ? product.colors.filter((c) => c && c.img) : [];
  const activeColor = colorIdx >= 0 ? colors[colorIdx] || null : null;
  // main product image shows by default; a colour only overrides it when picked
  const displayImg = activeColor?.img || product.img;

  // ---- type / model variants (each has its own price), e.g. "AC/DC", "30W" ----
  const variants = Array.isArray(product.variants)
    ? product.variants.filter((v) => v && v.label)
    : [];
  const selectedLabel = powerType || variants[0]?.label || null;
  const selectedVariant = variants.find((v) => v.label === selectedLabel) || null;
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

  const specs = [
    ["Category", product.category],
    ["Type", selectedLabel],
    ["Sweep Size", product.sweep],
    ["Speed", product.speed],
    ["Colour", activeColor?.name || product.color],
    ["Material", product.material],
    ["Warranty", product.warranty],
    ["Rating", `${product.rating} / 5`],
    ["Availability", product.stock != null ? `${product.stock} in stock` : null],
  ].filter(([, v]) => v);

  const addOpts = {
    color: activeColor?.name || null,
    variant: selectedLabel,
    price: currentPrice,
    img: displayImg,
  };

  return (
    <div className="container pdp" style={{ paddingBottom: 40 }}>
      <div className="breadcrumb page-head" style={{ paddingBottom: 0 }}>
        <Link href="/">Home</Link> / <Link href="/products">Products</Link> /{" "}
        <span style={{ color: "var(--ink)" }}>{product.name}</span>
      </div>

      <div className="grid pdp-grid" style={{ alignItems: "start", marginTop: 20 }}>
        {/* visual */}
        <div
          className="glass-strong pdp-visual"
          style={{ padding: 16, overflow: "hidden" }}
        >
          {product.badge && (
            <span className="pill" style={{ position: "absolute", top: 26, left: 26, zIndex: 2 }}>
              {product.badge}
            </span>
          )}
          <div className="imgbox" style={{ aspectRatio: "4 / 3" }}>
            <ProductImage product={{ ...product, img: displayImg }} />
          </div>

          {/* thumbnails — main image first, then each colour */}
          {colors.length > 0 && (
            <div className="flex gap-12 wrap" style={{ marginTop: 12, justifyContent: "center" }}>
              {product.img && (
                <button
                  onClick={() => setColorIdx(-1)}
                  title="Default"
                  aria-label="Default image"
                  style={{
                    width: 56, height: 56, borderRadius: 10, overflow: "hidden", cursor: "pointer",
                    padding: 0, background: "#fff",
                    border: colorIdx === -1 ? "2px solid var(--blue-2)" : "1px solid var(--line)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.img} alt="Default" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              )}
              {colors.map((c, i) => (
                <button
                  key={c.name || i}
                  onClick={() => setColorIdx(i)}
                  title={c.name}
                  aria-label={c.name}
                  style={{
                    width: 56, height: 56, borderRadius: 10, overflow: "hidden", cursor: "pointer",
                    padding: 0, background: "#fff",
                    border: i === colorIdx ? "2px solid var(--blue-2)" : "1px solid var(--line)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div>
          <span className="eyebrow">{product.category} Fan</span>
          <h1 className="section-title" style={{ fontSize: "clamp(1.5rem, 6vw, 2.1rem)" }}>
            {product.name}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--blue-2)", fontWeight: 600 }}>
            {product.tagline}
          </p>
          <p style={{ fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <IconStar size={15} style={{ color: "var(--gold, #f5a623)" }} /> {product.rating} rating • {product.warranty} warranty
          </p>

          <div className="flex gap-12 wrap" style={{ alignItems: "baseline", margin: "10px 0 12px" }}>
            <span className="product-price" style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}>
              {formatPKR(currentPrice)}
            </span>
            {product.oldPrice && product.oldPrice > currentPrice && (
              <span style={{ color: "var(--muted)", textDecoration: "line-through" }}>
                {formatPKR(product.oldPrice)}
              </span>
            )}
            {product.oldPrice && product.oldPrice > currentPrice && (
              <span className="pill">
                Save {formatPKR(product.oldPrice - currentPrice)}
              </span>
            )}
          </div>

          {/* type / model selector — each type has its own price */}
          {variants.length > 0 && (
            <div style={{ margin: "0 0 16px" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", display: "block", marginBottom: 6 }}>
                Choose Type
              </span>
              <div className="flex gap-12 wrap">
                {variants.map((v) => (
                  <button
                    key={v.label}
                    onClick={() => setPowerType(v.label)}
                    className={"btn btn-sm" + (selectedLabel === v.label ? " btn-primary" : "")}
                  >
                    {v.label} — {formatPKR(v.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* colour name */}
          {colors.length > 0 && activeColor?.name && (
            <p style={{ fontSize: "0.9rem", margin: "0 0 14px" }}>
              Colour: <strong>{activeColor.name}</strong>
            </p>
          )}

          <p>{product.description}</p>

          {/* qty + actions */}
          {product.stock === 0 ? (
            <div className="flex gap-12 wrap" style={{ alignItems: "center", margin: "22px 0" }}>
              <span className="pill" style={{ background: "var(--red)", color: "#fff" }}>
                Out of stock
              </span>
              <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                This fan is currently unavailable.
              </span>
            </div>
          ) : (
            <div className="flex gap-12 wrap pdp-actions" style={{ alignItems: "center", margin: "22px 0" }}>
              <div className="qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>
                  {qty}
                </span>
                <button
                  onClick={() =>
                    setQty((q) =>
                      typeof product.stock === "number" ? Math.min(product.stock, q + 1) : q + 1
                    )
                  }
                >
                  +
                </button>
              </div>
              <button className="btn btn-primary" onClick={() => addToCart(product, qty, addOpts)}>
                <IconCart size={17} /> Add to Cart
              </button>
              <button
                className="btn btn-blue"
                onClick={() => {
                  addToCart(product, qty, addOpts);
                  router.push("/cart");
                }}
              >
                <IconBolt size={17} /> Buy Now
              </button>
            </div>
          )}

          {/* specs */}
          <div className="glass" style={{ padding: 22 }}>
            <h3 style={{ fontSize: "1.05rem", marginBottom: 12 }}>Specifications</h3>
            <div className="grid grid-2" style={{ gap: 10 }}>
              {specs.map(([k, v]) => (
                <div key={k} className="flex" style={{ justifyContent: "space-between", gap: 10 }}>
                  <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>{k}</span>
                  <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* related */}
      {suggestions.length > 0 && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <h2 className="section-title" style={{ fontSize: "1.6rem", marginBottom: 24 }}>
            You may also like
          </h2>
          <div className="grid grid-4">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
