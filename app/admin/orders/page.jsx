"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/data/products";
import {
  IconPackage, IconSearch, IconPhone, IconMail, IconWhatsapp, IconPin, IconStar, IconUsers, IconShield,
} from "@/components/Icons";
import RecordDrawer, { RecSection, RecFields } from "@/components/admin/RecordDrawer";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const payClass = (p = "") => (/cod|cash/i.test(p) ? "cod" : /paid|card|online|bank/i.test(p) ? "paid" : "pending");
const ordClass = (s = "Pending") => "ord-" + s.toLowerCase();
const waLink = (phone = "") => {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("0")) d = "92" + d.slice(1);
  return "https://wa.me/" + d;
};

export default function AdminOrdersPage() {
  const { orders, ready, updateOrder } = useCart();
  const [openId, setOpenId] = useState(null);
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return orders;
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(s) ||
        o.customer.name.toLowerCase().includes(s) ||
        o.customer.phone.includes(s) ||
        o.customer.city.toLowerCase().includes(s)
    );
  }, [orders, q]);

  const active = orders.find((o) => o.id === openId) || null;
  const units = (o) => o.items.reduce((s, i) => s + i.qty, 0);
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const totalUnits = orders.reduce((s, o) => s + units(o), 0);
  const avg = orders.length ? Math.round(revenue / orders.length) : 0;

  if (!ready) return <div className="admin-page"><p>Loading…</p></div>;

  const stats = [
    { label: "Total Orders", value: orders.length, icon: <IconPackage size={19} />, tone: "blue" },
    { label: "Revenue", value: formatPKR(revenue), icon: <IconStar size={17} />, tone: "red" },
    { label: "Fans Sold", value: totalUnits, icon: <IconUsers size={19} />, tone: "teal" },
    { label: "Avg Order", value: formatPKR(avg), icon: <IconShield size={18} />, tone: "amber" },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <span className="eyebrow">Sales</span>
          <h1>Orders</h1>
          <p>Track and manage every order placed on your store.</p>
        </div>
        {orders.length > 0 && (
          <div className="input-wrap" style={{ maxWidth: 280 }}>
            <input className="input" placeholder="Search name, phone, city…" value={q}
              onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 38 }} />
            <span style={{ position: "absolute", left: 12, color: "var(--muted)", display: "flex" }}>
              <IconSearch />
            </span>
          </div>
        )}
      </header>

      {orders.length === 0 ? (
        <div className="admin-empty">
          <IconPackage size={40} />
          <h3>No orders yet</h3>
          <p>Orders placed on the website will appear here in real time.</p>
        </div>
      ) : (
        <>
          <div className="stat-cards">
            {stats.map((s) => (
              <div key={s.label} className={"stat-card " + s.tone}>
                <span className="stat-ic">{s.icon}</span>
                <div><div className="stat-val">{s.value}</div><div className="stat-lbl">{s.label}</div></div>
              </div>
            ))}
          </div>

          {list.length === 0 ? (
            <div className="admin-empty">
              <IconSearch size={34} /><h3>No matches</h3><p>Try a different name, phone number or city.</p>
            </div>
          ) : (
            <div className="admin-card" style={{ padding: 6 }}>
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th><th>Date</th><th>Customer</th><th>City</th>
                      <th>Items</th><th>Total</th><th>Status</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((o) => (
                      <tr key={o.id} className="row-click" onClick={() => setOpenId(o.id)}>
                        <td style={{ color: "var(--blue-2)", fontWeight: 700 }}>#{o.id}</td>
                        <td>{new Date(o.date).toLocaleDateString()}</td>
                        <td style={{ color: "var(--ink)", fontWeight: 600 }}>{o.customer.name}</td>
                        <td>{o.customer.city}</td>
                        <td>{units(o)}</td>
                        <td style={{ color: "var(--ink)", fontWeight: 700 }}>{formatPKR(o.total)}</td>
                        <td><span className={"ord-badge " + ordClass(o.status)}>{o.status || "Pending"}</span></td>
                        <td>
                          <button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); setOpenId(o.id); }}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* professional order detail drawer */}
      <RecordDrawer
        open={!!active}
        onClose={() => setOpenId(null)}
        title={active ? `Order #${active.id}` : ""}
        subtitle={active ? new Date(active.date).toLocaleString() : ""}
        badge={active && <span className={"ord-badge " + ordClass(active.status)}>{active.status || "Pending"}</span>}
        footer={
          active && (
            <>
              <a className="btn btn-sm" style={{ background: "#25d366", borderColor: "#25d366", color: "#fff" }}
                href={waLink(active.customer.phone)} target="_blank" rel="noreferrer">
                <IconWhatsapp size={15} /> WhatsApp
              </a>
              <a className="btn btn-sm" href={`tel:${active.customer.phone}`}><IconPhone size={15} /> Call</a>
              {active.customer.email && (
                <a className="btn btn-sm" href={`mailto:${active.customer.email}?subject=Sitara Fans — Order ${active.id}`}>
                  <IconMail /> Email
                </a>
              )}
              <span className="rec-foot-total">Total <strong>{formatPKR(active.total)}</strong></span>
            </>
          )
        }
      >
        {active && (
          <>
            <RecSection title="Order Status">
              <div className="status-set">
                {ORDER_STATUSES.map((s) => (
                  <button key={s} className={"status-opt" + ((active.status || "Pending") === s ? " on" : "")}
                    onClick={() => updateOrder(active.id, { status: s })}>
                    {s}
                  </button>
                ))}
              </div>
            </RecSection>

            <div className="rec-summary">
              <div><span>Items</span><strong>{units(active)}</strong></div>
              <div><span>Order Total</span><strong>{formatPKR(active.total)}</strong></div>
              <div><span>Payment</span><strong>{active.customer.payment}</strong></div>
            </div>

            <RecSection title="Customer">
              <RecFields items={[
                { label: "Name", value: active.customer.name },
                { label: "Phone", value: active.customer.phone, href: `tel:${active.customer.phone}` },
                active.customer.email && { label: "Email", value: active.customer.email, href: `mailto:${active.customer.email}` },
                { label: "City", value: active.customer.city },
              ]} />
            </RecSection>

            <RecSection title="Delivery Address">
              <p className="rec-address"><IconPin size={16} /> {active.customer.address}, {active.customer.city}</p>
              {active.customer.notes && <p className="rec-note">Note: {active.customer.notes}</p>}
            </RecSection>

            <RecSection title={`Items (${active.items.length})`}>
              <ul className="rec-items">
                {active.items.map((i, idx) => (
                  <li key={`${i.id}-${i.color || ""}-${i.variant || ""}-${idx}`} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* thumbnail of the exact image/colour that was ordered */}
                    {i.img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={i.img}
                        alt={i.name}
                        style={{ width: 46, height: 46, borderRadius: 8, objectFit: "cover", border: "1px solid var(--line)", flexShrink: 0 }}
                      />
                    )}
                    <span className="rec-item-qty">{i.qty}×</span>
                    <span className="rec-item-name" style={{ flex: 1 }}>
                      {i.name}
                      {(i.color || i.variant) && <em>{[i.color, i.variant].filter(Boolean).join(" · ")}</em>}
                      {!i.color && !i.variant && i.category && <em>{i.category}</em>}
                    </span>
                    <span className="rec-item-price">{formatPKR(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
            </RecSection>

            <RecSection title="Payment Summary">
              <div className="rec-totals">
                <div className="rec-total-line"><span>Subtotal</span><span>{formatPKR(active.subtotal)}</span></div>
                <div className="rec-total-line"><span>Shipping</span><span>{active.shipping === 0 ? "FREE" : formatPKR(active.shipping)}</span></div>
                <div className="rec-total-line grand"><span>Total</span><span>{formatPKR(active.total)}</span></div>
              </div>
            </RecSection>
          </>
        )}
      </RecordDrawer>
    </div>
  );
}
