"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MenuCard, { MenuItem } from "@/app/waitres/MenuCard";
import Cart, { CartItem } from "@/app/waitres/Cart";
import Link from "next/link";

const menu: MenuItem[] = [
  {
    id: 1,
    name: "Croissant",
    category: "Roti & Pastry",
    price: 30000,
    image:
      "https://static01.nyt.com/images/2021/04/07/dining/06croissantsrex1/merlin_184841898_ccc8fb62-ee41-44e8-9ddf-b95b198b88db-jumbo.jpg",
  },
  {
    id: 2,
    name: "Chocolate Cake",
    category: "Kue & Cake",
    price: 45000,
    image:
      "https://lilluna.com/wp-content/uploads/2019/01/Chocolate-Cake103.jpg",
  },
  {
    id: 3,
    name: "Espresso",
    category: "Minuman",
    price: 20000,
    image:
      "https://img.magnific.com/premium-photo/high-resolution-image-freshly-brewed-cup-espresso-with-creamy-crema-layer_1264082-26795.jpg?w=996",
  },
  {
    id: 4,
    name: "Baguette",
    category: "Roti & Pastry",
    price: 28000,
    image:
      "https://latelierdespains.fr/wp-content/uploads/2023/11/baguette-courte_Atelier-des-pains_1.jpg    ",
  },
  {
    id: 5,
    name: "Red Velvet",
    category: "Kue & Cake",
    price: 40000,
    image:
      "https://www.mommyplates.com/wp-content/uploads/2025/05/Red-Velvet-Cake.webp",
  },
  {
    id: 6,
    name: "Cappuccino",
    category: "Minuman",
    price: 25000,
    image:
      "https://tse4.mm.bing.net/th/id/OIP.sORUCLQs6IFavbrcEWRPgAHaE8?pid=Api&P=0&h=180",
  },
  {
    id: 7,
    name: "Danish Pastry",
    category: "Roti & Pastry",
    price: 32000,
    image:
      "https://tse1.mm.bing.net/th/id/OIP.tPkgAvgXjtG-R1fQNlm8ywHaEK?pid=Api&P=0&h=180",
  },
  {
    id: 8,
    name: "Brownies",
    category: "Kue & Cake",
    price: 35000,
    image:
      "https://www.glorioustreats.com/wp-content/uploads/2022/09/cheesecake-brownie-recipe-square.jpeg",
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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

          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((table) => (
              <button
                key={table}
                onClick={() => setTableNumber(table)}
                className="border rounded-lg py-3 text-sm font-medium hover:bg-orange-100"
              >
                {table}
              </button>
            ))}
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
                            ? "bg-red-100 text-red-600 border border-red-300 cursor-not-allowed"
                            : selected
                              ? "bg-orange-500 text-white border border-orange-600"
                              : "bg-white border border-gray-300 hover:bg-orange-100"
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
