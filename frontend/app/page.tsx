"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <style>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-1deg);
          }
          75% {
            transform: rotate(1deg);
          }
        }

        @keyframes glow-text {
          0%, 100% {
            text-shadow: 0 0 10px rgba(217, 119, 6, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(217, 119, 6, 0.8);
          }
        }

        @keyframes scale-bounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        .animate-wiggle-once {
          animation: wiggle 0.5s ease-out forwards;
        }

        .animate-glow-text-once {
          animation: glow-text 0.8s ease-out forwards;
        }

        .animate-scale-bounce {
          animation: scale-bounce 1.5s infinite;
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
      `}</style>

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-amber-800 text-white shadow-lg animate-fade-in">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold animate-fade-in">
            🥐 Nanyang Bakery & Beverage Shop
          </h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8">
            <li>
              <a
                href="#contact"
                className="text-white/80 hover:text-white transition animate-fade-in stagger-1 inline-block"
              >
                Kontak
              </a>
            </li>
          </ul>

          {/* Login Button */}
          <Link
            href="/login"
            className="bg-gradient-to-r from-amber-700 to-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-amber-800 hover:to-amber-700 transition transform hover:scale-110 animate-fade-in stagger-2"
          >
            Masuk
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="md:hidden text-white text-2xl animate-bounce"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {openMenu && (
          <div className="md:hidden bg-amber-700 px-4 py-4 space-y-2 animate-fade-in-up">
            <a href="#contact" className="block text-white/80 hover:text-white">
              Kontak
            </a>
          </div>
        )}
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="bg-gradient-to-r from-amber-800 to-amber-700 text-white py-32 text-center overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-6xl font-bold mb-6 animate-fade-in-up">
            Selamat Datang! 🍹
          </h2>
          <p className="text-2xl text-amber-100 mb-8 animate-fade-in-up stagger-1">
            Nanyang Bakery & Beverage Shop - Minuman Segar & Bakery Lezat
          </p>
          <p className="text-lg text-amber-50 mb-12 max-w-2xl mx-auto animate-fade-in-up stagger-2">
            Kami menyediakan minuman berkualitas premium dan bakery yang dibuat
            dengan cinta. Pesan sekarang melalui berbagai platform pengantaran
            atau hubungi kami secara langsung.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="#contact"
              className="bg-white text-amber-800 px-6 py-2 rounded-lg font-bold hover:bg-amber-100 transition transform hover:scale-110 animate-fade-in-up stagger-2 inline-block"
            >
              Kontak
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition transform hover:scale-110 animate-fade-in-up stagger-3 inline-block"
            >
              Masuk ke Akun
            </Link>
          </div>
        </div>
      </section>

      {/* ================= KONTAK SECTION ================= */}
      <section
        id="contact"
        className="bg-amber-50 mt-16 py-8 border-t border-amber-200 overflow-hidden"
      >
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-amber-900 mb-6 animate-fade-in-up">
            Hubungi Kami 📍
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="font-semibold text-amber-900 animate-fade-in-up stagger-1 hover:scale-105 transition">
                📞{" "}
                <a
                  href="https://wa.me/6281234567890"
                  className="text-amber-700 hover:text-amber-800 font-bold"
                >
                  0812-3456-7890
                </a>
              </p>
              <p className="font-semibold text-amber-900 animate-fade-in-up stagger-2 hover:scale-105 transition">
                📍 Tg.Sengkuang atas No.26 Batu ampar, Kota Batam
              </p>
              <p className="font-semibold text-amber-900 animate-fade-in-up stagger-3 hover:scale-105 transition">
                🕒 10:00 - 22:00
              </p>
              <p className="font-semibold text-amber-900 animate-fade-in-up stagger-3 hover:scale-105 transition">
                📧 nanyangbakery@gmail.com
              </p>
            </div>
            <div className="w-full h-48 rounded-xl overflow-hidden shadow-sm border border-amber-300 animate-fade-in-up stagger-2 hover:shadow-lg transition">
              <iframe
                className="w-full h-full hover:scale-105 transition duration-300"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26426.94292319071!2d103.98403783219406!3d1.1797867552774237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d989f9a1da6449%3A0x27ff497db30fc125!2sBatu%20Ampar%2C%20Batam%20City%2C%20Riau%20Islands%2C%20Indonesia!5e1!3m2!1sen!2sus!4v1765449834977!5m2!1sen!2sus"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gradient-to-r from-amber-800 to-amber-700 text-white py-6 text-center mt-10">
        <p className="font-bold text-lg animate-fade-in">
          Nanyang Bakery & Beverage Shop © 2025
        </p>
        <p className="text-sm text-amber-100 mt-1 animate-fade-in stagger-1">
          Fresh & delicious everyday 💗
        </p>
        <p className="text-sm text-amber-100 mt-1 animate-fade-in stagger-2">
          by silvi yulia
        </p>
      </footer>
    </>
  );
}
