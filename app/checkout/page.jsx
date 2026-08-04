"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/data/products";
import { IconCheck, IconCart, IconLock } from "@/components/Icons";

const empty = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  payment: "Cash on Delivery",
  notes: "",
};

export default function CheckoutPage() {
  const { cart, subtotal, placeOrder, ready } = useCart();
  const [form, setForm] = useState(empty);
  const [placed, setPlaced] = useState(null);
  const [errors, setErrors] = useState({});

  const shipping = subtotal > 10000 || subtotal === 0 ? 0 : 300;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Name is required";
    if (!/^[0-9+\-\s]{7,}$/.test(form.phone)) er.phone = "Enter a valid phone";
    if (!form.address.trim()) er.address = "Address is required";
    if (!form.city.trim()) er.city = "City is required";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const order = await placeOrder(form);
    setSubmitting(false);
    if (!order) {
      setErrors({ form: "Something went wrong placing your order. Please try again." });
      return;
    }
    setPlaced(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!ready) return <div className="container page-head">Loading…</div>;

  // -------- success screen --------
  if (placed) {
    return (
      <div className="container" style={{ paddingBottom: 40 }}>
        <div className="glass-strong center" style={{ padding: "60px 30px", marginTop: 40 }}>
          <div className="success-check"><IconCheck size={40} /></div>
          <h1 className="section-title">Order Placed!</h1>
          <p className="section-sub" style={{ margin: "6px auto 18px" }}>
            Thank you, {placed.customer.name}! Your order{" "}
            <strong style={{ color: "var(--blue-2)" }}>#{placed.id}</strong> has
            been received. We&apos;ll call you on {placed.customer.phone} to
            confirm.
          </p>
          <div
            className="glass"
            style={{ padding: 22, maxWidth: 440, margin: "0 auto 22px", textAlign: "left" }}
          >
            <div className="summary-line">
              <span>Order ID</span>
              <span>#{placed.id}</span>
            </div>
            <div className="summary-line">
              <span>Items</span>
              <span>{placed.items.reduce((s, i) => s + i.qty, 0)}</span>
            </div>
            <div className="summary-line">
              <span>Payment</span>
              <span>{placed.customer.payment}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{formatPKR(placed.total)}</span>
            </div>
          </div>
          <div className="flex gap-12 wrap" style={{ justifyContent: "center" }}>
            <Link href="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
            <Link href="/" className="btn btn-ghost">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------- empty cart guard --------
  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="glass empty-state" style={{ marginTop: 40 }}>
          <div className="empty-icon"><IconCart size={38} /></div>
          <h3>Your cart is empty</h3>
          <p>Add some fans before checking out.</p>
          <Link href="/products" className="btn btn-primary mt-40">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  // -------- checkout form --------
  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <div className="page-head">
        <span className="eyebrow">Checkout</span>
        <h1 className="section-title">Place Your Order</h1>
      </div>

      <form className="split" onSubmit={submit}>
        {/* details */}
        <div className="glass" style={{ padding: 26 }}>
          <h3 style={{ marginBottom: 16 }}>Delivery Details</h3>

          <div className="grid grid-2" style={{ gap: 14 }}>
            <div className="field">
              <label>Full Name *</label>
              <input className="input" value={form.name} onChange={set("name")} placeholder="Ahmed Khan" />
              {errors.name && <small style={{ color: "var(--red)" }}>{errors.name}</small>}
            </div>
            <div className="field">
              <label>Phone *</label>
              <input className="input" value={form.phone} onChange={set("phone")} placeholder="0300 1234567" />
              {errors.phone && <small style={{ color: "var(--red)" }}>{errors.phone}</small>}
            </div>
          </div>

          <div className="field">
            <label>Email (optional)</label>
            <input className="input" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
          </div>

          <div className="field">
            <label>Address *</label>
            <textarea className="textarea" value={form.address} onChange={set("address")} placeholder="House #, street, area..." />
            {errors.address && <small style={{ color: "var(--red)" }}>{errors.address}</small>}
          </div>

          <div className="grid grid-2" style={{ gap: 14 }}>
            <div className="field">
              <label>City *</label>
              <input className="input" value={form.city} onChange={set("city")} placeholder="Lahore" />
              {errors.city && <small style={{ color: "var(--red)" }}>{errors.city}</small>}
            </div>
            <div className="field">
              <label>Payment Method</label>
              <select className="select" value={form.payment} onChange={set("payment")}>
                <option>Cash on Delivery</option>
                <option>Bank Transfer</option>
                <option>JazzCash / Easypaisa</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Order Notes (optional)</label>
            <textarea className="textarea" value={form.notes} onChange={set("notes")} placeholder="Any special instructions..." />
          </div>
        </div>

        {/* summary */}
        <div>
          <div className="glass-strong" style={{ padding: 24, position: "sticky", top: 90 }}>
            <h3 style={{ marginBottom: 14 }}>Your Order</h3>
            {cart.map((i) => (
              <div key={i.id} className="summary-line">
                <span>
                  {i.name} × {i.qty}
                </span>
                <span>{formatPKR(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="summary-line" style={{ borderTop: "1px solid var(--glass-border)", marginTop: 6, paddingTop: 12 }}>
              <span>Subtotal</span>
              <span>{formatPKR(subtotal)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : formatPKR(shipping)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{formatPKR(subtotal + shipping)}</span>
            </div>
            {errors.form && (
              <small style={{ color: "var(--red)", display: "block", marginTop: 12 }}>{errors.form}</small>
            )}
            <button type="submit" className="btn btn-primary" disabled={submitting}
              style={{ width: "100%", justifyContent: "center", marginTop: 18 }}>
              {submitting ? "Placing…" : <><IconLock size={16} /> Place Order</>}
            </button>
            <Link href="/cart" className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>
              Back to Cart
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
