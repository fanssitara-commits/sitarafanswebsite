"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconShield, IconPackage, IconTruck, IconUsers, IconGear, IconClock,
  IconCheck, IconArrowRight, IconMail, IconWhatsapp,
} from "@/components/Icons";

const empty = {
  company: "",
  name: "",
  email: "",
  phone: "",
  country: "",
  product: "Ceiling Fans",
  quantity: "",
  message: "",
  agree: false,
};

const PRODUCTS = [
  "Ceiling Fans",
  "Designer Fans",
  "Pedestal Fans",
  "Bracket Fans",
  "Exhaust Fans",
  "Rechargeable Fans",
  "Mixed / Full Range",
];

const steps = [
  { n: "01", title: "Send Your Inquiry", text: "Share your market, target models and estimated volume using the form." },
  { n: "02", title: "Receive a Quote", text: "We reply with factory-direct pricing, MOQs, lead times and Incoterms." },
  { n: "03", title: "Approve a Sample", text: "We ship a sample so you can verify build quality before committing." },
  { n: "04", title: "Produce & Ship", text: "We manufacture your batch, quality-check it and ship to your port." },
];

const benefits = [
  { icon: <IconShield />, title: "Certified Quality", text: "Every export batch is tested to international standards." },
  { icon: <IconPackage />, title: "Factory-Direct Pricing", text: "No middlemen — you buy straight from the manufacturer." },
  { icon: <IconGear />, title: "Custom Options", text: "Colour, voltage (110V/220V) and packaging for your market." },
  { icon: <IconTruck />, title: "Reliable Shipping", text: "Well-packed containers delivered on schedule to your port." },
];

const terms = [
  "Minimum Order Quantity (MOQ) and pricing are confirmed per model at the time of quotation.",
  "Quoted prices are valid for 30 days unless stated otherwise.",
  "Standard payment terms: 30% advance to start production, 70% before dispatch (negotiable for established partners).",
  "Typical production lead time is 3–6 weeks depending on order volume.",
  "Prices are quoted Ex-Works / FOB Karachi by default; other Incoterms available on request.",
  "Samples are available on request; sample cost may be adjusted against a confirmed bulk order.",
  "Warranty covers manufacturing defects only and follows the terms agreed in the export contract.",
];

export default function ExportInquiryPage() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const validate = () => {
    const er = {};
    if (!form.company.trim()) er.company = "Company name is required";
    if (!form.name.trim()) er.name = "Contact name is required";
    if (!/.+@.+\..+/.test(form.email)) er.email = "Enter a valid email";
    if (!/^[0-9+\-\s]{7,}$/.test(form.phone)) er.phone = "Enter a valid phone / WhatsApp number";
    if (!form.country.trim()) er.country = "Destination country is required";
    if (!form.agree) er.agree = "Please accept the terms to continue";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/export-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company,
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          product: form.product,
          quantity: form.quantity,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error("failed");
      window.dispatchEvent(new Event("sitara:data"));
      setDone({ name: form.name, country: form.country });
      setForm(empty);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({ form: "Could not send your inquiry. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">International Trade</span>
          <h1>Export <span className="red">Inquiry.</span></h1>
          <p>
            Bring Pakistan&apos;s trusted fan brand to your market. Tell us what
            you need and our export team will reply with factory-direct pricing,
            MOQs and lead times — usually within 24 hours.
          </p>
        </div>
      </section>

      {/* process */}
      <section className="info-section">
        <div className="info-lead">
          <span className="eyebrow">How It Works</span>
          <h2 className="section-title">
            From Inquiry to <span className="blue">Shipment</span>
          </h2>
        </div>
        <div className="grid grid-4">
          {steps.map((s) => (
            <div key={s.n} className="feature-tile">
              <span className="icon" style={{ fontWeight: 800 }}>{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* form + sidebar */}
      <section className="section soft">
        <div className="container">
          {done ? (
            <div className="glass center" style={{ padding: "56px 30px", maxWidth: 640, margin: "0 auto", borderRadius: 18 }}>
              <span className="icon" style={{ width: 60, height: 60, margin: "0 auto 14px", background: "rgba(13,148,136,0.12)", color: "#0d9488", borderRadius: 16, display: "grid", placeItems: "center" }}>
                <IconCheck size={28} />
              </span>
              <h2 className="section-title" style={{ fontSize: "1.7rem" }}>Inquiry Received</h2>
              <p className="section-sub" style={{ margin: "8px auto 6px" }}>
                Thank you, {done.name}. We&apos;ve received your export inquiry for{" "}
                <strong style={{ color: "var(--blue-2)" }}>{done.country}</strong> and
                our team will get back to you shortly.
              </p>
              <div className="flex gap-12 wrap" style={{ justifyContent: "center", marginTop: 20 }}>
                <button className="btn btn-blue" onClick={() => setDone(null)}>Send Another Inquiry</button>
                <Link href="/products" className="btn btn-ghost">Browse Products</Link>
              </div>
            </div>
          ) : (
            <div className="two-col">
              {/* form */}
              <form className="glass" style={{ padding: 28, borderRadius: 18 }} onSubmit={submit}>
                <h3 style={{ marginBottom: 4 }}>Tell Us About Your Requirement</h3>
                <p className="form-sub" style={{ marginBottom: 16 }}>Fields marked * are required.</p>

                <div className="grid grid-2" style={{ gap: 14 }}>
                  <div className="field">
                    <label>Company Name *</label>
                    <input className="input" value={form.company} onChange={set("company")} placeholder="Your company" />
                    {errors.company && <small className="auth-error">{errors.company}</small>}
                  </div>
                  <div className="field">
                    <label>Contact Person *</label>
                    <input className="input" value={form.name} onChange={set("name")} placeholder="Your name" />
                    {errors.name && <small className="auth-error">{errors.name}</small>}
                  </div>
                </div>

                <div className="grid grid-2" style={{ gap: 14 }}>
                  <div className="field">
                    <label>Email *</label>
                    <input className="input" type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" />
                    {errors.email && <small className="auth-error">{errors.email}</small>}
                  </div>
                  <div className="field">
                    <label>Phone / WhatsApp *</label>
                    <input className="input" value={form.phone} onChange={set("phone")} placeholder="+92 300 1234567" />
                    {errors.phone && <small className="auth-error">{errors.phone}</small>}
                  </div>
                </div>

                <div className="grid grid-2" style={{ gap: 14 }}>
                  <div className="field">
                    <label>Destination Country / Market *</label>
                    <input className="input" value={form.country} onChange={set("country")} placeholder="e.g. UAE, Nigeria, UK" />
                    {errors.country && <small className="auth-error">{errors.country}</small>}
                  </div>
                  <div className="field">
                    <label>Products of Interest</label>
                    <select className="select" value={form.product} onChange={set("product")}>
                      {PRODUCTS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Estimated Quantity (units)</label>
                  <input className="input" value={form.quantity} onChange={set("quantity")} placeholder="e.g. 500 – 1000 units" />
                </div>

                <div className="field">
                  <label>Message / Additional Details</label>
                  <textarea className="textarea" value={form.message} onChange={set("message")} placeholder="Tell us about your requirements, timeline, packaging or voltage needs…" />
                </div>

                <label className="check" style={{ alignItems: "flex-start", marginTop: 4 }}>
                  <input type="checkbox" checked={form.agree} onChange={set("agree")} />
                  <span className="box"><IconCheck size={13} /></span>
                  <span className="lbl" style={{ fontSize: "0.86rem" }}>
                    I have read and accept the export terms &amp; conditions listed on this page.
                  </span>
                </label>
                {errors.agree && <small className="auth-error">{errors.agree}</small>}

                {errors.form && <div className="inv-msg err" style={{ marginTop: 12 }}>{errors.form}</div>}

                <button className="btn btn-primary" disabled={busy} style={{ marginTop: 16, justifyContent: "center" }}>
                  {busy ? "Sending…" : <>Submit Inquiry <IconArrowRight /></>}
                </button>
              </form>

              {/* sidebar */}
              <div>
                <div className="glass" style={{ padding: 24, borderRadius: 18 }}>
                  <h3 style={{ marginBottom: 14 }}>Why Partner With Sitara</h3>
                  {benefits.map((b) => (
                    <div key={b.title} className="channel" style={{ marginBottom: 12, boxShadow: "none", border: "none", padding: "6px 0" }}>
                      <span className="ic">{b.icon}</span>
                      <div><h3 style={{ fontSize: "1rem" }}>{b.title}</h3><p style={{ fontSize: "0.86rem" }}>{b.text}</p></div>
                    </div>
                  ))}
                  <div className="flex gap-12 wrap" style={{ marginTop: 10 }}>
                    <a className="btn btn-sm" href="mailto:info@sitarafans.com"><IconMail size={15} /> Email</a>
                    <a className="btn btn-sm" href="https://wa.me/923001234567" target="_blank" rel="noreferrer"><IconWhatsapp size={15} /> WhatsApp</a>
                  </div>
                </div>

                <div className="glass" style={{ padding: 24, borderRadius: 18, marginTop: 18 }}>
                  <h3 style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                    <IconClock size={18} /> Response Time
                  </h3>
                  <p style={{ fontSize: "0.9rem", margin: 0 }}>
                    Our export team typically replies within <strong>24 hours</strong> on
                    working days (Mon–Sat).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* terms & conditions */}
          <div className="glass" style={{ padding: 28, borderRadius: 18, marginTop: 24, maxWidth: 980, marginInline: "auto" }}>
            <span className="eyebrow"><IconShield size={16} /> Export Terms &amp; Conditions</span>
            <h2 className="section-title" style={{ fontSize: "1.5rem", marginTop: 6 }}>
              Simple, <span className="blue">Transparent</span> Trade Terms
            </h2>
            <ul className="tc-list" style={{ marginTop: 14, display: "grid", gap: 10, listStyle: "none", padding: 0 }}>
              {terms.map((t) => (
                <li key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.92rem" }}>
                  <span style={{ color: "#0d9488", flexShrink: 0, marginTop: 2 }}><IconCheck size={16} /></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 16 }}>
              Full terms are confirmed in a written export contract for each order.
              These points are a summary for guidance only.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
