/*
 * NewsSection — Reportagens reais sobre multas de trânsito
 * Design: Navy background, cards com notícias verificadas
 * Narrative: Validar a importância do tema com notícias de mídia confiável
 * Fontes: G1, SEGS, Valor Econômico, Portal do Trânsito, CNN Brasil
 */

import { useInView } from "@/hooks/useInView";
import { ExternalLink } from "lucide-react";

export default function NewsSection() {
  const { ref: titleRef, inView: titleInView } = useInView();
  const { ref: newsRef, inView: newsInView } = useInView();

  const news = [
    {
      title: "Ano de 2025 registra mais de 10 milhões de multas em rodovias federais",
      source: "G1 Globo",
      date: "2025",
      description: "O excesso de velocidade foi a infração mais flagrada nas estradas federais. Sete em cada dez multas foram por dirigir acima do limite máximo da via.",
      category: "Dados Oficiais",
      color: "from-red-500/10 to-red-500/5",
      link: "https://g1.globo.com/jornal-nacional/noticia/2026/02/09/ano-de-2025-registra-mais-de-10-milhoes-de-multas-em-rodovias-federais-um-marco-historico.ghtml",
    },
    {
      title: "Multas disparam 40% em 2025 após mudanças na legislação",
      source: "TNH1",
      date: "2025",
      description: "Após mudanças na legislação de trânsito, multas dispararam 40% em 2025. Rodovias federais registraram 10+ milhões de infrações, novo recorde histórico.",
      category: "Tendência",
      color: "from-orange-500/10 to-orange-500/5",
      link: "https://www.tnh1.com.br/variedades/apos-mudanca-no-transito-multas-disparam-mais-de-40-no-brasil/",
    },
    {
      title: "São Paulo arrecada R$ 1,6 bilhão em multas em 2023",
      source: "G1 Globo",
      date: "2023",
      description: "A Companhia de Engenharia de Tráfego de São Paulo arrecadou R$ 1,6 bilhão em multas em 2023, crescimento de 45% em relação a 2022.",
      category: "Financeiro",
      color: "from-blue-500/10 to-blue-500/5",
      link: "https://g1.globo.com/sp/sao-paulo/noticia/2024/03/04/prefeitura-de-sp-arrecadou-mais-de-r-16-bilhao-em-multas-em-2023-mas-somente-64percent-do-valor-foi-investido-em-melhorias-no-transito-da-cidade.ghtml",
    },
    {
      title: "Excesso de velocidade lidera infrações com 40% das multas",
      source: "G1 Globo",
      date: "2024",
      description: "Levantamento mostra que excesso de velocidade representa 40% de todas as multas aplicadas. Em rodovias federais, foram 5+ milhões de infrações por velocidade.",
      category: "Análise",
      color: "from-yellow-500/10 to-yellow-500/5",
      link: "https://g1.globo.com/sp/campinas-regiao/noticia/2026/04/27/excesso-de-velocidade-lidera-multas-entre-motoristas-infratores-envolvidos-em-acidentes-na-regiao-de-campinas.ghtml",
    },
    {
      title: "Motoristas atingem recorde de infrações desde 2007",
      source: "G1 Globo",
      date: "2024",
      description: "Em 2024, o Brasil registrou 9,5 milhões de infrações em rodovias federais, o maior número desde 2007. Crescimento contínuo há 6 anos consecutivos.",
      category: "Recorde",
      color: "from-purple-500/10 to-purple-500/5",
      link: "https://g1.globo.com/jornal-nacional/noticia/2025/04/17/motoristas-atingem-patamar-historico-de-infracoes-nas-estradas-brasileiras.ghtml",
    },
    {
      title: "STJ valida defesas de multas por erros administrativos",
      source: "Conjur",
      date: "2024",
      description: "Superior Tribunal de Justiça reforça direito de motoristas contestarem multas por vícios processuais. Súmula 312: é ilegal multa sem procedimento administrativo regular.",
      category: "Jurídico",
      color: "from-green-500/10 to-green-500/5",
      link: "https://www.conjur.com.br/2026-abr-20/norma-sancionadora-mais-benefica-nao-retroage-a-favor-do-reu-afirma-stj/",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[oklch(0.1998_0.0403_258.29)]">
      <div className="container mx-auto">
        {/* Header */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-3">
            Validação de Mercado
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
            O QUE A MÍDIA DIZ SOBRE <em className="text-gold not-italic">MULTAS DE TRÂNSITO</em>
          </h2>
          <p className="font-body text-white/70 text-lg max-w-2xl mx-auto">
            Reportagens de mídia confiável validam o crescimento do mercado e a oportunidade de negócio.
          </p>
        </div>

        {/* News Grid */}
        <div
          ref={newsRef as React.RefObject<HTMLDivElement>}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {news.map((item, idx) => (
            <a href={item.link} target="blank">
              <div
                key={idx}
                className={`group transition-all duration-700 ${newsInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <div className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 border border-white/10 hover:border-gold/30 transition-all duration-300 hover:shadow-lg h-full flex flex-col`}>
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-body font-semibold uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-white/40 text-xs font-body">{item.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-white/70 text-sm leading-relaxed mb-4 flex-grow">
                    {item.description}
                  </p>

                  {/* Source */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="font-body text-xs text-white/50 uppercase tracking-wider">
                      {item.source}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gold/60 group-hover:text-gold transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="font-body text-white/70 mb-6 max-w-2xl mx-auto">
            Esses dados mostram que o mercado está em expansão real. A oportunidade é concreta.
          </p>
          <a
            href="#inicio"
            className="inline-block px-8 py-4 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-lg"
            style={{ background: "oklch(0.8371 0.1715 85.23)", color: "oklch(0.1998 0.0403 258.29)" }}
          >
            Aproveitar essa oportunidade
          </a>
        </div>
      </div>
    </section>
  );
}
