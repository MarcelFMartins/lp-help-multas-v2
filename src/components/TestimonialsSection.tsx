import { useState } from "react";
import { Play, X } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const testimonials = [
  {
    name: "Kelly Volmann",
    location: "Criciúma — SC",
    quote:
      "Comecei sozinha e em poucos meses já estava faturando acima das minhas expectativas. O suporte da Help é incrível.",
    highlight: "Começou sozinha e deu certo",
    videoThumb: "/image/KELLY.png",
    videoUrl: "https://www.youtube.com/embed/44PoELQxMwI?autoplay=1",
  },
  {
    name: "Dani Correa",
    location: "Joinville — SC",
    quote:
      "Em 1 ano de operação já ultrapassei R$ 1 milhão em faturamento. Nunca imaginei que seria possível com esse modelo.",
    highlight: "R$ 1 milhão em 1 ano",
    videoThumb: "/image/DANI.png",
    videoUrl: "https://www.youtube.com/embed/_ZKqEShdv1A?autoplay=1",
  },
  {
    name: "Raphael Moraes",
    location: "Joinville — SC",
    quote:
      "A verdade sobre a Help Multas é que o modelo realmente funciona. Você tem todo o suporte que precisa para começar e crescer.",
    highlight: "Modelo que realmente funciona",
    videoThumb: "/image/Rapha.png",
    videoUrl: "https://www.youtube.com/embed/GhF9Byl44qg?autoplay=1",
  },
];

export default function TestimonialsSection() {
  const { ref: titleRef, inView: titleInView } = useInView();
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  return (
    <section
      id="depoimentos"
      className="py-24 bg-[oklch(0.1998_0.0403_258.29)]"
    >
      <div className="container mx-auto">
        {/* Header */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${
            titleInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-3">
            Casos de Sucesso
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight max-w-3xl mx-auto">
            ESSES RESULTADOS{" "}
            <em className="text-gold not-italic">PODEM SER SEUS</em>
          </h2>
          <p className="font-body text-white/60 text-lg mt-4 max-w-xl mx-auto">
            Franqueados reais, resultados reais. Veja o que nossos parceiros têm
            a dizer.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((t, i) => {
            const isActive = activeVideo === i;

            return (
              <div
                key={t.name}
                className="group bg-oklch(0.1998_0.0403_258.29) rounded-2xl border border-white/10 overflow-hidden hover:border-gold/40 transition-all duration-300"
              >
                {/* Video / Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  {isActive ? (
                    <>
                      {/* Botão fechar */}
                      <button
                        onClick={() => setActiveVideo(null)}
                        className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 p-2 rounded-full"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>

                      {/* Vídeo */}
                      {t.videoUrl.includes("youtube") ? (
                        <iframe
                          src={t.videoUrl}
                          className="w-full h-full"
                          title={t.name}
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={t.videoUrl}
                          controls
                          autoPlay
                          className="w-full h-full object-cover"
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {/* Thumbnail */}
                      <img
                        src={t.videoThumb}
                        alt={t.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Overlay play */}
                      <div
                        onClick={() => setActiveVideo(i)}
                        className="absolute inset-0 bg-[oklch(oklch(0.1998_0.0403_258.29))]/50 flex items-center justify-center cursor-pointer"
                      >
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                          style={{
                            background: "oklch(0.8371 0.1715 85.23)",
                          }}
                        >
                          <Play
                            className="w-5 h-5 fill-current"
                            style={{
                              color: "oklch(0.3274 0.0363 242.96)",
                            }}
                          />
                        </div>
                      </div>

                      {/* Badge */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <span
                          className="inline-block px-3 py-1 rounded-full font-body font-bold text-xs uppercase tracking-wide"
                          style={{
                            background: "oklch(0.8371 0.1715 85.23)",
                            color: "oklch(0.3274 0.0363 242.96)",
                          }}
                        >
                          {t.highlight}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Texto */}
                <div className="p-5">
                  <p className="font-body text-sm text-white/70 leading-relaxed mb-4 italic">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm"
                      style={{
                        background: "oklch(0.8371 0.1715 85.23)",
                        color: "oklch(0.3274 0.0363 242.96)",
                      }}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-body font-semibold text-white text-sm">
                        {t.name}
                      </p>
                      <p className="font-body text-xs text-white/50">
                        {t.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="font-body text-white/60 text-sm mb-4">
            Quer fazer parte dessa história?
          </p>
          <a
            href="#inicio"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            style={{
              background: "oklch(0.8371 0.1715 85.23)",
              color: "oklch(0.1998 0.0403 258.29)",
            }}
          >
            Quero ser um franqueado →
          </a>
        </div>
      </div>
    </section>
  );
}