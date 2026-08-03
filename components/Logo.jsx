"use client";

import { useState } from "react";

/**
 * Sitara logo (public/images/logo.jpg).
 * The file has a white background, so `mix-blend-mode: multiply` knocks the
 * white out on light surfaces — it reads as a transparent logo.
 * Falls back to a styled wordmark if the file is missing.
 */
export default function Logo({ variant = "nav" }) {
  const [failed, setFailed] = useState(false);

  const heights = { nav: 42, hero: 84, footer: 40 };
  const fontSize = { nav: "1.35rem", hero: "2.4rem", footer: "1.2rem" };

  if (failed) {
    return (
      <span
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 800,
          fontSize: fontSize[variant],
          letterSpacing: "-0.02em",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: "var(--blue)" }}>Sitara</span>
        <span style={{ color: "var(--red)" }}> Fans</span>
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo.png"
      alt="Sitara Fans"
      onError={() => setFailed(true)}
      style={{ height: heights[variant], width: "auto" }}
    />
  );
}
