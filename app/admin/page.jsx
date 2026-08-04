"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useCart } from "@/context/CartContext";
import { useInventory } from "@/context/InventoryContext";
import useLocalList from "@/hooks/useLocalList";
import { formatPKR } from "@/data/products";
import {
  IconPackage, IconUsers, IconStar, IconShield, IconArrowRight,
  IconChat, IconSupport, IconArrowRight as IconGo,
  IconAlert,
} from "@/components/Icons";

/* Validated categorical palette (colorblind-safe) */
const CAT = ["#2563eb", "#e2242b", "#0d9488", "#b45309", "#7c3aed", "#0891b2"];
const INK = "#101a33";
const MUTED = "#5b6b8c";
const GRID = "#e7eef9";
const DAYS = 14;

const dayKey = (d) => d.toISOString().slice(0, 10);
const shortLabel = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const initials = (n = "?") =>
  n.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
const ago = (iso) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

function ChartTip({ active, payload, label, money }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tip">
      <p className="chart-tip-label">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey || p.name} className="chart-tip-row">
          <span className="dot" style={{ background: p.color || p.payload?.fill }} />
          <span>{p.name}</span>
          <strong>{money ? formatPKR(p.value) : p.value}</strong>
        </p>
      ))}
    </div>
  );
}

const Empty = ({ text }) => (
  <div className="chart-empty">
    <IconPackage size={30} />
    <p>{text}</p>
  </div>
);

export default function AdminDashboard() {
  const { orders, ready } = useCart();
  const { allProducts } = useInventory();
  const { items: messages } = useLocalList("sitara_messages");
  const { items: complaints } = useLocalList("sitara_complaints");

  const data = useMemo(() => {
    const today = new Date();
    const series = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      series.push({ key: dayKey(d), day: shortLabel(dayKey(d)), revenue: 0, orders: 0 });
    }
    const byKey = Object.fromEntries(series.map((s) => [s.key, s]));
    const catTotals = {};
    const productTotals = {};
    for (const o of orders) {
      const k = dayKey(new Date(o.date));
      if (byKey[k]) { byKey[k].revenue += o.total; byKey[k].orders += 1; }
      for (const it of o.items) {
        catTotals[it.category || "Other"] = (catTotals[it.category || "Other"] || 0) + it.qty;
        productTotals[it.name] = (productTotals[it.name] || 0) + it.qty;
      }
    }
    const byCategory = Object.entries(catTotals).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    const topProducts = Object.entries(productTotals).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const units = orders.reduce((s, o) => s + o.items.reduce((n, i) => n + i.qty, 0), 0);
    return { series, byCategory, topProducts, revenue, units, avg: orders.length ? Math.round(revenue / orders.length) : 0 };
  }, [orders]);

  if (!ready) return <div className="admin-page"><p>Loading…</p></div>;

  const unreadMsgs = messages.filter((m) => !m.read).length;
  const newComplaints = complaints.filter((c) => (c.status || "New") === "New").length;
  const lowStock = allProducts.filter((p) => typeof p.stock === "number" && p.stock <= 5);
  const hasOrders = orders.length > 0;
  const hasAnyData = orders.length || messages.length || complaints.length;
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const clearData = async () => {
    if (window.confirm("Remove all demo orders, messages and complaints?")) {
      await fetch("/api/seed", { method: "DELETE" });
      window.location.reload();
    }
  };

  const kpis = [
    { icon: <IconPackage size={20} />, label: "Total Orders", value: orders.length },
    { icon: <IconStar size={18} />, label: "Total Revenue", value: formatPKR(data.revenue) },
    { icon: <IconUsers size={20} />, label: "Fans Sold", value: data.units },
    { icon: <IconShield size={20} />, label: "Avg Order Value", value: formatPKR(data.avg) },
  ];

  const quick = [
    { href: "/admin/orders", icon: <IconPackage size={20} />, label: "Orders", sub: `${orders.length} total`, tone: "blue" },
    { href: "/admin/inventory", icon: <IconShield size={20} />, label: "Inventory", sub: `${allProducts.length} added · ${allProducts.length} live`, tone: "teal" },
    { href: "/admin/messages", icon: <IconChat size={20} />, label: "Messages", sub: unreadMsgs ? `${unreadMsgs} unread` : `${messages.length} total`, tone: "amber", badge: unreadMsgs },
    { href: "/admin/complaints", icon: <IconSupport size={20} />, label: "Complaints", sub: newComplaints ? `${newComplaints} new` : `${complaints.length} total`, tone: "red", badge: newComplaints },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Dashboard</h1>
          <p>Welcome back — here&apos;s your store at a glance.</p>
        </div>
        <div className="head-right">
          <span className="date-chip">{today}</span>
          {hasAnyData ? (
            <button className="btn btn-sm" onClick={clearData}>Clear data</button>
          ) : null}
          <Link href="/admin/inventory" className="btn btn-primary btn-sm">
            Manage Inventory <IconArrowRight />
          </Link>
        </div>
      </header>

      {/* KPI tiles */}
      <div className="kpi-row">
        {kpis.map((k) => (
          <div key={k.label} className="kpi">
            <span className="kpi-ic">{k.icon}</span>
            <div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="qa-grid">
        {quick.map((q) => (
          <Link key={q.href} href={q.href} className={"qa-card " + q.tone}>
            <span className="qa-ic">{q.icon}</span>
            <span className="qa-body">
              <span className="qa-label">{q.label}</span>
              <span className="qa-sub">{q.sub}</span>
            </span>
            {q.badge > 0 && <em className="qa-badge">{q.badge}</em>}
            <IconGo size={16} />
          </Link>
        ))}
      </div>

      {/* Revenue */}
      <section className="chart-card">
        <div className="chart-head">
          <div><h3>Revenue Over Time</h3><p>Daily order value, last {DAYS} days</p></div>
          <span className="chart-total">{formatPKR(data.revenue)}</span>
        </div>
        <div className="chart-body">
          {hasOrders ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.series} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CAT[0]} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={CAT[0]} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: MUTED, fontSize: 12 }} tickLine={false} axisLine={{ stroke: GRID }} />
                <YAxis tick={{ fill: MUTED, fontSize: 12 }} tickLine={false} axisLine={false} width={64}
                  tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)} />
                <Tooltip content={<ChartTip money />} cursor={{ stroke: CAT[0], strokeOpacity: 0.25, strokeWidth: 2 }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={CAT[0]} strokeWidth={2}
                  fill="url(#revFill)" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <Empty text="No revenue yet — orders will chart here as they arrive." />}
        </div>
      </section>

      <div className="chart-grid">
        <section className="chart-card">
          <div className="chart-head"><div><h3>Orders Per Day</h3><p>Order volume, last {DAYS} days</p></div></div>
          <div className="chart-body">
            {hasOrders ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.series} margin={{ top: 6, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: MUTED, fontSize: 11 }} tickLine={false} axisLine={{ stroke: GRID }} />
                  <YAxis allowDecimals={false} tick={{ fill: MUTED, fontSize: 12 }} tickLine={false} axisLine={false} width={30} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(37,99,235,0.06)" }} />
                  <Bar dataKey="orders" name="Orders" fill={CAT[2]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <Empty text="No orders yet." />}
          </div>
        </section>

        <section className="chart-card">
          <div className="chart-head"><div><h3>Sales by Category</h3><p>Share of fans sold</p></div></div>
          <div className="chart-body">
            {data.byCategory.length ? (
              <div className="donut-wrap">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={data.byCategory} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={2} stroke="#fff" strokeWidth={2}>
                      {data.byCategory.map((_, i) => <Cell key={i} fill={CAT[i % CAT.length]} />)}
                    </Pie>
                    <Tooltip content={<ChartTip />} />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="legend">
                  {data.byCategory.map((c, i) => (
                    <li key={c.name}>
                      <span className="dot" style={{ background: CAT[i % CAT.length] }} />
                      <span>{c.name}</span><strong>{c.value}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            ) : <Empty text="No category data yet." />}
          </div>
        </section>
      </div>

      {/* Recent activity + alerts */}
      <div className="recent-grid">
        <section className="admin-card recent-card">
          <div className="recent-head">
            <h3>Recent Orders</h3>
            <Link href="/admin/orders" className="recent-link">View all <IconGo size={14} /></Link>
          </div>
          {orders.length ? (
            <ul className="recent-list">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id}>
                  <span className="ra-ic order"><IconPackage size={16} /></span>
                  <span className="ra-main">
                    <span className="ra-title">{o.customer.name}</span>
                    <span className="ra-sub">#{o.id} · {o.items.reduce((s, i) => s + i.qty, 0)} item(s)</span>
                  </span>
                  <span className="ra-right">
                    <strong>{formatPKR(o.total)}</strong>
                    <span className="ra-time">{ago(o.date)}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : <div className="recent-empty"><IconPackage size={26} /><p>No orders yet.</p></div>}
        </section>

        <section className="admin-card recent-card">
          <div className="recent-head">
            <h3>Recent Messages</h3>
            <Link href="/admin/messages" className="recent-link">View all <IconGo size={14} /></Link>
          </div>
          {messages.length ? (
            <ul className="recent-list">
              {messages.slice(0, 5).map((m) => (
                <li key={m.id}>
                  <span className="ra-ic msg">{initials(m.name)}</span>
                  <span className="ra-main">
                    <span className="ra-title">{m.name || "Unknown"} {!m.read && <em className="ra-new">new</em>}</span>
                    <span className="ra-sub">{m.subject || "(no subject)"}</span>
                  </span>
                  <span className="ra-right"><span className="ra-time">{ago(m.date)}</span></span>
                </li>
              ))}
            </ul>
          ) : <div className="recent-empty"><IconChat size={26} /><p>No messages yet.</p></div>}
        </section>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <section className="admin-card lowstock">
          <div className="recent-head">
            <h3 style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><IconAlert size={18} style={{ color: "#f59e0b" }} /> Low Stock Alert</h3>
            <Link href="/admin/inventory" className="recent-link">Manage <IconGo size={14} /></Link>
          </div>
          <div className="lowstock-row">
            {lowStock.slice(0, 6).map((p) => (
              <span key={p.id} className="lowstock-pill">
                {p.name} <em>{p.stock} left</em>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Top sellers */}
      <section className="chart-card">
        <div className="chart-head"><div><h3>Top Selling Fans</h3><p>By units sold</p></div></div>
        <div className="chart-body">
          {data.topProducts.length ? (
            <ResponsiveContainer width="100%" height={Math.max(180, data.topProducts.length * 52)}>
              <BarChart data={data.topProducts} layout="vertical" margin={{ top: 4, right: 28, left: 8, bottom: 4 }} barCategoryGap="30%">
                <CartesianGrid stroke={GRID} horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: MUTED, fontSize: 12 }} tickLine={false} axisLine={{ stroke: GRID }} />
                <YAxis type="category" dataKey="name" width={170} tick={{ fill: INK, fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(37,99,235,0.06)" }} />
                <Bar dataKey="value" name="Units sold" fill={CAT[0]} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <Empty text="No sales yet — your best sellers will appear here." />}
        </div>
      </section>
    </div>
  );
}
