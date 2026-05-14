/*
 * ComparisonSection — Tabela comparativa com outras franquias
 * Design: Light background, tabela elegante com destaque na coluna HelpMultas
 * Narrative: Posiciona a HelpMultas como a melhor escolha
 */

import { Check, X, Minus } from "lucide-react";
import { useInView } from "../hooks/useInView";


const criteria = [
  { label: "Sem precisar ser advogado", help: true, other1: false, other2: false },
  { label: "Modelo Done-For-You completo", help: true, other1: false, other2: false },
  { label: "Sistema próprio de gestão", help: true, other1: null, other2: true },
  { label: "Sem taxa de publicidade", help: true, other1: false, other2: false },
  { label: "Suporte jurídico incluso", help: true, other1: false, other2: false },
  { label: "Treinamento contínuo", help: true, other1: true, other2: true },
  { label: "Território exclusivo", help: true, other1: null, other2: true },
  { label: "Mercado em crescimento constante", help: true, other1: true, other2: true },
];

function Cell({ value }: { value: boolean | null }) {
  if (value === true) return <Check className="w-5 h-5 mx-auto" style={{ color: "oklch(0.8371 0.1715 85.23)" }} />;
  if (value === false) return <X className="w-5 h-5 mx-auto text-red-400" />;
  return <Minus className="w-5 h-5 mx-auto text-gray-300" />;
}

export default function ComparisonSection() {
  const { ref: titleRef, inView: titleInView } = useInView();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto">

        {/* Section header */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 transition-all duration-700 ${titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-3">
            Comparativo
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-[oklch(0.3274_0.0363_242.96)] leading-tight max-w-3xl mx-auto">
            Por que a HelpMultas se{" "}
            <em className="text-gold not-italic">destaca no mercado</em>
          </h2>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-5 font-body font-semibold text-gray-500 text-sm w-1/2">
                  Critério
                </th>
                <th className="p-5 text-center w-1/6">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-display text-lg font-bold text-[oklch(0.3274_0.0363_242.96)]">
                      help<span className="text-gold">multas</span>
                    </span>
                    <span
                      className="text-xs font-body font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "oklch(0.8371 0.1715 85.23)", color: "oklch(0.3274 0.0363 242.96)" }}
                    >
                      Recomendado
                    </span>
                  </div>
                </th>
                <th className="p-5 text-center w-1/6">
                  <span className="font-body text-sm font-semibold text-gray-400">Franquia A</span>
                </th>
                <th className="p-5 text-center w-1/6">
                  <span className="font-body text-sm font-semibold text-gray-400">Franquia B</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-b border-gray-50 ${i % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`}
                >
                  <td className="p-5 font-body text-sm text-gray-700">{row.label}</td>
                  <td className="p-5 bg-[oklch(0.8371_0.1715_85.23)]/5">
                    <Cell value={row.help} />
                  </td>
                  <td className="p-5">
                    <Cell value={row.other1} />
                  </td>
                  <td className="p-5">
                    <Cell value={row.other2} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center font-body text-xs text-gray-400 mt-4">
          * Comparativo baseado em informações públicas disponíveis. Dados sujeitos a alteração.
        </p>
      </div>
    </section>
  );
}
