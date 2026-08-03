"use client";

import { useMemo, useState } from "react";
import useLocalList from "@/hooks/useLocalList";
import {
  IconChat, IconMail, IconSearch, IconTrash, IconCheck, IconClock, IconPhone, IconWhatsapp,
} from "@/components/Icons";

const initials = (name = "?") =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";

const waLink = (phone = "") => {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("0")) d = "92" + d.slice(1);
  return "https://wa.me/" + d;
};

const when = (iso) => {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

export default function AdminMessagesPage() {
  const { items, ready, save } = useLocalList("sitara_messages");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeId, setActiveId] = useState(null);

  const unread = items.filter((m) => !m.read).length;

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((m) => {
      if (filter === "unread" && m.read) return false;
      if (!s) return true;
      return (
        (m.name || "").toLowerCase().includes(s) ||
        (m.email || "").toLowerCase().includes(s) ||
        (m.phone || "").includes(s) ||
        (m.subject || "").toLowerCase().includes(s) ||
        (m.message || "").toLowerCase().includes(s)
      );
    });
  }, [items, q, filter]);

  const active = items.find((m) => m.id === activeId) || null;

  const open = (m) => {
    setActiveId(m.id);
    if (!m.read) save(items.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
  };
  const toggleRead = (m) => save(items.map((x) => (x.id === m.id ? { ...x, read: !x.read } : x)));
  const remove = (id) => { save(items.filter((x) => x.id !== id)); if (activeId === id) setActiveId(null); };

  if (!ready) return <div className="admin-page"><p>Loading…</p></div>;

  const stats = [
    { label: "Total", value: items.length, icon: <IconChat size={19} />, tone: "blue" },
    { label: "Unread", value: unread, icon: <IconMail size={18} />, tone: "red" },
    { label: "Read", value: items.length - unread, icon: <IconCheck size={18} />, tone: "teal" },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <span className="eyebrow">Inbox</span>
          <h1>Messages</h1>
          <p>Enquiries sent from the website contact form.</p>
        </div>
        {items.length > 0 && (
          <div className="flex gap-12 wrap" style={{ alignItems: "center" }}>
            <div className="seg">
              <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>All</button>
              <button className={filter === "unread" ? "on" : ""} onClick={() => setFilter("unread")}>
                Unread{unread > 0 && ` (${unread})`}
              </button>
            </div>
            <div className="input-wrap" style={{ maxWidth: 240 }}>
              <input className="input" placeholder="Search messages…" value={q}
                onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 38 }} />
              <span style={{ position: "absolute", left: 12, color: "var(--muted)", display: "flex" }}>
                <IconSearch />
              </span>
            </div>
          </div>
        )}
      </header>

      {items.length === 0 ? (
        <div className="admin-empty">
          <IconChat size={40} />
          <h3>No messages yet</h3>
          <p>Messages sent from the website&apos;s Contact page will appear here.</p>
        </div>
      ) : (
        <>
          <div className="stat-cards stat-3">
            {stats.map((s) => (
              <div key={s.label} className={"stat-card " + s.tone}>
                <span className="stat-ic">{s.icon}</span>
                <div><div className="stat-val">{s.value}</div><div className="stat-lbl">{s.label}</div></div>
              </div>
            ))}
          </div>

          <div className="inbox">
            <div className="inbox-list admin-card" style={{ padding: 6 }}>
              {list.length === 0 ? (
                <div className="admin-empty" style={{ boxShadow: "none", border: "none" }}>
                  <IconSearch size={30} /><h3>No matches</h3><p>Try a different search or filter.</p>
                </div>
              ) : (
                list.map((m) => (
                  <button key={m.id}
                    className={"msg-row" + (m.id === activeId ? " active" : "") + (m.read ? "" : " unread")}
                    onClick={() => open(m)}>
                    <span className="msg-avatar">{initials(m.name)}</span>
                    <span className="msg-main">
                      <span className="msg-top">
                        <span className="msg-name">{m.name || "Unknown"}</span>
                        <span className="msg-time">{when(m.date)}</span>
                      </span>
                      <span className="msg-subj">{m.subject || "(no subject)"}</span>
                      <span className="msg-snip">{m.message}</span>
                    </span>
                    {!m.read && <span className="msg-dot" aria-label="unread" />}
                  </button>
                ))
              )}
            </div>

            <div className="inbox-detail admin-card">
              {!active ? (
                <div className="inbox-placeholder">
                  <IconMail size={38} /><p>Select a message to read it.</p>
                </div>
              ) : (
                <div className="msg-view">
                  <div className="msg-view-head">
                    <span className="msg-avatar lg">{initials(active.name)}</span>
                    <div style={{ minWidth: 0 }}>
                      <h2>{active.name || "Unknown"}</h2>
                      <div className="msg-contacts">
                        {active.phone && <a href={`tel:${active.phone}`}><IconPhone size={13} /> {active.phone}</a>}
                        {active.email && <a href={`mailto:${active.email}`}><IconMail size={13} /> {active.email}</a>}
                      </div>
                    </div>
                    <div className="msg-view-actions">
                      <button className="btn btn-sm" onClick={() => toggleRead(active)}>
                        <IconCheck size={15} /> {active.read ? "Mark unread" : "Mark read"}
                      </button>
                      <button className="btn btn-sm danger" onClick={() => remove(active.id)}>
                        <IconTrash /> Delete
                      </button>
                    </div>
                  </div>

                  <div className="msg-meta">
                    <span className="pill">{active.subject || "(no subject)"}</span>
                    <span className="msg-meta-time"><IconClock size={14} /> {new Date(active.date).toLocaleString()}</span>
                  </div>

                  <p className="msg-body">{active.message}</p>

                  <div className="msg-view-foot">
                    {active.phone && (
                      <a className="btn btn-primary" style={{ background: "#25d366", borderColor: "#25d366" }}
                        href={`${waLink(active.phone)}?text=${encodeURIComponent("Assalam o Alaikum " + (active.name || "") + ", thank you for contacting Sitara Fans.")}`}
                        target="_blank" rel="noreferrer">
                        <IconWhatsapp /> Reply on WhatsApp
                      </a>
                    )}
                    {active.phone && <a className="btn" href={`tel:${active.phone}`}><IconPhone size={15} /> Call</a>}
                    {active.email && (
                      <a className="btn" href={`mailto:${active.email}?subject=Re: ${encodeURIComponent(active.subject || "Your message to Sitara Fans")}`}>
                        <IconMail /> Email
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
