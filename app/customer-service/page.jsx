import Link from "next/link";
import {
  IconPhone, IconMail, IconWhatsapp, IconClock, IconShield, IconArrowRight,
} from "@/components/Icons";

export const metadata = {
  title: "Customer Services — Sitara Fans",
  description: "Sitara Fans customer support — contact channels, warranty help, and answers to common questions.",
};

const channels = [
  { icon: <IconPhone size={22} />, title: "Call Us", text: "+92 300 1116492", note: "Mon–Sat, 9am–8pm" },
  { icon: <IconWhatsapp size={22} />, title: "WhatsApp", text: "+92 300 1116492", note: "Quick replies during working hours" },
  { icon: <IconMail size={22} />, title: "Email", text: "fanssitara@gmail.com", note: "We reply within 24 hours" },
  { icon: <IconClock size={22} />, title: "Service Hours", text: "Mon–Sat, 9am–8pm", note: "Closed on public holidays" },
];

const faqs = [
  { q: "How do I claim my warranty?", a: "Keep your invoice and contact us with your order ID. Warranty covers manufacturing defects for the period stated on your product (1–3 years)." },
  { q: "How long does delivery take?", a: "Orders are usually delivered within 3–5 working days across major cities. You'll get a call to confirm before dispatch." },
  { q: "Do you offer installation?", a: "Standard ceiling fans are easy to install with any local electrician. For designer models, contact us for guidance." },
  { q: "Which fan should I choose for my room?", a: "For most rooms a 56\" ceiling fan is ideal. For smaller spaces or shops, our 48\" and pedestal options work great. Our team can help you pick." },
  { q: "How do I register a complaint?", a: "Use our Complaint page to submit the details — you'll get a reference number and our team will follow up." },
];

export default function CustomerServicePage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">Customer Care</span>
          <h1>We&apos;re Here to <span className="red">Help.</span></h1>
          <p>
            Questions about a product, an order or a warranty claim? Reach our
            support team through any channel below — we&apos;re happy to help.
          </p>
        </div>
      </section>

      <section className="info-section">
        <div className="grid grid-4">
          {channels.map((c) => (
            <div key={c.title} className="channel">
              <span className="ic">{c.icon}</span>
              <div>
                <h3>{c.title}</h3>
                <p style={{ color: "var(--ink)", fontWeight: 600 }}>{c.text}</p>
                <p>{c.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-12 wrap" style={{ justifyContent: "center", marginTop: 34 }}>
          <Link href="/complaint" className="btn btn-primary">Register a Complaint <IconArrowRight /></Link>
          <Link href="/contact" className="btn btn-ghost">Contact Us</Link>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="center mb-40">
            <span className="eyebrow" style={{ justifyContent: "center" }}>Help Centre</span>
            <h2 className="section-title">
              Frequently Asked <span className="blue">Questions</span>
            </h2>
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
