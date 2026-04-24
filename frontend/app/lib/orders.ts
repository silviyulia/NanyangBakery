export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  table: string;

  // tetap dipakai untuk display awal
  time: string;

  status: "selesai" | "proses" | "batal";
  items: OrderItem[];
  total: number;
  waiter: string;

  // 🔥 TAMBAHAN UNTUK REAL-TIME (WAJIB)
  createdAt: string;   // waktu masuk sistem
  startedAt?: string;  // mulai diproses
  completedAt?: string; // selesai
}

export const ordersData: Order[] = [
  {
    id: "M1",
    table: "Meja 1",
    time: "14:32 WIB",
    createdAt: "2026-04-24T14:32:00",
    startedAt: "2026-04-24T14:33:00",
    status: "selesai",
    items: [
      { name: "Croissant", qty: 2, price: 30000 },
      { name: "Espresso", qty: 1, price: 25000 },
      { name: "Cake Coklat", qty: 1, price: 40000 },
    ],
    total: 125000,
    waiter: "Sarah",
  },
  {
    id: "M2",
    table: "Meja 2",
    time: "14:32 WIB",
    createdAt: "2026-04-24T14:35:00",
    status: "batal",
    items: [
      { name: "Croissant", qty: 2, price: 30000 },
      { name: "Espresso", qty: 1, price: 25000 },
      { name: "Cake Coklat", qty: 1, price: 40000 },
    ],
    total: 125000,
    waiter: "Sarah",
  },
  {
    id: "M3",
    table: "Meja 3",
    time: "14:32 WIB",
    createdAt: "2026-04-24T14:40:00",
    startedAt: "2026-04-24T14:41:00",
    status: "proses",
    items: [
      { name: "Croissant", qty: 2, price: 30000 },
      { name: "Espresso", qty: 1, price: 25000 },
      { name: "Cake Coklat", qty: 1, price: 40000 },
    ],
    total: 125000,
    waiter: "Sarah",
  },
  {
    id: "M4",
    table: "Meja 4",
    time: "14:32 WIB",
    createdAt: "2026-04-24T14:10:00",
    status: "selesai",
    completedAt: "2026-04-24T14:30:00",
    items: [
      { name: "Croissant", qty: 2, price: 30000 },
      { name: "Espresso", qty: 1, price: 25000 },
    ],
    total: 85000,
    waiter: "Budi",
  },
  {
    id: "M5",
    table: "Meja 5",
    time: "14:32 WIB",
    createdAt: "2026-04-24T14:50:00",
    status: "batal",
    items: [
      { name: "Croissant", qty: 1, price: 30000 },
      { name: "Espresso", qty: 2, price: 25000 },
    ],
    total: 80000,
    waiter: "Andi",
  },
  {
    id: "M6",
    table: "Meja 6",
    time: "14:32 WIB",
    createdAt: "2026-04-24T14:55:00",
    startedAt: "2026-04-24T14:56:00",
    status: "proses",
    items: [
      { name: "Cake Coklat", qty: 2, price: 40000 },
      { name: "Croissant", qty: 1, price: 30000 },
    ],
    total: 110000,
    waiter: "Sarah",
  },
];