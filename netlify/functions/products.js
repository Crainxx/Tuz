import { getStore } from "@netlify/blobs";
import { CATALOG } from "../lib/catalog.js";

export default async () => {
  const stock = getStore("stock");
  const items = await Promise.all(
    CATALOG.map(async (p) => {
      const left = await stock.get(p.id, { type: "json" });
      return { ...p, stock: left ?? p.stock };
    })
  );
  return Response.json(items, { headers: { "cache-control": "no-store" } });
};

export const config = { path: "/api/products" };
