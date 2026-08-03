"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconClose } from "@/components/Icons";

/**
 * Professional right-side slide-over for viewing a full record.
 * Props: open, onClose, title, subtitle, badge (node), footer (node), children.
 */
export default function RecordDrawer({ open, onClose, title, subtitle, badge, footer, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="rec-scrim"
            onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          />
          <motion.aside
            className="rec-drawer"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            role="dialog" aria-modal="true"
          >
            <header className="rec-head">
              <div className="rec-head-main">
                <div className="rec-head-titles">
                  <h2>{title}</h2>
                  {subtitle && <p>{subtitle}</p>}
                </div>
                {badge}
              </div>
              <button className="rec-close" onClick={onClose} aria-label="Close">
                <IconClose size={20} />
              </button>
            </header>

            <div className="rec-body">{children}</div>

            {footer && <footer className="rec-foot">{footer}</footer>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* small presentational helpers reused by the record pages */
export function RecSection({ title, children }) {
  return (
    <section className="rec-section">
      {title && <h3 className="rec-section-title">{title}</h3>}
      {children}
    </section>
  );
}

export function RecFields({ items }) {
  return (
    <div className="rec-fields">
      {items.filter(Boolean).map((f) => (
        <div key={f.label} className="rec-field">
          <span className="rec-field-label">{f.label}</span>
          {f.href ? (
            <a className="rec-field-value" href={f.href}>{f.value}</a>
          ) : (
            <span className="rec-field-value">{f.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}
