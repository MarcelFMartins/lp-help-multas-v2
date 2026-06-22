/*
 * MarketSection — "O Problema / A Oportunidade"
 * Design: Dark navy background, gold data visualization, market stats
 * Narrative: Apresenta o tamanho do mercado de multas como oportunidade
 * fature até 30k mes modelo franquia
ticket medio
n contratos por mes 
 */

import * as React from "react";
import { useInView, useCounter } from "@/hooks/useInView";

/* ─── Stats principais (grandes) ─── */
function Primarystat({ value, suffix, label, description }: {
  value: number;
  suffix: string;
  label: string;
  description: string;
}) {
  const { ref, inView } = useInView();
  const count = useCounter(value, 1800, inView);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col items-center text-center p-8 rounded-2xl border border-white/10 hover:border-gold/40 transition-all duration-300 group"
    >
      <span className="font-data text-6xl lg:text-7xl text-gold leading-none font-bold tracking-tight">
        {count}{suffix}
      </span>
      <span className="font-display text-lg font-bold text-white mt-3">{label}</span>
      <span className="font-body text-sm text-white/50 mt-1 max-w-[200px] leading-snug">{description}</span>
    </div>
  );
}

/* ─── Stats secundários (compactos / prova social) ─── */
function SecondaryStat({ value, suffix, label, description }: {
  value: number;
  suffix: string;
  label: string;
  description: string;
}) {
  const { ref, inView } = useInView();
  const count = useCounter(value, 1400, inView);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col items-center text-center px-6 py-4 group"
    >
      <span className="font-data text-4xl lg:text-5xl text-gold leading-none font-bold">
        {count}{suffix}
      </span>
      <span className="font-display text-sm font-bold text-white mt-2">{label}</span>
      <span className="font-body text-xs text-white/50 mt-1 max-w-[160px] leading-snug">{description}</span>
    </div>
  );
}

/* ─── Divider responsivo ─── */
function Divider() {
  return (
    <>
      <div className="hidden md:block w-px self-stretch bg-white/10 my-8" />
      <div className="md:hidden h-px w-full bg-white/10" />
    </>
  );
}

/* ─── Earnings stat ─── */
function EarningsStat({
  eyebrow,
  value,
  prefix = "",
  suffix = "",
  description,
  highlight = false,
}: {
  eyebrow: string;
  value: number;
  prefix?: string;
  suffix?: string;
  description: string;
  highlight?: boolean;
}) {
  const { ref, inView } = useInView();
  const count = useCounter(value, 1800, inView);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col items-center justify-center text-center px-8 py-10 gap-1"
    >
      <span className="font-body text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">
        {eyebrow}
      </span>
      <div className="flex items-baseline justify-center whitespace-nowrap">
        <span
          className={`font-data font-black leading-none tracking-tight ${
            highlight
              ? "text-5xl lg:text-6xl text-gold"
              : "text-4xl lg:text-5xl text-white"
          }`}
          style={{ minWidth: highlight ? "3ch" : undefined, display: "inline-block", textAlign: "right" }}
        >
          {prefix}{count}
        </span>
        <span
          className={`font-data font-black leading-none tracking-tight ${
            highlight ? "text-5xl lg:text-6xl text-gold" : "text-4xl lg:text-5xl text-white"
          }`}
        >
          {suffix}
        </span>
      </div>
      <span className="font-body text-xs text-white/40 mt-2 max-w-[180px] leading-snug">
        {description}
      </span>
    </div>
  );
}

export default function MarketSection() {
  const { ref: titleRef, inView: titleInView } = useInView();

  const primaryStats = [
    { value: 80, suffix: "+", label: "Franquias no Brasil", description: "Franqueados operando em todo o país" },
    { value: 100, suffix: "MIL+", label: "Clientes", description: "Se defenderam com a Help Multas" },
    { value: 27, suffix: "", label: "Estados Atendidos", description: "Presença nacional consolidada" },
  ];

  const socialProofStats = [
    { value: 10, suffix: " ANOS", label: "De Franquia", description: "Temos Franqueados com mais de 07 anos de unidade ativa" },
    { value: 40, suffix: "%", label: "Índice de Recompra", description: "Dos clientes que voltam para recorrer novas multas" },
    { value: 20, suffix: "%", label: "Índice de Indicação", description: "Dos clientes indicam a Help passivamente a amigos" },
  ];

  return (
    <section id="mercado" className="relative py-24 bg-[oklch(0.1998_0.0403_258.29)] overflow-hidden">
      <div className="absolute inset-0 opacity-20" />
      <div className="absolute inset-0" />

      <div className="relative z-10 container mx-auto px-4">

        {/* Section header */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-3">
            O Mercado
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight max-w-3xl mx-auto">
            O BRASIL EMITE{" "}
            <span className="text-gold italic">MAIS DE <br />70 MILHÕES DE MULTAS</span>{" "}
            POR ANO. ALGUÉM PRECISA DEFENDER ESSES MOTORISTAS.
          </h2>
          <p className="font-body text-white/70 text-lg mt-6 max-w-2xl mx-auto">
            Esse alguém pode ser você, com suporte técnico completo da Help Multas,
            sem precisar ser advogado.
          </p>
        </div>

        {/* ── Bloco 1: Stats principais ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {primaryStats.map((stat) => (
            <Primarystat key={stat.label} {...stat} />
          ))}
        </div>

        {/* ── Bloco 2: Prova social (strip compacto) ── */}
        <div className="rounded-2xl border border-white/10 mb-16 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {socialProofStats.map((stat) => (
              <SecondaryStat key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        {/* ── Bloco 3: Potencial de Faturamento ── */}
        <div className="relative rounded-2xl border border-gold/30 overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
          {/* Glow sutil */}
          <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center">
            
            <EarningsStat
              eyebrow="Faturamento médio das franquias Help"
              value={30}
              prefix="R$"
              suffix=" MIL/mês"
              description="Potencial de faturamento mensal como franqueado"
              highlight
            />

            <Divider />

            <EarningsStat
              eyebrow="Ticket médio por venda"
              value={616}
              prefix="R$"
              suffix=",63"
              description="Valor médio por contrato fechado"
            />

            <Divider />

            <EarningsStat
              eyebrow="Vendas médias por mês"
              value={52}
              suffix="&nbsp;vendas"
              description="Volume médio de contratos mensais"
            />

          </div>

          {/* Canais de vendas — strip dentro do card */}
          <div className="relative z-10 border-t border-white/10 px-8 py-5 flex flex-col items-center gap-3">
            <span className="font-body text-[10px] font-bold uppercase tracking-widest text-white/30">
              Principais Canais de Vendas
            </span>
            <div className="flex flex-row items-center gap-6">
              {[
                { label: "Marketing Digital" },
                { label: "Recompra" },
                { label: "Indicação" },
              ].map((c, i) => (
                <React.Fragment key={c.label}>
                  {i > 0 && <span className="text-white/20">·</span>}
                  <span className="font-display text-sm font-bold text-white/70">{c.label}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
