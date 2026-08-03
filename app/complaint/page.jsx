"use client";

import { useState } from "react";
import Link from "next/link";
import { IconCheck, IconArrowRight } from "@/components/Icons";

const empty = { name: "", phone: "", email: "", orderId: "", category: "Product Issue", message: "" };

export default function ComplaintPage() {
  const [form, setForm] = useState(empty);
  const [done, setDone] = useState(null);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!form.name.trim()) er.name = "Please enter your name";
    if (!/^[0-9+\-\s]{7,}$/.test(form.phone)) er.phone = "Enter a valid phone number";
    if (!form.message.trim()) er.message = "Please describe your complaint";
    setErrors(er);
    if (Object.keys(er).length) return;

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.item) throw new Error("failed");
      window.dispatchEvent(new Event("sitara:data"));
      setDone(data.item);
      setForm(empty);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({ message: "Could not submit your complaint. Please try again." });
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">Customer Care</span>
          <h1>Register a <span className="red">Complaint.</span></h1>
          <p>
            Something not right with your Sitara fan or order? Tell us and our
            support team will get back to you promptly.
          </p>
        </div>
      </section>

      <section className="info-section" style={{ maxWidth: 760 }}>
        {done ? (
          <div className="glass center" style={{ padding: "48px 30px", border: "1px solid var(--line)", borderRadius: 18, boxShadow: "var(--shadow-sm)" }}>
            <span className="icon" style={{ width: 60, height: 60, margin: "0 auto 14px", background: "rgba(13,148,136,0.12)", color: "#0d9488", borderRadius: 16, display: "grid", placeItems: "center" }}>
              <IconCheck size={28} />
            </span>
            <h2 className="section-title" style={{ fontSize: "1.7rem" }}>Complaint Received</h2>
            <p className="section-sub" style={{ margin: "8px auto 6px" }}>
              Thank you, {done.name}. Your complaint reference is{" "}
              <strong style={{ color: "var(--blue-2)" }}>#{done.id}</strong>.
              Our team will contact you on {done.phone}.
            </p>
            <div className="flex gap-12 wrap" style={{ justifyContent: "center", marginTop: 20 }}>
              <button className="btn btn-blue" onClick={() => setDone(null)}>Submit Another</button>
              <Link href="/customer-service" className="btn">Customer Services</Link>
            </div>
          </div>
        ) : (
          <form className="glass" style={{ padding: 28, border: "1px solid var(--line)", borderRadius: 18 }} onSubmit={submit}>
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
                <label>Order ID (optional)</label>
                <input className="input" value={form.orderId} onChange={set("orderId")} placeholder="SF-XXXXXXXX" />
              </div>
            </div>
            <div className="field">
              <label>Complaint Type</label>
              <select className="select" value={form.category} onChange={set("category")}>
                <option>Product Issue</option>
                <option>Delivery Problem</option>
                <option>Warranty Claim</option>
                <option>Billing / Payment</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field">
              <label>Describe your complaint *</label>
              <textarea className="textarea" value={form.message} onChange={set("message")} placeholder="Tell us what went wrong…" />
              {errors.message && <small className="auth-error">{errors.message}</small>}
            </div>
            <button className="btn btn-primary" style={{ justifyContent: "center" }}>
              Submit Complaint <IconArrowRight />
            </button>
          </form>
        )}
      </section>
    </>
  );
}
