/*
 * ThankYouPage — Página de agradecimento após envio do formulário
 * Estrutura:
 *  1. Hero: logo → ícone → título → subtítulo → VÍDEO GRANDE → botão WA
 *  2. Casos de Sucesso (carrossel paginado)
 *  3. O que acontece agora? + CTA final
 */

import { useState, useEffect, useRef } from "react";
import { CheckCircle, UserPlus, AlertCircle, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { Img } from "@/components/Img";

const HERO_BG = "/image/fundo.webp";



/* ─── DADOS ─── */
const testimonials = [
  {
    name: "Vinicius",
    location: "Pato Branco / Curitiba Hauer — PR",
    quote: "O suporte que a franqueadora presta é sensacional. Quando ela pega na mão da gente, literalmente faz a gente crescer. Aqui eu não precisei criar nada do zero — só repliquei o que realmente deu certo.",
    highlight: "Só replico o que já deu certo",
    videoThumb: "/image/VINICIUS.jpeg",
    videoThumbFallback: "/image/VINICIUS.jpeg",
    videoUrl: "https://www.youtube.com/embed/pG5I2rFutPI?autoplay=1",
  },
  {
    name: "Kelly",
    location: "Criciúma — SC",
    quote: "Comecei sozinha e em poucos meses já estava faturando acima das minhas expectativas. O suporte da Help é incrível.",
    highlight: "Começou sozinha e deu certo",
    videoThumb: "/image/KELLY.webp",
    videoThumbFallback: "/image/KELLY.png",
    videoUrl: "https://www.youtube.com/embed/44PoELQxMwI?autoplay=1",
  },
  {
    name: "André",
    location: "Curitiba Centro — PR",
    quote: "Não falta apoio. A própria franqueadora dá o suporte, chama a gente, incentiva. Ela não só ajuda, ela orienta.",
    highlight: "Ela não só ajuda, ela orienta",
    videoThumb: "/image/ANDRE.jpeg",
    videoThumbFallback: "/image/ANDRE.jpeg",
    videoUrl: "https://www.youtube.com/embed/TG7Q4yicXek?autoplay=1",
  },
  {
    name: "Dani",
    location: "Joinville — SC",
    quote: "Em 1 ano de operação já ultrapassei R$ 1 milhão em faturamento. Nunca imaginei que seria possível com esse modelo.",
    highlight: "R$ 1 milhão em 1 ano",
    videoThumb: "/image/DANI.webp",
    videoThumbFallback: "/image/DANI.png",
    videoUrl: "https://www.youtube.com/embed/_ZKqEShdv1A?autoplay=1",
  },
  {
    name: "Raphael",
    location: "Joinville — SC",
    quote: "A verdade sobre a Help Multas é que o modelo realmente funciona. Você tem todo o suporte que precisa para começar e crescer.",
    highlight: "Modelo que realmente funciona",
    videoThumb: "/image/Rapha.webp",
    videoThumbFallback: "/image/Rapha.png",
    videoUrl: "https://www.youtube.com/embed/GhF9Byl44qg?autoplay=1",
  },
  {
    name: "Alisson",
    location: "Caçador — SC",
    quote: "A Help me proporcionou mais tempo com a minha família. Eu vinha de um emprego que trabalhava de domingo a domingo — hoje trabalho de segunda a sexta e tenho o final de semana inteiro para estar com eles.",
    highlight: "Mais tempo com a família",
    videoThumb: "/image/ALISSON.jpeg",
    videoThumbFallback: "/image/ALISSON.jpeg",
    videoUrl: "https://www.youtube.com/embed/NsWT_P2RAtM?autoplay=1",
  },
  {
    name: "Jean",
    location: "Palhoça — SC",
    quote: "A liberdade que eu tenho hoje é uma coisa bem bacana, que mudou bastante. Não adianta comprar e abandonar — você tem que estar junto, tem que estar presente.",
    highlight: "Liberdade que mudou bastante",
    videoThumb: "/image/JEAN.jpeg",
    videoThumbFallback: "/image/JEAN.jpeg",
    videoUrl: "https://www.youtube.com/embed/Y3LUfnvJdrc?autoplay=1",
  },
  {
    name: "Marcos",
    location: "Paranaguá — PR",
    quote: "A Help trouxe liberdade para atender o cliente de um jeito diferenciado, e essa mesma liberdade chegou para mim e para a minha família. O cliente entra com uma dor e sai com uma satisfação.",
    highlight: "Cliente entra com dor e sai com satisfação",
    videoThumb: "/image/MARCOS.jpeg",
    videoThumbFallback: "/image/MARCOS.jpeg",
    videoUrl: "https://www.youtube.com/embed/GbKJ6cgk-nQ?autoplay=1",
  },
];

/* ─── HELPERS ─── */
const WaSvg = ({ cls }: { cls: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className={cls}>
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

const getItemsPerPage = () => {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
};

/* ══════════════════════════════════════════════ */
export default function ThankYouPage() {
  /* ─── carrossel ─── */
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [activePage, setActivePage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);
  const [slideState, setSlideState] = useState<"idle" | "exit-left" | "exit-right" | "enter-left" | "enter-right">("idle");
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridInnerRef = useRef<HTMLDivElement>(null);

  const { ref: testTitleRef, inView: testTitleInView } = useInView();
  const { ref: ctaRef, inView: ctaInView } = useInView();

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const startIndex = activePage * itemsPerPage;
  const visibleTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage);

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

  useEffect(() => () => {
    if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
  }, []);

  const changePage = (newPage: number, direction: "left" | "right") => {
    if (slideState !== "idle") return;
    setSlideState(direction === "right" ? "exit-left" : "exit-right");
    transitionTimeout.current = setTimeout(() => {
      setActiveVideo(null);
      setActivePage(newPage);
      setSlideState(direction === "right" ? "enter-right" : "enter-left");
      requestAnimationFrame(() => requestAnimationFrame(() => setSlideState("idle")));
    }, 220);
  };

  const goToPage = (page: number) => changePage(page, page > activePage ? "right" : "left");
  const goToPreviousPage = () => changePage(activePage === 0 ? totalPages - 1 : activePage - 1, "left");
  const goToNextPage = () => changePage(activePage === totalPages - 1 ? 0 : activePage + 1, "right");

  /* ─── vídeo hero ─── */
  const [isPlaying, setIsPlaying] = useState(false);
  const youtubeId = "uhLKyugkczY";

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════
          1. Hero
         ══════════════════════════════════════════ */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-16"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[oklch(0.1998_0.0403_258.29)]/65 backdrop-blur-[8px]" />
        {/* glow dourado atrás do vídeo */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[60%] pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,160,23,0.12), transparent)" }}
        />

        <div className="relative z-10 w-full flex flex-col items-center gap-8">

          {/* Logo */}
          <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <img src="/image/helpinho 3d.png" alt="Help Multas" className="h-14 w-auto" />
          </div>

          {/* Ícone + texto — container estreito */}
          <div className="max-w-2xl w-full text-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex justify-center mb-6">
              <div className="bg-gold/20 p-4 rounded-full border border-gold/30 animate-pulse inline-block">
                <CheckCircle className="w-14 h-14 text-gold" />
              </div>
            </div>
            <h1 className="font-display text-4xl lg:text-6xl font-black text-white leading-tight mb-3">
              MUITO <span className="text-gold">OBRIGADO!</span>
            </h1>
            <p className="font-body text-xl text-white/75 leading-relaxed font-semibold">
              Recebemos seus dados com sucesso.
            </p>
          </div>

          {/* ── VÍDEO — container alargado ── */}
          <div className="w-full max-w-5xl animate-fade-up" style={{ animationDelay: "0.38s" }}>
            <div className="relative rounded-3xl overflow-hidden border border-[#D4A017]/35 shadow-[0_50px_100px_rgba(0,0,0,0.8),0_0_80px_rgba(212,160,23,0.18)] bg-black">

              {/* player */}
              <div className="relative aspect-video group">
                {!isPlaying ? (
                  <div onClick={() => setIsPlaying(true)} className="absolute inset-0 cursor-pointer">
                    <img
                      src="/image/ThumbObrigado.png"
                      alt="Conheça a Help Multas"
                      className="w-full h-full object-cover"
                    />
                    {/* overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/70 group-hover:via-black/30" />

                    {/* play centralizado */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                      <div
                        className="w-28 h-28 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(212,160,23,0.7),0_0_120px_rgba(212,160,23,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_80px_rgba(212,160,23,0.9),0_0_160px_rgba(212,160,23,0.4)]"
                        style={{ background: "oklch(0.8371 0.1715 85.23)" }}
                      >
                        <Play
                          className="w-11 h-11 fill-current ml-2.5"
                          style={{ color: "oklch(0.3274 0.0363 242.96)" }}
                        />
                      </div>
                      <span className="font-body text-white text-sm font-bold uppercase tracking-[0.2em] bg-black/50 px-5 py-2 rounded-full backdrop-blur-sm border border-white/10">
                        Assistir
                      </span>
                    </div>

                    {/* label canto superior esquerdo */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
                      <span className="font-body text-white/80 text-xs font-semibold uppercase tracking-widest">
                        Obrigado por enviar nosso Formulário!!
                      </span>
                    </div>
                  </div>
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                    title="Conheça a Help Multas"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>

              {/* rodapé */}
              <div className="flex items-center justify-between gap-4 px-6 py-4 bg-[oklch(0.13_0.03_258)] border-t border-white/8">
                <p className="font-body text-sm text-white/50">
                  Assista enquanto aguarda o nosso contato
                </p>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="flex flex-col items-center gap-2 text-white/25 pb-4 animate-fade-up" style={{ animationDelay: "0.7s" }}>
            <span className="font-body text-xs uppercase tracking-widest">Role para ver casos de sucesso</span>
            <div className="w-4 h-4 border-r-2 border-b-2 border-white/25 rotate-45 animate-bounce" />
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. Casos de Sucesso
         ══════════════════════════════════════════ */}
      <section id="depoimentos" className="py-24 bg-[oklch(0.1998_0.0403_258.29)]">
        <div className="container mx-auto">

          <div
            ref={testTitleRef as React.RefObject<HTMLDivElement>}
            className={`text-center mb-16 transition-all duration-700 ${testTitleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
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
              Franqueados reais, resultados reais. Veja o que nossos parceiros têm a dizer.
            </p>
          </div>

          {/* Carrossel */}
          <div className="relative mb-12">
            <div
              className="overflow-hidden"
              style={{ minHeight: gridHeight ? `${gridHeight}px` : undefined }}
            >
              <div
                ref={gridInnerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                style={{
                  transform:
                    slideState === "exit-left" ? "translateX(-48px)"
                    : slideState === "exit-right" ? "translateX(48px)"
                    : slideState === "enter-left" ? "translateX(-48px)"
                    : slideState === "enter-right" ? "translateX(48px)"
                    : "translateX(0)",
                  opacity:
                    slideState === "exit-left" || slideState === "exit-right" ? 0
                    : slideState === "enter-left" || slideState === "enter-right" ? 0
                    : 1,
                  transition:
                    slideState === "enter-left" || slideState === "enter-right" ? "none"
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
                              <iframe src={t.videoUrl} className="w-full h-full" title={t.name} allow="autoplay; encrypted-media" allowFullScreen />
                            ) : (
                              <video src={t.videoUrl} controls autoPlay className="w-full h-full object-cover" />
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
                              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveVideo(testimonialIndex); }}
                            >
                              <div
                                className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                style={{ background: "oklch(0.8371 0.1715 85.23)" }}
                              >
                                <Play className="w-5 h-5 fill-current" style={{ color: "oklch(0.3274 0.0363 242.96)" }} />
                              </div>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                              <span
                                className="inline-block px-3 py-1 rounded-full font-body font-bold text-xs uppercase tracking-wide"
                                style={{ background: "oklch(0.8371 0.1715 85.23)", color: "oklch(0.3274 0.0363 242.96)" }}
                              >
                                {t.highlight}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <p className="font-body text-sm text-white/70 leading-relaxed italic flex-1 md:line-clamp-6 md:overflow-hidden">
                          &quot;{t.quote}&quot;
                        </p>
                        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/[0.08]">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0"
                            style={{ background: "oklch(0.8371 0.1715 85.23)", color: "oklch(0.3274 0.0363 242.96)" }}
                          >
                            {t.name[0]}
                          </div>
                          <div>
                            <p className="font-body font-semibold text-white text-sm">{t.name}</p>
                            <p className="font-body text-xs text-white/50">{t.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button type="button" onClick={goToPreviousPage} className="w-10 h-10 rounded-full border border-white/15 text-white hover:border-gold hover:text-gold transition-colors flex items-center justify-center" aria-label="Depoimentos anteriores">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      className={`h-2 rounded-full transition-all duration-300 ${activePage === page ? "w-8 bg-gold" : "w-2 bg-white/20 hover:bg-white/40"}`}
                      aria-label={`Ir para página ${page + 1} dos depoimentos`}
                      aria-current={activePage === page ? "true" : undefined}
                    />
                  ))}
                </div>
                <button type="button" onClick={goToNextPage} className="w-10 h-10 rounded-full border border-white/15 text-white hover:border-gold hover:text-gold transition-colors flex items-center justify-center" aria-label="Próximos depoimentos">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. O que acontece agora? + CTA final
         ══════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[oklch(0.1998_0.0403_258.29)]">
        <div
          ref={ctaRef as React.RefObject<HTMLDivElement>}
          className={`max-w-2xl mx-auto transition-all duration-700 ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <span className="gold-line mx-auto" />
            <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-3">
              Próximos passos
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-black text-white leading-tight">
              O QUE ACONTECE <span className="text-gold">AGORA?</span>
            </h2>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-5 mb-12">

            {/* Step 1 */}
            <div className="flex items-start gap-5 bg-white/5 rounded-2xl border border-white/8 p-6 hover:border-gold/30 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5 text-[#22c55e]" strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-body font-bold text-white text-base mb-1">Análise de perfil</p>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  Nossa equipe de expansão está analisando o seu perfil neste momento.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-5 bg-white/5 rounded-2xl border border-white/8 p-6 hover:border-gold/30 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center shrink-0">
                <WaSvg cls="w-5 h-5 text-[#22c55e]" />
              </div>
              <div>
                <p className="font-body font-bold text-white text-base mb-1">Contato via WhatsApp ou Ligação</p>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  Em breve, um de nossos consultores entrará em contato para dar os próximos passos.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-5 bg-white/5 rounded-2xl border border-white/8 p-6 hover:border-gold/30 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-[#facc15]/15 border border-[#facc15]/30 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-[#facc15]" strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-body font-bold text-white text-base mb-1">Fique atento ao telefone</p>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  Nosso contato virá com DDD <strong className="text-white font-bold">(42)</strong> ou <strong className="text-white font-bold">(11)</strong>. Não perca a ligação!
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="font-body text-white/50 text-sm mb-5">
              Prefere adiantar a conversa? Fale direto com a gente.
            </p>
            <a
              href="https://wa.me/554298673007"
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:scale-[1.03] active:scale-[0.97] shadow-lg animate-[bounce_4s_infinite] bg-[#22c55e] text-white"
            >
              <WaSvg cls="w-5 h-5" />
              Falar com especialista
            </a>
            <p className="font-body text-white/30 text-xs mt-4">
              Atendimento via WhatsApp · DDD (42) ou (11)
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="py-6 bg-[oklch(0.1998_0.0403_258.29)] text-center">
        <p className="font-body text-sm text-white/30">
          © 2026 Help Multas — Todos os direitos reservados.
        </p>
      </div>

    </div>
  );
}