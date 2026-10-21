/*
 * CTASectionOp — CTA final da LP /oportunidade
 * Cópia do CTASection do root, com o formulário sem UF/Cidade.
 */

import { useInView } from "../../hooks/useInView";
import LeadFormCard from "./LeadFormCard";

const CTA_BG = "/image/fundo.webp";

const urgencyItems = [
  "Resposta em até 24h",
  "Dados protegidos",
  "Vagas por região limitadas",
];

export default function CTASectionOp() {
  const { ref: titleRef, inView: titleInView } = useInView();

  return (
    <section
      id="formulario"
      className="relative py-24 overflow-hidden"
      style={{ backgroundImage: `url(${CTA_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-[oklch(0.1998_0.0403_258.29)]/75 backdrop-blur-[4px]" />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">

          <div
            ref={titleRef as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-700 ${titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="gold-line" />
            <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-4">
              Próximo Passo
            </p>

            <h2 className="font-display text-4xl lg:text-[56px] font-black text-white leading-[1.05] tracking-tight mb-6">
              VENHA FAZER PARTE DESSE{" "}
              <em className="text-gold not-italic">MERCADO</em>
            </h2>

            <p className="font-body text-white/70 text-lg leading-relaxed mb-10 max-w-md">
              Preencha o formulário e nosso time entrará em contato em até 24 horas.
            </p>

            <div className="flex flex-col gap-3">
              {urgencyItems.map((text) => (
                <div
                  key={text}
                  className="flex items-center justify-center gap-3 bg-white/5 border border-white/12 rounded-2xl px-5 py-4 w-full text-center"
                >
                  <span className="font-body text-white/80 text-[15px] font-semibold">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <LeadFormCard
              idPrefix="cta"
              origem="Oportunidade (CTA final)"
              Heading="h3"
              className="shadow-[0_32px_70px_rgba(0,0,0,0.5)] p-7 sm:p-10"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
