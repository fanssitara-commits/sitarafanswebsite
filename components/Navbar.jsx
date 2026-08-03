"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Logo from "./Logo";
import { IconCart, IconArrowRight, IconMenu, IconClose, IconChevron } from "./Icons";

const nav = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  {
    label: "Export",
    children: [
      { label: "Export", href: "/export" },
      { label: "Export Inquiry", href: "/export-inquiry" },
      { label: "History", href: "/history" },
    ],
  },
  {
    label: "Customer Care",
    children: [
      { label: "Complaint", href: "/complaint" },
      { label: "Warranty Registration", href: "/warranty" },
      { label: "Customer Services", href: "/customer-service" },
    ],
  },
  { label: "About Us", href: "/#about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSub, setOpenSub] = useState(null); // mobile expanded submenu
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => { setOpen(false); setOpenSub(null); };
  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="nav-inner">
        <Link href="/" className="nav-brand" onClick={close}>
          <Logo variant="nav" />
        </Link>

        <div className={"nav-links" + (open ? " open" : "")}>
          {nav.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className={"nav-item has-sub" + (openSub === item.label ? " sub-open" : "")}
              >
                <button
                  className="nav-link nav-parent"
                  onClick={() => setOpenSub((s) => (s === item.label ? null : item.label))}
                  aria-expanded={openSub === item.label}
                >
                  {item.label}
                  <IconChevron size={15} />
                </button>
                <div className="nav-dropdown">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className={"nav-drop-link" + (isActive(c.href) ? " active" : "")}
                      onClick={close}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={"nav-link" + (isActive(item.href) ? " active" : "")}
                onClick={close}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className="nav-right">
          <Link href="/cart" className="iconbtn cart-btn" aria-label="Cart" onClick={close}>
            <IconCart />
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
          <Link href="/products" className="btn btn-primary btn-sm nav-cta" onClick={close}>
            Explore Fans <IconArrowRight />
          </Link>
          <button
            className="nav-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
