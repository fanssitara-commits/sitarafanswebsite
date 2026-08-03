"use client";

import { useMemo, useState } from "react";
import useLocalList from "@/hooks/useLocalList";
import {
  IconTruck, IconSearch, IconTrash, IconPhone, IconWhatsapp, IconMail, IconClock,
} from "@/components/Icons";
import RecordDrawer, { RecSection, RecFields } from "@/components/admin/RecordDrawer";

const STATUSES = ["New", "Contacted", "Closed"];
const cls = (s) => "s-" + String(s).replace(/\s+/g, "").toLowerCase();
const initials = (name = "?") =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
const waLink = (phone = "") => {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("0")) d = "92" + d.slice(1);
  return "https://wa.me/" + d;
};

export default function AdminExportInquiriesPage() {
  const { items, ready, save } = useLocalList("sitara_export-inquiries");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);

  const rows = useMemo(() => items.map((c) => ({ status: "New", ...c })), [items]);

  const counts = useMemo(() => {
    const c = { all: rows.length, New: 0, Contacted: 0, Closed: 0 };
    rows.forEach((r) => { c[r.status] = (c[r.status] || 0) + 1; });
    return c;
  }, [rows]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((c) => {
      if (filter !== "all" && c.status !== filter) return false;
      if (!s) return true;
      return (
        (c.company || "").toLowerCase().includes(s) ||
        (c.name || "").toLowerCase().includes(s) ||
        (c.phone || "").includes(s) ||
        (c.country || "").toLowerCase().includes(s) ||
        (c.product || "").toLowerCase().includes(s) ||
        (c.id || "").toLowerCase().includes(s)
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
    { key: "Contacted", label: "Contacted", value: counts.Contacted, tone: "amber" },
    { key: "Closed", label: "Closed", value: counts.Closed, tone: "teal" },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <span className="eyebrow">International Trade</span>
          <h1>Export Inquiries</h1>
          <p>{rows.length} inquir{rows.length === 1 ? "y" : "ies"} received from the export form.</p>
        </div>
        {rows.length > 0 && (
          <div className="input-wrap" style={{ maxWidth: 260 }}>
            <input className="input" placeholder="Search company, country…" value={q}
              onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 38 }} />
            <span style={{ position: "absolute", left: 12, color: "var(--muted)", display: "flex" }}>
              <IconSearch />
            </span>
          </div>
        )}
      </header>

      {rows.length === 0 ? (
        <div className="admin-empty">
          <IconTruck size={40} />
          <h3>No export inquiries yet</h3>
          <p>Inquiries submitted on the Export Inquiry page will appear here.</p>
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
                  <span className="msg-avatar">{initials(c.company || c.name)}</span>
                  <span className="cmp-main">
                    <span className="cmp-top">
                      <span className="cmp-name">{c.company || c.name || "Unknown"}</span>
                      <span className={"status-badge " + cls(c.status)}>{c.status}</span>
                    </span>
                    <span className="cmp-sub">
                      <span className="cmp-ref">#{c.id}</span>
                      {c.country && <span className="pill soft">{c.country}</span>}
                      {c.product && <span className="pill soft">{c.product}</span>}
                      <span className="cmp-time"><IconClock size={13} /> {new Date(c.date).toLocaleDateString()}</span>
                    </span>
                    <span className="cmp-snip">{c.message || `Qty: ${c.quantity || "—"}`}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <RecordDrawer
        open={!!active}
        onClose={() => setOpenId(null)}
        title={active ? active.company || active.name || "Unknown" : ""}
        subtitle={active ? `#${active.id}` : ""}
        badge={active && <span className={"status-badge " + cls(active.status)}>{active.status}</span>}
        footer={
          active && (
            <>
              {active.phone && <a className="btn btn-sm" href={`tel:${active.phone}`}><IconPhone size={15} /> Call</a>}
              {active.phone && (
                <a className="btn btn-sm" href={waLink(active.phone)} target="_blank" rel="noreferrer">
                  <IconWhatsapp size={15} /> WhatsApp
                </a>
              )}
              {active.email && (
                <a className="btn btn-sm" href={`mailto:${active.email}?subject=Re: Export Inquiry ${active.id}`}><IconMail /> Email</a>
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

            <RecSection title="Requirement">
              <RecFields items={[
                { label: "Company", value: active.company },
                { label: "Destination", value: active.country },
                { label: "Product interest", value: active.product },
                { label: "Estimated quantity", value: active.quantity || "Not specified" },
              ]} />
              {active.message && <p className="rec-message" style={{ marginTop: 10 }}>{active.message}</p>}
            </RecSection>

            <RecSection title="Contact">
              <RecFields items={[
                { label: "Name", value: active.name },
                { label: "Phone", value: active.phone, href: active.phone ? `tel:${active.phone}` : undefined },
                active.email && { label: "Email", value: active.email, href: `mailto:${active.email}` },
                { label: "Received", value: new Date(active.date).toLocaleString() },
              ]} />
            </RecSection>
          </>
        )}
      </RecordDrawer>
    </div>
  );
}
