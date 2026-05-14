/*
 * GrowthSection — Por que o mercado cresce?
 * Design: Off-white background, 3 fatores principais + gráficos interativos
 * Narrative: Explicar os drivers de crescimento com dados REAIS verificados
 * Fontes: Senatran, PRF, G1, SEGS, CET-SP
 */

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useInView } from "../hooks/useInView";

const CustomXAxisTick = ({ x, y, payload }: any) => {
  const words = payload.value.split(" ");

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="oklch(0.3274 0.0363 242.96)"
        fontSize={11}
        fontWeight="bold"
      >
        {words.map((word: string, index: number) => (
          <tspan key={index} x="0" dy={index === 0 ? 0 : 14}>
            {word}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export default function GrowthSection() {
  const { ref: titleRef, inView: titleInView } = useInView();
  const { ref: chartsRef, inView: chartsInView } = useInView();

  // Dados REAIS de multas de trânsito no Brasil
  // Fonte: Senatran, PRF, G1, SEGS Portal
  const growthData = [
    { year: "2021", multas: 42373773 },
    { year: "2022", multas: 56151649 },
    { year: "2023", multas: 69419273 },
    { year: "2024", multas: 74897708 },
  ];

  const infracoesData = [
    { tipo: "Excesso de velocidade", valor: 40 },
    { tipo: "Avanço de sinal", valor: 25 },
    { tipo: "Outras infrações", valor: 35 },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="container mx-auto">
        {/* Header */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`max-w-4xl mx-auto text-center mb-20 transition-all duration-700 ${titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-4">
            Análise de Mercado — Dados Reais
          </p>
          <h2 className="font-display text-4xl lg:text-6xl font-black text-[oklch(0.1998_0.0403_258.29)] leading-tight mb-8">
            CRESCIMENTO <em className="text-gold not-italic">DO MERCADO</em> EM NÚMEROS
          </h2>
          <p className="font-body text-[oklch(0.1998_0.0403_258.29)] text-xl max-w-3xl mx-auto leading-relaxed">
            Dados verificados de Senatran, PRF, G1 e autoridades de trânsito mostram crescimento exponencial do mercado de multas.
          </p>
        </div>

        {/* Charts Section */}
        <div
          ref={chartsRef as React.RefObject<HTMLDivElement>}
          className={`mt-24 pt-24 border-t border-[oklch(0.90_0.005_75)] transition-all duration-700 ${chartsInView ? "opacity-100" : "opacity-0"
            }`}
        >

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Gráfico 1: Crescimento de Multas */}
            <div className="bg-gradient-to-br from-[oklch(0.98_0.005_75)] to-[oklch(0.95_0.008_75)] rounded-2xl p-8 border border-[oklch(0.90_0.005_75)] shadow-lg">
              <h4 className="font-display text-xl font-bold text-[oklch(0.1998_0.0403_258.29)] mb-2">
                Multas Emitidas no Brasil (Milhões/ano)
              </h4>
              <p className="font-body text-xs text-[oklch(0.1998_0.0403_258.29)] mb-6">
                Fonte: Senatran, PRF, 2021-2024
              </p>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={growthData}
                  margin={{ top: 40, right: 50, left: 50, bottom: 20 }} // Aumentei as margens
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.005 75)" vertical={false} />

                  <XAxis
                    dataKey="year"
                    stroke="oklch(0.40 0.02 250)"
                    tick={{ fill: 'oklch(0.1998 0.0403 258.29)', fontWeight: 'bold' }}
                    interval={0} // Força a exibição de todos os anos, incluindo 2021
                    padding={{ left: 30, right: 30 }} // Dá espaço nas laterais para o label não cortar
                  />

                  <YAxis hide={true} domain={['dataMin - 10000000', 'dataMax + 10000000']} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.98 0.005 75)",
                      border: "2px solid oklch(0.8371 0.1715 85.23)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: any) => [`${(Number(value) / 1000000).toFixed(1).replace('.', ',')} Milhões`, "Total"]}
                  />

                  <Line
                    type="monotone"
                    dataKey="multas"
                    stroke="oklch(0.8371 0.1715 85.23)"
                    strokeWidth={4}
                    dot={{ fill: "oklch(0.8371 0.1715 85.23)", r: 6 }}
                    label={{
                      position: 'top',
                      offset: 15,
                      fill: 'oklch(0.1998 0.0403 258.29)',
                      fontSize: 14,
                      fontWeight: 'bold',
                      // Formata para aparecer exatamente como na imagem: 74,9M, 69,4M, etc.
                      formatter: (value: any) => `${(Number(value) / 1000000).toFixed(1).replace('.', ',')}M`
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico 2: Tipos de Infrações */}
            <div className="bg-gradient-to-br from-[oklch(0.98_0.005_75)] to-[oklch(0.95_0.008_75)] rounded-2xl p-8 border border-[oklch(0.90_0.005_75)] shadow-lg">
              <h4 className="font-display text-xl font-bold text-[oklch(0.1998_0.0403_258.29)] mb-2">
                Tipos de Infrações Mais Comuns
              </h4>
              <p className="font-body text-xs text-[oklch(0.1998_0.0403_258.29)] mb-6">
                Fonte: CET-SP, Senatran, 2024
              </p>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={infracoesData}
                  margin={{ top: 30, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.005 75)" vertical={false}/>
                  <XAxis
                    dataKey="tipo"
                    stroke="oklch(0.40 0.02 250)"
                    interval={0}
                    tickMargin={10}
                    tick={{ fill: 'oklch(0.3274 0.0363 242.96)', fontSize: 12, fontWeight: 'bold' }}
                    height={60}
                  />
                  <XAxis
                    dataKey="tipo"
                    interval={0}
                    tickMargin={10}
                    height={70}
                    tick={<CustomXAxisTick />}
                  />
                  <Tooltip
                    cursor={{ fill: 'oklch(0.90 0.005 75 / 0.4)' }}
                    contentStyle={{
                      backgroundColor: "oklch(0.98 0.005 75)",
                      border: "2px solid oklch(0.8371 0.1715 85.23)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "oklch(0.3274 0.0363 242.96)" }}
                    formatter={(value) => [`${value}%`, "Frequência"]}
                  />
                  <Bar
                    dataKey="valor"
                    fill="oklch(0.8371 0.1715 85.23)"
                    name="Percentual (%)"
                    radius={[8, 8, 0, 0]}
                    // ESTA LINHA ADICIONA O NÚMERO EM CIMA DA BARRA
                    label={{
                      position: 'top',
                      fill: 'oklch(0.3274 0.0363 242.96)',
                      fontSize: 14,
                      fontWeight: 'bold',
                      formatter: (value) => `${value}%`
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom insight */}
        <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-r from-gold/10 to-gold/5 rounded-2xl p-10 border border-gold/30">
          <div className="flex gap-6">
            <div className="w-1.5 bg-gradient-to-b from-gold to-gold/30 rounded-full flex-shrink-0" />
            <div>
              <p className="font-display text-2xl font-bold text-[oklch(0.1998_0.0403_258.29)] mb-3">
                Um mercado bilionário em expansão
              </p>
              <p className="font-body text-[oklch(0.1998_0.0403_258.29)] text-base leading-relaxed mb-3">
                Com 74,9 milhões de multas em 2024 e crescimento de 40% em 2025, o mercado de defesa de multas é uma oportunidade real. São Paulo arrecadou R$ 1,6 bilhão em 2023, demonstrando o volume financeiro envolvido.
              </p>
              <p className="font-body text-[oklch(0.1998_0.0403_258.29)] text-sm italic">
                Dados verificados: Senatran, PRF, G1, CET-SP, SEGS Portal Nacional
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}