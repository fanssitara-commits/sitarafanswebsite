"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const InventoryContext = createContext(null);

/** Blank product used by the "Add Fan" form. */
export const emptyProduct = {
  name: "",
  tagline: "",
  category: "Ceiling",
  price: "",
  oldPrice: "",
  color: "",
  material: "",
  motorWarranty: "Lifetime",
  kitWarranty: "1 Year",
  sweep: "",
  speed: "",
  stock: "",
  badge: "",
  rating: "4.5",
  short: "",
  description: "",
  img: "",
  colors: [], // [{ name, img }] — colour variants, each with its own photo
  variants: [], // [{ label, price }] — e.g. { AC/DC: 12500 }, { 30W: 15500 }
};

export const CATEGORIES = [
  "Ceiling",
  "Designer",
  "Pedestal",
  "Bracket",
  "Exhaust",
  "Rechargeable",
  "Table",
  "Industrial",
];

export const MOTOR_WARRANTIES = ["Lifetime", "10 Years", "5 Years", "3 Years", "2 Years", "1 Year"];
export const KIT_WARRANTIES = ["6 Months", "1 Year", "2 Years", "3 Years", "5 Years"];

// default fallbacks used across the shop when a product has no explicit value
export const DEFAULT_MOTOR_WARRANTY = "Lifetime";
export const DEFAULT_KIT_WARRANTY = "1 Year";

export function InventoryProvider({ children }) {
  const [allProducts, setAllProducts] = useState([]);
  const [ready, setReady] = useState(false);

  const CACHE_KEY = "sitara_products_cache";

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      const list = Array.isArray(data.products) ? data.products : [];
      setAllProducts(list);
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(list));
      } catch {
        /* ignore quota */
      }
    } catch {
      // keep whatever we already have
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    // show cached products instantly, then revalidate in the background
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
      if (Array.isArray(cached) && cached.length) {
        setAllProducts(cached);
        setReady(true);
      }
    } catch {
      /* ignore */
    }
    refresh();
  }, [refresh]);

  const addProduct = useCallback(
    async (data) => {
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const out = await res.json();
        if (!res.ok || out.ok === false) {
          return { ok: false, error: out.error || "Could not save the fan." };
        }
        await refresh();
        return { ok: true, item: out.item };
      } catch {
        return { ok: false, error: "Network error — please try again." };
      }
    },
    [refresh]
  );

  const updateProduct = useCallback(
    async (id, data) => {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const out = await res.json();
        if (!res.ok || out.ok === false) {
          return { ok: false, error: out.error || "Could not update the fan." };
        }
        await refresh();
        return { ok: true, item: out.item };
      } catch {
        return { ok: false, error: "Network error — please try again." };
      }
    },
    [refresh]
  );

  const deleteProduct = useCallback(
    async (id) => {
      try {
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        await refresh();
        return { ok: true };
      } catch {
        return { ok: false, error: "Could not delete the fan." };
      }
    },
    [refresh]
  );

  // admin-added fans (custom) — kept as a derived list for the admin UI
  const inventory = useMemo(
    () => allProducts.filter((p) => p.custom),
    [allProducts]
  );

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        allProducts,
        ready,
        refresh,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}
