"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconShield, IconCheck, IconArrowRight, IconClock, IconPackage, IconGear,
} from "@/components/Icons";

const empty = {
  name: "",
  phone: "",
  email: "",
  product: "",
  orderId: "",
  purchaseDate: "",
  seller: "",
  message: "",
  agree: false,
};

const covered = [
  { icon: <IconGear />, title: "Motor & Windings", text: "Manufacturing defects in the copper motor and internal windings." },
  { icon: <IconPackage />, title: "Build & Finish", text: "Defects in blades, canopy and factory finish under normal use." },
  { icon: <IconShield />, title: "Electrical Parts", text: "Capacitor and wiring faults not caused by external power issues." },
];

const terms = [
  "Warranty is valid only for the period printed on your product (1–3 years) from the date of purchase.",
  "Keep your original invoice / order ID — it is required for any warranty claim.",
  "Warranty covers manufacturing defects only, not physical damage, misuse or unauthorised repairs.",
  "Damage from voltage fluctuation, water or incorrect installation is not covered.",
  "Registering your product speeds up future claims but the invoice remains the primary proof of purchase.",
];

export default function WarrantyPage() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Your name is required";
    if (!/^[0-9+\-\s]{7,}$/.test(form.phone)) er.phone = "Enter a valid phone number";
    if (!form.product.trim()) er.product = "Please enter the fan model";
    if (!form.agree) er.agree = "Please accept the warranty terms to continue";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    const composed = [
      `Product / Model: ${form.product}`,
      `Order ID / Invoice: ${form.orderId || "Not provided"}`,
      `Purchase date: ${form.purchaseDate || "Not provided"}`,
      `Purchased from: ${form.seller || "Not provided"}`,
      "",
      form.message || "(No additional notes)",
    ].join("\n");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: `Warranty Registration — ${form.product}`,
          message: composed,
        }),
      });
      if (!res.ok) throw new Error("failed");
      window.dispatchEvent(new Event("sitara:data"));
      setDone({ name: form.name, product: form.product });
      setForm(empty);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({ form: "Could not register your product. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">Customer Care</span>
          <h1>Warranty <span className="red">Registration.</span></h1>
          <p>
            Register your Sitara fan to activate hassle-free warranty support.
            It only takes a minute — and makes any future claim faster.
          </p>
        </div>
      </section>

      {/* what's covered */}
      <section className="info-section">
        <div className="info-lead">
          <span className="eyebrow">Peace of Mind</span>
          <h2 className="section-title">What Your <span className="blue">Warranty</span> Covers</h2>
        </div>
        <div className="grid grid-3">
          {covered.map((c) => (
            <div key={c.title} className="feature-tile">
              <span className="icon">{c.icon}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* form + terms */}
      <section className="section soft">
        <div className="container">
          {done ? (
            <div className="glass center" style={{ padding: "56px 30px", maxWidth: 640, margin: "0 auto", borderRadius: 18 }}>
              <span className="icon" style={{ width: 60, height: 60, margin: "0 auto 14px", background: "rgba(13,148,136,0.12)", color: "#0d9488", borderRadius: 16, display: "grid", placeItems: "center" }}>
                <IconCheck size={28} />
              </span>
              <h2 className="section-title" style={{ fontSize: "1.7rem" }}>Product Registered</h2>
              <p className="section-sub" style={{ margin: "8px auto 6px" }}>
                Thank you, {done.name}. Your <strong style={{ color: "var(--blue-2)" }}>{done.product}</strong> is
                now registered. Please keep your invoice safe as proof of purchase.
              </p>
              <div className="flex gap-12 wrap" style={{ justifyContent: "center", marginTop: 20 }}>
                <button className="btn btn-blue" onClick={() => setDone(null)}>Register Another</button>
                <Link href="/complaint" className="btn btn-ghost">Need a Warranty Claim?</Link>
              </div>
            </div>
          ) : (
            <div className="two-col">
              <form className="glass" style={{ padding: 28, borderRadius: 18 }} onSubmit={submit}>
                <h3 style={{ marginBottom: 4 }}>Register Your Fan</h3>
                <p className="form-sub" style={{ marginBottom: 16 }}>Fields marked * are required.</p>

                <div className="grid grid-2" style={{ gap: 14 }}>
                  <div className="field">
                    <label>Full Name *</label>
                    <input className="input" value={form.name} onChange={set("name")} placeholder="Your name" />
                    {errors.name && <small className="auth-error">{errors.name}</small>}
                  </div>
                  <div className="field">
                    <label>Phone *</label>
                    <input className="input" value={form.phone} onChange={set("phone")} placeholder="0300 1234567" />
                    {errors.phone && <small className="auth-error">{errors.phone}</small>}
                  </div>
                </div>

                <div className="grid grid-2" style={{ gap: 14 }}>
                  <div className="field">
                    <label>Email (optional)</label>
                    <input className="input" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
                  </div>
                  <div className="field">
                    <label>Fan Model *</label>
                    <input className="input" value={form.product} onChange={set("product")} placeholder="e.g. Sitara Royal Gold" />
                    {errors.product && <small className="auth-error">{errors.product}</small>}
                  </div>
                </div>

                <div className="grid grid-2" style={{ gap: 14 }}>
                  <div className="field">
                    <label>Order ID / Invoice No. (optional)</label>
                    <input className="input" value={form.orderId} onChange={set("orderId")} placeholder="SF-XXXXXXXX" />
                  </div>
                  <div className="field">
                    <label>Purchase Date (optional)</label>
                    <input className="input" type="date" value={form.purchaseDate} onChange={set("purchaseDate")} />
                  </div>
                </div>

                <div className="field">
                  <label>Purchased From (optional)</label>
                  <input className="input" value={form.seller} onChange={set("seller")} placeholder="Shop name / city or sitarafans.com" />
                </div>

                <div className="field">
                  <label>Notes (optional)</label>
                  <textarea className="textarea" value={form.message} onChange={set("message")} placeholder="Anything you'd like us to know…" />
                </div>

                <label className="check" style={{ alignItems: "flex-start", marginTop: 4 }}>
                  <input type="checkbox" checked={form.agree} onChange={set("agree")} />
                  <span className="box"><IconCheck size={13} /></span>
                  <span className="lbl" style={{ fontSize: "0.86rem" }}>
                    I have read and accept the warranty terms &amp; conditions.
                  </span>
                </label>
                {errors.agree && <small className="auth-error">{errors.agree}</small>}

                {errors.form && <div className="inv-msg err" style={{ marginTop: 12 }}>{errors.form}</div>}

                <button className="btn btn-primary" disabled={busy} style={{ marginTop: 16, justifyContent: "center" }}>
                  {busy ? "Registering…" : <>Register Product <IconArrowRight /></>}
                </button>
              </form>

              <div>
                <div className="glass" style={{ padding: 24, borderRadius: 18 }}>
                  <span className="eyebrow"><IconShield size={16} /> Warranty Terms</span>
                  <ul className="tc-list" style={{ marginTop: 12, display: "grid", gap: 10, listStyle: "none", padding: 0 }}>
                    {terms.map((t) => (
                      <li key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.9rem" }}>
                        <span style={{ color: "#0d9488", flexShrink: 0, marginTop: 2 }}><IconCheck size={16} /></span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass" style={{ padding: 24, borderRadius: 18, marginTop: 18 }}>
                  <h3 style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                    <IconClock size={18} /> Already Have an Issue?
                  </h3>
                  <p style={{ fontSize: "0.9rem", marginTop: 0 }}>
                    If your fan already has a fault, you can raise a claim directly.
                  </p>
                  <Link href="/complaint" className="btn btn-sm">Register a Complaint <IconArrowRight size={14} /></Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
