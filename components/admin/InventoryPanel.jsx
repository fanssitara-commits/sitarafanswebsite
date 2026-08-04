"use client";

import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { useInventory } from "@/context/InventoryContext";
import { formatPKR } from "@/data/products";
import {
  IconTrash, IconPackage, IconShield, IconStar, IconBolt, IconArrowRight,
} from "@/components/Icons";

export default function InventoryPanel() {
  const { allProducts, deleteProduct } = useInventory();
  const lowStock = allProducts.filter((p) => typeof p.stock === "number" && p.stock > 0 && p.stock <= 5).length;
  const outStock = allProducts.filter((p) => p.stock === 0).length;

  return (
    <div>
      {/* stat cards */}
      <div className="stat-cards">
        <div className="stat-card blue"><span className="stat-ic"><IconPackage size={19} /></span>
          <div><div className="stat-val">{allProducts.length}</div><div className="stat-lbl">Live Fans</div></div></div>
        <div className="stat-card teal"><span className="stat-ic"><IconStar size={17} /></span>
          <div><div className="stat-val">{allProducts.length}</div><div className="stat-lbl">Added by You</div></div></div>
        <div className="stat-card amber"><span className="stat-ic"><IconBolt size={18} /></span>
          <div><div className="stat-val">{lowStock}</div><div className="stat-lbl">Low Stock</div></div></div>
        <div className="stat-card red"><span className="stat-ic"><IconShield size={18} /></span>
          <div><div className="stat-val">{outStock}</div><div className="stat-lbl">Out of Stock</div></div></div>
      </div>

      {/* header */}
      <div className="inv-head">
        <p style={{ margin: 0, fontSize: "0.88rem" }}>
          <strong style={{ color: "var(--ink)" }}>{allProducts.length}</strong> fan
          {allProducts.length === 1 ? "" : "s"} in your catalogue — all added by you.
          Any fan below can be edited or removed.
        </p>
        <Link href="/admin/inventory/new" className="btn btn-primary">
          + Add New Fan
        </Link>
      </div>

      {/* inventory list — all fans (catalogue + admin-added) */}
      {allProducts.length === 0 ? (
        <div className="admin-empty" style={{ marginTop: 20 }}>
          <IconPackage size={40} />
          <h3>No fans yet</h3>
          <p>Click “Add New Fan” to put your first product on the shop.</p>
          <Link href="/admin/inventory/new" className="btn btn-primary" style={{ marginTop: 18 }}>
            Add New Fan <IconArrowRight />
          </Link>
        </div>
      ) : (
        <div className="inv-grid">
          {allProducts.map((p) => (
            <article key={p.id} className="inv-card">
              <div className="inv-card-media">
                <ProductImage product={p} />
                {p.badge && <span className="pill">{p.badge}</span>}
              </div>
              <div className="inv-card-body">
                <h4>{p.name}</h4>
                <span className="product-meta">
                  {p.category}{p.color ? ` • ${p.color}` : ""}
                </span>
                <div className="inv-price">
                  {formatPKR(p.price)}
                  {p.oldPrice ? <s>{formatPKR(p.oldPrice)}</s> : null}
                </div>
                <div className="inv-tags">
                  <span>Added by you</span>
                  {p.warranty && <span>{p.warranty} warranty</span>}
                  {p.stock != null && <span>{p.stock} in stock</span>}
                  {Array.isArray(p.variants) && p.variants.length > 0 && (
                    <span>{p.variants.map((v) => v.label).join(" / ")}</span>
                  )}
                  {p.material && <span title={p.material}>{p.material.slice(0, 24)}{p.material.length > 24 ? "…" : ""}</span>}
                </div>
                <div className="flex gap-12" style={{ marginTop: "auto", paddingTop: 12 }}>
                  <Link href={`/admin/inventory/new?id=${p.id}`} className="btn btn-sm">Edit</Link>
                  <button className="btn btn-sm inv-del"
                    onClick={() => { if (confirm(`Delete “${p.name}” from inventory?`)) deleteProduct(p.id); }}>
                    <IconTrash /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
