import { useState, useEffect, useRef } from "react";
import { useInView, useCounter } from "../hooks/useInView";
import { useScrollTracker } from "../hooks/useScrollTracker";

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
   NAV
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
      <div className="w-full px-4 max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between h-16 gap-4">

          <a href="#inicio" className="flex-shrink-0 min-w-0">
            <img src="/image/logotipo.png" alt="Help Multas" className="h-7 md:h-10 w-auto" />
          </a>

          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {[
              ["Para quem é", "#para-quem"],
              ["Como funciona", "#como"],
              ["Resultados", "#numeros"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm hover:text-yellow-400 transition-colors whitespace-nowrap"
                style={{ color: `${OFFWHITE}90` }}
              >
                {label}
              </a>
            ))}
          </div>

          <a
            href="#cadastro"
            className="flex-shrink-0 px-3 py-2 md:px-5 md:py-2.5 rounded-lg font-bold uppercase whitespace-nowrap"
            style={{ background: GOLD, color: NAVY_DEEP, fontSize: "clamp(9px, 2.2vw, 12px)" }}
          >
            <span className="sm:hidden">Parceiro</span>
            <span className="hidden sm:inline">Quero ser parceiro</span>
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
   HERO
   ════════════════════════════════════ */
function Hero() {
  const [refs, setRefs] = useState(7);
  const earn = calcEarn(refs);
  const pct = Math.round(((refs - 1) / 29) * 100);

  return (
    <section
      id="inicio"
      data-section="hero"
      className="relative min-h-screen flex flex-col"
      style={{ background: NAVY_DEEP }}
    >
      <div className="absolute inset-0"
        style={{
          backgroundImage: `url('/image/fundo.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: 0.12,
        }}
      />
      <div className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${NAVY_DEEP}EE 0%, ${NAVY_DEEP}88 50%, ${NAVY_DEEP}CC 100%)`,
        }}
      />
      <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px]"
        style={{ background: `radial-gradient(ellipse at 80% 10%, ${GOLD}12 0%, transparent 65%)` }}
      />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[500px] h-[500px]"
        style={{ background: `radial-gradient(ellipse at 10% 90%, ${GREEN}0D 0%, transparent 65%)` }}
      />

      <div className="relative z-10 container mx-auto px-4 flex-1 flex items-center pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

          {/* Copy */}
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

            <div className="flex flex-wrap items-center gap-4">
              {["Cadastro gratuito", "Sem mensalidade", "Sem metas"].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Earnings widget */}
          <EarningsWidget refs={refs} setRefs={setRefs} earn={earn} pct={pct} />
        </div>
      </div>
    </section>
  );
}

/* ── Earnings Widget ── */
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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(to right, transparent, ${GREEN}70, transparent)` }}
      />

      <div className="px-6 pt-6 pb-5 sm:px-7 sm:pt-7" style={{ borderBottom: `1px solid ${OFFWHITE}08` }}>
        <p className="font-display font-bold text-[10px] uppercase tracking-[.18em] mb-2" style={{ color: MUTED }}>
          Sua estimativa de comissão / mês
        </p>
        <p
          className="font-display font-black leading-none"
          style={{ fontSize: "clamp(3rem, 6vw, 5rem)", color: GREEN_LT, letterSpacing: "-0.02em" }}
        >
          {fmtBRL(earn)}
        </p>
        <p className="text-sm mt-1" style={{ color: MUTED }}>
          com{" "}
          <strong className="font-bold" style={{ color: OFFWHITE }}>{refs}</strong>{" "}
          indicações convertidas por mês
        </p>
      </div>

      <div className="px-6 py-5 sm:px-7">
        <div className="flex justify-between text-xs mb-3" style={{ color: MUTED }}>
          <span>Indicações / mês</span>
          <span className="font-bold tabular-nums" style={{ color: OFFWHITE }}>{refs}</span>
        </div>

        <div
          ref={trackRef}
          className="relative h-2 rounded-full cursor-pointer select-none"
          style={{ background: `${OFFWHITE}15` }}
          onClick={handleTrackClick}
        >
          <div
            className="absolute left-0 top-0 h-2 rounded-full"
            style={{ width: `${pct}%`, background: `linear-gradient(to right, ${GOLD}, ${GOLD_LIGHT})` }}
          />
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

      <div className="grid grid-cols-2 gap-px mx-6 mb-5 sm:mx-7 rounded-xl overflow-hidden"
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

      <div className="px-6 pb-6 sm:px-7 sm:pb-7">
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
    <section id="para-quem" data-section="para-quem" className="py-20 md:py-24" style={{ background: NAVY }}>
      <div className="container mx-auto px-4">
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`mb-12 md:mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
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
   STATS — sem comparação 7K vs 100K
   ════════════════════════════════════ */
const STATS = [
  { value: 100, suffix: "K+", label: "motoristas atendidos em todo o Brasil", gold: true },
  { value: 80, suffix: "+", label: "franqueados ativos em todo o país" },
  { value: 27, suffix: "", label: "estados com atuação ativa", green: true },
  { value: 10, suffix: "+", label: "anos de experiência no mercado" },
];

function Numeros() {
  const { ref, inView } = useInView();
  return (
    <section id="numeros" data-section="numeros" className="py-20 md:py-24 relative overflow-hidden" style={{ background: NAVY_DEEP }}>
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full"
        style={{ background: `radial-gradient(ellipse, ${GOLD}08 0%, transparent 70%)` }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
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

function StatCard({ value, suffix, label, green, gold, delay }: typeof STATS[0] & { delay: number; gold?: boolean }) {
  const { ref, inView } = useInView();
  const count = useCounter(value, 1600, inView);
  const accentColor = green ? GREEN : gold ? GOLD : GOLD;
  const textColor = green ? GREEN_LT : gold ? GOLD : GOLD;
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={`text-center py-8 px-4 rounded-2xl transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms`, background: `${OFFWHITE}04`, border: `1px solid ${OFFWHITE}08`, borderTop: `2px solid ${accentColor}55` }}>
      <span className="block font-display font-black leading-none mb-2"
        style={{ fontSize: "clamp(3rem, 5.5vw, 5rem)", color: textColor }}>
        {count}{suffix}
      </span>
      <p className="text-sm leading-snug" style={{ color: MUTED }}>{label}</p>
    </div>
  );
}

/* ════════════════════════════════════
   CREDIBILIDADE + FEATURES
   ════════════════════════════════════ */

function BancoMultas() {
  const { ref: lRef, inView: lIn } = useInView(0.2);
  const { ref: rRef, inView: rIn } = useInView(0.2);
  return (
    <section id="banco" data-section="banco" className="py-20 md:py-24" style={{ background: NAVY }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Card — credibilidade */}
          <div ref={lRef as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-700 ${lIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
              style={{ background: NAVY_DEEP, border: `1px solid ${GOLD}28` }}>

              {/* Gradient top accent */}
              <div className="h-1 rounded-full mb-8 -mt-2 -mx-2"
                style={{ background: `linear-gradient(to right, ${GOLD}, ${GREEN})` }}
              />
              {/* Glow */}
              <div className="pointer-events-none absolute top-0 right-0 w-64 h-64"
                style={{ background: `radial-gradient(ellipse at 90% 10%, ${GOLD}09 0%, transparent 65%)` }}
              />

              {/* Big stat */}
              <div className="relative z-10 mb-7">
                <p className="font-display font-black leading-none"
                  style={{ fontSize: "clamp(3.5rem, 7vw, 5.5rem)", color: GOLD }}>
                  10<span style={{ fontSize: "60%", color: `${GOLD}BB` }}>+ anos</span>
                </p>
                <p className="text-sm mt-1" style={{ color: MUTED }}>
                  defendendo motoristas em todo o Brasil
                </p>
              </div>

              {/* Divider */}
              <div className="h-px mb-6 relative z-10" style={{ background: `${OFFWHITE}10` }} />

              {/* Órgãos */}
              <div className="relative z-10 mb-7">
                <p className="font-display font-bold text-[10px] uppercase tracking-[.18em] mb-3"
                  style={{ color: `${MUTED}90` }}>
                  Atuação direta em
                </p>
                <div className="flex flex-wrap gap-2">
                  {["DETRAN", "DER", "SENATRAN", "CONTRAN", "PRF"].map(org => (
                    <span key={org}
                      className="px-3 py-1.5 rounded-lg font-display font-bold text-xs"
                      style={{ background: `${GOLD}12`, color: GOLD, border: `1px solid ${GOLD}28` }}>
                      {org}
                    </span>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px mb-6 relative z-10" style={{ background: `${OFFWHITE}10` }} />

              {/* Tipos de infração */}
              <div className="relative z-10">
                <p className="font-display font-bold text-[10px] uppercase tracking-[.18em] mb-4"
                  style={{ color: `${MUTED}90` }}>
                  Tipos de infração que atuamos
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    "Multa por radar",
                    "Suspensão de CNH",
                    "Excesso de velocidade",
                    "Frota corporativa",
                    "Infração por pontuação",
                    "Licenciamento e documentação",
                  ].map(tipo => (
                    <div key={tipo} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: GREEN_LT }} />
                      <span className="text-sm" style={{ color: `${OFFWHITE}85` }}>{tipo}</span>
                    </div>
                  ))}
                </div>
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
              Quando alguém hesita com o "mas funciona mesmo?",
              você tem documentação real para mostrar. Cada número representa
              um recurso fundamentado, trabalhado e ganho — e isso é o que
              faz sua indicação chegar com credibilidade.
            </p>
            <div className="flex flex-col gap-5">
              {[
                { title: "Histórico documentado por tipo de infração", desc: "Cada caso com fundamento jurídico e técnico rastreável. Você indica com embasamento, não com promessa." },
                { title: "Atuação em todo o Brasil", desc: "DETRAN, DER, SENATRAN. A Help conhece cada órgão autuador e o canal certo para o recurso." },
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
   DEFERIDOS — carrossel 6 por slide
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

  const nextSlide = () => { if (slide < totalSlides - 1) setSlide(slide + 1); };
  const prevSlide = () => { if (slide > 0) setSlide(slide - 1); };

  return (
    <section id="deferidos" data-section="deferidos" className="py-20 md:py-24 relative overflow-hidden" style={{ background: NAVY_DEEP }}>
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

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 transition-all duration-500">
          {currentSlideImages.map((src, i) => (
            <DeferidoCardCarousel key={`${slide}-${i}`} src={src} index={slide * itemsPerSlide + i} inView={inView} />
          ))}
        </div>

        {/* Navigation — botões junto com dots, sem overflow */}
        {totalSlides > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              onClick={prevSlide}
              disabled={slide === 0}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
              style={{ background: GOLD, color: NAVY_DEEP }}
              aria-label="Slide anterior"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="flex gap-2">
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

            <button
              onClick={nextSlide}
              disabled={slide === totalSlides - 1}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
              style={{ background: GOLD, color: NAVY_DEEP }}
              aria-label="Próximo slide"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
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
      className="rounded-2xl overflow-hidden aspect-square transition-all duration-300"
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
   DEPOIMENTOS — carrossel de vídeos 9:16
   ════════════════════════════════════ */
const DEPOIMENTOS = [
  { id: "vCb4UsdjnQo", nome: "Cliente Help Multas", cargo: "Multa cancelada" },
  { id: "CBFWYJtLoJY", nome: "Cliente Help Multas", cargo: "CNH suspensa recuperada" },
  { id: "R3VDIyxPUqQ", nome: "Cliente Help Multas", cargo: "Multa cancelada" },
  { id: "pVJdx4Vl_wo", nome: "Cliente Help Multas", cargo: "Recurso deferido" },
  { id: "x7WpYJjcv_g", nome: "Cliente Help Multas", cargo: "Recurso deferido" },
  { id: "peUlKN--nAE", nome: "Cliente Help Multas", cargo: "Multa cancelada" },
  { id: "1BNzKNy2nZc", nome: "Cliente Help Multas", cargo: "Recurso deferido" },
];

function VideoCard({ id, nome, cargo }: typeof DEPOIMENTOS[0]) {
  const embedUrl = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className="flex flex-col gap-3">
      {/* 9:16 iframe container */}
      <div
        className="rounded-2xl overflow-hidden w-full"
        style={{
          aspectRatio: "9/16",
          background: NAVY_DEEP,
          border: `1px solid ${OFFWHITE}12`,
        }}
      >
        <iframe
          src={embedUrl}
          className="w-full h-full"
          title={`Depoimento - ${nome}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          style={{ border: "none", display: "block" }}
        />
      </div>

      {/* Label abaixo */}
      <div className="px-1 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: `${GREEN}20`, border: `1px solid ${GREEN}40` }}>
          <IcCheck c="w-3 h-3" />
        </div>
        <div>
          <p className="font-display font-bold text-sm leading-tight" style={{ color: OFFWHITE }}>{nome}</p>
          <p className="text-xs" style={{ color: MUTED }}>{cargo}</p>
        </div>
      </div>
    </div>
  );
}

function Depoimentos() {
  const { ref, inView } = useInView();
  const containerRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [cardW, setCardW] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const GAP = 16;
  const MAX_CARD_W = 240; // largura máxima: vídeo fica ~427px alto, tamanho de celular

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const totalW = containerRef.current.offsetWidth;
      const w = window.innerWidth;
      const count = w >= 1024 ? 3 : w >= 640 ? 2 : 1;
      const natural = (totalW - (count - 1) * GAP) / count;
      setVisibleCount(count);
      setCardW(Math.min(natural, MAX_CARD_W));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const maxIdx = Math.max(0, DEPOIMENTOS.length - visibleCount);
  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(maxIdx, i + 1));

  return (
    <section id="depoimentos" data-section="depoimentos" className="py-20 md:py-24 relative overflow-hidden" style={{ background: NAVY_DEEP }}>
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${GREEN}40, transparent)` }}
      />
      <div className="pointer-events-none absolute top-1/4 right-0 w-[400px] h-[600px]"
        style={{ background: `radial-gradient(ellipse at 90% 50%, ${GREEN}07 0%, transparent 65%)` }}
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-display font-bold text-[11px] uppercase tracking-[.18em] block mb-3" style={{ color: GOLD }}>
            Depoimentos reais
          </span>
          <h2 className="font-display font-black leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", color: OFFWHITE }}>
            Quem recorreu.<br />
            <em className="not-italic" style={{ color: GREEN_LT }}>Quem ganhou.</em>
          </h2>
          <p className="text-base leading-relaxed max-w-lg mx-auto" style={{ color: MUTED }}>
            Veja o que dizem os motoristas que usaram a Help Multas e tiveram suas multas canceladas.
          </p>
        </div>

        {/* Carousel */}
        <div ref={containerRef} className="w-full">
          {cardW > 0 && (
            <div className="flex justify-center">
              {/* viewport — largura fixa, clippa o conteúdo */}
              <div
                style={{
                  width: `${visibleCount * cardW + (visibleCount - 1) * GAP}px`,
                  overflow: "hidden",
                }}
              >
                {/* track — desliza via transform */}
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    gap: `${GAP}px`,
                    transform: `translateX(-${idx * (cardW + GAP)}px)`,
                  }}
                >
                  {DEPOIMENTOS.map((dep, i) => (
                    <div
                      key={i}
                      style={{ width: cardW, flexShrink: 0 }}
                      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    >
                      <VideoCard {...dep} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            onClick={prev}
            disabled={idx === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: GOLD, color: NAVY_DEEP }}
            aria-label="Anterior"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex gap-2">
            {Array.from({ length: maxIdx + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="h-2 rounded-full transition-all"
                style={{
                  width: idx === i ? "32px" : "8px",
                  background: idx === i ? GOLD : `${OFFWHITE}30`,
                }}
                aria-label={`Ir para ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={idx === maxIdx}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: GOLD, color: NAVY_DEEP }}
            aria-label="Próximo"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* CTA */}
        <div className={`mt-12 text-center transition-all duration-700 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <a
            href="#cadastro"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-wide transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: GREEN, color: "#fff", boxShadow: `0 8px 32px ${GREEN}30` }}
          >
            Quero ser parceiro <IcArrow />
          </a>
        </div>
      </div>
    </section>
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
    <section id="como" data-section="como" className="py-20 md:py-24" style={{ background: NAVY }}>
      <div className="container mx-auto px-4">
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-display font-bold text-[11px] uppercase tracking-[.18em] block mb-3" style={{ color: GOLD }}>Como funciona</span>
          <h2 className="font-display font-black leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", color: OFFWHITE }}>
            Três passos.{" "}<em className="not-italic" style={{ color: GOLD }}>Uma nova receita.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
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
const AREAS_OPTIONS = [
  { value: "Despachante", label: "Despachante" },
  { value: "Contador / Assessor fiscal", label: "Contador / Assessor fiscal" },
  { value: "Advogado", label: "Advogado" },
  { value: "Corretor / Segurador", label: "Corretor / Segurador" },
  { value: "Gestor de RH / Frotas", label: "Gestor de RH / Frotas" },
  { value: "Autônomo / Motorista", label: "Autônomo / Motorista" },
  { value: "Outro", label: "Outro" },
];

const ESTADOS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

/* ─────────────────────────────────────────────────────
   CustomSelect — dropdown reutilizável (mesmo do Hero)
───────────────────────────────────────────────────── */
interface SelectOpt { value: string; label: string }

function CustomSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: SelectOpt[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="flex flex-col gap-[7px]" ref={ref}>
      <span className="text-[oklch(0.1998_0.0403_258.29)] text-[13px] font-bold uppercase tracking-wide">{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`w-full min-h-[50px] border rounded-[14px] px-4 pr-10 text-left text-[15px] outline-none transition-all duration-200 relative
            ${value ? "text-[oklch(0.1998_0.0403_258.29)]" : "text-[#98a2b3]"}
            ${open ? "border-[#D4A017] ring-4 ring-[#D4A017]/20 bg-white" : "border-[#D9E1E8] bg-white"}`}
        >
          {selected?.label || placeholder}
          <span className={`absolute right-4 top-1/2 w-2 h-2 border-r-2 border-b-2 border-[oklch(0.1998_0.0403_258.29)]/50 transition-transform duration-200 ${open ? "-translate-y-1/3 rotate-[225deg]" : "-translate-y-2/3 rotate-45"}`} />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 max-h-56 overflow-y-auto overscroll-contain rounded-[14px] border border-[#D9E1E8] bg-white shadow-[0_18px_34px_rgba(36,55,70,0.16)] p-1.5 flex flex-col gap-0.5"
          >
            <button
              type="button"
              className="w-full text-left px-3 py-2.5 rounded-[10px] text-[#98a2b3] text-[15px] hover:bg-[#edf2f6]"
              onClick={() => { onChange(""); setOpen(false); }}
            >
              {placeholder}
            </button>
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={value === opt.value}
                className={`w-full text-left px-3 py-2.5 rounded-[10px] text-[15px] transition-colors duration-150
                  ${value === opt.value
                    ? "bg-[#D4A017]/15 text-[#D4A017] font-bold"
                    : "text-[oklch(0.1998_0.0403_258.29)] hover:bg-[#edf2f6]"
                  }`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FormSection() {
  const { ref, inView } = useInView();
  const [nome, setNome] = useState("");
  const [wpp, setWpp] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [area, setArea] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // UF dropdown
  const [ufOpen, setUfOpen] = useState(false);
  const ufRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ufRef.current && !ufRef.current.contains(e.target as Node)) setUfOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !wpp || !area) {
      setError("Preencha nome, WhatsApp e área de atuação.");
      return;
    }

    setSending(true);
    setError("");

    // ── event_id para deduplicação Meta (pixel browser + CAPI servidor)
    const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // ── Dispara Lead no pixel do browser COM eventID
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Lead', { content_name: 'Landing Page Parceiro' }, { eventID: eventId });
    }

    const payload = {
      origem: "Landing Page Parceiro",
      nome,
      email,
      whatsapp: wpp,
      cidade,
      estado,
      area,
      enviadoEm: new Date().toISOString(),
      event_id: eventId,
    };

    try {
      // ── N8N
      const n8nRes = await fetch("https://n8n.helpmultas.com/webhook/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!n8nRes.ok) throw new Error("Erro no webhook");

      // ── Web3Forms removido — notificação por e-mail agora via Resend dentro do n8n

      window.location.href = "/sucesso";
    } catch {
      setError("Erro ao enviar. Tente novamente.");
      setSending(false);
    }
  }

  const inputCls =
    "w-full min-h-[50px] border border-[#D9E1E8] rounded-[14px] px-4 bg-white text-[oklch(0.1998_0.0403_258.29)] text-[15px] outline-none placeholder-[#98a2b3] focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/20 transition-all duration-200";

  const labelCls =
    "text-[oklch(0.1998_0.0403_258.29)] text-[13px] font-bold uppercase tracking-wide";

  return (
    <section id="cadastro" data-section="cta-cadastro" className="py-20 md:py-24 relative overflow-hidden" style={{ background: NAVY_DEEP }}>
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
        style={{ background: `radial-gradient(ellipse, ${GOLD}09 0%, transparent 70%)` }}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('/image/fundo.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.04,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

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
            <div className="bg-white rounded-[28px] shadow-[0_32px_70px_rgba(0,0,0,0.45)] border border-[#D4A017]/20 p-6 sm:p-10">

              <div className="mb-6">
                <div className="h-1 rounded-full mb-5" style={{ background: `linear-gradient(to right, ${GOLD}, ${GREEN})` }} />
                <h3 className="font-display font-black text-[26px] text-[oklch(0.1998_0.0403_258.29)] leading-tight mb-2">
                  Cadastro gratuito
                </h3>
                <p className="text-[15px] text-gray-400">Nossa equipe entra em contato em até 24 horas.</p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

                {/* Nome */}
                <div className="flex flex-col gap-[7px]">
                  <label className={labelCls} htmlFor="i-nome">Nome completo</label>
                  <input
                    id="i-nome" type="text" placeholder="Seu nome completo"
                    value={nome} onChange={e => setNome(e.target.value)}
                    className={inputCls}
                  />
                </div>

                {/* WhatsApp + Email lado a lado */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-[7px]">
                    <label className={labelCls} htmlFor="i-wpp">WhatsApp</label>
                    <input
                      id="i-wpp" type="tel" placeholder="(00) 00000-0000"
                      value={wpp} onChange={e => setWpp(fmtWpp(e.target.value))}
                      inputMode="numeric" maxLength={15}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-[7px]">
                    <label className={labelCls} htmlFor="i-email">E-mail</label>
                    <input
                      id="i-email" type="email" placeholder="seu@email.com"
                      value={email} onChange={e => setEmail(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Cidade + UF lado a lado */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-[7px]">
                    <label className={labelCls} htmlFor="i-cidade">Cidade</label>
                    <input
                      id="i-cidade" type="text" placeholder="Sua cidade"
                      value={cidade} onChange={e => setCidade(e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  {/* UF — dropdown customizado */}
                  <div className="flex flex-col gap-[7px]" ref={ufRef}>
                    <span className={labelCls}>Estado</span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setUfOpen((o) => !o)}
                        aria-haspopup="listbox"
                        aria-expanded={ufOpen}
                        className={`w-full min-h-[50px] border rounded-[14px] px-4 pr-10 text-left text-[15px] outline-none transition-all duration-200 relative
                          ${estado ? "text-[oklch(0.1998_0.0403_258.29)]" : "text-[#98a2b3]"}
                          ${ufOpen ? "border-[#D4A017] ring-4 ring-[#D4A017]/20 bg-white" : "border-[#D9E1E8] bg-white"}`}
                      >
                        {estado || "UF"}
                        <span className={`absolute right-4 top-1/2 w-2 h-2 border-r-2 border-b-2 border-[oklch(0.1998_0.0403_258.29)]/50 transition-transform duration-200 ${ufOpen ? "-translate-y-1/3 rotate-[225deg]" : "-translate-y-2/3 rotate-45"}`} />
                      </button>

                      {ufOpen && (
                        <div
                          role="listbox"
                          className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 max-h-56 overflow-y-auto overscroll-contain rounded-[14px] border border-[#D9E1E8] bg-white shadow-[0_18px_34px_rgba(36,55,70,0.16)] p-1.5 flex flex-col gap-0.5"
                        >
                          <button
                            type="button"
                            className="w-full text-left px-3 py-2.5 rounded-[10px] text-[#98a2b3] text-[15px] hover:bg-[#edf2f6]"
                            onClick={() => { setEstado(""); setUfOpen(false); }}
                          >
                            Selecione
                          </button>
                          {ESTADOS.map((uf) => (
                            <button
                              key={uf}
                              type="button"
                              role="option"
                              aria-selected={estado === uf}
                              className={`w-full text-left px-3 py-2.5 rounded-[10px] text-[15px] transition-colors duration-150
                                ${estado === uf
                                  ? "bg-[#D4A017]/15 text-[#D4A017] font-bold"
                                  : "text-[oklch(0.1998_0.0403_258.29)] hover:bg-[#edf2f6]"
                                }`}
                              onClick={() => { setEstado(uf); setUfOpen(false); }}
                            >
                              {uf}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Área de atuação */}
                <CustomSelect
                  label="Área de atuação"
                  placeholder="Selecione sua área"
                  options={AREAS_OPTIONS}
                  value={area}
                  onChange={setArea}
                />

                {error && (
                  <div className="rounded-[14px] px-4 py-3 text-[14px] leading-[1.5] border bg-red-50 text-red-700 border-red-200" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit" disabled={sending}
                  className="w-full min-h-[52px] mt-1 rounded-[14px] font-display font-black text-[15px] uppercase tracking-wide shadow-[0_14px_24px_rgba(212,160,23,0.28)] hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ background: GOLD, color: NAVY_DEEP }}
                >
                  {sending ? "Enviando..." : "Quero ser parceiro →"}
                </button>

                <p className="text-center text-xs text-gray-400">
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
  useScrollTracker({
    webhookUrl: "https://n8n.helprecurso.com.br/webhook/scroll-tracker",
    pageName: "indica",
  });
  return (
    <div style={{ background: NAVY_DEEP, color: OFFWHITE, overflowX: "hidden" }}>
      <IndicaNav />
      <Hero />
      <ComoFunciona />
      <Ticker />
      <ParaQuem />
      <Numeros />
      <BancoMultas />
      <Deferidos />
      <Depoimentos />
      <FormSection />
      <IndicaFooter />
    </div>
  );
}