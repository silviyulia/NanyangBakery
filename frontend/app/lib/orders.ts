export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  table: string;
  time: string;
  status: "selesai" | "proses" | "batal";
  items: OrderItem[];
  total: number;
  waiter: string;
}

export const ordersData: Order[] = [
  {
    id: "M1",
    table: "Meja 1",
    time: "14:32 WIB",
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
    status: "selesai",
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
    status: "proses",
    items: [
      { name: "Cake Coklat", qty: 2, price: 40000 },
      { name: "Croissant", qty: 1, price: 30000 },
    ],
    total: 110000,
    waiter: "Sarah",
  },
];
