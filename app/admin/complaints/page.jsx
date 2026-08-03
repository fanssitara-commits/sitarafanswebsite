"use client";

import { useMemo, useState } from "react";
import useLocalList from "@/hooks/useLocalList";
import {
  IconSupport, IconSearch, IconTrash, IconPhone, IconWhatsapp, IconMail, IconClock,
} from "@/components/Icons";
import RecordDrawer, { RecSection, RecFields } from "@/components/admin/RecordDrawer";

const STATUSES = ["New", "In Progress", "Resolved"];
const cls = (s) => "s-" + s.replace(/\s+/g, "").toLowerCase();
const initials = (name = "?") =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";

export default function AdminComplaintsPage() {
  const { items, ready, save } = useLocalList("sitara_complaints");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);

  const rows = useMemo(() => items.map((c) => ({ status: "New", ...c })), [items]);

  const counts = useMemo(() => {
    const c = { all: rows.length, New: 0, "In Progress": 0, Resolved: 0 };
    rows.forEach((r) => { c[r.status] = (c[r.status] || 0) + 1; });
    return c;
  }, [rows]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((c) => {
      if (filter !== "all" && c.status !== filter) return false;
      if (!s) return true;
      return (
        (c.name || "").toLowerCase().includes(s) ||
        (c.phone || "").includes(s) ||
        (c.id || "").toLowerCase().includes(s) ||
        (c.category || "").toLowerCase().includes(s) ||
        (c.message || "").toLowerCase().includes(s)
      );
    });
  }, [rows, q, filter]);

  const active = rows.find((c) => c.id === openId) || null;
  const setStatus = (id, status) => save(items.map((c) => (c.id === id ? { ...c, status } : c)));
  const remove = (id) => { save(items.filter((c) => c.id !== id)); if (openId === id) setOpenId(null); };

  if (!ready) return <div className="admin-page"><p>Loading…</p></div>;

  const kpis = [
    { key: "all", label: "Total", value: counts.all, tone: "blue" },
    { key: "New", label: "New", value: counts.New, tone: "red" },
    { key: "In Progress", label: "In Progress", value: counts["In Progress"], tone: "amber" },
    { key: "Resolved", label: "Resolved", value: counts.Resolved, tone: "teal" },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <span className="eyebrow">Customer Care</span>
          <h1>Complaints</h1>
          <p>{rows.length} complaint{rows.length === 1 ? "" : "s"} registered.</p>
        </div>
        {rows.length > 0 && (
          <div className="input-wrap" style={{ maxWidth: 260 }}>
            <input className="input" placeholder="Search ref, name, phone…" value={q}
              onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 38 }} />
            <span style={{ position: "absolute", left: 12, color: "var(--muted)", display: "flex" }}>
              <IconSearch />
            </span>
          </div>
        )}
      </header>

      {rows.length === 0 ? (
        <div className="admin-empty">
          <IconSupport size={40} />
          <h3>No complaints yet</h3>
          <p>Complaints submitted from the website will appear here.</p>
        </div>
      ) : (
        <>
          <div className="kpi-strip">
            {kpis.map((k) => (
              <button key={k.key} className={"kpi-chip " + k.tone + (filter === k.key ? " on" : "")} onClick={() => setFilter(k.key)}>
                <em>{k.value}</em><span>{k.label}</span>
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <div className="admin-empty">
              <IconSearch size={30} />
              <h3>No matches</h3>
              <p>Try a different search or status filter.</p>
            </div>
          ) : (
            <div className="cmp-list">
              {list.map((c) => (
                <button key={c.id} className="cmp-card" onClick={() => setOpenId(c.id)}>
                  <span className="msg-avatar">{initials(c.name)}</span>
                  <span className="cmp-main">
                    <span className="cmp-top">
                      <span className="cmp-name">{c.name || "Unknown"}</span>
                      <span className={"status-badge " + cls(c.status)}>{c.status}</span>
                    </span>
                    <span className="cmp-sub">
                      <span className="cmp-ref">#{c.id}</span>
                      <span className="pill soft">{c.category}</span>
                      <span className="cmp-time"><IconClock size={13} /> {new Date(c.date).toLocaleDateString()}</span>
                    </span>
                    <span className="cmp-snip">{c.message}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* ---------- professional complaint detail drawer ---------- */}
      <RecordDrawer
        open={!!active}
        onClose={() => setOpenId(null)}
        title={active ? active.name || "Unknown" : ""}
        subtitle={active ? `#${active.id}` : ""}
        badge={active && <span className={"status-badge " + cls(active.status)}>{active.status}</span>}
        footer={
          active && (
            <>
              <a className="btn btn-sm" href={`tel:${active.phone}`}><IconPhone size={15} /> Call</a>
              <a className="btn btn-sm" href={`https://wa.me/${(active.phone || "").replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">
                <IconWhatsapp size={15} /> WhatsApp
              </a>
              {active.email && (
                <a className="btn btn-sm" href={`mailto:${active.email}?subject=Re: Complaint ${active.id}`}><IconMail /> Email</a>
              )}
              <button className="btn btn-sm danger" onClick={() => remove(active.id)}><IconTrash /> Delete</button>
            </>
          )
        }
      >
        {active && (
          <>
            <RecSection title="Update Status">
              <div className="status-set">
                {STATUSES.map((s) => (
                  <button key={s} className={"status-opt" + (active.status === s ? " on" : "")} onClick={() => setStatus(active.id, s)}>
                    {s}
                  </button>
                ))}
              </div>
            </RecSection>

            <RecSection title="Complaint">
              <div className="rec-cat"><span className="pill soft">{active.category}</span></div>
              <p className="rec-message">{active.message}</p>
            </RecSection>

            <RecSection title="Customer Details">
              <RecFields items={[
                { label: "Name", value: active.name },
                { label: "Phone", value: active.phone, href: `tel:${active.phone}` },
                active.email && { label: "Email", value: active.email, href: `mailto:${active.email}` },
                active.orderId && { label: "Order ID", value: active.orderId },
                { label: "Received", value: new Date(active.date).toLocaleString() },
              ]} />
            </RecSection>
          </>
        )}
      </RecordDrawer>
    </div>
  );
}
