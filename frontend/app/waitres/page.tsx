"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MenuCard, { MenuItem } from "@/app/waitres/MenuCard";
import Cart, { CartItem } from "@/app/waitres/Cart";
import Link from "next/link";

const categories = ["Semua", "Roti & Pastry", "Kue & Cake", "Minuman"];
const actorName = "Ayu";
const actorRole = "Waitres";

export default function WaitresPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [user, setUser] = useState<any>(null);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [occupiedTables, setOccupiedTables] = useState<number[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const categoryMap: Record<number, string> = {
    1: "Roti & Pastry",
    2: "Kue & Cake",
    3: "Minuman",
  };

  const loadProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/products");
      const data = await res.json();

      const formattedMenu = data.map((item: any) => ({
        id: item.product_id,
        name: item.name,
        category: categoryMap[item.category_id] || "Lainnya",
        price: Number(item.price),
        stock: Number(item.stock),
        image: item.image
          ? `http://127.0.0.1:8000/storage/${item.image}`
          : "/no-image.png",
      }));

      setMenu(formattedMenu);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadTables();
    loadOccupiedTables();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectedTableName = tableNumber
    ? `Meja ${tableNumber}`
    : "Belum dipilih";

  const loadTables = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/tables");
      const data = await res.json();

      console.log("TABLE DATA", data);

      setTables(data);
    } catch (error) {
      console.error(error);
    }
  };
  const loadOccupiedTables = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/occupied-tables");

      const data = await res.json();

      setOccupiedTables(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredMenu = menu.filter((item: any) => {
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

useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);
  const sendToKasir = async () => {
    if (!tableNumber || cart.length === 0) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
body: JSON.stringify({
  table_id: tableNumber,
  waitres_id: user.user_id,
  items: cart.map((item) => ({
    product_id: item.id,
    quantity: item.qty,
  })),
}),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Pesanan berhasil dibuat");
      setCart([]);
      
    } catch (error) {
      console.error(error);
      alert("Gagal membuat pesanan");
    }
  };
  console.log("TABLES =", tables);
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
              <div className="flex items-center gap-4">
                <button className="text-sm text-amber-100 hover:text-white transition">
                  👤 waitres
                </button>
                <Link
                  href="/login"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Logout
                </Link>
              </div>
              {/*<div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white font-semibold">
                {actorName.charAt(0)}
              </div> */}
            </div>
          </div>
        </div>
      </nav>

      {isMobile && !tableNumber && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6">
          <h2 className="text-2xl font-bold mb-4">Pilih Meja</h2>
          <p className="text-gray-500 mb-6 text-center">
            Pilih meja terlebih dahulu sebelum melakukan order
          </p>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {tables.map((table) => {
              const occupied = occupiedTables.includes(table.table_id);
              const selected = tableNumber === table.table_id;

              return (
                <button
                  key={table.table_id}
                  type="button"
                  onClick={() => !occupied && setTableNumber(table.table_id)}
                  disabled={occupied}
                  className={`rounded-lg py-2 text-xs font-semibold transition ${
                    occupied
                      ? "bg-red-100 text-red-600 border border-red-300 cursor-not-allowed"
                      : selected
                        ? "bg-orange-500 text-white border border-orange-600"
                        : "bg-white border border-gray-300 hover:bg-orange-100"
                  }`}
                >
                  Meja {table.table_number}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
                {filteredMenu.map((item: any) => (
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
                    const occupied = occupiedTables.includes(table.table_id);
                const selected = tableNumber === table.table_id;
                    return (
                      <button
                        key={table.table_id}
                        type="button"
                        onClick={() =>
                          !occupied && setTableNumber(table.table_id)
                        }
                        disabled={occupied}
                        className={`rounded-lg py-2 text-xs font-semibold transition ${
                          occupied
                            ? "bg-red-100 text-red-600 border border-red-300 cursor-not-allowed"
                            : selected
                              ? "bg-orange-500 text-white border border-orange-600"
                              : "bg-white border border-gray-300 hover:bg-orange-100"
                        }`}
                      >
                        {table.table_number}
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
