"use client";

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
};

type MenuCardProps = {
  item: MenuItem;
  addToCart: (item: MenuItem) => void;
  disabled?: boolean;
};

export default function MenuCard({ item, addToCart, disabled }: MenuCardProps) {
  return (
    <div className="group overflow-hidden rounded-[20px] border border-orange-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-32 overflow-hidden bg-orange-50">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-orange-800">
            {item.category}
          </span>
          <span className="text-xs font-semibold text-amber-950">
            Rp {item.price.toLocaleString()}
          </span>
        </div>
        <h2 className="mt-2 text-sm font-semibold text-amber-950">
          {item.name}
        </h2>
        <p className="mt-1 text-xs leading-4 text-orange-700">
          {item.description}
        </p>
        <button
          type="button"
          onClick={() => addToCart(item)}
          disabled={disabled}
          className={`mt-3 inline-flex w-full items-center justify-center rounded-2xl px-3 py-2 text-xs font-semibold text-white transition ${
            disabled
              ? "cursor-not-allowed bg-orange-300 text-orange-700"
              : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          {disabled ? "Pilih meja" : "Tambah"}
        </button>
      </div>
    </div>
  );
}
