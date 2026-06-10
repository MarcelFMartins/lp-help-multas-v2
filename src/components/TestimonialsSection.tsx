import { useEffect, useState, useRef, type RefObject } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { Img } from "./Img";

const testimonials = [
  {
    name: "Kelly",
    location: "Criciúma — SC",
    quote:
      "Comecei sozinha e em poucos meses já estava faturando acima das minhas expectativas. O suporte da Help é incrível.",
    highlight: "Começou sozinha e deu certo",
    videoThumb: "/image/KELLY.webp",
    videoThumbFallback: "/image/KELLY.png",
    videoUrl: "https://www.youtube.com/embed/44PoELQxMwI?autoplay=1",
  },
  {
    name: "Dani",
    location: "Joinville — SC",
    quote:
      "Em 1 ano de operação já ultrapassei R$ 1 milhão em faturamento. Nunca imaginei que seria possível com esse modelo.",
    highlight: "R$ 1 milhão em 1 ano",
    videoThumb: "/image/DANI.webp",
    videoThumbFallback: "/image/DANI.png",
    videoUrl: "https://www.youtube.com/embed/_ZKqEShdv1A?autoplay=1",
  },
  {
    name: "Raphael",
    location: "Joinville — SC",
    quote:
      "A verdade sobre a Help Multas é que o modelo realmente funciona. Você tem todo o suporte que precisa para começar e crescer.",
    highlight: "Modelo que realmente funciona",
    videoThumb: "/image/Rapha.webp",
    videoThumbFallback: "/image/Rapha.png",
    videoUrl: "https://www.youtube.com/embed/GhF9Byl44qg?autoplay=1",
  },
  {
    name: "Alisson",
    location: "Caçador — SC",
    quote:
      "A Help me proporcionou mais tempo com a minha família. Eu vinha de um emprego que trabalhava de domingo a domingo — hoje trabalho de segunda a sexta e tenho o final de semana inteiro para estar com eles.",
    highlight: "Mais tempo com a família",
    videoThumb: "/image/ALISSON.jpeg",
    videoThumbFallback: "/image/ALISSON.jpeg",
    videoUrl: "https://www.youtube.com/embed/NsWT_P2RAtM?autoplay=1",
  },
  {
    name: "André",
    location: "Curitiba Centro — PR",
    quote:
      "Não falta apoio. A própria franqueadora dá o suporte, chama a gente, incentiva. Ela não só ajuda, ela orienta.",
    highlight: "Ela não só ajuda, ela orienta",
    videoThumb: "/image/ANDRE.jpeg",
    videoThumbFallback: "/image/ANDRE.jpeg",
    videoUrl: "https://www.youtube.com/embed/TG7Q4yicXek?autoplay=1",
  },
  {
    name: "Jean",
    location: "Palhoça — SC",
    quote:
      "A liberdade que eu tenho hoje é uma coisa bem bacana, que mudou bastante. Não adianta comprar e abandonar — você tem que estar junto, tem que estar presente.",
    highlight: "Liberdade que mudou bastante",
    videoThumb: "/image/JEAN.jpeg",
    videoThumbFallback: "/image/JEAN.jpeg",
    videoUrl: "https://www.youtube.com/embed/Y3LUfnvJdrc?autoplay=1",
  },
  {
    name: "Marcos",
    location: "Paranaguá — PR",
    quote:
      "A Help trouxe liberdade para atender o cliente de um jeito diferenciado, e essa mesma liberdade chegou para mim e para a minha família. O cliente entra com uma dor e sai com uma satisfação.",
    highlight: "cliente entra com dor e sai com satisfação",
    videoThumb: "/image/MARCOS.jpeg",
    videoThumbFallback: "/image/MARCOS.jpeg",
    videoUrl: "https://www.youtube.com/embed/GbKJ6cgk-nQ?autoplay=1",
  },
  {
    name: "Vinicius",
    location: "Pato Branco / Curitiba Hauer — PR",
    quote:
      "O suporte que a franqueadora presta é sensacional. Quando ela pega na mão da gente, literalmente faz a gente crescer. Aqui eu não precisei criar nada do zero — só repliquei o que realmente deu certo.",
    highlight: "Só replico o que já deu certo",
    videoThumb: "/image/VINICIUS.jpeg",
    videoThumbFallback: "/image/VINICIUS.jpeg",
    videoUrl: "https://www.youtube.com/embed/pG5I2rFutPI?autoplay=1",
  },
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
  const [slideState, setSlideState] = useState<"idle" | "exit-left" | "exit-right" | "enter-left" | "enter-right">("idle");
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridInnerRef = useRef<HTMLDivElement>(null);

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
    if (activePage > lastPage) setActivePage(lastPage);
  }, [activePage, totalPages]);

  // Observa o grid interno e trava a altura máxima no wrapper — evita que o CTA se mova
  useEffect(() => {
    if (!gridInnerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = Math.round(entry.contentRect.height);
        setGridHeight((prev) => (prev === null || h > prev ? h : prev));
      }
    });
    observer.observe(gridInnerRef.current);
    return () => observer.disconnect();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  const changePage = (newPage: number, direction: "left" | "right") => {
    if (slideState !== "idle") return;

    setSlideState(direction === "right" ? "exit-left" : "exit-right");

    transitionTimeout.current = setTimeout(() => {
      setActiveVideo(null);
      setActivePage(newPage);
      setSlideState(direction === "right" ? "enter-right" : "enter-left");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlideState("idle");
        });
      });
    }, 220);
  };

  const goToPage = (page: number) =>
    changePage(page, page > activePage ? "right" : "left");

  const goToPreviousPage = () =>
    changePage(
      activePage === 0 ? totalPages - 1 : activePage - 1,
      "left"
    );

  const goToNextPage = () =>
    changePage(
      activePage === totalPages - 1 ? 0 : activePage + 1,
      "right"
    );

  return (
    <section
      id="depoimentos"
      className="py-24 bg-[oklch(0.1998_0.0403_258.29)]"
    >
      <div className="container mx-auto">
        {/* Header */}
        <div
          ref={titleRef as RefObject<HTMLDivElement>}
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

        {/* Carousel */}
        <div className="relative mb-12">

          {/* Wrapper com altura travada — impede que diferença de altura entre páginas mova o CTA */}
          <div
            className="overflow-hidden"
            style={{ minHeight: gridHeight ? `${gridHeight}px` : undefined }}
          >
          {/* Grid com transição de deslize */}
          <div
            ref={gridInnerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{
              transform:
                slideState === "exit-left"
                  ? "translateX(-48px)"
                  : slideState === "exit-right"
                  ? "translateX(48px)"
                  : slideState === "enter-left"
                  ? "translateX(-48px)"
                  : slideState === "enter-right"
                  ? "translateX(48px)"
                  : "translateX(0)",
              opacity:
                slideState === "exit-left" || slideState === "exit-right"
                  ? 0
                  : slideState === "enter-left" || slideState === "enter-right"
                  ? 0
                  : 1,
              transition:
                slideState === "enter-left" || slideState === "enter-right"
                  ? "none"
                  : slideState === "idle"
                  ? "transform 240ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 240ms ease"
                  : "transform 220ms cubic-bezier(0.55,0,1,0.45), opacity 220ms ease",
            }}
          >
            {visibleTestimonials.map((t, i) => {
              const testimonialIndex = startIndex + i;
              const isActive = activeVideo === testimonialIndex;

              return (
                <div
                  key={`${t.name}-${testimonialIndex}`}
                  className="group bg-[oklch(0.1998_0.0403_258.29)] rounded-2xl border border-white/10 overflow-hidden hover:border-gold/40 transition-all duration-300 flex flex-col md:h-[460px]"
                >
                  {/* Video / Thumbnail */}
                  <div className="relative h-65 overflow-hidden flex-shrink-0">
                    {isActive ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveVideo(null)}
                          className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 p-2 rounded-full"
                          aria-label="Fechar vídeo"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>

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
                        <Img
                          webp={t.videoThumb}
                          fallback={t.videoThumbFallback}
                          alt={t.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div
                          onClick={() => setActiveVideo(testimonialIndex)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              setActiveVideo(testimonialIndex);
                          }}
                        >
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                            style={{ background: "oklch(0.8371 0.1715 85.23)" }}
                          >
                            <Play
                              className="w-5 h-5 fill-current"
                              style={{ color: "oklch(0.3274 0.0363 242.96)" }}
                            />
                          </div>
                        </div>

                        {/* Badge highlight */}
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

                  {/* Corpo do card — flex-col com rodapé fixo */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Quote cresce para preencher o espaço disponível */}
                    <p className="font-body text-sm text-white/70 leading-relaxed italic flex-1 md:line-clamp-6 md:overflow-hidden">
                      &quot;{t.quote}&quot;
                    </p>

                    {/* Rodapé sempre no fundo */}
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/[0.08]">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0"
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
          </div>{/* fim overflow-hidden */}

          {/* Navegação unificada: ← • • • → */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={goToPreviousPage}
                className="w-10 h-10 rounded-full border border-white/15 text-white hover:border-gold hover:text-gold transition-colors flex items-center justify-center"
                aria-label="Depoimentos anteriores"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activePage === page
                        ? "w-8 bg-gold"
                        : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Ir para página ${page + 1} dos depoimentos`}
                    aria-current={activePage === page ? "true" : undefined}
                  />
                ))}
              </div>

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