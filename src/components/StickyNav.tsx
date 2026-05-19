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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      style={{ background: "oklch(0.1998 0.0403 258.29)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* px-4 adicionado para evitar que os elementos colem na borda da tela */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <a href="#inicio" className="shrink-0">
          <img
            src="/image/H amarelo.png"
            alt="Help Multas"
            className="h-10 w-auto"
          />
        </a>

        <div className="hidden md:flex items-center gap-6">
          <a href="#depoimentos" className="font-body text-sm text-white/70 hover:text-gold transition-colors">Depoimentos</a>
          <a href="#modelo" className="font-body text-sm text-white/70 hover:text-gold transition-colors">O Modelo</a>
          <a href="#equipe" className="font-body text-sm text-white/70 hover:text-gold transition-colors">Nosso Time</a>
        </div>

        {/* Classes de tamanho responsivo e whitespace-nowrap aplicadas para o botão não quebrar nem vazar */}
        <a
          href="#inicio"
          className="px-3 py-2 text-[10px] sm:px-5 sm:py-2.5 sm:text-xs rounded-lg font-body font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90 whitespace-nowrap shrink-0 text-center"
          style={{ background: "oklch(0.8371 0.1715 85.23)", color: "oklch(0.1998 0.0403 258.29)" }}
        >
          Quero ser franqueado
        </a>
      </div>
    </nav>
  );
}