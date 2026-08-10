"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const CartContext = createContext(null);

// The cart is a per-browser concept, so it stays in localStorage.
// Orders now live in MongoDB (via /api/orders).
const CART_KEY = "sitara_cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");

  // hydrate cart from localStorage
  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      setCart(Array.isArray(c) ? c : []);
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  // persist cart
  useEffect(() => {
    if (ready) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  // load orders (returns [] for non-admin sessions — the endpoint is guarded)
  const refreshOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) {
        setOrders([]);
        return;
      }
      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setOrders([]);
    }
  }, []);

  // NOTE: orders are admin-only. We do NOT auto-fetch here — the admin layout
  // calls refreshOrders() once the session is authenticated, so public pages
  // and the admin login screen never hit /api/orders (no 401 noise).

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  }, []);

  const addToCart = useCallback(
    (product, qty = 1, opts = {}) => {
      const color = opts.color || null;
      const variant = opts.variant || null; // type/model label e.g. "AC/DC", "30W"
      const price = opts.price != null ? opts.price : product.price;
      const img = opts.img || product.img;
      // one cart line per product + colour + type combination
      const key = `${product.id}|${color || ""}|${variant || ""}`;

      setCart((prev) => {
        const found = prev.find((i) => i.key === key);
        if (found) {
          return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
        }
        return [
          ...prev,
          {
            key,
            id: product.id,
            name: product.name,
            price,
            hue: product.hue,
            img,
            category: product.category,
            color,
            variant,
            qty,
          },
        ];
      });
      const label = [color, variant].filter(Boolean).join(" · ");
      showToast(`${product.name}${label ? ` (${label})` : ""} added to cart`);
    },
    [showToast]
  );

  const removeFromCart = useCallback((key) => {
    setCart((prev) => prev.filter((i) => (i.key || i.id) !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    setCart((prev) =>
      prev
        .map((i) => ((i.key || i.id) === key ? { ...i, qty: Math.max(1, qty) } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // POST the order to the API. The server rebuilds prices, decrements stock
  // and returns the saved order. Returns null on failure.
  const placeOrder = useCallback(
    async (customer) => {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer,
            items: cart.map((i) => ({ id: i.id, qty: i.qty, color: i.color, variant: i.variant, img: i.img })),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.order) return null;
        setCart([]);
        return data.order;
      } catch {
        return null;
      }
    },
    [cart]
  );

  const updateOrder = useCallback(
    async (id, patch) => {
      // optimistic
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
      try {
        await fetch(`/api/orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
      } catch {
        refreshOrders();
      }
    },
    [refreshOrders]
  );

  const deleteOrder = useCallback(
    async (id) => {
      // optimistic — drop it from the list right away
      setOrders((prev) => prev.filter((o) => o.id !== id));
      try {
        await fetch(`/api/orders/${id}`, { method: "DELETE" });
      } catch {
        refreshOrders();
      }
    },
    [refreshOrders]
  );

  const count = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        ready,
        count,
        subtotal,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        placeOrder,
        updateOrder,
        deleteOrder,
        refreshOrders,
        showToast,
      }}
    >
      {children}
      <div className={"toast" + (toast ? " show" : "")}>{toast}</div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
