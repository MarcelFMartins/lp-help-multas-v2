/*
 * TeamSection — Conheça o time
 * Design: Foto da equipe em destaque com texto lateral ou inferior
 * Narrative: Humanização e suporte por trás da marca
 */

import { useInView } from "../hooks/useInView";
import { Img } from "./Img";

export default function TeamSection() {
  const { ref: contentRef, inView: contentInView } = useInView();

  return (
    <section id="equipe" className="py-24 bg-white">
      <div className="container mx-auto px-4 mb-10">
        <div 
          ref={contentRef as React.RefObject<HTMLDivElement>}
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
        >
          {/* Image Side */}
          <div className={`flex-1 transition-all duration-1000 delay-200 ${contentInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <div className="relative">
              {/* Elemento decorativo amarelo */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[oklch(0.8371_0.1715_85.23)] rounded-2xl -z-10" />
              
              <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-100">
                <Img
                  webp="/image/equipe_help.webp"
                  fallback="/image/logotipo.png"
                  alt="Equipe Help Multas"
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Elemento decorativo azul */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[oklch(0.1998_0.0403_258.29)] rounded-full -z-10 opacity-20" />
            </div>
          </div>

          {/* Text Side */}
          <div className={`flex-1 transition-all duration-1000 ${contentInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="gold-line" />
            <span className="font-body font-semibold text-[oklch(0.8371_0.1715_85.23)] text-sm uppercase tracking-widest mb-4 block">
              Nosso Capital Humano
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-[oklch(0.1998_0.0403_258.29)] leading-tight mb-6">
              CONHEÇA O TIME QUE FAZ <br />
              <span className="text-[oklch(0.8371_0.1715_85.23)]">ISSO ACONTECER</span>
            </h2>
            <p className="font-body text-lg text-gray-600 leading-relaxed mb-8">
              Por trás de cada unidade e de cada recurso vitorioso, existe um time de especialistas apaixonados pelo que fazem. Estamos aqui para dar todo o suporte necessário para que sua franquia seja um sucesso absoluto.
            </p>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[oklch(0.1998_0.0403_258.29)]/5 border-l-4 border-[oklch(0.8371_0.1715_85.23)]">
              <span className="text-2xl">🚀</span>
              <p className="font-body font-medium text-[oklch(0.1998_0.0403_258.29)]">
                Mais de 40 colaboradores focados no seu resultado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
