"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import {
  IconPackage, IconShield, IconUsers, IconLock, IconArrowLeft,
  IconMenu, IconClose, IconChat, IconSupport, IconTruck,
} from "@/components/Icons";

const nav = [
  { href: "/admin", label: "Dashboard", icon: <IconUsers size={19} /> },
  { href: "/admin/orders", label: "Orders", icon: <IconPackage size={19} /> },
  { href: "/admin/inventory", label: "Inventory", icon: <IconShield size={19} /> },
  { href: "/admin/messages", label: "Messages", icon: <IconChat size={19} /> },
  { href: "/admin/complaints", label: "Complaints", icon: <IconSupport size={19} /> },
  { href: "/admin/export-inquiries", label: "Export Inquiries", icon: <IconTruck size={19} /> },
];

export default function AdminSidebar({ onLock, counts = {} }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="admin-burger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle admin menu"
      >
        {open ? <IconClose /> : <IconMenu />}
      </button>

      <aside className={"admin-sidebar" + (open ? " open" : "")}>
        <div className="admin-brand">
          <Logo variant="footer" />
        </div>

        <p className="admin-nav-label">Menu</p>
        <nav className="admin-nav">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={"admin-nav-link" + (active ? " active" : "")}
                onClick={() => setOpen(false)}
              >
                {active && (
                  <motion.span
                    layoutId="adminNavBg"
                    className="admin-nav-bg"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="admin-nav-inner">
                  {n.icon}
                  {n.label}
                  {counts[n.href] != null && (
                    <em className="admin-nav-count">{counts[n.href]}</em>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-side-foot">
          <Link href="/" className="admin-side-link">
            <IconArrowLeft size={16} /> Back to website
          </Link>
          <button className="admin-side-link danger" onClick={onLock}>
            <IconLock size={16} /> Lock dashboard
          </button>
        </div>
      </aside>

      {open && <div className="admin-scrim" onClick={() => setOpen(false)} />}
    </>
  );
}
