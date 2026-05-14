/*
 * HelpExperienceVideoSection — Vídeo Institucional
 * Design: Vídeo em destaque ocupando quase toda a tela
 * Narrative: Experiência e autoridade da marca
 */

import { useInView } from "../hooks/useInView";

export default function HelpExperienceVideoSection() {
  const { ref: sectionRef, inView: sectionInView } = useInView();

  return (
    <section id="experiencia" className="py-24 bg-[oklch(0.1998_0.0403_258.29)] overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          ref={sectionRef as React.RefObject<HTMLDivElement>}
          className={`transition-all duration-1000 ${sectionInView ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          {/* Header opcional para contexto */}
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-5xl font-black text-white mb-4">
              VEJA O TAMANHO DA <span className="text-[oklch(0.8371_0.1715_85.23)]">HELP MULTAS</span>
            </h2>
            <div className="w-24 h-1 bg-[oklch(0.8371_0.1715_85.23)] mx-auto rounded-full" />
          </div>

          {/* Video Container */}
          <div className="relative w-full max-w-6xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-[oklch(0.8371_0.1715_85.23)]/20">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/dqmeOfJlEcQ"
              title="Help Experience 2024"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          
          <p className="text-center mt-8 font-body text-white/60 italic">
            Sinta a energia do maior evento de direito de trânsito do Brasil.
          </p>
        </div>
      </div>
    </section>
  );
}
