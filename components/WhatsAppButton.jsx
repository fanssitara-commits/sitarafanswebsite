"use client";

import { IconWhatsapp } from "./Icons";

// Sitara Fans WhatsApp number (same as the contact page)
const PHONE = "923001234567";
const TEXT = encodeURIComponent(
  "Assalam o Alaikum! I'm interested in Sitara Fans. Could you help me?"
);

/** Floating WhatsApp button shown on every public page (bottom-right). */
export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${PHONE}?text=${TEXT}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="wa-fab"
    >
      <IconWhatsapp size={30} />
      <span className="wa-fab-label">WhatsApp</span>
    </a>
  );
}
