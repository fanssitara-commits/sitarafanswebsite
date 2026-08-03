"use client";

import { useState } from "react";
import { IconArrowRight, IconCheck } from "./Icons";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    try {
      const all = JSON.parse(localStorage.getItem("sitara_subscribers") || "[]");
      if (!all.includes(email)) {
        localStorage.setItem("sitara_subscribers", JSON.stringify([email, ...all]));
      }
    } catch {}
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <form className={"footer-news-form" + (done ? " ok" : "")} onSubmit={submit}>
      <input
        type="email"
        required
        placeholder={done ? "You're subscribed 🎉" : "Enter your email"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
        disabled={done}
      />
      <button type="submit" aria-label="Subscribe">
        {done ? <IconCheck size={18} /> : <IconArrowRight />}
      </button>
    </form>
  );
}
