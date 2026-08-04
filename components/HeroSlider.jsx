"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { IconArrowLeft, IconArrowRight } from "./Icons";

// Ultra-wide 21:9 banners (public/images/hero-*.png).
const slideNums = [1, 2, 3, 5, 6, 7, 8];
const slides = slideNums.map((n) => ({
  src: `/images/hero-${n}.png`,
  alt: "Sitara Fans — Sitara comfort for every home",
}));

const DURATION = 5500; // ms each slide is shown

// directional slide (modern carousel wipe) + soft fade
const variants = {
  enter: (dir) => ({ xPercent: dir > 0 ? 100 : -100, opacity: 0 }),
  center: { xPercent: 0, opacity: 1 },
  exit: (dir) => ({ xPercent: dir > 0 ? -100 : 100, opacity: 0 }),
};
const ease = [0.76, 0, 0.24, 1];

export default function HeroSlider() {
  const [[index, dir], setState] = useState([0, 1]);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState({});
  const n = slides.length;

  const go = useCallback((d) => setState(([i]) => [(i + d + n) % n, d]), [n]);
  const jump = (to) => setState(([i]) => [to, to >= i ? 1 : -1]);

  // autoplay — restarts on every slide change; frozen while hovered
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(1), DURATION);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  const slide = slides[index];

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-slider">
        <AnimatePresence initial={false} custom={dir} mode="sync">
          <motion.div
            key={index}
            className="hero-slide"
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ xPercent: { duration: 0.5, ease }, opacity: { duration: 0.3 } }}
          >
            {failed[index] ? (
              <div className="hero-fallback">
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "clamp(1.8rem,5vw,3rem)" }}>
                    <span style={{ color: "var(--blue)" }}>SITARA</span>{" "}
                    <span style={{ color: "var(--red)" }}>FANS</span>
                  </div>
                  <p style={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: "0.9rem", marginTop: 8 }}>
                    Comfort That Lasts, Elegance That Stays
                  </p>
                  <Link href="/products" className="btn btn-primary mt-24">Explore Fans</Link>
                </div>
              </div>
            ) : (
              // next/image auto-serves resized WebP/AVIF (≈150 KB vs ~1.8 MB PNG).
              // Only the first slide is `priority`; the rest load as they appear.
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="hero-fg"
                sizes="100vw"
                priority={index === 0}
                onError={() => setFailed((f) => ({ ...f, [index]: true }))}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <button className="hero-arrow left" onClick={() => go(-1)} aria-label="Previous slide">
          <IconArrowLeft />
        </button>
        <button className="hero-arrow right" onClick={() => go(1)} aria-label="Next slide">
          <IconArrowRight />
        </button>

        {/* dots with autoplay progress fill on the active one */}
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={"hero-dot" + (i === index ? " active" : "")}
              onClick={() => jump(i)}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === index && (
                <span
                  key={index + (paused ? "-p" : "")}
                  className={"hero-dot-fill" + (paused ? " paused" : "")}
                  style={{ animationDuration: `${DURATION}ms` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
