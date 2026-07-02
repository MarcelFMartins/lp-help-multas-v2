/*
 * InvestmentModelsSection — "Escolha o formato que combina com o seu momento"
 *
 * Baseado no layout de https://www.helpmultas.com/quero-ser-franqueado
 * Foto de fundo full-bleed com overlay navy, headline à esquerda e
 * duas pills de alternância (Home Based / Loja Física) na base do card.
 * Trocar a pill troca a foto de fundo e os dados de investimento.
 */

import { useState } from "react";
import { useInView } from "../hooks/useInView";

type ModelKey = "home" | "loja";

const MODELS: Record<
  ModelKey,
  {
    label: string;
    sublabel: string;
    bg: string;
    investment: string;
    description: string;
    bullets: string[];
  }
> = {
  home: {
    label: "Home Based",
    sublabel: "100% Digital",
    bg: "image/homebased.webp",
    investment: "R$ 29.900",
    description:
      "Opere de qualquer lugar, sem ponto físico. Ideal para quem quer começar com o menor investimento e estrutura enxuta.",
    bullets: [
      "Menor investimento inicial",
      "Sem custo com aluguel ou loja",
      "Atendimento 100% online",
      "Estrutura enxuta e ágil",
    ],
  },
  loja: {
    label: "Loja Física",
    sublabel: "Presença Local",
    bg: "image/lojafisica.webp",
    investment: "R$ 110.000",
    description:
      "Ponto físico com fachada e atendimento presencial. Ideal para quem busca autoridade local e maior volume de captação.",
    bullets: [
      "Fachada e visibilidade na cidade",
      "Captação orgânica de clientes locais",
      "Maior potencial de faturamento",
      "Autoridade e confiança presencial",
    ],
  },
};

export default function InvestmentModelsSection() {
  const [active, setActive] = useState<ModelKey>("home");
  const { ref, inView } = useInView();

  const model = MODELS[active];

  return (
    <section
      id="investimento"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative overflow-hidden min-h-[640px] lg:min-h-screen lg:h-screen flex items-center"
    >
      {/* Background photos — crossfade entre os dois modelos */}
      {(Object.keys(MODELS) as ModelKey[]).map((key) => (
        <div
          key={key}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-out ${
            active === key ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${MODELS[key].bg})` }}
        />
      ))}

      {/* Overlay navy — mais escuro à esquerda para leitura do texto */}
      <div className="absolute inset-0 bg-[oklch(0.1998_0.0403_258.29)]/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.1998_0.0403_258.29)]/95 via-[oklch(0.1998_0.0403_258.29)]/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.1998_0.0403_258.29)]/90 via-transparent to-transparent" />

      <div
        className={`relative z-10 container mx-auto px-5 lg:px-12 py-16 lg:py-0 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="font-body text-xs lg:text-sm uppercase tracking-[0.25em] text-white/70 font-bold mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-gold">Investimento</span>
            <span className="text-white/40">→</span>
            <span>Dois modelos</span>
          </p>

          {/* Headline */}
          <h2 className="font-display text-3xl lg:text-5xl font-black text-white leading-[1.15] mb-6">
            Escolha o formato que combina com o seu momento.
          </h2>

          {/* Investment highlight card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[20px] p-6 lg:p-8 mb-8">
            <div className="flex items-baseline gap-3 mb-3 flex-wrap">
              <span className="font-body text-xs uppercase tracking-wide text-white/60 font-semibold">
                {model.label} · Investimento a partir de
              </span>
            </div>
            <p className="font-display text-4xl lg:text-5xl font-black text-gold mb-4">
              {model.investment}
            </p>
            <p className="font-body text-sm lg:text-base text-white/80 leading-relaxed mb-5">
              {model.description}
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {model.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-2.5 font-body text-sm text-white/85"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <a
            href="#inicio"
            className="inline-flex items-center gap-2 rounded-[14px] bg-gold text-[oklch(0.1998_0.0403_258.29)] font-body font-black text-sm uppercase tracking-wide px-7 py-4 shadow-[0_14px_24px_rgba(212,160,23,0.28)] hover:bg-gold/80 hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200"
          >
            Quero ser um franqueado →
          </a>
        </div>

        {/* Toggle pills */}
        <div className="mt-10 lg:mt-14 inline-flex rounded-[18px] border border-white/25 bg-white/5 backdrop-blur-md p-1.5 gap-1.5">
          {(Object.keys(MODELS) as ModelKey[]).map((key) => {
            const m = MODELS[key];
            const isActive = active === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`text-left rounded-[13px] px-5 py-3 lg:px-7 lg:py-3.5 transition-all duration-200 ${
                  isActive
                    ? "bg-gold shadow-[0_10px_20px_rgba(212,160,23,0.28)]"
                    : "bg-transparent hover:bg-white/10"
                }`}
              >
                <span
                  className={`block font-display font-black text-sm lg:text-base leading-tight ${
                    isActive ? "text-[oklch(0.1998_0.0403_258.29)]" : "text-white"
                  }`}
                >
                  {m.label}
                </span>
                <span
                  className={`block font-body text-[10px] lg:text-xs uppercase tracking-wide font-bold mt-0.5 ${
                    isActive
                      ? "text-[oklch(0.1998_0.0403_258.29)]/70"
                      : "text-white/50"
                  }`}
                >
                  {m.sublabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
