"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconArrowLeft, IconArrowRight, IconStar } from "./Icons";

/**
 * Spring-animated testimonial carousel (pattern inspired by the
 * 21st.dev "Reviews Carousel"), rebuilt natively with framer-motion
 * so it fits this project's plain-CSS stack.
 */
export default function ReviewsCarousel({ reviews = [] }) {
  const [[index, dir], setState] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (d) => setState(([i]) => [(i + d + reviews.length) % reviews.length, d]),
    [reviews.length]
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [go, paused]);

  if (!reviews.length) return null;
  const r = reviews[index];

  return (
    <div
      className="reviews-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="rc-stage">
        {/* stacked cards behind for depth */}
        <div className="rc-ghost rc-ghost-2" aria-hidden="true" />
        <div className="rc-ghost rc-ghost-1" aria-hidden="true" />

        <AnimatePresence mode="wait" custom={dir}>
          <motion.blockquote
            key={index}
            className="rc-card"
            custom={dir}
            initial={{ opacity: 0, x: dir >= 0 ? 70 : -70, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir >= 0 ? -70 : 70, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <div className="rc-quote">&ldquo;</div>
            <p className="rc-text">{r.text}</p>
            <footer className="rc-who">
              <span className="rc-avatar">{r.name.charAt(0)}</span>
              <span>
                <span className="rc-name">{r.name}</span>
                <span className="rc-stars">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <IconStar key={i} />
                  ))}
                </span>
              </span>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="rc-controls">
        <button className="iconbtn" onClick={() => go(-1)} aria-label="Previous review">
          <IconArrowLeft />
        </button>

        <div className="rc-dots">
          {reviews.map((_, i) => (
            <button
              key={i}
              className={"rc-dot" + (i === index ? " active" : "")}
              onClick={() => setState([i, i > index ? 1 : -1])}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>

        <button className="iconbtn" onClick={() => go(1)} aria-label="Next review">
          <IconArrowRight />
        </button>
      </div>
    </div>
  );
}
