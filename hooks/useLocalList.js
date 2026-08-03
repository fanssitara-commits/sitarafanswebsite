"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * API-backed list hook (messages / complaints).
 *
 * Keeps the original interface — { items, ready, save } — so existing admin
 * pages keep working. `save(nextArray)` diffs against the current items and
 * issues the matching REST calls (PATCH changed, DELETE removed, POST added),
 * then optimistically updates local state.
 *
 * `key` is a legacy localStorage key like "sitara_messages"; we map it to the
 * API resource by stripping the "sitara_" prefix.
 */
export default function useLocalList(key) {
  const resource = key.replace(/^sitara_/, "");
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const itemsRef = useRef([]);
  itemsRef.current = items;

  const read = useCallback(async () => {
    try {
      const res = await fetch(`/api/${resource}`, { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data.items) ? data.items : [];
    } catch {
      return [];
    }
  }, [resource]);

  const refresh = useCallback(async () => {
    const next = await read();
    setItems(next);
    setReady(true);
  }, [read]);

  useEffect(() => {
    refresh();
    const sync = () => refresh();
    window.addEventListener("focus", sync);
    window.addEventListener("sitara:data", sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("sitara:data", sync);
    };
  }, [refresh]);

  const save = useCallback(
    async (next) => {
      const prev = itemsRef.current;
      const value = typeof next === "function" ? next(prev) : next;

      // optimistic update
      setItems(value);

      const prevById = new Map(prev.map((x) => [x.id, x]));
      const nextById = new Map(value.map((x) => [x.id, x]));
      const calls = [];

      // removed
      for (const [id] of prevById) {
        if (!nextById.has(id)) {
          calls.push(fetch(`/api/${resource}/${id}`, { method: "DELETE" }));
        }
      }
      // added / changed
      for (const [id, item] of nextById) {
        const before = prevById.get(id);
        if (!before) {
          calls.push(
            fetch(`/api/${resource}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item),
            })
          );
        } else if (JSON.stringify(before) !== JSON.stringify(item)) {
          const { id: _omit, ...patch } = item;
          calls.push(
            fetch(`/api/${resource}/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(patch),
            })
          );
        }
      }

      try {
        await Promise.all(calls);
      } catch {
        refresh(); // re-sync on any failure
      }
    },
    [resource, refresh]
  );

  return { items, ready, save, refresh };
}
