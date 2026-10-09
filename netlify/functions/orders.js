import { getStore } from "@netlify/blobs";
import { CATALOG } from "../lib/catalog.js";

const bad = (msg, status = 400) => Response.json({ error: msg }, { status });
const clean = (v, max) => String(v ?? "").trim().slice(0, max);

export default async (req) => {
  const orders = getStore("orders");
  const stock = getStore("stock");

  // ---- Admin: lihat semua pesanan (header x-admin-key = env ADMIN_KEY)
  if (req.method === "GET") {
    const key = process.env.ADMIN_KEY;
    if (!key || req.headers.get("x-admin-key") !== key) return bad("Tidak diizinkan", 401);
    const { blobs } = await orders.list();
    const all = await Promise.all(blobs.map((b) => orders.get(b.key, { type: "json" })));
    all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return Response.json(all);
  }

  if (req.method !== "POST") return bad("Method tidak didukung", 405);

  let body;
  try { body = await req.json(); } catch { return bad("Data tidak valid"); }

  if (body.website) return Response.json({ ok: true }); // honeypot anti-bot

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 20).replace(/[^\d+]/g, "");
  const address = clean(body.address, 300);
  const note = clean(body.note, 200);
  if (name.length < 2) return bad("Nama minimal 2 huruf");
  if (phone.length < 9) return bad("Nomor WhatsApp belum benar");
  if (address.length < 10) return bad("Alamat kurang lengkap");
  if (!Array.isArray(body.items) || !body.items.length || body.items.length > 20)
    return bad("Keranjang kosong");

  // Validasi item & hitung harga dari katalog server
  const lines = [];
  const need = {};
  for (const it of body.items) {
    const p = CATALOG.find((x) => x.id === it.id);
    const qty = Number.parseInt(it.qty, 10);
    if (!p) return bad("Produk tidak ditemukan");
    if (!p.sizes.includes(String(it.size))) return bad(`Ukuran ${p.name} tidak valid`);
    if (!(qty >= 1 && qty <= 5)) return bad("Jumlah per item 1–5");
    lines.push({ id: p.id, name: p.name, size: String(it.size), qty, price: p.price });
    need[p.id] = (need[p.id] || 0) + qty;
  }

  // Cek & kurangi stok
  const left = {};
  for (const id of Object.keys(need)) {
    const p = CATALOG.find((x) => x.id === id);
    const cur = (await stock.get(id, { type: "json" })) ?? p.stock;
    if (cur < need[id]) return bad(`Stok ${p.name} tinggal ${cur}`, 409);
    left[id] = cur - need[id];
  }
  for (const id of Object.keys(left)) await stock.setJSON(id, left[id]);

  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const id = "TPK-" + crypto.randomUUID().slice(0, 8).toUpperCase();
  await orders.setJSON(id, {
    id, name, phone, address, note, lines, total,
    status: "baru", createdAt: new Date().toISOString()
  });

  return Response.json({ ok: true, id, total }, { status: 201 });
};

export const config = { path: "/api/orders" };
