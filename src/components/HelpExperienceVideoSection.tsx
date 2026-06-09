/*
 * HelpExperienceVideoSection — Vídeo Institucional
 * Design: Vídeo em destaque ocupando quase toda a tela
 * Narrative: Experiência e autoridade da marca
 */

import { useInView } from "../hooks/useInView";
import { useState } from "react";
import { Play } from "lucide-react";

export default function HelpExperienceVideoSection() {
  const { ref: sectionRef, inView: sectionInView } = useInView();
  const [isPlayingExperience, setIsPlayingExperience] = useState(false);


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

          <div className="relative w-full max-w-6xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-[oklch(0.8371_0.1715_85.23)]/20 bg-black">
            {!isPlayingExperience ? (
              <div
                onClick={() => setIsPlayingExperience(true)}
                className="absolute inset-0 cursor-pointer group"
              >
                <img
                  src="/image/thumbhelpday.png"
                  alt="Help Day 2024"
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 transition-all duration-300 group-hover:bg-black/45" />

                {/* Botão Play */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(212,160,23,0.6)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_60px_rgba(212,160,23,0.8)]"
                    style={{ background: "oklch(0.8371 0.1715 85.23)" }}
                  >
                    <Play
                      className="w-9 h-9 fill-current ml-2"
                      style={{ color: "oklch(0.3274 0.0363 242.96)" }}
                    />
                  </div>

                  <span className="font-body text-white/80 text-sm font-semibold uppercase tracking-widest bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
                    Assistir o evento
                  </span>
                </div>
              </div>
            ) : (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/7QaDuGApFig?autoplay=1&rel=0"
                title="Help Day 2024"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>

          <p className="text-center mt-8 font-body text-white/60 italic">
            Sinta a energia do maior evento de direito de trânsito do Brasil.
          </p>
        </div>
      </div>
    </section>
  );
}
