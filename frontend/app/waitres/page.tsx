"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MenuCard, { MenuItem } from "@/components/MenuCard";
import Cart, { CartItem } from "@/components/Cart";

const menu: MenuItem[] = [
  {
    id: 1,
    name: "Roti Keju",
    price: 12000,
    image: "/nasi.jpg",
    category: "Roti & Pastry",
    description: "Roti isi keju lezat dengan lapisan kerak renyah.",
  },
  {
    id: 2,
    name: "Croffle Cokelat",
    price: 18000,
    image: "/mie.jpg",
    category: "Kue & Cake",
    description: "Croffle gurih dengan saus cokelat premium.",
  },
  {
    id: 3,
    name: "Donat Strawberry",
    price: 15000,
    image: "/esteh.jpg",
    category: "Kue & Cake",
    description: "Donat empuk dengan topping strawberry manis.",
  },
  {
    id: 4,
    name: "Pain Raisin",
    price: 14000,
    image: "/sate.jpg",
    category: "Roti & Pastry",
    description: "Roti rendang kismis lembut dengan rasa hangat.",
  },
  {
    id: 5,
    name: "Kue Tart Cokelat",
    price: 25000,
    image: "/soup.jpg",
    category: "Kue & Cake",
    description: "Slice kue tart cokelat premium untuk pelanggan istimewa.",
  },
  {
    id: 6,
    name: "Es Kopi Latte",
    price: 18000,
    image: "/mango.jpg",
    category: "Minuman",
    description: "Kopi latte dingin, creamy, dengan aroma kacang pilihan.",
  },
  {
    id: 7,
    name: "Lemon Tea",
    price: 10000,
    image: "/mie.jpg",
    category: "Minuman",
    description: "Teh lemon segar yang pas untuk menemani roti panas.",
  },
  {
    id: 8,
    name: "Milkshake Vanilla",
    price: 20000,
    image: "/esteh.jpg",
    category: "Minuman",
    description: "Milkshake vanilla lembut dengan topping krim kocok.",
  },
];

const categories = ["Semua", "Roti & Pastry", "Kue & Cake", "Minuman"];
const tables = Array.from({ length: 20 }, (_, index) => index + 1);
const occupiedTables = [5, 10, 15, 20];
const actorName = "Ayu";
const actorRole = "Waitres";

export default function WaitresPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [tableNumber, setTableNumber] = useState<number | null>(null);

  const selectedTableName = tableNumber
    ? `Meja ${tableNumber}`
    : "Belum dipilih";

  const filteredMenu = menu.filter((item) => {
    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    if (!tableNumber) return;

    setCart((currentCart) => {
      const existingItem = currentCart.find((entry) => entry.id === item.id);

      if (existingItem) {
        return currentCart.map((entry) =>
          entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry,
        );
      }

      return [...currentCart, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: number, qty: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => (item.id === id ? { ...item, qty } : item))
        .filter((item) => item.qty > 0),
    );
  };

  const removeFromCart = (id: number) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const sendToKasir = () => {
    if (!tableNumber || cart.length === 0) return;

    const order = {
      tableNumber,
      items: cart,
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("waitresOrder", JSON.stringify(order));
    }

    router.push("/kasir");
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-amber-800 text-white shadow-lg">
        <div className="mx-auto max-w-[1480px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold">🍞</div>
              <h1 className="text-lg font-semibold">
                Waitres - Nanyang Bakery
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden flex-col items-end sm:flex">
                <p className="text-sm font-semibold">{actorName}</p>
                <p className="text-xs text-orange-200">{actorRole}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white font-semibold">
                {actorName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-amber-50">
        <div className="mx-auto max-w-[1480px] px-4 py-8">
          <h2 className="text-3xl font-bold text-amber-950">Menu Minuman</h2>

          {/* Category Filters */}
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-orange-600 text-white"
                    : "border border-orange-300 bg-orange-50 text-amber-900 hover:bg-orange-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_350px]">
            {/* Menu Grid */}
            <div>
              <div className="mb-6 flex items-center gap-2">
                <span className="text-sm font-semibold text-amber-900">
                  Cari menu:
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari menu..."
                  className="rounded-full border border-orange-300 bg-white px-4 py-2 text-sm text-amber-900 outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {filteredMenu.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    addToCart={addToCart}
                    disabled={!tableNumber}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar - Cart & Info */}
            <div className="space-y-4">
              {/* Table Selection */}
              <div className="rounded-[28px] border border-orange-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-amber-900">
                  🪑 Pilih Meja
                </p>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {tables.map((table) => {
                    const occupied = occupiedTables.includes(table);
                    const selected = tableNumber === table;
                    return (
                      <button
                        key={table}
                        type="button"
                        onClick={() => !occupied && setTableNumber(table)}
                        disabled={occupied}
                        className={`rounded-lg py-2 text-xs font-semibold transition ${
                          occupied
                            ? "cursor-not-allowed border border-orange-300 bg-orange-100 text-amber-900"
                            : selected
                              ? "border border-orange-600 bg-orange-500 text-white"
                              : "border border-orange-200 bg-orange-50 text-amber-900 hover:bg-orange-100"
                        }`}
                      >
                        {table}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cart */}
              <Cart
                cart={cart}
                updateQty={updateQty}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                tableNumber={
                  tableNumber ? `Meja ${tableNumber}` : "Belum dipilih"
                }
                sendToKasir={sendToKasir}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
