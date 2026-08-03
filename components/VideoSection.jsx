"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import { IconPlay, IconArrowRight } from "./Icons";

const SRC = "/videos/promo.mp4";

/**
 * Brand film. Drop the Motion-generated file at public/videos/promo.mp4 and
 * it plays automatically. Until then we show a clean branded panel instead of
 * a play button that does nothing.
 */
export default function VideoSection() {
  const [status, setStatus] = useState("checking"); // checking | ready | missing
  const [play, setPlay] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(SRC, { method: "HEAD" })
      .then((r) => alive && setStatus(r.ok ? "ready" : "missing"))
      .catch(() => alive && setStatus("missing"));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="section soft">
      <div className="container">
        <Reveal className="section-head center-head">
          <div>
            <span className="eyebrow">Watch The Film</span>
            <h2 className="section-title">
              Experience <span className="blue">Sitara</span> in Motion
            </h2>
            <p className="section-sub">
              A glimpse of the craftsmanship, comfort and elegance behind every
              Sitara fan.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="video-wrap" style={{ maxWidth: 960, margin: "0 auto" }}>
            {status === "ready" && play ? (
              <video src={SRC} controls autoPlay playsInline />
            ) : status === "ready" ? (
              <button
                className="video-poster"
                onClick={() => setPlay(true)}
                aria-label="Play the Sitara Fans brand film"
              >
                <span>
                  <span className="play-btn"><IconPlay /></span>
                  <span className="video-title">Sitara Fans — Brand Film</span>
                  <span className="video-sub">Comfort that lasts, elegance that stays</span>
                </span>
              </button>
            ) : (
              /* no video file yet — a clean branded panel, nothing broken */
              <div className="video-poster as-panel">
                <span>
                  <span className="video-title">Comfort That Lasts,<br />Elegance That Stays</span>
                  <span className="video-sub">
                    Premium ceiling, designer &amp; rechargeable fans — engineered
                    for every Pakistani home.
                  </span>
                  <Link href="/products" className="btn btn-primary" style={{ marginTop: 20 }}>
                    Explore Our Fans <IconArrowRight />
                  </Link>
                </span>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
