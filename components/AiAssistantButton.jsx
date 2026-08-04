"use client";

import Link from "next/link";
import { IconChat } from "./Icons";

/** Floating "Ask AI" button, sits just above the WhatsApp button on every page. */
export default function AiAssistantButton() {
  return (
    <Link href="/assistant" aria-label="Open AI Assistant" className="ai-fab">
      <IconChat size={26} />
      <span className="ai-fab-label">Ask AI</span>
    </Link>
  );
}
