/*
 * FAQSection — Perguntas Frequentes
 * Design: Off-white background, accordion elegante, sem bordas pesadas
 * Narrative: Responde objeções e reduz ansiedade do lead
 */

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useInView } from "../hooks/useInView";


const faqs = [
  {
    q: "Preciso ter experiência jurídica ou ser advogado?",
    a: "Não. O modelo Done-For-You da HelpMultas foi criado justamente para que você não precise de conhecimento jurídico. Nossa equipe de advogados cuida de toda a parte técnica — análise, elaboração da defesa e protocolo nos órgãos de trânsito. Você foca em vendas e atendimento.",
  },
  {
    q: "Quanto preciso investir para abrir minha franquia?",
    a: "O investimento inicial é acessível e varia conforme o modelo escolhido. Nossa equipe apresentará os valores detalhados durante a conversa de qualificação. Temos opções para diferentes perfis de investidor.",
  },
  {
    q: "Qual é o potencial de faturamento mensal?",
    a: "O faturamento varia conforme sua dedicação e região. Temos franqueados que faturaram R$ 500 mil em 12 meses. Os resultados dependem da sua capacidade comercial e do tamanho do mercado na sua cidade.",
  },
  {
    q: "Preciso ter um escritório físico?",
    a: "Não necessariamente. O modelo pode ser operado de forma híbrida. Muitos franqueados começam em home based e expandem para o modelo Store (Loja Física) conforme o negócio cresce.",
  },
  {
    q: "Como funciona o suporte da Help Multas?",
    a: "Você terá acesso a suporte técnico e comercial, treinamento inicial e contínuo, sistema próprio de gestão, equipe técnica dedicada e materiais de marketing. Nosso time está disponível para apoiar sua operação.",
  },
  {
    q: "Quanto tempo leva para começar a operar?",
    a: "Após a assinatura do contrato e conclusão do treinamento, você pode começar a operar em 60 dias. Nosso processo de onboarding foi otimizado para que você comece a gerar resultados o mais rápido possível.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        onClick={() => setOpen(!open)}
      >
        <span className="font-display text-base font-bold text-[oklch(0.3274_0.0363_242.96)] group-hover:text-gold transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-gold" : "text-gray-400"}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-5" : "max-h-0"}`}
      >
        <p className="font-body text-sm text-gray-600 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const { ref: titleRef, inView: titleInView } = useInView();

  return (
    <section id="faq" className="py-24 bg-[oklch(0.98_0.005_75)]">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: Header */}
          <div
            ref={titleRef as React.RefObject<HTMLDivElement>}
            className={`lg:sticky lg:top-24 transition-all duration-700 ${titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="gold-line" />
            <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-3">
              Dúvidas Frequentes
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-[oklch(0.3274_0.0363_242.96)] leading-tight mb-6">
              RESPONDEMOS SUAS{" "}
              <em className="text-gold not-italic">PRINCIPAIS DÚVIDAS</em>
            </h2>
            <p className="font-body text-[oklch(0.50_0.02_250)] leading-relaxed mb-8">
              Não encontrou o que procurava? Nossa equipe está pronta para responder
              qualquer dúvida durante a conversa de qualificação.
            </p>
            <a
              href="#inicio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90"
              style={{ background: "oklch(0.3274 0.0363 242.96)", color: "white" }}
            >
              Falar com um consultor →
            </a>
          </div>

          {/* Right: FAQ accordion */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
