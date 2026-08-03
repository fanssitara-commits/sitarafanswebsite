"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useInventory } from "@/context/InventoryContext";
import useLocalList from "@/hooks/useLocalList";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const { orders, refreshOrders } = useCart();
  const { allProducts } = useInventory();
  const { items: messages } = useLocalList("sitara_messages");
  const { items: complaints } = useLocalList("sitara_complaints");
  const { items: inquiries } = useLocalList("sitara_export-inquiries");
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  // ask the server whether this session is authenticated (httpOnly cookie)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" });
        const data = await res.json();
        if (alive) setAuthed(!!data.authed);
        if (alive && data.authed) refreshOrders(); // load admin orders now
      } catch {
        if (alive) setAuthed(false);
      } finally {
        if (alive) setChecked(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const authenticate = async (passcode) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error || "Incorrect passcode." };
      }
      setAuthed(true);
      refreshOrders(); // pull admin-only data now that the cookie is set
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error — please try again." };
    }
  };

  const lock = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    setAuthed(false);
  };

  if (!checked) return null;

  if (!authed) {
    return <AdminLogin onAuthenticate={authenticate} />;
  }

  return (
    <div className="admin-shell">
      <AdminSidebar
        onLock={lock}
        counts={{
          "/admin/orders": orders.length,
          "/admin/inventory": allProducts.length,
          "/admin/messages": messages.filter((m) => !m.read).length || undefined,
          "/admin/complaints": complaints.filter((c) => (c.status || "New") === "New").length || undefined,
          "/admin/export-inquiries": inquiries.filter((c) => (c.status || "New") === "New").length || undefined,
        }}
      />
      <div className="admin-content">{children}</div>
    </div>
  );
}
