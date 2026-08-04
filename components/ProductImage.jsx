"use client";

import { useState } from "react";
import FanArt from "./FanArt";

/**
 * Shows the real product photo (from /public/images/fans/...).
 * If the file isn't there yet, it gracefully falls back to the
 * coloured SVG fan so the site never looks broken.
 */
export default function ProductImage({ product, spin = false }) {
  const [failed, setFailed] = useState(false);

  if (failed || !product.img) {
    return <FanArt hue={product.hue} spin={spin} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={product.img}
      alt={product.name}
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
}
