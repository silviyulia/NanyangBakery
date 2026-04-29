import { MenuItem } from "@/app/waitres/MenuCard";

export type CartItem = MenuItem & {
  qty: number;
};

type CartProps = {
  cart: CartItem[];
  updateQty: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  tableNumber: string;
  sendToKasir: () => void;
};

export default function Cart({
  cart,
  updateQty,
  removeFromCart,
  clearCart,
  tableNumber,
  sendToKasir,
}: CartProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isEmpty = cart.length === 0;
  const canSend = !isEmpty && tableNumber !== "Belum dipilih";

  return (
    <div className="rounded-[32px] bg-white p-6 shadow-md border border-orange-100">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-600">
          Keranjang Pesanan
        </p>
        <p className="mt-3 text-2xl font-semibold text-amber-950">
          {tableNumber}
        </p>
      </div>

      {isEmpty ? (
        <div className="rounded-[28px] border border-orange-200 bg-orange-50 p-10 text-center text-sm text-orange-700">
          {tableNumber === "Belum dipilih"
            ? "Pilih nomor meja terlebih dahulu"
            : "Keranjang masih kosong. Tambahkan menu dari pilihan di kiri."}
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="rounded-[24px] border border-orange-200 bg-orange-50 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-amber-950">{item.name}</p>
                  <p className="mt-1 text-sm text-orange-700">
                    Rp {item.price.toLocaleString()} x {item.qty}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-700 hover:bg-red-100"
                >
                  Hapus
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 rounded-2xl border border-orange-300 bg-white px-3 py-2">
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700"
                  >
                    -
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold text-amber-950">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-semibold text-amber-950">
                  Total: Rp {(item.price * item.qty).toLocaleString()}
                </p>
              </div>
            </div>
          ))}

          <div className="rounded-[28px] border border-orange-200 bg-orange-50 p-5">
            <div className="flex items-center justify-between text-sm text-orange-700">
              <span>Total item</span>
              <span>{totalItems}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-lg font-semibold text-amber-950">
              <span>Subtotal</span>
              <span>Rp {totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={sendToKasir}
          disabled={!canSend}
          className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition ${
            canSend
              ? "bg-orange-600 hover:bg-orange-700"
              : "cursor-not-allowed bg-orange-300 text-orange-700"
          }`}
        >
          Kirim ke Kasir
        </button>
        <button
          type="button"
          onClick={clearCart}
          disabled={isEmpty}
          className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
            isEmpty
              ? "cursor-not-allowed border-orange-200 bg-orange-100 text-orange-500"
              : "border-orange-300 bg-white text-orange-700 hover:bg-orange-50"
          }`}
        >
          Bersihkan Keranjang
        </button>
      </div>
    </div>
  );
}
