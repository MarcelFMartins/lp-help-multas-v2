/*
 * FranchiseeMotivationSection — O que o franqueado busca?
 * Design: Foco em transformação e segurança
 * Narrative: Mudança de vida, crescimento e proteção contra o mercado
 */

import { useInView } from "../hooks/useInView";

const motivations = [
  {
    title: "Liberdade Financeira",
    description: "Construa uma nova fonte de renda com suporte e estrutura pronta.",
    icon: "💰"
  },
  {
    title: "Mercado em Expansão",
    description: "Atue em um segmento que cresce com o aumento das fiscalizações.",
    icon: "📈"
  },
  {
    title: "Negócio Simplificado",
    description: "Você vende e nossa equipe técnica cuida da operação especializada.",
    icon: "🛡️"
  },
  {
    title: "Crescimento Profissional",
    description: "Desenvolva liderança, gestão e visão empreendedora.",
    icon: "💼"
  }
];

export default function FranchiseeMotivationSection() {
  const { ref: titleRef, inView: titleInView } = useInView();

  return (
    <section id="motivacao" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`mb-16 text-center transition-all duration-700 ${titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-[oklch(0.8371_0.1715_85.23)] text-sm uppercase tracking-widest mb-3">
            UMA OPORTUNIDADE PARA QUEM QUER CRESCER
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-[oklch(0.1998_0.0403_258.29)] leading-tight max-w-5xl mx-auto">
            CONSTRUA O NEGÓCIO QUE PODE <em className="text-[oklch(0.8371_0.1715_85.23)] not-italic">MUDAR SUA HISTÓRIA</em>
          </h2>
        </div>

        {/* Motivation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {motivations.map((item, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl border border-gray-100 hover:border-[oklch(0.8371_0.1715_85.23)] transition-all duration-300 group bg-[oklch(0.98_0.01_75)]"
            >
              <span className="text-4xl mb-6 block">{item.icon}</span>
              <h3 className="font-display text-xl font-bold text-[oklch(0.1998_0.0403_258.29)] mb-4 group-hover:text-[oklch(0.8371_0.1715_85.23)] transition-colors">
                {item.title}
              </h3>
              <p className="font-body text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to action / Insight */}
        <div className="mt-16 p-8 rounded-2xl bg-[oklch(0.1998_0.0403_258.29)] text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h3 className="font-display text-2xl font-bold mb-2">Medo de ser engolido pelo mercado?</h3>
            <p className="font-body text-white/70">
              Muitos donos de autoescolas e despachantes nos procuram para proteger o que construíram e se transformar diante das novas leis. Nós somos o seu porto seguro.
            </p>
          </div>
          <div className="shrink-0">
            <span className="text-5xl">🤝</span>
          </div>
        </div>
      </div>
    </section>
  );
}
