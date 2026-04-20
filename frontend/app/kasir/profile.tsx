"use client";

import Link from "next/link";
export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-amber-800 to-amber-700 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          User Profile
        </h1>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <p className="text-gray-700 mb-4">
            This is a placeholder for the user profile page. You can add user
            details, order history, and other relevant information here.
          </p>
          ```
          <Link
            href="/"
            className="text-amber-700 font-bold hover:text-amber-800"
          >
            ← back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
