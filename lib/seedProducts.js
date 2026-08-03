import { getCollection } from "@/lib/mongodb";
import { products as catalog } from "@/data/products";

/**
 * On first run the `products` collection is empty, so we seed it from the
 * static catalog in data/products.js. Catalog items are marked custom:false
 * and keep their original order via `seq`. Admin-added fans are custom:true.
 * Runs at most once (guarded by a count check).
 */
let seeded = false; // module-level cache: once true, skip the count round-trip

export async function ensureProductsSeeded() {
  const col = await getCollection("products");
  if (seeded) return col;

  const count = await col.estimatedDocumentCount();
  if (count > 0) {
    seeded = true;
    return col;
  }

  const docs = catalog.map((p, i) => ({
    ...p,
    custom: false,
    seq: i,
    createdAt: new Date(0).toISOString(),
  }));
  if (docs.length) await col.insertMany(docs);
  // unique index on the app-level string id
  await col.createIndex({ id: 1 }, { unique: true }).catch(() => {});
  seeded = true;
  return col;
}
