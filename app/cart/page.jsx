"use client";

import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/data/products";
import { IconTrash, IconCart, IconTruck, IconArrowRight } from "@/components/Icons";

export default function CartPage() {
  const { cart, ready, updateQty, removeFromCart, subtotal } = useCart();
  const shipping = subtotal > 10000 || subtotal === 0 ? 0 : 300;

  if (!ready) return <div className="container page-head">Loading…</div>;

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <div className="page-head">
        <span className="eyebrow">Your Cart</span>
        <h1 className="section-title">Shopping Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="glass empty-state">
          <div className="empty-icon"><IconCart size={38} /></div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven&apos;t added any fans yet.</p>
          <Link href="/products" className="btn btn-primary mt-40">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="split">
          <div>
            {cart.map((item) => (
              <div key={item.key || item.id} className="glass cart-row">
                <div
                  className="imgbox"
                  style={{ width: 90, height: 72, aspectRatio: "auto", borderRadius: 12 }}
                >
                  <ProductImage product={item} />
                </div>

                <div>
                  <Link href={`/products/${item.id}`}>
                    <div style={{ fontWeight: 700, color: "var(--ink)" }}>
                      {item.name}
                    </div>
                  </Link>
                  <div className="product-meta">
                    {item.category} • {formatPKR(item.price)}
                  </div>
                  {(item.color || item.variant) && (
                    <div className="product-meta" style={{ color: "var(--blue-2)", fontWeight: 600 }}>
                      {[item.color, item.variant].filter(Boolean).join(" · ")}
                    </div>
                  )}
                  <button
                    onClick={() => removeFromCart(item.key || item.id)}
                    style={{
                      border: "none",
                      background: "none",
                      color: "var(--red)",
                      cursor: "pointer",
                      padding: "4px 0",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <IconTrash /> Remove
                  </button>
                </div>

                <div className="qty">
                  <button onClick={() => updateQty(item.key || item.id, item.qty - 1)}>−</button>
                  <span style={{ minWidth: 22, textAlign: "center", fontWeight: 700 }}>
                    {item.qty}
                  </span>
                  <button onClick={() => updateQty(item.key || item.id, item.qty + 1)}>+</button>
                </div>

                <div style={{ fontWeight: 800, color: "var(--red)" }}>
                  {formatPKR(item.price * item.qty)}
                </div>
              </div>
            ))}
          </div>

          {/* summary */}
          <div>
            <div className="glass-strong" style={{ padding: 24, position: "sticky", top: 96 }}>
              <h3 style={{ fontSize: "1.15rem", marginBottom: 14 }}>Order Summary</h3>
              <div className="summary-line">
                <span>Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : formatPKR(shipping)}</span>
              </div>
              {shipping === 0 && subtotal > 0 && (
                <p style={{ fontSize: "0.8rem", margin: "4px 0 0", color: "var(--blue-2)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <IconTruck size={15} /> You unlocked free shipping!
                </p>
              )}
              <div className="summary-total">
                <span>Total</span>
                <span>{formatPKR(subtotal + shipping)}</span>
              </div>
              <Link
                href="/checkout"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: 20 }}
              >
                Proceed to Checkout <IconArrowRight size={16} />
              </Link>
              <Link
                href="/products"
                className="btn btn-ghost"
                style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
