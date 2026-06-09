import { useEffect, useState, type RefObject } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { Img } from "./Img";

const testimonials = [
  {
    name: "Kelly Volmann",
    location: "Criciúma — SC",
    quote:
      "Comecei sozinha e em poucos meses já estava faturando acima das minhas expectativas. O suporte da Help é incrível.",
    highlight: "Começou sozinha e deu certo",
    videoThumb: "/image/KELLY.webp",
    videoThumbFallback: "/image/KELLY.png",
    videoUrl: "https://www.youtube.com/embed/44PoELQxMwI?autoplay=1",
  },
  {
    name: "Dani Correa",
    location: "Joinville — SC",
    quote:
      "Em 1 ano de operação já ultrapassei R$ 1 milhão em faturamento. Nunca imaginei que seria possível com esse modelo.",
    highlight: "R$ 1 milhão em 1 ano",
    videoThumb: "/image/DANI.webp",
    videoThumbFallback: "/image/DANI.png",
    videoUrl: "https://www.youtube.com/embed/_ZKqEShdv1A?autoplay=1",
  },
  {
    name: "Raphael Moraes",
    location: "Joinville — SC",
    quote:
      "A verdade sobre a Help Multas é que o modelo realmente funciona. Você tem todo o suporte que precisa para começar e crescer.",
    highlight: "Modelo que realmente funciona",
    videoThumb: "/image/Rapha.webp",
    videoThumbFallback: "/image/Rapha.png",
    videoUrl: "https://www.youtube.com/embed/GhF9Byl44qg?autoplay=1",
  },

  // Adicione abaixo os outros 9 depoimentos seguindo o mesmo padrão:
  // {
  //   name: "Nome do franqueado",
  //   location: "Cidade — UF",
  //   quote: "Texto do depoimento.",
  //   highlight: "Destaque curto",
  //   videoThumb: "/image/ARQUIVO.webp",
  //   videoThumbFallback: "/image/ARQUIVO.png",
  //   videoUrl: "https://www.youtube.com/embed/ID_DO_VIDEO?autoplay=1",
  // },
];

const getItemsPerPage = () => {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
};

export default function TestimonialsSection() {
  const { ref: titleRef, inView: titleInView } = useInView();
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [activePage, setActivePage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const startIndex = activePage * itemsPerPage;
  const visibleTestimonials = testimonials.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    const handleResize = () => setItemsPerPage(getItemsPerPage());

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const lastPage = Math.max(totalPages - 1, 0);

    if (activePage > lastPage) {
      setActivePage(lastPage);
    }
  }, [activePage, totalPages]);

  const goToPage = (page: number) => {
    setActiveVideo(null);
    setActivePage(page);
  };

  const goToPreviousPage = () => {
    setActiveVideo(null);
    setActivePage((currentPage) =>
      currentPage === 0 ? totalPages - 1 : currentPage - 1
    );
  };

  const goToNextPage = () => {
    setActiveVideo(null);
    setActivePage((currentPage) =>
      currentPage === totalPages - 1 ? 0 : currentPage + 1
    );
  };

  return (
    <section
      id="depoimentos"
      className="py-24 bg-[oklch(0.1998_0.0403_258.29)]"
    >
      <div className="container mx-auto">
        {/* Header */}
        <div
          ref={titleRef as RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${titleInView
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

        {/* Carousel */}
        <div className="relative mb-12">
          {totalPages > 1 && (
            <div className="absolute -top-12 right-0 hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={goToPreviousPage}
                className="w-10 h-10 rounded-full border border-white/15 text-white hover:border-gold hover:text-gold transition-colors flex items-center justify-center"
                aria-label="Depoimentos anteriores"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={goToNextPage}
                className="w-10 h-10 rounded-full border border-white/15 text-white hover:border-gold hover:text-gold transition-colors flex items-center justify-center"
                aria-label="Próximos depoimentos"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTestimonials.map((t, i) => {
              const testimonialIndex = startIndex + i;
              const isActive = activeVideo === testimonialIndex;

              return (
                <div
                  key={`${t.name}-${testimonialIndex}`}
                  className="group bg-[oklch(0.1998_0.0403_258.29)] rounded-2xl border border-white/10 overflow-hidden hover:border-gold/40 transition-all duration-300"
                >
                  {/* Video / Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    {isActive ? (
                      <>
                        {/* Botão fechar */}
                        <button
                          type="button"
                          onClick={() => setActiveVideo(null)}
                          className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 p-2 rounded-full"
                          aria-label="Fechar vídeo"
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
                        <Img
                          webp={t.videoThumb}
                          fallback={t.videoThumbFallback}
                          alt={t.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Overlay play */}
                        <div
                          onClick={() => setActiveVideo(testimonialIndex)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              setActiveVideo(testimonialIndex);
                            }
                          }}
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
                      &quot;{t.quote}&quot;
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

          {totalPages > 1 && (
            <>
              <div className="flex md:hidden items-center justify-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  className="w-10 h-10 rounded-full border border-white/15 text-white hover:border-gold hover:text-gold transition-colors flex items-center justify-center"
                  aria-label="Depoimentos anteriores"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={goToNextPage}
                  className="w-10 h-10 rounded-full border border-white/15 text-white hover:border-gold hover:text-gold transition-colors flex items-center justify-center"
                  aria-label="Próximos depoimentos"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }).map((_, page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={`h-2 rounded-full transition-all duration-300 ${activePage === page
                        ? "w-8 bg-gold"
                        : "w-2 bg-white/20 hover:bg-white/40"
                      }`}
                    aria-label={`Ir para página ${page + 1} dos depoimentos`}
                    aria-current={activePage === page ? "true" : undefined}
                  />
                ))}
              </div>
            </>
          )}
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
