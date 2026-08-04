"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import {
  IconLock, IconArrowRight, IconArrowLeft, IconShield, IconPackage, IconUsers, IconCheck,
} from "@/components/Icons";

const perks = [
  { icon: <IconPackage size={18} />, title: "Order Management", text: "Track every order in real time" },
  { icon: <IconShield size={18} />, title: "Inventory Control", text: "Add and update your fan catalogue" },
  { icon: <IconUsers size={18} />, title: "Customer Insights", text: "Revenue, volume and demand at a glance" },
];

export default function AdminLogin({ onAuthenticate }) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await onAuthenticate(value);
    if (!res?.ok) {
      setError(res?.error || "Incorrect passcode. Please try again.");
      setValue("");
    }
    setBusy(false);
  };

  return (
    <div className="auth-split">
      {/* ---------- brand panel ---------- */}
      <motion.aside
        className="auth-brand"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 0.7, 0.2, 1] }}
      >
        <div className="auth-brand-inner">
          <div className="auth-logo-chip">
            <Logo variant="footer" />
          </div>

          <h1 className="auth-headline">
            Sitara Fans
            <br />
            <span>Admin Portal</span>
          </h1>
          <p className="auth-lede">
            Manage orders, add new fans to your inventory and keep an eye on
            how your business is performing — all in one place.
          </p>

          <ul className="auth-perks">
            {perks.map((p, i) => (
              <motion.li
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.1, duration: 0.45 }}
              >
                <span className="ic">{p.icon}</span>
                <span>
                  <strong>{p.title}</strong>
                  <em>{p.text}</em>
                </span>
              </motion.li>
            ))}
          </ul>

          <p className="auth-foot">Sitara Comfort For Every Home</p>
        </div>
      </motion.aside>

      {/* ---------- form panel ---------- */}
      <motion.main
        className="auth-form-side"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 0.7, 0.2, 1] }}
      >
        <form className="auth-card" onSubmit={submit}>
          <span className="auth-badge">
            <IconLock size={15} /> Secure Area
          </span>

          <h2>Welcome back</h2>
          <p className="auth-sub">
            Enter your passcode to access the dashboard.
          </p>

          <div className="field">
            <label htmlFor="passcode">Passcode</label>
            <div className="input-wrap">
              <input
                id="passcode"
                className="input"
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter admin passcode"
                autoFocus
                autoComplete="current-password"
                aria-invalid={!!error}
              />
              <button
                type="button"
                className="input-action"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide passcode" : "Show passcode"}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            {error && (
              <motion.small
                className="auth-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.small>
            )}
          </div>

          <button
            className="btn btn-primary auth-submit"
            disabled={busy || !value}
          >
            {busy ? "Checking…" : "Unlock Dashboard"}
            {!busy && <IconArrowRight />}
          </button>

          <div className="auth-note">
            <IconCheck size={15} />
            <span>This area is restricted to Sitara Fans staff.</span>
          </div>

          <Link href="/" className="auth-back">
            <IconArrowLeft size={15} /> Back to website
          </Link>
        </form>
      </motion.main>
    </div>
  );
}
