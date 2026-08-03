"use client";

import Link from "next/link";
import ProductImage from "./ProductImage";
import { products as staticProducts, formatPKR } from "@/data/products";
import { useInventory } from "@/context/InventoryContext";

/**
 * Continuous horizontal strip of every fan (image + name + price).
 * Auto-scrolls, pauses on hover, and each card links to its detail page.
 * Items are duplicated once so the loop is seamless.
 * Reads live products from the DB, falling back to the static catalogue.
 */
export default function ProductMarquee() {
  const { allProducts } = useInventory();
  const products = allProducts.length ? allProducts : staticProducts;
  const loop = [...products, ...products];
  return (
    <div className="marquee" aria-label="Browse all Sitara fans">
      <div className="marquee-track">
        {loop.map((p, i) => (
          <Link
            key={`${p.id}-${i}`}
            href={`/products/${p.id}`}
            className="marquee-card"
            aria-hidden={i >= products.length}
            tabIndex={i >= products.length ? -1 : 0}
          >
            <span className="marquee-media">
              <ProductImage product={p} />
            </span>
            <span className="marquee-info">
              <span className="marquee-name">{p.name}</span>
              <span className="marquee-price">{formatPKR(p.price)}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
