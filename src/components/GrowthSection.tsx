/*
 * GrowthSection — Por que o mercado cresce?
 * Design: Off-white background, 3 fatores principais + gráficos interativos
 * Narrative: Explicar os drivers de crescimento com dados REAIS verificados
 * Fontes: Senatran, PRF, G1, SEGS, CET-SP
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useInView } from "../hooks/useInView";

/* ─── Color tokens ─── */
const COLORS = {
  gold: "oklch(0.8371 0.1715 85.23)",
  goldLight: "oklch(0.8371 0.1715 85.23 / 0.15)",
  navy: "oklch(0.1998 0.0403 258.29)",
  navyMuted: "oklch(0.3274 0.0363 242.96)",
  gridLine: "oklch(0.90 0.005 75)",
  cardBg: "oklch(0.98 0.005 75)",
  cardBgEnd: "oklch(0.95 0.008 75)",
  tooltipBg: "oklch(0.15 0.03 258)",
  tooltipBorder: "oklch(0.8371 0.1715 85.23)",
  white: "#fff",
};

/* ─── Bar colors (gradient feel via distinct fills) ─── */
const BAR_FILLS = [
  COLORS.gold,
  "oklch(0.75 0.14 85.23)",
  "oklch(0.65 0.12 85.23)",
  "oklch(0.55 0.10 85.23)",
];

/* ─── Custom Tooltip ─── */
function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: COLORS.tooltipBg,
        border: `1.5px solid ${COLORS.tooltipBorder}`,
        borderRadius: 10,
        padding: "10px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 11,
          fontWeight: 600,
          color: COLORS.gold,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginBottom: 2,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 800,
          color: COLORS.white,
        }}
      >
        {formatter(payload[0].value)}
      </p>
    </div>
  );
}

/* ─── Custom label on bar chart ─── */
function BarLabel(props: any) {
  const { x, y, width, value } = props;
  const formatted = `${(Number(value) / 1_000_000).toFixed(1).replace(".", ",")}M`;
  return (
    <text
      x={x + width / 2}
      y={y - 10}
      textAnchor="middle"
      fill={COLORS.navy}
      fontSize={14}
      fontWeight={800}
      fontFamily="inherit"
    >
      {formatted}
    </text>
  );
}

/* ─── Custom label on infracoes bar chart ─── */
function InfracoesBarLabel(props: any) {
  const { x, y, width, value } = props;
  return (
    <text
      x={x + width / 2}
      y={y - 10}
      textAnchor="middle"
      fill={COLORS.navy}
      fontSize={15}
      fontWeight={800}
      fontFamily="inherit"
    >
      {value}%
    </text>
  );
}

/* ─── Custom X-axis tick for infracoes bar chart (word-wrap) ─── */
function BarXTick({ x, y, payload }: any) {
  const words: string[] = payload.value.split(" ");
  return (
    <g transform={`translate(${x},${y + 8})`}>
      {words.map((word: string, i: number) => (
        <text
          key={i}
          x={0}
          y={i * 15}
          textAnchor="middle"
          fill={COLORS.navyMuted}
          fontSize={11}
          fontWeight={600}
          fontFamily="inherit"
        >
          {word}
        </text>
      ))}
    </g>
  );
}

/* ─── Growth badge ─── */
function GrowthBadge({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${className}`}
      style={{
        background: COLORS.goldLight,
        color: COLORS.navy,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 1L9 6H1L5 1Z" fill={COLORS.gold} />
      </svg>
      {value}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
 *  MAIN COMPONENT
 * ═══════════════════════════════════════════════════ */
export default function GrowthSection() {
  const { ref: titleRef, inView: titleInView } = useInView();
  const { ref: chartsRef, inView: chartsInView } = useInView();

  /* Dados REAIS — Senatran, PRF, G1, SEGS Portal */
  const growthData = [
    { year: "2021", multas: 42_373_773 },
    { year: "2022", multas: 56_151_649 },
    { year: "2023", multas: 69_419_273 },
    { year: "2024", multas: 74_897_708 },
  ];

  const infracoesData = [
    { tipo: "Avanço de sinal", valor: 25 },
    { tipo: "Outras infrações", valor: 35 },
    { tipo: "Excesso de velocidade", valor: 40 },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`max-w-4xl mx-auto text-center mb-20 transition-all duration-700 ${
            titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-4">
            Análise de Mercado — Dados Reais
          </p>
          <h2 className="font-display text-4xl lg:text-6xl font-black text-[oklch(0.1998_0.0403_258.29)] leading-tight mb-8">
            CRESCIMENTO <em className="text-gold not-italic">DO MERCADO</em> EM NÚMEROS
          </h2>
          <p className="font-body text-[oklch(0.1998_0.0403_258.29)] text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Dados verificados de Senatran, PRF, G1 e autoridades de trânsito mostram crescimento
            exponencial do mercado de multas.
          </p>
        </div>

        {/* ── Charts ── */}
        <div
          ref={chartsRef as React.RefObject<HTMLDivElement>}
          className={`mt-16 lg:mt-24 pt-16 lg:pt-24 border-t border-[oklch(0.90_0.005_75)] transition-all duration-700 ${
            chartsInView ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* ─────── Gráfico 1: Crescimento de Multas (BarChart) ─────── */}
            <div className="bg-gradient-to-br from-[oklch(0.98_0.005_75)] to-[oklch(0.95_0.008_75)] rounded-2xl p-5 sm:p-8 border border-[oklch(0.90_0.005_75)] shadow-lg">
              {/* Card header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                <div>
                  <h4 className="font-display text-lg sm:text-xl font-bold text-[oklch(0.1998_0.0403_258.29)] mb-1">
                    Multas Emitidas no Brasil
                  </h4>
                  <p className="font-body text-xs text-[oklch(0.45_0.02_250)]">
                    Fonte: Senatran, PRF · 2021–2024
                  </p>
                </div>
                <GrowthBadge value="+76,8% em 4 anos" />
              </div>

              {/* Chart */}
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={growthData}
                  margin={{ top: 36, right: 28, left: 28, bottom: 8 }}
                  barCategoryGap="25%"
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke={COLORS.gridLine}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: COLORS.navyMuted, fontSize: 13, fontWeight: 700 }}
                    interval={0}
                  />
                  <YAxis hide domain={[0, 90_000_000]} />
                  <Tooltip
                    content={
                      <ChartTooltip
                        formatter={(v) =>
                          `${(v / 1_000_000).toFixed(1).replace(".", ",")} milhões de multas`
                        }
                      />
                    }
                    cursor={{ fill: "oklch(0.90 0.005 75 / 0.35)", radius: 8 }}
                  />
                  <Bar
                    dataKey="multas"
                    radius={[10, 10, 0, 0]}
                    fill={COLORS.gold}
                    label={<BarLabel />}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>

              {/* Mini legend */}
              <div className="mt-4 flex items-center gap-2 justify-center">
                <span
                  className="block w-8 h-3 rounded-sm"
                  style={{ background: COLORS.gold }}
                />
                <span className="font-body text-xs text-[oklch(0.45_0.02_250)] font-medium">
                  Total de multas emitidas por ano (milhões)
                </span>
              </div>
            </div>

            {/* ─────── Gráfico 2: Tipos de Infrações ─────── */}
            <div className="bg-gradient-to-br from-[oklch(0.98_0.005_75)] to-[oklch(0.95_0.008_75)] rounded-2xl p-5 sm:p-8 border border-[oklch(0.90_0.005_75)] shadow-lg">
              {/* Card header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                <div>
                  <h4 className="font-display text-lg sm:text-xl font-bold text-[oklch(0.1998_0.0403_258.29)] mb-1">
                    Tipos de Infrações Mais Comuns
                  </h4>
                  <p className="font-body text-xs text-[oklch(0.45_0.02_250)]">
                    Fonte: CET-SP, Senatran · 2024
                  </p>
                </div>
                <GrowthBadge value="Top 3 infrações" />
              </div>

              {/* Chart */}
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={infracoesData}
                  margin={{ top: 36, right: 16, left: 16, bottom: 16 }}
                  barCategoryGap="25%"
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke={COLORS.gridLine}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="tipo"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    height={50}
                    tick={<BarXTick />}
                  />
                  <YAxis hide domain={[0, 55]} />
                  <Tooltip
                    content={
                      <ChartTooltip formatter={(v) => `${v}% das infrações`} />
                    }
                    cursor={{ fill: "oklch(0.90 0.005 75 / 0.35)", radius: 8 }}
                  />
                  <Bar
                    dataKey="valor"
                    radius={[10, 10, 0, 0]}
                    label={<InfracoesBarLabel />}
                    animationDuration={800}
                  >
                    {infracoesData.map((_, i) => (
                      <Cell key={i} fill={BAR_FILLS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Mini legend */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {infracoesData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className="block w-3 h-3 rounded-sm"
                      style={{ background: BAR_FILLS[i] }}
                    />
                    <span className="font-body text-xs text-[oklch(0.45_0.02_250)] font-medium">
                      {item.tipo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom insight ── */}
        <div className="mt-16 lg:mt-20 max-w-4xl mx-auto bg-gradient-to-r from-gold/10 to-gold/5 rounded-2xl p-8 sm:p-10 border border-gold/30">
          <div className="flex gap-5 sm:gap-6">
            <div className="w-1.5 bg-gradient-to-b from-gold to-gold/30 rounded-full flex-shrink-0" />
            <div>
              <p className="font-display text-xl sm:text-2xl font-bold text-[oklch(0.1998_0.0403_258.29)] mb-3">
                Um mercado bilionário em expansão
              </p>
              <p className="font-body text-[oklch(0.1998_0.0403_258.29)] text-sm sm:text-base leading-relaxed mb-3">
                Com 74,9 milhões de multas em 2024 e crescimento de 40% em 2025, o mercado de defesa
                de multas é uma oportunidade real. São Paulo arrecadou R$&nbsp;1,6 bilhão em 2023,
                demonstrando o volume financeiro envolvido.
              </p>
              <p className="font-body text-[oklch(0.1998_0.0403_258.29)] text-xs sm:text-sm italic">
                Dados verificados: Senatran, PRF, G1, CET-SP, SEGS Portal Nacional
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}