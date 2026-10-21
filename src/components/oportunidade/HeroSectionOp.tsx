/*
 * HeroSectionOp — Hero da LP /oportunidade
 * Cópia do HeroSection do root, com o formulário sem UF/Cidade.
 */

import { ChevronDown, BadgeCheck } from "lucide-react";
import LeadFormCard from "./LeadFormCard";

const HERO_BG = "/image/fundo.webp";

export default function HeroSectionOp() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-[oklch(0.1998_0.0403_258.29)]/60 backdrop-blur-[8px]" />

      <div className="relative z-10 container mx-auto px-5 lg:px-12 flex-1 flex items-center py-10 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">

          {/* Copy */}
          <div className="text-white order-2 lg:order-1">
            <div className="hidden lg:block mb-4">
              <img src="/image/LogotipoHelpinho.png" alt="Help Multas" className="h-12 w-auto" />
            </div>

            <span className="gold-line" />

            <h1 className="font-display text-4xl lg:text-[64px] font-black text-white leading-[1.1] tracking-tight mb-4">
              VOCÊ VENDE.{" "}
              <br /><span className="text-gold">NÓS EXECUTAMOS TODA A OPERAÇÃO.</span>
            </h1>

            <p className="font-body text-lg text-white/80 leading-relaxed mb-7 max-w-lg font-semibold">
              <span className="text-gold">Sem Royalties e 50% da venda no seu bolso.</span> <span><br />Nós cuidamos de todo o resto.</span>
            </p>

            <div className="flex items-stretch gap-0 mb-8">
              <div className="w-1 bg-gold rounded-full shrink-0" />
              <div className="pl-5">
                <p className="font-body text-gold/60 text-[11px] font-semibold uppercase tracking-[.15em] mb-1">
                  Investimento a partir de
                </p>
                <p className="font-display text-5xl lg:text-6xl font-black text-gold leading-none tracking-tight">
                  R$ 30 MIL
                </p>
                <p className="font-body text-white/35 text-xs mt-1.5">
                  Taxa de franquia inclusa
                </p>
              </div>
            </div>

            <div className="hidden lg:flex gap-1 flex-wrap mb-8">
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2">
                <span className="text-gold"><BadgeCheck className="w-5 h-5" /></span>
                <span className="font-body text-body font-bold text-white/80">Franquia com mais de 10 ANOS DE MERCADO</span>
              </div>
            </div>

            <a href="#modelo" className="hidden lg:flex items-center gap-2 text-white/40 text-sm hover:text-white transition-colors">
              <ChevronDown className="animate-bounce w-4 h-4" />
              <span className="font-body font-semibold">Role para conhecer o modelo</span>
            </a>
          </div>

          {/* Formulário */}
          <div id="formulario" className="order-1 lg:order-2">
            <div className="lg:hidden flex items-center justify-between mb-5">
              <img src="/image/LogotipoHelpinho.png" alt="Help Multas" className="h-9 w-auto" />
              <div className="text-right">
                <p className="text-gold font-body font-black text-[11px] uppercase tracking-widest leading-tight">
                  Oportunidade 2026
                </p>
                <p className="text-white/70 font-body text-[11px] font-semibold leading-tight">
                  Até R$ 500 Mil / ano
                </p>
              </div>
            </div>

            <LeadFormCard
              idPrefix="hero"
              origem="Oportunidade (Hero)"
              Heading="h2"
              className="shadow-[0_32px_70px_rgba(0,0,0,0.45)] p-6 sm:p-10"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
