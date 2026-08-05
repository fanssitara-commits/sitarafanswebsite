"use client";

import Link from "next/link";
import ProductImage from "./ProductImage";
import { useCart } from "@/context/CartContext";
import { formatPKR, defaultVariant } from "@/data/products";
import { DEFAULT_KIT_WARRANTY } from "@/context/InventoryContext";
import { IconStar, IconArrowRight, IconCart } from "./Icons";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  // if the fan has AC/DC (or other) types, default to the AC/DC one + its price
  const dv = defaultVariant(product);
  const price = dv ? dv.price : product.price;
  const addOpts = dv ? { variant: dv.label, price: dv.price } : {};

  const off = product.oldPrice
    ? Math.round(((product.oldPrice - price) / product.oldPrice) * 100)
    : 0;
  const outOfStock = product.stock === 0;

  return (
    <article className={"card product-card" + (outOfStock ? " is-out" : "")}>
      <Link href={`/products/${product.id}`} className="product-media">
        <span className="badge-stack">
          {product.badge && <span className="pill">{product.badge}</span>}
          {off > 0 && <span className="pill pill-off">-{off}%</span>}
        </span>
        {outOfStock && <span className="stock-veil">Out of stock</span>}
        <ProductImage product={product} />
      </Link>

      <div className="product-body">
        <span className="product-meta">
          {product.category}
          <span className="rate"><IconStar size={13} /> {product.rating}</span>
        </span>

        <Link href={`/products/${product.id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <p className="product-tag">{product.tagline || product.short}</p>

        <ul className="card-specs">
          <li>{product.kitWarranty || DEFAULT_KIT_WARRANTY} kit warranty</li>
          {product.color && <li>{product.color}</li>}
        </ul>

        <div className="product-foot">
          <div>
            <div className="product-price">
              {formatPKR(price)}
              {dv && <span className="price-type"> · {dv.label}</span>}
            </div>
            {product.oldPrice && product.oldPrice > price && (
              <div className="old-price">{formatPKR(product.oldPrice)}</div>
            )}
          </div>
          <button
            className="btn btn-primary btn-sm add-btn"
            onClick={() => addToCart(product, 1, addOpts)}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
          >
            <IconCart size={16} /> Add
          </button>
        </div>

        <Link href={`/products/${product.id}`} className="card-link">
          View details <IconArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
