import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "sitarafans";

if (!uri) {
  throw new Error(
    "Missing MONGODB_URI. Add it to .env.local (see .env.example)."
  );
}

// Reuse a single client across hot-reloads in dev and across lambda
// invocations in production, so we don't exhaust the Atlas connection pool.
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._sitaraMongoClientPromise) {
    global._sitaraMongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = global._sitaraMongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

/** Returns the shared Db instance. */
export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

/** Convenience helper for a named collection. */
export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}

export default clientPromise;
