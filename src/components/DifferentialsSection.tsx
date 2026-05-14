/*
 * DifferentialsSection — Qual é a sua história?
 * Design: Editorial manifesto — linhas numeradas, tipografia bold, contraste forte
 * Fala diretamente com as motivações/dores do comprador de franquia
 */

import { useInView } from "../hooks/useInView";

const BLUE = "oklch(0.1998_0.0403_258.29)";
const GOLD = "oklch(0.8371 0.1715 85.23)";
const GOLD_TEXT = "oklch(0.65 0.14 85)";

const archetypes = [
  {
    num: "01",
    tag: "Independência Financeira",
    quote: "Cansado de trabalhar pra enriquecer os outros.",
    headline: "Quer ganhar de verdade",
    description:
      "Um negócio próprio com modelo validado e resultado comprovado. Sem teto de salário, sem chefe — você decide o tamanho do seu crescimento.",
    stat: "R$ 15–40k",
    statLabel: "faturamento médio mensal",
    accent: GOLD_TEXT,
  },
  {
    num: "02",
    tag: "Crescimento Profissional",
    quote: "Tenho vontade de empreender, mas não sei por onde começar.",
    headline: "Quer evoluir como empresário",
    description:
      "Suporte completo, sistema pronto e uma marca que abre portas. Você aprende fazendo — com quem já construiu isso antes de você.",
    stat: "100%",
    statLabel: "suporte técnico incluso",
    accent: BLUE,
  },
  {
    num: "03",
    tag: "Medo do Mercado",
    quote: "As leis mudam, o mercado some. Não posso perder o que construí.",
    headline: "Seu negócio atual está ameaçado",
    description:
      "Autoescola, despachante, qualquer negócio legado ameaçado por regulamentações. O mercado de multas cresce com cada nova lei — transforme sua expertise em nova vantagem.",
    stat: "+80",
    statLabel: "franquias ativas no Brasil",
    accent: GOLD_TEXT,
    highlight: true,
  },
  {
    num: "04",
    tag: "Novo Começo",
    quote: "Quero recomeçar — mas do jeito certo, sem arriscar no escuro.",
    headline: "Quer uma rota segura para recomeçar",
    description:
      "Modelo validado, estrutura pronta, treinamento completo. Você foca em construir sua carteira de clientes — nós cuidamos de todo o resto.",
    stat: "< 60 dias",
    statLabel: "para estar operacional",
    accent: BLUE,
  },
];

function MotivationRow({
  item,
  index,
}: {
  item: (typeof archetypes)[number];
  index: number;
}) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="group relative"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${index * 120}ms, transform 0.6s ease ${index * 120}ms`,
      }}
      id = "oportunidade"
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-black/10 group-hover:bg-transparent transition-colors duration-300" />

      {/* Hover accent bar */}
      <div
        className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full"
        style={{ background: item.accent }}
      />

      {/* Row content */}
      <div
        className="grid grid-cols-12 gap-6 lg:gap-10 items-center py-10 pl-6 pr-4 transition-colors duration-300"
        style={{
          backgroundColor: item.highlight ? "rgba(25, 45, 90, 0.04)" : "transparent",
        }}
      >
        {/* Number + Tag — col 1-2 */}
        <div className="col-span-12 md:col-span-2 flex md:flex-col items-center md:items-start gap-4 md:gap-2">
          <span
            className="font-data text-6xl lg:text-7xl font-black leading-none select-none"
            style={{ color: item.accent, opacity: 0.85 }}
          >
            {item.num}
          </span>
          <span
            className="font-body text-[10px] font-bold uppercase tracking-[0.15em] leading-tight max-w-[120px]"
            style={{ color: "oklch(0.55 0.02 258)" }}
          >
            {item.tag}
          </span>
        </div>

        {/* Main content — col 3-9 */}
        <div className="col-span-12 md:col-span-7">
          <p
            className="font-body text-lg lg:text-xl italic mb-4 leading-snug"
            style={{ color: "oklch(0.40 0.03 258)" }}
          >
            "{item.quote}"
          </p>
          <h3
            className="font-display text-2xl lg:text-3xl font-black mb-3 leading-tight"
            style={{ color: BLUE }}
          >
            {item.headline}
          </h3>
          <p
            className="font-body text-sm lg:text-base leading-relaxed max-w-xl"
            style={{ color: "oklch(0.50 0.02 250)" }}
          >
            {item.description}
          </p>
        </div>

        {/* Stat — col 10-12 */}
        <div className="col-span-12 md:col-span-3 md:text-right">
          <div className="inline-block md:block bg-white rounded-xl px-5 py-4 shadow-sm border border-black/5 group-hover:shadow-md transition-shadow duration-300">
            <span
              className="font-data text-4xl lg:text-5xl font-black block leading-none mb-1"
              style={{ color: item.accent }}
            >
              {item.stat}
            </span>
            <span
              className="font-body text-[11px] uppercase tracking-widest font-semibold"
              style={{ color: "oklch(0.60 0.02 258)" }}
            >
              {item.statLabel}
            </span>
          </div>
        </div>
      </div>

      {index === archetypes.length - 1 && (
        <div className="h-px bg-black/10" />
      )}
    </div>
  );
}

export default function DifferentialsSection() {
  const { ref: titleRef, inView: titleInView } = useInView();

  return (
    <section id="diferenciais" className="py-24 bg-[oklch(0.96_0.01_75)]">
      <div className="container mx-auto">

        {/* Section header */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`mb-16 transition-all duration-700 ${
            titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="gold-line" />
          <p
            className="font-body font-semibold text-sm uppercase tracking-widest mb-4"
            style={{ color: GOLD_TEXT }}
          >
            Por que a HelpMultas?
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2
              className="font-display text-5xl lg:text-6xl font-black leading-[0.95] max-w-lg"
              style={{ color: BLUE }}
            >
              QUAL É A <br />
              <em className="not-italic" style={{ color: GOLD_TEXT }}>
                SUA HISTÓRIA?
              </em>
            </h2>

            <p
              className="font-body text-base max-w-sm leading-relaxed"
              style={{ color: "oklch(0.50 0.02 250)" }}
            >
              Cada perfil tem um ponto de partida diferente.
              Todos chegam ao mesmo lugar — um negócio próprio,
              escalável e com suporte real.
            </p>
          </div>
        </div>

        {/* Motivation rows */}
        <div className="mb-8">
          {archetypes.map((item, i) => (
            <MotivationRow key={item.num} item={item} index={i} />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Left: dark blue block */}
          <div className="flex-1 p-8 md:p-10" style={{ background: BLUE }}>
            <p
              className="font-body text-xs uppercase tracking-widest font-semibold mb-3"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              Resultado comprovado
            </p>
            <h3 className="font-display text-2xl md:text-3xl font-black text-white leading-tight mb-2">
              Independente da sua história,{" "}
              <span style={{ color: GOLD }}>o modelo funciona.</span>
            </h3>
            <p
              className="font-body text-sm"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              +80 franquias em todo o Brasil — regiões e perfis diferentes, um resultado em comum.
            </p>
          </div>

          {/* Right: gold CTA */}
          <a
            href="#contato"
            className="flex items-center justify-center gap-3 px-10 py-8 md:py-0 font-body font-black text-base uppercase tracking-widest transition-all duration-300 hover:brightness-95 shrink-0"
            style={{
              background: GOLD,
              color: BLUE,
              minWidth: "260px",
            }}
          >
            Quero minha franquia
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 10h12M11 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
