"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { authenticateUser, UserRole } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("owner");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await authenticateUser(email, password, role);
      if (!user) {
        setError("Email, password, atau role tidak sesuai.");
        return;
      }

      if (user.role === "owner") {
        router.push("/owner");
      } else if (user.role === "kasir") {
        router.push("/kasir");
      } else if (user.role === "waitres") {
        router.push("/waitres");
      }
    } catch (err) {
      setError("Login gagal. Silakan coba lagi.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-amber-800 to-amber-700 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="https://cdn-icons-png.flaticon.com/512/924/924514.png"
            alt="Nanyang Bakery & Beverage Shop"
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-white p-2"
          />
          <h1 className="text-4xl font-bold text-white mb-2">
            Nanyang Bakery & Beverage Shop
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-3">
                Login as
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Owner", value: "owner" },
                  { label: "Kasir", value: "kasir" },
                  { label: "Waitres", value: "waitres" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRole(item.value as UserRole)}
                    className={`py-2 px-3 rounded-lg font-semibold transition capitalize ${
                      role === item.value
                        ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white"
                        : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-amber-900 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-amber-900 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-700 hover:text-amber-900 transition"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-5.68 1.74L3.707 2.293zM12.168 6.95a2 2 0 012.825.825.75.75 0 001.5-.388C15.75 5.901 14.574 4.5 13 4.5c-1.205 0-2.27.501-3.048 1.309l.854.854.362-.362zM5 10a5 5 0 019.192 1.342.75.75 0 001.5-.484A6.973 6.973 0 005 10c0 .9.156 1.765.424 2.559l1.068-1.068A4.986 4.986 0 015 10zm6-4a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5A.75.75 0 0011 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition ${
                role
                  ? "bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700"
                  : "bg-amber-200 cursor-not-allowed"
              } ${isLoading ? "opacity-75" : ""}`}
            >
              {isLoading ? "loading..." : "login"}
            </button>


          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-amber-700 text-sm">
            dont have an account?{" "}
            <Link
              href="/register"
              className="text-amber-700 font-bold hover:text-amber-800"
            >
              register here
            </Link>
          </p>

          {/* Back to Home */}
          <p className="text-center mt-4">
            <Link
              href="/"
              className="text-amber-700 text-sm hover:text-amber-800 font-medium"
            >
              ← back to home
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-amber-100 text-xs">
          © 2026 Nanyang Bakery & Beverage Shop. All rights reserved.
        </p>
      </div>
    </div>
  );
}
