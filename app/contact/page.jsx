"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  IconPin, IconPhone, IconMail, IconWhatsapp, IconClock, IconCheck, IconArrowRight,
} from "@/components/Icons";

const ADDRESS = "Industrial Area, Gujranwala, Punjab, Pakistan";
const MAPS = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ADDRESS);

const channels = [
  { icon: <IconPhone size={20} />, title: "Call Us", lines: ["+92 300 1234567"], note: "Mon–Sat, 9am–8pm", href: "tel:+923001234567", cta: "Call now" },
  { icon: <IconWhatsapp size={20} />, title: "WhatsApp", lines: ["+92 300 1234567"], note: "Fast replies in working hours", href: "https://wa.me/923001234567", cta: "Chat on WhatsApp", tone: "red" },
  { icon: <IconMail size={20} />, title: "Email Us", lines: ["info@sitarafans.com"], note: "We reply within 24 hours", href: "mailto:info@sitarafans.com", cta: "Send an email" },
  { icon: <IconPin size={20} />, title: "Visit Us", lines: [ADDRESS], note: "Factory & head office", href: MAPS, cta: "Get directions", tone: "red" },
];

export default function ContactPage() {
  const { showToast } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      window.dispatchEvent(new Event("sitara:data"));
      setSent(true);
      showToast("Message sent! We'll reply soon 💬");
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    } catch {
      showToast("Could not send your message. Please try again.");
    }
  };

  return (
    <>
      <section className="info-section contact-section">
        <div className="contact-head">
          <span className="eyebrow">Get in Touch</span>
          <h1>Let&apos;s <span className="red">Talk.</span></h1>
          <p>
            Questions about a product, an order or a warranty claim? Our team is
            here to help — reach us any way you like, or drop a message below.
          </p>
        </div>

        <div className="contact-grid">
          {/* channels */}
          <div className="contact-info">
            {channels.map((c) => (
              <a
                key={c.title}
                className={"contact-channel" + (c.tone === "red" ? " red" : "")}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noreferrer" : undefined}
              >
                <span className="ic">{c.icon}</span>
                <span className="contact-channel-body">
                  <h3>{c.title}</h3>
                  {c.lines.map((l) => <p key={l} className="main">{l}</p>)}
                  <p className="note">{c.note}</p>
                  <span className="chan-cta">{c.cta} <IconArrowRight size={14} /></span>
                </span>
              </a>
            ))}
          </div>

          {/* form */}
          <div className="contact-form-card">
            <h3>Send us a <span className="blue">Message</span></h3>
            <p className="form-sub">Fill in the form and our team will get back to you shortly.</p>
            <form onSubmit={submit}>
              <div className="grid grid-2" style={{ gap: 14 }}>
                <div className="field">
                  <label>Name *</label>
                  <input className="input" required value={form.name} onChange={set("name")} placeholder="Your name" />
                </div>
                <div className="field">
                  <label>Phone (WhatsApp) *</label>
                  <input className="input" required value={form.phone} onChange={set("phone")} placeholder="0300 1234567" />
                </div>
              </div>
              <div className="grid grid-2" style={{ gap: 14 }}>
                <div className="field">
                  <label>Email</label>
                  <input className="input" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
                </div>
                <div className="field">
                  <label>Subject</label>
                  <input className="input" value={form.subject} onChange={set("subject")} placeholder="What is this about?" />
                </div>
              </div>
              <div className="field">
                <label>Message *</label>
                <textarea className="textarea" required value={form.message} onChange={set("message")} placeholder="Write your message…" />
              </div>
              <button className={"btn btn-primary" + (sent ? " ok" : "")} style={{ justifyContent: "center", width: "100%" }}>
                {sent ? <><IconCheck size={17} /> Message Sent</> : <>Send Message <IconArrowRight /></>}
              </button>
              <p className="form-tiny">We typically reply within 24 hours. Your details are kept private.</p>
            </form>
          </div>
        </div>

        {/* location card */}
        <div className="contact-map">
          <div className="contact-map-grid">
            <div>
              <span className="pin"><IconPin size={26} /></span>
              <h3>Sitara Fans — Head Office & Factory</h3>
              <p>{ADDRESS}</p>
              <a className="btn btn-blue" href={MAPS} target="_blank" rel="noreferrer">
                Open in Google Maps <IconArrowRight />
              </a>
            </div>
            <ul className="contact-hours">
              <li><span><IconClock size={16} /> Mon – Fri</span><strong>9:00am – 8:00pm</strong></li>
              <li><span><IconClock size={16} /> Saturday</span><strong>10:00am – 6:00pm</strong></li>
              <li><span><IconClock size={16} /> Sunday</span><strong>Closed</strong></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
