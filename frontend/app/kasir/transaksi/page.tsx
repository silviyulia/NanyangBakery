"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MenuCard, { MenuItem } from "@/app/waitres/MenuCard";
import { User } from "@/app/lib/auth";
import Sidebar from "../components/Sidebar";

interface Product {
  product_id: number;
  name: string;
  price: number;
  image?: string;
  category_id?: number;
  status?: string;
  stock: number;
}
type OrderDetail = {
  id: number;
  table_id: number;
  total_amount: string;
  status: string;

  table?: {
    table_number: number;
  };

  waitres?: {
    name: string;
  };

  items: {
    id: number;
    quantity: number;
    price: string;
    subtotal: string;

    product?: {
      product_id: number;
      name: string;
    };
  }[];
};

export default function transaksiPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [incomingTable, setIncomingTable] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState(["Semua"]);
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get("order");
  {/*const [orderType, setOrderType] = useState<
  "waitres" | "manual-dinein" | "takeaway"
>("waitres"); */}
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<
    Array<{
      id: number;
      name: string;
      price: number;
      qty: number;
      image?: string;
    }>
  >([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedOrder = window.localStorage.getItem("waitresOrder");
    const storedUser = window.localStorage.getItem("user");

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Gagal memuat user login:", error);
      }
    }

    if (!storedOrder) return;

    try {
      const parsed = JSON.parse(storedOrder);

      if (parsed?.items) {
        setIncomingTable(parsed.tableNumber || null);
        setCart(parsed.items);
      }
    } catch (error) {
      console.error("Gagal memuat pesanan waitres:", error);
    }

    try {
      const tableFromQuery = searchParams?.get("table");
      if (tableFromQuery) {
        setIncomingTable(decodeURIComponent(tableFromQuery));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // ================= FETCH PRODUCTS & CATEGORIES =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productsRes = await fetch("http://127.0.0.1:8000/api/products");
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }

        // Fetch categories
        const categoriesRes = await fetch(
          "http://127.0.0.1:8000/api/categories",
        );
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          const categoryNames = [
            "Semua",
            ...categoriesData.map(
              (cat: any) => cat.name || `Kategori ${cat.id}`,
            ),
          ];
          setCategories(categoryNames);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}`);

        const data = await res.json();

        setOrder(data);

        setIncomingTable(data.table?.table_number?.toString() || "");

        setCart(
          data.items.map((item: any) => ({
            id: item.product?.product_id,
            name: item.product?.name,
            price: Number(item.price),
            qty: item.quantity,
          })),
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getProductCategoryName = (categoryId: number | undefined) => {
    if (!categoryId) return "Lainnya";
    if (categoryId === 1) return "Roti & Pastry";
    if (categoryId === 2) return "Kue & Cake";
    if (categoryId === 3) return "Minuman";
    return `Kategori ${categoryId}`;
  };

  // ================= FILTER =================
  const filteredMenu = products
    .filter((item) => {
      const categoryName = getProductCategoryName(item.category_id);
      const matchCategory =
        selectedCategory === "Semua" || categoryName === selectedCategory;
      const matchSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchCategory && matchSearch && item.status === "active";
    })
    .map((product) => ({
      id: product.product_id,
      name: product.name,
      category: getProductCategoryName(product.category_id),
      price: product.price,
      image: product.image
        ? `http://127.0.0.1:8000/storage/${product.image}`
        : "/images/no-image.png",
      stock: product.stock,
    }));

  // ================= CART =================
  const addToCart = (item: MenuItem) => {
    const existing = cart.find((c) => c.id === item.id);

    if (existing) {
      setCart(
        cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)),
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map((c) => (c.id === id ? { ...c, qty } : c)));
    }
  };

  const clearCart = () => {
    setCart([]);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("waitresOrder");
    }
  };

const handleSaveOrder = async () => {
  try {
    if (!orderId) {
      alert("Order tidak ditemukan");
      return;
    }

    const res = await fetch(
      `http://127.0.0.1:8000/api/orders/${orderId}/items`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          items: cart,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    alert("Pesanan berhasil disimpan");

    router.push("/kasir");
  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan perubahan");
  }
};
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState(0);
  //const grandTotal = Math.round(totalPrice * 1.1);
  const grandTotal = totalPrice;
  const changeAmount =
    paymentMethod === "cash" ? Math.max(0, amountPaid - grandTotal) : 0;
  const [processing, setProcessing] = useState(true);

  const finalizeTransaction = async (
    paidAmount: number,
    paymentStatus: "pending" | "completed" | "failed",
    referenceNumber?: string,
  ) => {
    if (!orderId) {
      throw new Error("Order tidak ditemukan");
    }

    const itemRes = await fetch(
      `http://127.0.0.1:8000/api/orders/${orderId}/items`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          items: cart,
        }),
      },
    );

    if (!itemRes.ok) {
      const itemData = await itemRes.text();
      throw new Error(`Gagal update item order: ${itemData}`);
    }

    if (!currentUser) {
      throw new Error("Kasir belum login. Refresh halaman dan coba lagi.");
    }

    const trxRes = await fetch("http://127.0.0.1:8000/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        order_id: Number(orderId),
        kasir_id: currentUser.user_id,
        total_amount: grandTotal,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        amount_paid: paidAmount,
        reference_number: referenceNumber,
        items: cart,
      }),
    });

    if (!trxRes.ok) {
      const trxData = await trxRes.text();
      throw new Error(`Gagal menyimpan transaksi: ${trxData}`);
    }

    if (paymentStatus === "completed") {
      const orderRes = await fetch(
        `http://127.0.0.1:8000/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "selesai",
          }),
        },
      );

      if (!orderRes.ok) {
        throw new Error("Gagal update order");
      }

      setShowPaymentModal(false);
      alert("Pembayaran berhasil dan pesanan terkonfirmasi.");
      router.push("/kasir");
      return;
    }

    alert(
      "Transaksi tercatat, pembayaran Midtrans sedang menunggu konfirmasi.",
    );
  };

  const handlePayment = async () => {
    try {
      if (!orderId) {
        alert("Order tidak ditemukan");
        return;
      }

      let paid = amountPaid;

      if (paymentMethod === "qris" || paymentMethod === "transfer") {
        paid = grandTotal;
      }

      if (paymentMethod === "cash" && paid < grandTotal) {
        alert("Uang pembayaran kurang");
        return;
      }

      console.log("Payment Method:", paymentMethod);

      if (paymentMethod === "qris" || paymentMethod === "transfer") {
        const res = await fetch("http://127.0.0.1:8000/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            order_id: Number(orderId),
            payment_method: paymentMethod,
          }),
        });

        const data = await res.json();
        console.log("Midtrans response status:", res.status, data);

        if (!res.ok) {
          alert(data.message || "Gagal membuat pembayaran Midtrans");
          return;
        }

        if (typeof window === "undefined") {
          alert("Midtrans Snap belum siap. Muat ulang halaman.");
          return;
        }

        const snap = (window as any).snap;

        if (!snap) {
          alert("Midtrans Snap belum tersedia. Muat ulang halaman.");
          return;
        }

        snap.pay(data.token, {
          onSuccess: async (result: any) => {
            console.log("Midtrans success:", result);
            const referenceNumber = result.transaction_id || result.order_id;
            await finalizeTransaction(grandTotal, "completed", referenceNumber);
          },
          onPending: async (result: any) => {
            console.log("Midtrans pending:", result);
            const referenceNumber = result.transaction_id || result.order_id;
            await finalizeTransaction(grandTotal, "pending", referenceNumber);
          },
          onError: async (result: any) => {
            console.error("Midtrans error:", result);
            alert("Terjadi kesalahan pembayaran Midtrans.");
          },
          onClose: () => {
            console.log(
              "Midtrans popup ditutup tanpa menyelesaikan pembayaran",
            );
          },
        });

        return;
      }

      await finalizeTransaction(paid, "completed");
    } catch (error) {
      console.error(error);
      alert("Pembayaran gagal");
    }
  };

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-[450px] p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-[#5c2500] mb-6">
              Pembayaran
            </h2>

            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Metode Pembayaran
              </label>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border rounded-xl p-3"
              >
                <option value="cash">Cash</option>
                <option value="qris">QRIS</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Total Tagihan</label>

              <div className="border rounded-xl p-3 bg-gray-100 font-semibold">
                Rp {grandTotal.toLocaleString("id-ID")}
              </div>
            </div>

            {paymentMethod === "cash" && (
              <>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    Uang Diterima
                  </label>

                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="w-full border rounded-xl p-3"
                  />
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-medium">Kembalian</label>

                  <div className="border rounded-xl p-3 bg-green-50 text-green-700 font-bold">
                    Rp {changeAmount.toLocaleString("id-ID")}
                  </div>
                </div>
              </>
            )}

            {(paymentMethod === "qris" || paymentMethod === "transfer") && (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl text-blue-700">
                Pembayaran akan dianggap lunas setelah dikonfirmasi kasir.
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-200 py-3 rounded-xl"
              >
                Batal
              </button>

              <button
                onClick={handlePayment}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      <Sidebar>
        {/* MAIN */}
        <main className="flex-1">
          {/* CONTENT */}
          <section className="p-8">
            {incomingTable && (
              <div className="mb-6">
                <div className="bg-orange-100 border border-orange-300 p-4 rounded-2xl text-orange-800 font-medium">
                  Pesanan dari meja{" "}
                  <span className="font-bold">{incomingTable}</span>
                </div>
              </div>
            )}
{/*<button
  onClick={startManualOrder}
  className="bg-orange-500 text-white px-4 py-2 rounded-xl"
>
  + Transaksi Baru
</button> */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* LEFT - MENU */}
              <div className="xl:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                {" "}
                <h2 className="text-2xl font-bold text-[#5c2500] mb-6">Menu</h2>
                {/* CATEGORY */}
                <div className="flex gap-3 flex-wrap mb-5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2 rounded-full font-semibold transition ${
                        selectedCategory === cat
                          ? "bg-orange-500 text-white shadow"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {/* SEARCH */}
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari menu..."
                  className="w-full border border-gray-200 px-5 py-3 rounded-2xl mb-6 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                {/* MENU GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {" "}
                  {filteredMenu.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      addToCart={addToCart}
                      disabled={false}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT - CART */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sticky top-6">
                  <h2 className="text-2xl font-bold text-[#5c2500] mb-6">
                    🛒 Pesanan ({totalItems})
                  </h2>

                  {/* CART ITEMS */}
                  <div className="space-y-3 max-h-96 overflow-y-auto mb-6 border-b border-gray-200 pb-4">
                    {cart.length === 0 ? (
                      <p className="text-center text-gray-400 py-8">
                        Keranjang kosong
                      </p>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.id}
                          className="bg-orange-50 p-4 rounded-2xl border border-orange-100"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>

                              <p className="text-sm text-orange-700">
                                Rp {item.price.toLocaleString("id-ID")}
                              </p>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 font-bold"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              className="w-8 h-8 rounded-lg bg-orange-200 font-bold"
                            >
                              −
                            </button>

                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) =>
                                updateQty(
                                  item.id,
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="flex-1 text-center border rounded-lg py-1"
                            />

                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="w-8 h-8 rounded-lg bg-orange-200 font-bold"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-right font-bold text-orange-600 mt-3">
                            Rp {(item.price * item.qty).toLocaleString("id-ID")}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* TOTAL */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>

                      <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                    </div>

                    {/* <div className="flex justify-between">
                      <span>PPN 10%</span>

                      <span>
                        Rp{" "}
                        {Math.round(totalPrice * 0.1).toLocaleString("id-ID")}
                      </span>
                    </div> */}

                    <div className="flex justify-between bg-orange-100 p-4 rounded-2xl font-bold text-lg">
                      <span>Total</span>

                      <span className="text-orange-600">
                        Rp {totalPrice.toLocaleString("id-ID")}
                      </span>
                    </div>

                    {/* BUTTON */}
                    <div className="space-y-3 pt-4">
                      <button
                        onClick={handleSaveOrder}
                        disabled={cart.length === 0}
                        className={`w-full py-3 rounded-2xl font-bold text-white transition ${
                          cart.length === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        💾 Simpan Pesanan
                      </button>

                      <button
                        onClick={() => setShowPaymentModal(true)}
                        disabled={cart.length === 0}
                        className={`w-full py-3 rounded-2xl font-bold text-white transition ${
                          cart.length === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        ✓ Proses Pembayaran
                      </button>

                      <button
                        onClick={clearCart}
                        disabled={cart.length === 0}
                        className={`w-full py-3 rounded-2xl font-bold transition ${
                          cart.length === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        🗑️ Bersihkan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </Sidebar>
    </>
  );
}
