/*
 * TechSection — "Tecnologia Desenvolvida pela HelpMultas"
 * Design: Dark navy (igual ao MarketSection) — consistência narrativa
 * Hierarquia: Aquarium (hero) → CRM (secundário forte) → Help Indica (menção sutil)
 * Narrativa: Você não começa do zero — já tem um ecossistema digital completo
 */

import * as React from "react";
import { useInView } from "@/hooks/useInView";
import aquariumLogo from "@/assets/AquariumLogoWhite.png";
import turboCRMLogo from "@/assets/TurboCRMLogo.png";
import helpIndicaLogo from "@/assets/HelpIndica.png";

/* ─── Color tokens ─── */
const NAVY = "oklch(0.1998 0.0403 258.29)";
const GOLD = "oklch(0.8371 0.1715 85.23)";
const GOLD_TEXT = "oklch(0.65 0.14 85)";

/* ─── SVG Icons ─── */
const S = {
  strokeWidth: "1.8",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
  stroke: "currentColor",
};

function IcDroplet({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function IcCRM({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 17.5h7M17.5 14v7" />
    </svg>
  );
}

function IcShare({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/* ─── Badge "Desenvolvido pela HelpMultas" ─── */
function HelpBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border"
      style={{
        color: GOLD_TEXT,
        borderColor: "oklch(0.8371 0.1715 85.23 / 0.3)",
        background: "oklch(0.8371 0.1715 85.23 / 0.08)",
      }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
        <circle cx="5" cy="5" r="3" />
      </svg>
      Desenvolvido pela Help Multas
    </span>
  );
}

/* ─── Feature item dentro do card ─── */
function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <svg
        className="w-4 h-4 mt-0.5 shrink-0"
        viewBox="0 0 16 16"
        fill="none"
        stroke={GOLD}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 8 6.5 11.5 13 5" />
      </svg>
      <span className="font-body text-sm text-white/65 leading-snug">{text}</span>
    </li>
  );
}

/* ─── Card principal (Aquarium e CRM) ─── */
function MainTechCard({
  icon,
  tag,
  logoSrc,
  logoAlt,
  tagline,
  description,
  features,
  index,
  highlight = false,
}: {
  icon: React.ReactNode;
  tag: string;
  logoSrc: string;
  logoAlt: string;
  tagline: string;
  description: string;
  features: string[];
  index: number;
  highlight?: boolean;
}) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="relative rounded-2xl overflow-hidden border transition-all duration-500 group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${index * 150}ms, transform 0.65s ease ${index * 150}ms, border-color 0.3s`,
        borderColor: highlight
          ? "oklch(0.8371 0.1715 85.23 / 0.35)"
          : "rgba(255,255,255,0.08)",
        background: highlight
          ? "linear-gradient(135deg, oklch(0.24 0.05 258.29) 0%, oklch(0.20 0.04 258.29) 100%)"
          : "oklch(0.22 0.045 258.29 / 0.6)",
      }}
    >
      {/* Glow top border no highlight */}
      {highlight && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
        />
      )}

      {/* Glow de canto */}
      {highlight && (
        <div
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: GOLD, filter: "blur(40px)" }}
        />
      )}

      <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
        {/* Topo: badge + ícone */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="shrink-0">
            <HelpBadge />
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: highlight
                ? "oklch(0.8371 0.1715 85.23 / 0.15)"
                : "rgba(255,255,255,0.06)",
              color: highlight ? GOLD : "rgba(255,255,255,0.5)",
            }}
          >
            {icon}
          </div>
        </div>

        {/* Tag */}
        <p
          className="font-body text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          {tag}
        </p>

        {/* Logo do produto */}
        <div className="mb-5">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="h-10 md:h-12 w-auto object-contain"
            style={{ maxWidth: "220px" }}
          />
        </div>

        {/* Tagline */}
        <p
          className="font-body text-base font-semibold mb-4 leading-snug"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {tagline}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-5">
          {features.map((f) => (
            <FeatureItem key={f} text={f} />
          ))}
        </ul>

        {/* Descrição curta */}
        <p
          className="font-body text-sm leading-relaxed mt-auto"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════ */
export default function TechSection() {
  const { ref: titleRef, inView: titleInView } = useInView();
  return (
    <section
      id="tecnologia"
      className="relative py-24 overflow-hidden"
      style={{ background: NAVY }}
    >
      {/* Glow ambiente */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10 pointer-events-none"
        style={{ background: GOLD, filter: "blur(100px)", borderRadius: "50%" }}
      />

      <div className="relative z-10 container mx-auto px-4">

        {/* ── Section header ── */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${
            titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: GOLD_TEXT }}>
            Ecossistema Digital
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight max-w-3xl mx-auto">
            TECNOLOGIA PRÓPRIA{" "}
            <span className="italic" style={{ color: GOLD }}>
              CRIADA PELA HELP MULTAS
            </span>{" "}
            PARA O SEU SUCESSO
          </h2>
          <p className="font-body text-white/60 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            Você não começa do zero. Desde o primeiro dia, tem acesso a um ecossistema
            digital completo, desenvolvido internamente para maximizar suas vendas.
          </p>
        </div>

        {/* ── 2 cards principais ── */}
        <div className="grid md:grid-cols-3 gap-5 mb-5">
          <MainTechCard
            index={0}
            highlight
            icon={<IcDroplet className="w-6 h-6" />}
            tag="Geração de Leads"
            logoSrc={aquariumLogo}
            logoAlt="Aquarium"
            tagline="Receba leads qualificados todos os dias, direto na sua plataforma."
            description="Nossa plataforma exclusiva capta motoristas que já buscam ajuda com multas e entrega oportunidades organizadas direto na sua conta, fluxo constante desde o primeiro dia, sem depender de prospecção."
            features={[
              "Leads novos entregues diariamente na sua conta",
              "Motoristas que já buscaram ajuda com multas",
              "Painel de gestão para acompanhar e converter",
            ]}
          />

          <MainTechCard
            index={1}
            icon={<IcCRM className="w-6 h-6" />}
            tag="Gestão Comercial"
            logoSrc={turboCRMLogo}
            logoAlt="Turbo CRM"
            tagline="Mais controle, mais produtividade e mais vendas para sua unidade."
            description="Desenvolvido exclusivamente para a operação Help Multas: gerencie leads, automatize follow-ups via WhatsApp, monitore seu funil e acompanhe o desempenho da equipe em tempo real, tudo em um só lugar."
            features={[
              "Gestão completa de leads e clientes",
              "Integração com o Aquarium e demais canais de captação",
              "Funil de vendas exclusivo para o modelo Help Multas",
              "Automação de mensagens e follow-ups",
              "Controle de atendimentos e negociações",
              "Indicadores de desempenho em tempo real",
              "Mais organização, produtividade e faturamento",
            ]}
          />

          <MainTechCard
            index={2}
            icon={<IcShare className="w-6 h-6" />}
            tag="Programa de Indicações"
            logoSrc={helpIndicaLogo}
            logoAlt="Help Indica"
            tagline="Clientes satisfeitos gerando novas vendas para sua unidade."
            description="Com o Help Indica, cada cliente bem atendido se torna uma fonte orgânica de novos negócios, ampliando seu volume de contratos sem depender exclusivamente de mídia paga."
            features={[
              "Indicações de clientes e parceiros registradas na plataforma",
              "Leads com maior confiança e taxa de conversão",
              "Crescimento orgânico e escalável para sua unidade",
              "Mais vendas sem aumentar o custo de aquisição",
            ]}
          />
        </div>

        {/* ── CTA central — padrão das outras sections ── */}
        <div className="mt-16 text-center">
          <p className="font-body text-white/60 mb-6 max-w-xl mx-auto">
            Tudo incluso na franquia, pronto para usar desde o primeiro dia.
          </p>
          <a
            href="#inicio"
            className="inline-block px-8 py-4 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-lg"
            style={{
              background: GOLD,
              color: NAVY,
            }}
          >
            Quero minha franquia
          </a>
        </div>

      </div>
    </section>
  );
}