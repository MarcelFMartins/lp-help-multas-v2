/*
 * StickyNav — Barra de navegação fixa que aparece após scroll
 * Design: Navy with gold CTA button, appears after hero
 */

import { useState, useEffect } from "react";

export default function StickyNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
      style={{ background: "oklch(0.1998 0.0403 258.29)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="container mx-auto py-3 flex items-center justify-between">
        <a href="#inicio" className="font-display text-lg font-bold text-white">
          help<span className="text-gold">multas</span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          <a href="#modelo" className="font-body text-sm text-white/70 hover:text-white transition-colors">O Modelo</a>
          <a href="#depoimentos" className="font-body text-sm text-white/70 hover:text-white transition-colors">Depoimentos</a>
          <a href="#faq" className="font-body text-sm text-white/70 hover:text-white transition-colors">FAQ</a>
        </div>
        <a
          href="#inicio"
          className="px-5 py-2.5 rounded-lg font-body font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:opacity-90"
          style={{ background: "oklch(0.8371 0.1715 85.23)", color: "oklch(0.1998 0.0403 258.29)" }}
        >
          Quero ser franqueado
        </a>
      </div>
    </nav>
  );
}
