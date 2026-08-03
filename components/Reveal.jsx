"use client";

import { motion } from "framer-motion";

/**
 * Scroll-reveal wrapper. Fades + slides content in when it enters view.
 * Respects prefers-reduced-motion automatically via framer-motion.
 *
 * Props:
 *  - as: element/component to render (default motion.div)
 *  - delay: seconds
 *  - y: initial offset (default 26)
 *  - once: animate only first time (default true)
 */
export default function Reveal({
  children,
  delay = 0,
  y = 26,
  once = true,
  className,
  style,
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Staggered container — children reveal one after another. */
export function RevealGroup({ children, className, style, gap = 0.08 }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className, style, y = 24 }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 0.7, 0.2, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
