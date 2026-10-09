// Sumber data produk. Harga & stok SELALU divalidasi ulang di server.
const S = ["38", "39", "40", "41", "42", "43", "44"];
const D = ["36", "37", "38", "39", "40", "41", "42"];

export const CATALOG = [
  { id: "p1", name: "Gumpal Runner", type: "sepatu", price: 389000, colors: ["#ff4fa3", "#d6ff3d"], sizes: S, stock: 12 },
  { id: "p2", name: "Kentang Chunky", type: "sepatu", price: 459000, colors: ["#6ec9ff", "#ffffff"], sizes: S, stock: 8 },
  { id: "p3", name: "Halu High-Top", type: "sepatu", price: 519000, colors: ["#9b7bff", "#ff4fa3"], sizes: S, stock: 5 },
  { id: "p4", name: "Santuy Slide", type: "sendal", price: 149000, colors: ["#d6ff3d", "#1a1033"], sizes: D, stock: 25 },
  { id: "p5", name: "Mager Platform", type: "sendal", price: 199000, colors: ["#ff4fa3", "#ffffff"], sizes: D, stock: 14 },
  { id: "p6", name: "Gaskeun Strap", type: "sendal", price: 229000, colors: ["#6ec9ff", "#9b7bff"], sizes: D, stock: 10 },
  { id: "p7", name: "Receh Low-Cut", type: "sepatu", price: 299000, colors: ["#ffffff", "#ff4fa3"], sizes: S, stock: 18 },
  { id: "p8", name: "Jelly Wobble", type: "sendal", price: 129000, colors: ["#9b7bff", "#d6ff3d"], sizes: D, stock: 20 }
];
