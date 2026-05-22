/*
 * NewsSection — Reportagens reais sobre multas de trânsito
 * Design: Navy background, cards com preview realista
 */

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { ExternalLink } from "lucide-react";

export default function NewsSection() {
  const { ref: titleRef, inView: titleInView } = useInView();
  const { ref: newsRef, inView: newsInView } = useInView();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const news = [
    {
      title:
        "Ano de 2025 registra mais de 10 milhões de multas em rodovias federais",
      source: "G1 Globo",
      domain: "g1.globo.com",
      date: "2025",
      image:
        "/image/noticia01.webp",
      description:
        "O excesso de velocidade foi a infração mais flagrada nas estradas federais. Sete em cada dez multas foram por dirigir acima do limite máximo da via.",
      category: "Dados Oficiais",
      color: "from-red-500/10 to-red-500/5",
      link:
        "https://g1.globo.com/jornal-nacional/noticia/2026/02/09/ano-de-2025-registra-mais-de-10-milhoes-de-multas-em-rodovias-federais-um-marco-historico.ghtml",
    },
    {
      title:
        "Multas disparam 40% em 2025 após mudanças na legislação",
      source: "TNH1",
      domain: "tnh1.com.br",
      date: "2025",
      image:
        "/image/noticia02.webp",
      description:
        "Após mudanças na legislação de trânsito, multas dispararam 40% em 2025. Rodovias federais registraram números históricos.",
      category: "Tendência",
      color: "from-orange-500/10 to-orange-500/5",
      link:
        "https://www.tnh1.com.br/variedades/apos-mudanca-no-transito-multas-disparam-mais-de-40-no-brasil/",
    },
    {
      title:
        "São Paulo arrecada R$ 1,6 bilhão em multas em 2023",
      source: "G1 Globo",
      domain: "g1.globo.com",
      date: "2023",
      image:
        "/image/noticia03.webp",
      description:
        "A Companhia de Engenharia de Tráfego arrecadou R$ 1,6 bilhão em multas em 2023.",
      category: "Financeiro",
      color: "from-blue-500/10 to-blue-500/5",
      link:
        "https://g1.globo.com/sp/sao-paulo/noticia/2024/03/04/prefeitura-de-sp-arrecadou-mais-de-r-16-bilhao-em-multas-em-2023-mas-somente-64percent-do-valor-foi-investido-em-melhorias-no-transito-da-cidade.ghtml",
    },
    {
      title:
        "Excesso de velocidade lidera infrações com 40% das multas",
      source: "G1 Globo",
      domain: "g1.globo.com",
      date: "2024",
      image:
        "/image/noticia04.webp",
      description:
        "Levantamento mostra que excesso de velocidade representa 40% de todas as multas aplicadas.",
      category: "Análise",
      color: "from-yellow-500/10 to-yellow-500/5",
      link:
        "https://g1.globo.com/sp/campinas-regiao/noticia/2026/04/27/excesso-de-velocidade-lidera-multas-entre-motoristas-infratores-envolvidos-em-acidentes-na-regiao-de-campinas.ghtml",
    },
    {
      title:
        "Motoristas atingem recorde de infrações desde 2007",
      source: "G1 Globo",
      domain: "g1.globo.com",
      date: "2024",
      image:
        "/image/noticia05.webp",
      description:
        "O Brasil registrou o maior número de infrações em rodovias federais desde 2007.",
      category: "Recorde",
      color: "from-purple-500/10 to-purple-500/5",
      link:
        "https://g1.globo.com/jornal-nacional/noticia/2025/04/17/motoristas-atingem-patamar-historico-de-infracoes-nas-estradas-brasileiras.ghtml",
    },
    {
      title:
        "STJ valida defesas de multas por erros administrativos",
      source: "Conjur",
      domain: "conjur.com.br",
      date: "2024",
      image:
        "/image/noticia06.webp",
      description:
        "Superior Tribunal de Justiça reforça direito de motoristas contestarem multas por vícios processuais.",
      category: "Jurídico",
      color: "from-green-500/10 to-green-500/5",
      link:
        "https://www.conjur.com.br/2026-abr-20/norma-sancionadora-mais-benefica-nao-retroage-a-favor-do-reu-afirma-stj/",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[oklch(0.1998_0.0403_258.29)] overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${titleInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
            }`}
        >
          <span className="gold-line mx-auto" />

          <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-3">
            Validação de Mercado
          </p>

          <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
            O QUE A MÍDIA DIZ SOBRE{" "}
            <em className="text-gold not-italic">
              MULTAS DE TRÂNSITO
            </em>
          </h2>

          <p className="font-body text-white/70 text-lg max-w-2xl mx-auto">
            Reportagens de mídia confiável validam o crescimento do
            mercado e a oportunidade de negócio.
          </p>
        </div>

        {/* News Grid */}
        <div
          ref={newsRef as React.RefObject<HTMLDivElement>}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {news.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div
                className={`group transition-all duration-700 ${newsInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                  }`}
                style={{
                  transitionDelay: `${idx * 80}ms`,
                }}
              >
                <div
                  className={`overflow-hidden bg-gradient-to-br ${item.color}
                  rounded-2xl border border-white/10
                  hover:border-gold/40 transition-all duration-300
                  hover:-translate-y-1 hover:shadow-2xl
                  h-full flex flex-col backdrop-blur-sm`}
                >
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-52 bg-white/10" />

                      <div className="p-6 space-y-4">
                        <div className="h-4 w-24 rounded bg-white/10" />

                        <div className="h-6 rounded bg-white/10" />
                        <div className="h-6 w-4/5 rounded bg-white/10" />

                        <div className="h-4 rounded bg-white/10" />
                        <div className="h-4 w-5/6 rounded bg-white/10" />

                        <div className="flex justify-between pt-6">
                          <div className="space-y-2">
                            <div className="h-3 w-16 rounded bg-white/10" />
                            <div className="h-3 w-24 rounded bg-white/10" />
                          </div>

                          <div className="h-10 w-10 rounded-full bg-white/10" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Image */}
                      <div className="relative overflow-hidden h-52">
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-gold/20 backdrop-blur-md text-gold text-xs font-semibold uppercase tracking-wider border border-gold/20">
                            {item.category}
                          </span>

                          <span className="text-white/70 text-xs">
                            {item.date}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                          <span className="text-xs text-white/50 uppercase tracking-wider">
                            Reportagem publicada
                          </span>
                        </div>

                        <h3 className="font-display text-lg font-bold text-white mb-3 leading-snug group-hover:text-gold transition-colors duration-300 line-clamp-2">
                          {item.title}
                        </h3>

                        <p className="font-body text-white/70 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                          {item.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div>
                            <p className="text-xs text-white font-semibold uppercase tracking-wider">
                              {item.source}
                            </p>

                            <p className="text-[11px] text-white/40 mt-1">
                              {item.domain}
                            </p>
                          </div>

                          <div
                            className="w-10 h-10 rounded-full
                            bg-gold/10 border border-gold/20
                            flex items-center justify-center
                            group-hover:bg-gold/20
                            transition-all duration-300"
                          >
                            <ExternalLink className="w-4 h-4 text-gold" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
        {/* ── Vídeo ── */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <video
              controls
              playsInline
              preload="none"
              poster="/image/thumbRPC.png"
              className="w-full aspect-video object-cover"
            >
              <source src="/videos/video_apresentação_rpc.mov" type="video/mp4" />
            </video>
          </div>

          <p className="font-body text-[11px] text-white/30 mt-3">
            Fonte: RPC
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="font-body text-white/70 mb-6 max-w-2xl mx-auto">
            Esses dados mostram que o mercado está em expansão real.
            A oportunidade é concreta.
          </p>

          <a
            href="#inicio"
            className="inline-block px-8 py-4 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-lg"
            style={{
              background: "oklch(0.8371 0.1715 85.23)",
              color: "oklch(0.1998 0.0403 258.29)",
            }}
          >
            Aproveitar essa oportunidade
          </a>
        </div>
      </div>
    </section>
  );
}