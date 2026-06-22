import { useState, useEffect, useRef } from "react";
import { useInView, useCounter } from "../hooks/useInView";

/* ─── Color tokens ─── */
const NAVY_DEEP = "oklch(0.1998 0.0403 258.29)";
const NAVY = "oklch(0.26   0.048  258.29)";
const GOLD = "oklch(0.8371 0.1715 85.23)";
const GREEN = "oklch(0.73   0.17   142)";
const GREEN_LT = "oklch(0.79   0.19   142)";
const GOLD_LIGHT = "oklch(0.88   0.15   85)";
const OFFWHITE = "oklch(0.98   0.005  75)";
const MUTED = "oklch(0.65   0.025  248)";

const TICKET = 1057;
const COMMISSION = 0.10;
const CONVERSION = 0.70;

function calcEarn(n: number) {
  return Math.round(n * TICKET * COMMISSION);
}
function fmtBRL(v: number) {
  return "R$\u00a0" + v.toLocaleString("pt-BR");
}
function fmtWpp(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 2) return n;
  if (n.length <= 6) return n.replace(/(\d{2})(\d+)/, "($1) $2");
  if (n.length <= 10) return n.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return n.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
}

/* ════════════════════════════════════
   SVG ICONS
   ════════════════════════════════════ */
const S = {
  strokeWidth: "1.75",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
  stroke: "currentColor",
};
const IcFile = ({ c = "w-5 h-5" }) => <svg className={c} viewBox="0 0 24 24" {...S}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>;
const IcUsers = ({ c = "w-5 h-5" }) => <svg className={c} viewBox="0 0 24 24" {...S}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
const IcMonitor = ({ c = "w-5 h-5" }) => <svg className={c} viewBox="0 0 24 24" {...S}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
const IcShield = ({ c = "w-5 h-5" }) => <svg className={c} viewBox="0 0 24 24" {...S}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const IcStar = ({ c = "w-5 h-5" }) => <svg className={c} viewBox="0 0 24 24" {...S}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
const IcPlusC = ({ c = "w-5 h-5" }) => <svg className={c} viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>;
const IcCheck = ({ c = "w-3 h-3" }) => <svg className={c} viewBox="0 0 24 24" {...S}><polyline points="20 6 9 17 4 12" /></svg>;
const IcArrow = ({ c = "w-4 h-4" }) => <svg className={c} viewBox="0 0 24 24" {...S}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const IcTrophy = ({ c = "w-5 h-5" }) => <svg className={c} viewBox="0 0 24 24" {...S}><path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0012 0V2Z" /></svg>;
const IcDollar = ({ c = "w-5 h-5" }) => <svg className={c} viewBox="0 0 24 24" {...S}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>;
const IcTrend = ({ c = "w-5 h-5" }) => <svg className={c} viewBox="0 0 24 24" {...S}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;

/* ════════════════════════════════════
   NAV — sempre visível, logo Help Multas
   ════════════════════════════════════ */
function IndicaNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(13,20,38,0.96)" : "transparent",
        borderBottom: scrolled ? `1px solid ${GOLD}20` : "1px solid transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <a href="#inicio" className="flex-shrink-0">
            <img
              src="/image/logotipo.png"
              alt="Help Multas"
              className="h-8 md:h-10 w-auto"
            />
          </a>

          <div className="hidden lg:flex items-center gap-6">
            {[
              ["Para quem é", "#para-quem"],
              ["Como funciona", "#como"],
              ["Resultados", "#numeros"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm hover:text-yellow-400 transition-colors"
                style={{ color: `${OFFWHITE}90` }}
              >
                {label}
              </a>
            ))}
          </div>

          <a
            href="#cadastro"
            className="
              px-3 py-2
              md:px-5 md:py-2.5
              text-[10px]
              md:text-xs
              rounded-lg
              font-bold
              uppercase
              whitespace-nowrap
            "
            style={{
              background: GOLD,
              color: NAVY_DEEP,
            }}
          >
            Quero ser parceiro
          </a>

        </div>
      </div>
    </nav>
  );
}

/* ════════════════════════════════════
   TICKER
   ════════════════════════════════════ */
const TICKER_ITEMS = [
  "100.000+ motoristas atendidos",
  "80+ franqueados ativos",
  "Atuação em 27 estados",
  "10+ anos de mercado",
  "7.752 multas deferidas",
  "Comissão paga a cada caso ganho",
  "Cadastro 100% gratuito",
];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden py-3" style={{ background: GOLD }}>
      <div className="ticker-track flex whitespace-nowrap" style={{ animationDuration: "10s" }}>
        {doubled.map((item, i) => (
          <span key={i}
            className="inline-flex items-center gap-2 font-display font-black text-[11px] uppercase tracking-[.1em] px-8"
            style={{ color: NAVY_DEEP }}
          >
            <span className="w-1 h-1 rounded-full" style={{ background: `${NAVY_DEEP}55` }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   HERO — full-screen com fundo + earnings
   ════════════════════════════════════ */
function Hero() {
  const [refs, setRefs] = useState(7);
  const earn = calcEarn(refs);
  const pct = Math.round(((refs - 1) / 29) * 100);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col"
      style={{ background: NAVY_DEEP }}
    >
      {/* Fundo com overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/image/fundo.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: 0.12,
        }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${NAVY_DEEP}EE 0%, ${NAVY_DEEP}88 50%, ${NAVY_DEEP}CC 100%)`,
        }}
      />
      {/* Gold glow top-right */}
      <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px]"
        style={{ background: `radial-gradient(ellipse at 80% 10%, ${GOLD}12 0%, transparent 65%)` }}
      />
      {/* Green glow bottom-left */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-[500px] h-[500px]"
        style={{ background: `radial-gradient(ellipse at 10% 90%, ${GREEN}0D 0%, transparent 65%)` }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex-1 flex items-center pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

          {/* ── Copy ── */}
          <div>
            <h1
              className="font-display font-black leading-[.98] mb-6"
              style={{ fontSize: "clamp(3.5rem, 7vw, 6rem)", color: OFFWHITE }}
            >
              Indique.<br />
              <span style={{ color: GOLD }}>Ganhe.</span><br />
              <span style={{ color: GREEN_LT }}>Repita.</span>
            </h1>

            <p className="text-base lg:text-lg leading-relaxed mb-8 max-w-md" style={{ color: MUTED }}>
              Você indica quem tem multa de trânsito.
              A Help Multas entra com toda a expertise técnica e jurídica.
              Você recebe <strong style={{ color: OFFWHITE }}>comissão a cada caso ganho</strong>, sem precisar entender nada de direito.
            </p>

            <div className="flex flex-wrap gap-3 mb-7">
              <a
                href="#cadastro"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-wide transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
                style={{ background: GREEN, color: "#fff", boxShadow: `0 8px 32px ${GREEN}40` }}
              >
                Quero ser parceiro <IcArrow />
              </a>
              <a
                href="#como"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-wide transition-all hover:-translate-y-0.5"
                style={{ border: `1.5px solid ${OFFWHITE}25`, color: OFFWHITE }}
              >
                Como funciona
              </a>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-4">
              {["Cadastro gratuito", "Sem mensalidade", "Sem metas"].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Earnings widget ── */}
          <EarningsWidget refs={refs} setRefs={setRefs} earn={earn} pct={pct} />

        </div>
      </div>
    </section>
  );
}

/* ── Earnings Widget — custom slider ── */
function EarningsWidget({
  refs, setRefs, earn, pct,
}: { refs: number; setRefs: (n: number) => void; earn: number; pct: number }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function handleTrackClick(e: React.MouseEvent) {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setRefs(Math.max(1, Math.round(1 + ratio * 29)));
  }

  return (
    <div
      className="rounded-2xl relative overflow-hidden"
      style={{ background: NAVY, border: `1px solid ${GOLD}30` }}
    >
      {/* Green glow top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(to right, transparent, ${GREEN}70, transparent)` }}
      />

      {/* Header row */}
      <div className="px-7 pt-7 pb-5" style={{ borderBottom: `1px solid ${OFFWHITE}08` }}>
        <p className="font-display font-bold text-[10px] uppercase tracking-[.18em] mb-2" style={{ color: MUTED }}>
          Sua estimativa de comissão / mês
        </p>

        {/* BIG earning number */}
        <p
          className="font-display font-black leading-none"
          style={{ fontSize: "clamp(3.5rem, 6vw, 5rem)", color: GREEN_LT, letterSpacing: "-0.02em" }}
        >
          {fmtBRL(earn)}
        </p>
        <p className="text-sm mt-1" style={{ color: MUTED }}>
          com{" "}
          <strong className="font-bold" style={{ color: OFFWHITE }}>{refs}</strong>{" "}
          indicações convertidas por mês
        </p>
      </div>

      {/* Slider */}
      <div className="px-7 py-5">
        <div className="flex justify-between text-xs mb-3" style={{ color: MUTED }}>
          <span>Indicações / mês</span>
          <span className="font-bold tabular-nums" style={{ color: OFFWHITE }}>{refs}</span>
        </div>

        {/* Custom track */}
        <div
          ref={trackRef}
          className="relative h-2 rounded-full cursor-pointer select-none"
          style={{ background: `${OFFWHITE}15` }}
          onClick={handleTrackClick}
        >
          {/* Fill */}
          <div
            className="absolute left-0 top-0 h-2 rounded-full"
            style={{ width: `${pct}%`, background: `linear-gradient(to right, ${GOLD}, ${GOLD_LIGHT})` }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-lg"
            style={{
              left: `calc(${pct}% - 10px)`,
              background: GOLD,
              border: `2px solid ${NAVY_DEEP}`,
              boxShadow: `0 0 0 4px ${GOLD}35`,
              pointerEvents: "none",
            }}
          />
          {/* Invisible native input for keyboard + drag */}
          <input
            type="range" min={1} max={30} value={refs}
            onChange={e => setRefs(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            style={{ margin: 0 }}
          />
        </div>

        <div className="flex justify-between text-[10px] mt-1.5" style={{ color: `${MUTED}80` }}>
          <span>1</span><span>30 indicações</span>
        </div>
      </div>

      {/* Breakdown grid */}
      <div className="grid grid-cols-2 gap-px mx-7 mb-5 rounded-xl overflow-hidden"
        style={{ border: `1px solid ${OFFWHITE}10` }}
      >
        {[
          { lbl: "Ticket médio", val: `R$ ${TICKET.toLocaleString("pt-BR")}` },
          { lbl: "Sua comissão", val: `${(COMMISSION * 100).toFixed(0)}%` },
          { lbl: "Taxa de conversão", val: `~${(CONVERSION * 100).toFixed(0)}%` },
          { lbl: "Estimativa mensal", val: fmtBRL(earn), green: true },
        ].map(({ lbl, val, green }) => (
          <div key={lbl} className="p-4" style={{ background: `${OFFWHITE}05` }}>
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: MUTED }}>{lbl}</p>
            <p className="font-display font-bold text-sm" style={{ color: green ? GREEN_LT : OFFWHITE }}>{val}</p>
          </div>
        ))}
      </div>

      {/* CTA inside widget */}
      <div className="px-7 pb-7">
        <a
          href="#cadastro"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wide transition-all hover:opacity-90"
          style={{ background: GOLD, color: NAVY_DEEP }}
        >
          Quero ganhar isso <IcArrow />
        </a>
      </div>
    </div>
  );
}


/* ════════════════════════════════════
   PARA QUEM É
   ════════════════════════════════════ */
const PERSONAS = [
  { icon: <IcFile />, title: "Despachantes", desc: "Você já lida com documentação de veículos. Seus clientes têm multas, só faltava monetizar isso." },
  { icon: <IcUsers />, title: "Gestores de RH e Frotas", desc: "Empresas com frota acumulam multas constantemente. Você tem acesso a esses decisores, é só indicar." },
  { icon: <IcMonitor />, title: "Contadores e Assessores", desc: "Quem cuida das finanças de empresas tem acesso direto a transportadoras, frotas e autônomos." },
  { icon: <IcShield />, title: "Advogados", desc: "Amplie seu portfólio sem precisar atuar na área. Indique, acompanhe o resultado e receba." },
  { icon: <IcStar />, title: "Corretores e Seguradoras", desc: "Seguro e multa andam juntos. Ofereça mais uma solução e diferencie sua carteira." },
  { icon: <IcPlusC />, title: "Qualquer pessoa com rede", desc: "Grupos de WhatsApp, vizinhos, colegas. Se você conhece quem tem multa, já tem tudo que precisa.", featured: true },
];

function ParaQuem() {
  const { ref, inView } = useInView();
  return (
    <section id="para-quem" className="py-24" style={{ background: NAVY }}>
      <div className="container mx-auto px-4">
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-display font-bold text-[11px] uppercase tracking-[.18em] block mb-3" style={{ color: GOLD }}>Para quem é</span>
          <h2 className="font-display font-black leading-tight mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", color: OFFWHITE }}>
            Você tem uma rede?<br />
            Então tem uma <em className="not-italic" style={{ color: GOLD }}>fonte de receita.</em>
          </h2>
          <p className="text-base leading-relaxed max-w-lg" style={{ color: MUTED }}>
            O programa é para quem já tem contato com motoristas, empresas ou profissionais
            que acumulam multas, e quer transformar isso em comissão sem mudar o que já faz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PERSONAS.map((p, i) => <PersonaCard key={p.title} {...p} delay={i * 80} />)}
        </div>
      </div>
    </section>
  );
}

function PersonaCard({ icon, title, desc, featured, delay }: typeof PERSONAS[0] & { delay: number }) {
  const { ref, inView } = useInView();
  const [hover, setHover] = useState(false);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`rounded-2xl p-6 transition-all duration-700 cursor-default ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{
        transitionDelay: `${delay}ms`,
        background: hover || featured ? `${GOLD}07` : `${OFFWHITE}04`,
        border: `1px solid ${hover || featured ? GOLD + "40" : OFFWHITE + "10"}`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-center justify-center w-11 h-11 rounded-xl mb-4"
        style={{ background: `${GOLD}18`, color: GOLD }}>
        {icon}
      </div>
      <h3 className="font-display font-bold text-base mb-2" style={{ color: OFFWHITE }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{desc}</p>
    </div>
  );
}

/* ════════════════════════════════════
   STATS
   ════════════════════════════════════ */
const STATS = [
  { value: 7, suffix: "K+", label: "multas deferidas no banco da Help", green: true },
  { value: 100, suffix: "K+", label: "motoristas atendidos em todo o Brasil" },
  { value: 80, suffix: "+", label: "franqueados ativos em 27 estados" },
  { value: 10, suffix: "+", label: "anos de experiência no mercado" },
];

function Numeros() {
  const { ref, inView } = useInView();
  return (
    <section id="numeros" className="py-24 relative overflow-hidden" style={{ background: NAVY_DEEP }}>
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full"
        style={{ background: `radial-gradient(ellipse, ${GOLD}08 0%, transparent 70%)` }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-display font-bold text-[11px] uppercase tracking-[.18em] block mb-3" style={{ color: GOLD }}>Números Help Multas</span>
          <h2 className="font-display font-black leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", color: OFFWHITE }}>
            Você indica para quem já tem{" "}
            <em className="not-italic" style={{ color: GOLD }}>resultado comprovado.</em>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => <StatCard key={s.label} {...s} delay={i * 100} />)}
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, suffix, label, green, delay }: typeof STATS[0] & { delay: number }) {
  const { ref, inView } = useInView();
  const count = useCounter(value, 1600, inView);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={`text-center py-8 px-4 rounded-2xl transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms`, background: `${OFFWHITE}04`, border: `1px solid ${OFFWHITE}08`, borderTop: `2px solid ${green ? GREEN : GOLD}55` }}>
      <span className="block font-display font-black leading-none mb-2"
        style={{ fontSize: "clamp(3rem, 5.5vw, 5rem)", color: green ? GREEN_LT : GOLD }}>
        {count}{suffix}
      </span>
      <p className="text-sm leading-snug" style={{ color: MUTED }}>{label}</p>
    </div>
  );
}

/* ════════════════════════════════════
   BANCO DE MULTAS + FEATURES
   ════════════════════════════════════ */
const BARS = [
  { label: "Excesso de velocidade", pct: 38 },
  { label: "Frota corporativa", pct: 27 },
  { label: "Suspensão de CNH", pct: 18 },
  { label: "Demais infrações", pct: 17 },
];

function BancoMultas() {
  const { ref: lRef, inView: lIn } = useInView(0.2);
  const { ref: rRef, inView: rIn } = useInView(0.2);
  return (
    <section id="banco" className="py-24" style={{ background: NAVY }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Card */}
          <div ref={lRef as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-700 ${lIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="rounded-2xl p-8 relative overflow-hidden"
              style={{ background: NAVY_DEEP, border: `1px solid ${GREEN}30` }}>
              <div className="pointer-events-none absolute inset-0"
                style={{ background: `radial-gradient(ellipse at 50% -5%, ${GREEN}10 0%, transparent 60%)` }}
              />
              <p className="font-display font-black leading-none relative z-10"
                style={{ fontSize: "clamp(4rem, 8vw, 6.5rem)", color: GREEN_LT }}>
                7.752
              </p>
              <p className="text-sm mb-8 relative z-10" style={{ color: MUTED }}>multas deferidas pela Help Multas</p>
              <div className="flex flex-col gap-4 relative z-10">
                {BARS.map(b => (
                  <div key={b.label} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs" style={{ color: MUTED }}>
                      <span>{b.label}</span>
                      <span className="font-bold" style={{ color: GREEN_LT }}>{b.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${OFFWHITE}10` }}>
                      <div className="h-full rounded-full transition-all duration-[1400ms] ease-out"
                        style={{ width: lIn ? `${b.pct}%` : "0%", background: `linear-gradient(to right, ${GREEN}, ${GREEN_LT})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text */}
          <div ref={rRef as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-700 delay-150 ${rIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="font-display font-bold text-[11px] uppercase tracking-[.18em] block mb-3" style={{ color: GOLD }}>
              Por que isso importa para você
            </span>
            <h2 className="font-display font-black leading-tight mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", color: OFFWHITE }}>
              O argumento que<br />fecha a <em className="not-italic" style={{ color: GOLD }}>indicação.</em>
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: MUTED }}>
              Quando um cliente em dúvida pergunta "mas funciona mesmo?",
              você tem dados reais para mostrar. Mais de 7 mil multas deferidas
              é um histórico que convence, e que faz sua indicação chegar com credibilidade.
            </p>
            <div className="flex flex-col gap-5">
              {[
                { title: "Argumentação técnica comprovada", desc: "Cada caso deferido documentado com fundamento jurídico e técnico que gerou o cancelamento." },
                { title: "Atuação em todo o Brasil", desc: "DETRAN, DER, SENATRAN. A Help conhece cada órgão autuador e o canal certo para recurso." },
                { title: "Nova receita sem investimento", desc: "Sem curso, sem formação específica, sem custo. Só você, sua rede e a Help Multas." },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-3 items-start">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 mt-0.5"
                    style={{ background: `${GREEN}20`, border: `1px solid ${GREEN}40`, color: GREEN_LT }}>
                    <IcCheck />
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm mb-1" style={{ color: OFFWHITE }}>{title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════
   DEFERIDOS — carrossel com 6 por slide
   ════════════════════════════════════ */

const DEFERIDOS_IMGS: string[] = [
  "/image/deferidos/d1 (1).png",
  "/image/deferidos/d1 (2).png",
  "/image/deferidos/d1 (3).png",
  "/image/deferidos/d1 (4).png",
  "/image/deferidos/d1 (5).png",
  "/image/deferidos/d1 (6).png",
  "/image/deferidos/d1 (7).png",
  "/image/deferidos/d1 (8).png",
  "/image/deferidos/d1 (9).png",
  "/image/deferidos/d1 (10).png",
  "/image/deferidos/d1 (11).png",
  "/image/deferidos/d1 (12).png",
  "/image/deferidos/d1 (13).png",
  "/image/deferidos/d1 (14).png",
  "/image/deferidos/d1 (15).png",
  "/image/deferidos/d1 (16).png",
  "/image/deferidos/d1 (17).png",
  "/image/deferidos/d1 (18).png",
  "/image/deferidos/d1 (19).png",
  "/image/deferidos/d1 (20).png",
  "/image/deferidos/d1 (21).png",
  "/image/deferidos/d1 (22).png",
  "/image/deferidos/d1 (23).png",
  "/image/deferidos/d1 (24).png",
  "/image/deferidos/d1 (25).png",
  "/image/deferidos/d1 (26).png",
  "/image/deferidos/d1 (27).png",
  "/image/deferidos/d1 (28).png",
];

const PLACEHOLDER_COUNT = 18;

function Deferidos() {
  const { ref, inView } = useInView();
  const [slide, setSlide] = useState(0);

  const images = DEFERIDOS_IMGS.length > 0
    ? DEFERIDOS_IMGS
    : Array(PLACEHOLDER_COUNT).fill(null);

  const itemsPerSlide = 6;
  const totalSlides = Math.ceil(images.length / itemsPerSlide);
  const currentSlideImages = images.slice(slide * itemsPerSlide, (slide + 1) * itemsPerSlide);

  function nextSlide() {
    if (slide < totalSlides - 1) setSlide(slide + 1);
  }
  function prevSlide() {
    if (slide > 0) setSlide(slide - 1);
  }

  return (
    <section id="deferidos" className="py-24 relative overflow-hidden" style={{ background: NAVY_DEEP }}>
      {/* Diagonal gold rule */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${GOLD}40, transparent)` }}
      />

      <div className="container mx-auto px-4">
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-display font-bold text-[11px] uppercase tracking-[.18em] block mb-3" style={{ color: GOLD }}>
            Casos reais
          </span>
          <h2 className="font-display font-black leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", color: OFFWHITE }}>
            Multas canceladas.<br />
            <em className="not-italic" style={{ color: GREEN_LT }}>Resultados de verdade.</em>
          </h2>
          <p className="text-base leading-relaxed max-w-lg mx-auto" style={{ color: MUTED }}>
            Cada arte abaixo representa um caso real de multa cancelada ou reduzida pela Help Multas.
            Esses são os resultados que você vai apresentar quando indicar.
          </p>
        </div>

        {/* Carousel container */}
        <div className="relative">
          {/* Grid static — só mostra 6 items do slide atual */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 transition-all duration-500">
            {currentSlideImages.map((src, i) => (
              <DeferidoCardCarousel key={`${slide}-${i}`} src={src} index={slide * itemsPerSlide + i} inView={inView} />
            ))}
          </div>

          {/* Prev button */}
          {totalSlides > 1 && (
            <button
              onClick={prevSlide}
              disabled={slide === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 sm:-translate-x-16 md:-translate-x-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: GOLD,
                color: NAVY_DEEP,
              }}
              aria-label="Slide anterior"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {totalSlides > 1 && (
            <button
              onClick={nextSlide}
              disabled={slide === totalSlides - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 sm:translate-x-16 md:translate-x-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: GOLD,
                color: NAVY_DEEP,
              }}
              aria-label="Próximo slide"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>

        {/* Slide indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className="h-2 rounded-full transition-all"
                style={{
                  width: slide === i ? "32px" : "8px",
                  background: slide === i ? GOLD : `${OFFWHITE}30`,
                }}
                aria-label={`Ir para página ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <a
            href="#cadastro"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-wide transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: GOLD, color: NAVY_DEEP }}
          >
            Quero fazer parte disso <IcArrow />
          </a>
        </div>
      </div>
    </section>
  );
}

function DeferidoCardCarousel({ src, index, inView }: { src: string | null; index: number; inView: boolean }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`rounded-2xl overflow-hidden aspect-square transition-all duration-700`}
      style={{
        opacity: inView ? 1 : 0.6,
        border: `1px solid ${hover ? GOLD + "50" : OFFWHITE + "10"}`,
        transform: hover ? "scale(1.03)" : "scale(1)",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {src ? (
        <img src={src} alt={`Multa deferida ${index + 1}`} className="w-full h-full object-cover" />
      ) : (
        /* Placeholder */
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3 p-4"
          style={{ background: `${NAVY}CC` }}
        >
          <div style={{ color: `${GOLD}60` }}>
            <IcTrophy c="w-10 h-10" />
          </div>
          <p className="font-display font-bold text-xs uppercase tracking-wider text-center" style={{ color: `${MUTED}80` }}>
            Arte {index + 1}
          </p>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════
   COMO FUNCIONA
   ════════════════════════════════════ */
const STEPS = [
  { n: "1", title: "Cadastre-se grátis", desc: "Crie sua conta no programa de parceiros em menos de 2 minutos. Sem taxa, sem mensalidade.", icon: <IcTrophy /> },
  { n: "2", title: "Faça a indicação", desc: "Compartilhe com quem tem multa. Cada indicado fica vinculado ao seu perfil, rastreável.", icon: <IcUsers /> },
  { n: "3", title: "Receba a comissão", desc: "Quando o recurso for ganho, você recebe. Sem burocracia, sem surpresas.", icon: <IcDollar /> },
];

function ComoFunciona() {
  const { ref, inView } = useInView();
  return (
    <section id="como" className="py-24" style={{ background: NAVY }}>
      <div className="container mx-auto px-4">
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-display font-bold text-[11px] uppercase tracking-[.18em] block mb-3" style={{ color: GOLD }}>Como funciona</span>
          <h2 className="font-display font-black leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", color: OFFWHITE }}>
            Três passos.{" "}<em className="not-italic" style={{ color: GOLD }}>Uma nova receita.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[22%] right-[22%] h-px"
            style={{ background: `linear-gradient(to right, ${GOLD}, ${GOLD}20)` }}
          />
          {STEPS.map((s, i) => (
            <div key={s.n}
              className={`text-center p-8 rounded-2xl transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 120}ms`, background: `${OFFWHITE}04`, border: `1px solid ${OFFWHITE}08` }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 relative z-10 font-display font-black text-2xl"
                style={{ background: NAVY, border: `2px solid ${GOLD}`, color: GOLD }}>
                {s.n}
              </div>
              <h3 className="font-display font-bold text-base mb-3" style={{ color: OFFWHITE }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════
   FORMULÁRIO CTA
   ════════════════════════════════════ */
const AREAS = [
  "Despachante",
  "Contador / Assessor fiscal",
  "Advogado",
  "Corretor / Segurador",
  "Gestor de RH / Frotas",
  "Autônomo / Motorista",
  "Outro",
];

function FormSection() {
  const { ref, inView } = useInView();
  const [nome, setNome] = useState("");
  const [wpp, setWpp] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!nome || !wpp || !area) {
    setError("Preencha nome, WhatsApp e área de atuação.");
    return;
  }

  setSending(true);
  setError("");

  try {
    const response = await fetch("https://n8n.helpmultas.com/webhook/lp-parceiro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origem: "Landing Page Help Indica",
        nome,
        email,
        whatsapp: wpp,
        area,
        enviadoEm: new Date().toISOString(),
      }),
    });
    if (!response.ok) {
      throw new Error("Erro no webhook");
    }
    window.location.href = "/obrigado";
  } catch {
    setError("Erro ao enviar. Tente novamente.");
    setSending(false);
  }
}

  const iStyle = {
    background: OFFWHITE,
    border: `1px solid ${OFFWHITE}40`,
    color: NAVY_DEEP,
    borderRadius: "12px",
    padding: "0.8rem 1rem",
    width: "100%",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
  } as React.CSSProperties;

  return (
    <section id="cadastro" className="py-24 relative overflow-hidden" style={{ background: NAVY_DEEP }}>
      {/* Gold glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
        style={{ background: `radial-gradient(ellipse, ${GOLD}09 0%, transparent 70%)` }}
      />
      {/* Background image overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('/image/fundo.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.04,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div ref={ref as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="font-display font-bold text-[11px] uppercase tracking-[.18em] block mb-3" style={{ color: GOLD }}>
              Quero ser parceiro
            </span>
            <h2 className="font-display font-black leading-tight mb-6"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)", color: OFFWHITE }}>
              Comece agora.<br />
              <em className="not-italic" style={{ color: GOLD }}>Sem custo,<br />sem risco.</em>
            </h2>
            <p className="text-base leading-relaxed mb-10" style={{ color: MUTED }}>
              Preencha o formulário ao lado e nossa equipe entra em contato
              para apresentar todos os detalhes e liberar seu acesso ao programa.
            </p>

            {/* Mini trust cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <IcTrophy c="w-5 h-5" />, title: "Histórico real", sub: "7K+ multas deferidas" },
                { icon: <IcTrend c="w-5 h-5" />, title: "Resultado comprovado", sub: "10+ anos de mercado" },
                { icon: <IcDollar c="w-5 h-5" />, title: "Comissão garantida", sub: "Pago a cada caso ganho" },
              ].map(({ icon, title, sub }) => (
                <div key={title} className="rounded-xl p-4"
                  style={{ background: `${OFFWHITE}05`, border: `1px solid ${OFFWHITE}0A` }}>
                  <div className="mb-2" style={{ color: GOLD }}>{icon}</div>
                  <p className="font-display font-bold text-xs mb-0.5" style={{ color: OFFWHITE }}>{title}</p>
                  <p className="text-[11px]" style={{ color: MUTED }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className={`transition-all duration-700 delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="rounded-2xl p-8"
              style={{ background: NAVY, border: `1px solid ${GOLD}2A` }}>

              <div className="h-1 rounded-full mb-7 -mt-1 -mx-1"
                style={{ background: `linear-gradient(to right, ${GOLD}, ${GREEN})` }}
              />

              <h3 className="font-display font-black text-xl mb-1" style={{ color: OFFWHITE }}>Cadastro gratuito</h3>
              <p className="text-sm mb-6" style={{ color: MUTED }}>Nossa equipe entra em contato em até 24 horas.</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {[
                  { label: "Nome completo", value: nome, set: setNome, type: "text", ph: "Seu nome" },
                  { label: "WhatsApp", value: wpp, set: (v: string) => setWpp(fmtWpp(v)), type: "tel", ph: "(00) 00000-0000" },
                  { label: "E-mail", value: email, set: setEmail, type: "email", ph: "seu@email.com" },
                ].map(({ label, value, set, type, ph }) => (
                  <div key={label}>
                    <label className="block font-display font-bold text-[10px] uppercase tracking-wider mb-1.5" style={{ color: MUTED }}>{label}</label>
                    <input
                      type={type} value={value} placeholder={ph}
                      onChange={e => set(e.target.value)}
                      style={iStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = `${GOLD}90`)}
                      onBlur={e => (e.currentTarget.style.borderColor = `${OFFWHITE}40`)}
                    />
                  </div>
                ))}

                <div>
                  <label className="block font-display font-bold text-[10px] uppercase tracking-wider mb-1.5" style={{ color: MUTED }}>Área de atuação</label>
                  <select
                    value={area} onChange={e => setArea(e.target.value)}
                    style={{ ...iStyle, appearance: "none", cursor: "pointer" } as React.CSSProperties}
                    onFocus={e => (e.currentTarget.style.borderColor = `${GOLD}90`)}
                    onBlur={e => (e.currentTarget.style.borderColor = `${OFFWHITE}40`)}
                  >
                    <option value="" disabled>Selecione...</option>
                    {AREAS.map(a => <option key={a} value={a} style={{ background: "#ffffff" }}>{a}</option>)}
                  </select>
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <button
                  type="submit" disabled={sending}
                  className="w-full py-4 rounded-xl font-display font-black text-sm uppercase tracking-wider transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 mt-1"
                  style={{ background: GOLD, color: NAVY_DEEP }}
                >
                  {sending ? "Enviando..." : "Quero ser parceiro Help Indica →"}
                </button>

                <p className="text-[11px] text-center leading-relaxed" style={{ color: `${MUTED}90` }}>
                  Cadastro gratuito · Sem mensalidade · Sem metas obrigatórias
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════
   FOOTER
   ════════════════════════════════════ */
function IndicaFooter() {
  return (
    <footer className="py-8 text-center"
      style={{ background: "oklch(0.12 0.025 258)", borderTop: `1px solid ${OFFWHITE}08` }}>
      <img src="/image/logotipo.png" alt="Help Multas" className="h-8 w-auto mx-auto mb-3 opacity-70" />
      <p className="text-xs" style={{ color: `${MUTED}80` }}>
        © 2025 Help Multas · Programa de Parceiros · Todos os direitos reservados.
      </p>
    </footer>
  );
}

/* ════════════════════════════════════
   PAGE ROOT
   ════════════════════════════════════ */
export default function IndicaLP() {
  return (
    <div style={{ background: NAVY_DEEP, color: OFFWHITE }}>
      <IndicaNav />
      <Hero />
      <Ticker />
      <ParaQuem />
      <Numeros />
      <BancoMultas />
      <Deferidos />
      <ComoFunciona />
      <FormSection />
      <IndicaFooter />
    </div>
  );
}
