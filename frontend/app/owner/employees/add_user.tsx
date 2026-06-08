"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, UserRole } from "../../lib/auth";

export default function TambahUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "kasir" as UserRole,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const result = await registerUser(form);

    if (!result) {
      setError("Gagal menambahkan user. Email mungkin sudah digunakan.");
      setIsLoading(false);
      return;
    }

    setSuccess("User berhasil ditambahkan!");
    setForm({ name: "", email: "", password: "", phone: "", role: "kasir" });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Tambah User Baru</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">Nama</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nama lengkap"
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 karakter"
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">No. Telepon</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="kasir">Kasir</option>
                <option value="waitres">Waitres</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            {/* Tombol */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full py-3 px-4 rounded-lg font-bold border border-amber-600 text-amber-700 hover:bg-amber-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 ${
                  isLoading ? "opacity-75" : ""
                }`}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}