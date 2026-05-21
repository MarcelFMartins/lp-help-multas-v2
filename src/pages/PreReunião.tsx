/*
 * ThankYouPage — Página pós-formulário expandida
 * Layout de seções:
 *   1. IMAGEM  — Hero (fundo.webp) · confirmação agendamento
 *   2. AZUL    — Vídeo Help Experience
 *   3. BRANCO  — Autoridade & Reconhecimento (6 cards)
 *   4. AZUL    — Notícias da mídia
 *   5. BRANCO  — Depoimentos (3 vídeos)
 *   6. AZUL    — Equipe
 *   7. BRANCO  — CTA final + footer
 *
 * Colors: Navy #0e1e35 · Gold #D4A017 · White #fff · Offwhite #F8F6F0
 * Typography: Fraunces (display) · Plus Jakarta Sans (body)
 */

import { useState } from "react";
import { Play, X } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { Img } from "@/components/Img";

const HERO_BG = "/image/fundo.webp";

/* ─── DATA ─── */
const recognitions = [
    { title: "+80 Unidades no Brasil", desc: "Uma rede nacional consolidada, com franqueados ativos de norte a sul do país. Presença em todas as regiões, suporte local em cada uma." },
    { title: "Especialistas em Dir. de Trânsito", desc: "Mais de uma década transformando motoristas em clientes satisfeitos. Domínio técnico que nenhum concorrente replica." },
    { title: "Destaque na Grande Mídia", desc: "G1 Globo, TNH1 e outros grandes veículos cobriram o crescimento do mercado em que somos protagonistas." },
    { title: "Help Experience", desc: "Criamos o maior evento de direito de trânsito do Brasil. Reunimos franqueados, especialistas e parceiros todo ano." },
    { title: "+40 Colaboradores", desc: "Um time dedicado exclusivamente ao sucesso de cada franqueado. Suporte técnico, comercial, jurídico e marketing." },
    { title: "Mercado Recorrente e Crescente", desc: "+40% de crescimento em multas em 2025. Cada nova lei fortalece nossa demanda — independente do momento econômico." },
];

const news = [
    {
        src: "G1 Globo · 2025",
        img: "/image/noticia01.webp",
        headline: "2025 registra mais de 10 milhões de multas em rodovias federais",
        blurb: "Sete em cada dez multas foram por excesso de velocidade — um marco histórico no Brasil.",
        link: "https://g1.globo.com/jornal-nacional/noticia/2026/02/09/ano-de-2025-registra-mais-de-10-milhoes-de-multas-em-rodovias-federais-um-marco-historico.ghtml",
    },
    {
        src: "TNH1 · 2025",
        img: "/image/noticia02.webp",
        headline: "Multas disparam 40% em 2025 após mudanças na legislação",
        blurb: "Rodovias federais registram números históricos após novas regulamentações de trânsito.",
        link: "https://www.tnh1.com.br/variedades/apos-mudanca-no-transito-multas-disparam-mais-de-40-no-brasil/",
    },
    {
        src: "G1 Globo · 2023",
        img: "/image/noticia03.webp",
        headline: "São Paulo arrecada R$ 1,6 bilhão em multas — motoristas buscam recursos",
        blurb: "Explosão na arrecadação impulsiona a procura por especialistas em recursos de infração.",
        link: "https://g1.globo.com",
    },
];

const testimonials = [
    { name: "Kelly Volmann", location: "Criciúma — SC", highlight: "Começou sozinha e deu certo", thumb: "/image/KELLY.webp", thumbFallback: "/image/KELLY.png", videoUrl: "https://www.youtube.com/embed/44PoELQxMwI?autoplay=1", quote: "Comecei sozinha e em poucos meses já estava faturando acima das minhas expectativas. O suporte da Help é incrível." },
    { name: "Dani Correa", location: "Joinville — SC", highlight: "R$ 1 milhão em 1 ano", thumb: "/image/DANI.webp", thumbFallback: "/image/DANI.png", videoUrl: "https://www.youtube.com/embed/_ZKqEShdv1A?autoplay=1", quote: "Em 1 ano de operação já ultrapassei R$ 1 milhão em faturamento. Nunca imaginei que seria possível com esse modelo." },
    { name: "Raphael Moraes", location: "Joinville — SC", highlight: "Modelo que realmente funciona", thumb: "/image/Rapha.webp", thumbFallback: "/image/Rapha.png", videoUrl: "https://www.youtube.com/embed/GhF9Byl44qg?autoplay=1", quote: "A verdade sobre a Help Multas é que o modelo realmente funciona. Você tem todo o suporte necessário para começer e crescer." },
];

/* ─── HELPERS ─── */
const WaSvg = ({ cls }: { cls: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className={cls}>
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
);

/* ══════════════════════════════════════════════ */
export default function ThankYouPage() {
    const [activeVideo, setActiveVideo] = useState<number | null>(null);

    const { ref: videoRef, inView: videoInView } = useInView();
    const { ref: recogRef, inView: recogInView } = useInView();
    const { ref: newsRef, inView: newsInView } = useInView();
    const { ref: testRef, inView: testInView } = useInView();
    const { ref: teamRef, inView: teamInView } = useInView();
    const { ref: ctaRef, inView: ctaInView } = useInView();

    return (
        <div className="overflow-x-hidden">

            {/* ══════════════════════════════════════════
          1. IMAGEM — Hero
         ══════════════════════════════════════════ */}
            <section
                className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden"
                style={{
                    backgroundImage: `url(${HERO_BG})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* overlay */}
                <div className="absolute inset-0 bg-[oklch(0.1998_0.0403_258.29)]/75 backdrop-blur-[5px]" />
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,160,23,0.10), transparent)" }} />

                <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
                    {/* Logo */}
                    <div className="mb-10 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                        <img src="/image/H amarelo.png" alt="Help Multas" className="h-14 w-auto" />
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#D4A017]/10 border border-[#D4A017]/25 rounded-full px-4 py-1.5 mb-6 animate-fade-up"
                        style={{ animationDelay: "0.25s" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] animate-pulse" />
                        <span className="font-body text-[#D4A017] text-xs font-bold uppercase tracking-widest">Reunião confirmada</span>
                    </div>

                    {/* Title */}
                    <h1 className="font-display text-4xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-5 animate-fade-up"
                        style={{ animationDelay: "0.3s" }}>
                        PARABÉNS PELO{" "}
                        <span className="text-gold">AGENDAMENTO!</span>
                    </h1>

                    <p className="font-body text-lg text-white/65 leading-relaxed mb-10 animate-fade-up"
                        style={{ animationDelay: "0.4s" }}>
                        Preparamos este material para você chegar à nossa conversa conhecendo quem somos,
                        o que construímos e por que a Help Multas é a franquia de serviços mais sólida do Brasil.
                    </p>

                    {/* WA button */}
                    <div className="mt-8 animate-fade-up" style={{ animationDelay: "0.6s" }}>
                        <a href="https://wa.me/554298673007"
                            className="animate-[bounce_4s_infinite] inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-body font-bold text-sm uppercase tracking-wider bg-[#22c55e] text-white shadow-lg hover:opacity-90 hover:scale-[1.04] active:scale-[0.97] transition-all duration-200">
                            <WaSvg cls="w-5 h-5" />
                            Fale com nosso especialista
                        </a>
                    </div>

                    {/* scroll hint */}
                    <div className="mt-14 flex flex-col items-center gap-2 text-white/25 animate-fade-up"
                        style={{ animationDelay: "1s" }}>
                        <span className="font-body text-xs uppercase tracking-widest">Role para conhecer</span>
                        <div className="w-4 h-4 border-r-2 border-b-2 border-white/25 rotate-45 animate-bounce" />
                    </div>
                </div>
            </section>


            {/* ══════════════════════════════════════════
          2. AZUL — Vídeo Help Experience
         ══════════════════════════════════════════ */}
            <section className="py-24 px-6 bg-[oklch(0.1998_0.0403_258.29)] overflow-hidden">
                <div className="max-w-5xl mx-auto">
                    <div
                        ref={videoRef as React.RefObject<HTMLDivElement>}
                        className={`transition-all duration-1000 ${videoInView ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    >
                        <div className="text-center mb-12">
                            <h2 className="font-display text-3xl lg:text-5xl font-black text-white mb-4">
                                VEJA O TAMANHO DA{" "}
                                <span className="text-gold">HELP MULTAS</span>
                            </h2>
                            <div className="w-16 h-1 bg-gold mx-auto rounded-full" />
                        </div>

                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-[#D4A017]/20">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/dqmeOfJlEcQ"
                                title="Help Experience 2024"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                        <p className="text-center mt-6 font-body text-white/45 italic text-sm">
                            Sinta a energia do maior evento de direito de trânsito do Brasil.
                        </p>
                    </div>
                </div>
            </section>


            {/* ══════════════════════════════════════════
          3. BRANCO — Autoridade & Reconhecimento
         ══════════════════════════════════════════ */}
            <section className="py-24 px-6 bg-[#F8F6F0]">
                <div className="max-w-5xl mx-auto">
                    <div className={`transition-all duration-700 ${recogInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <span className="gold-line" />
                        <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-4">
                            Autoridade e Reconhecimento
                        </p>
                        <h2 className="font-display text-3xl lg:text-5xl font-black text-[oklch(0.1998_0.0403_258.29)] leading-tight mb-4">
                            POR QUE A HELP MULTAS{" "}
                            <span className="text-gold">É REFERÊNCIA?</span>
                        </h2>
                        <p className="font-body text-lg text-gray-500 leading-relaxed max-w-xl">
                            Construída ao longo de anos, nossa reputação é sustentada por resultados reais,
                            estrutura sólida e um modelo que funciona de verdade.
                        </p>
                    </div>

                    <div
                        ref={recogRef as React.RefObject<HTMLDivElement>}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14"
                    >
                        {recognitions.map((r, i) => (
                            <div
                                key={r.title}
                                className={`bg-white border border-gray-100 rounded-2xl p-8 shadow-sm
                  hover:border-[#D4A017]/40 hover:shadow-md transition-all duration-300
                  ${recogInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                `}
                                style={{ transitionDelay: `${(i % 3) * 90 + 80}ms`, transition: "opacity .7s ease, transform .7s ease, border-color .3s, box-shadow .3s" }}
                            >
                                <h3 className="font-display text-lg font-black text-[oklch(0.1998_0.0403_258.29)] mb-3 leading-snug">{r.title}</h3>
                                <p className="font-body text-sm text-gray-500 leading-relaxed">{r.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ══════════════════════════════════════════
          4. AZUL — Notícias da mídia
         ══════════════════════════════════════════ */}
            <section className="py-24 px-6 bg-[oklch(0.1998_0.0403_258.29)]">
                <div className="max-w-5xl mx-auto">
                    <div className={`transition-all duration-700 ${newsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <span className="gold-line" />
                        <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-4">
                            Presença na mídia
                        </p>
                        <h2 className="font-display text-3xl lg:text-5xl font-black text-white leading-tight mb-4">
                            O MERCADO QUE{" "}
                            <span className="text-gold">NUNCA PARA</span>
                        </h2>
                        <p className="font-body text-lg text-white/55 leading-relaxed max-w-xl">
                            Com mais de 10 milhões de multas emitidas em 2025, a grande imprensa brasileira
                            confirma o que já sabemos: este mercado só cresce.
                        </p>
                    </div>

                    <div
                        ref={newsRef as React.RefObject<HTMLDivElement>}
                        className="grid md:grid-cols-3 gap-5 mt-14"
                    >
                        {news.map((n, i) => (
                            <a
                                key={n.headline}
                                href={n.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group bg-white/5 border border-white/8 rounded-2xl overflow-hidden no-underline
                  hover:border-gold/40 hover:text-gold hover:-translate-y-1 transition-all duration-300
                  ${newsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                `}
                                style={{ transitionDelay: `${i * 100 + 100}ms`, transition: "opacity .7s ease, transform .35s ease, border-color .3s" }}
                            >
                                <img src={n.img} alt={n.headline} className="w-full h-44 object-cover block" />
                                <div className="p-5">
                                    <p className="font-body text-[#D4A017] text-[0.68rem] font-bold uppercase tracking-widest mb-2">{n.src}</p>
                                    <h4 className="font-display font-bold text-white text-[0.97rem] leading-snug mb-2">{n.headline}</h4>
                                    <p className="font-body text-white/50 text-sm leading-relaxed">{n.blurb}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>


            {/* ══════════════════════════════════════════
          5. BRANCO — Depoimentos
         ══════════════════════════════════════════ */}
            <section className="py-24 px-6 bg-[#F8F6F0]">
                <div className="max-w-5xl mx-auto">
                    <div className={`text-center transition-all duration-700 ${testInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <span className="gold-line mx-auto" />
                        <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-4">
                            casos de sucesso
                        </p>
                        <h2 className="font-display text-3xl lg:text-5xl font-black text-[oklch(0.1998_0.0403_258.29)] leading-tight mb-4">
                            RESULTADOS QUE{" "}
                            <span className="text-gold">FALAM POR SI</span>
                        </h2>
                        <p className="font-body text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
                            Franqueados reais. Resultados reais. Histórias que podem ser a sua.
                        </p>
                    </div>

                    <div
                        ref={testRef as React.RefObject<HTMLDivElement>}
                        className="grid md:grid-cols-3 gap-6 mt-14"
                    >
                        {testimonials.map((t, i) => {
                            const isActive = activeVideo === i;
                            return (
                                <div
                                    key={t.name}
                                    className={`group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm
                    hover:border-gold/40 hover:shadow-md transition-all duration-300
                    ${testInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                  `}
                                    style={{ transitionDelay: `${i * 120 + 80}ms`, transition: "opacity .7s ease, transform .7s ease, border-color .3s, box-shadow .3s" }}
                                >
                                    {/* Thumb / video */}
                                    <div className="relative aspect-video overflow-hidden">
                                        {isActive ? (
                                            <>
                                                <iframe
                                                    src={t.videoUrl}
                                                    className="w-full h-full"
                                                    title={t.name}
                                                    allow="autoplay; encrypted-media"
                                                    allowFullScreen
                                                />
                                                <button
                                                    onClick={() => setActiveVideo(null)}
                                                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors z-10"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Img
                                                    webp={t.thumb}
                                                    fallback={t.thumbFallback}
                                                    alt={t.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <button
                                                    onClick={() => setActiveVideo(i)}
                                                    className="absolute inset-0 flex items-center justify-center bg-[oklch(0.1998_0.0403_258.29)]/35 hover:bg-[oklch(0.1998_0.0403_258.29)]/15 transition-all duration-200"
                                                >
                                                    <div className="bg-gold/90 rounded-full p-4 hover:scale-110 transition-transform duration-200">
                                                        <Play className="w-5 h-5 text-[oklch(0.1998_0.0403_258.29)] fill-current ml-0.5" />
                                                    </div>
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Body */}
                                    <div className="p-5">
                                        <p className="font-body font-bold text-[oklch(0.1998_0.0403_258.29)] text-sm">{t.name}</p>
                                        <p className="font-body text-gold text-xs mb-3 font-semibold">{t.location}</p>
                                        <span className="inline-block bg-gold/10 border border-[#D4A017]/25 text-gold text-[0.7rem] font-bold uppercase tracking-wide rounded-full px-3 py-0.5 mb-3">
                                            {t.highlight}
                                        </span>
                                        <p className="font-body text-gray-500 text-sm leading-relaxed italic">
                                            "{t.quote}"
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>


            {/* ══════════════════════════════════════════
          6. AZUL — Equipe
         ══════════════════════════════════════════ */}
            <section className="py-24 px-6 bg-[oklch(0.1998_0.0403_258.29)]">
                <div className="max-w-5xl mx-auto">
                    <div
                        ref={teamRef as React.RefObject<HTMLDivElement>}
                        className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20"
                    >
                        {/* Image */}
                        <div className={`flex-1 transition-all duration-1000 delay-200 ${teamInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
                            <div className="relative">
                                <div className="absolute -top-4 -left-4 w-20 h-20 bg-gold rounded-2xl -z-10" />
                                <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10">
                                    <Img webp="/image/equipe_help.webp" fallback="/image/logotipo.png" alt="Equipe Help Multas" className="w-full h-auto object-cover" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-[#D4A017] rounded-full -z-10 opacity-10" />
                            </div>
                        </div>

                        {/* Text */}
                        <div className={`flex-1 transition-all duration-1000 ${teamInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            <span className="gold-line" />
                            <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-4">
                                nosso capital humano
                            </p>
                            <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
                                CONHEÇA O TIME QUE FAZ{" "}
                                <span className="text-gold">ISSO ACONTECER</span>
                            </h2>
                            <p className="font-body text-lg text-white/60 leading-relaxed mb-5">
                                Por trás de cada unidade e de cada recurso vitorioso, existe um time de especialistas
                                apaixonados pelo que fazem.
                            </p>
                            <p className="font-body text-lg text-white/60 leading-relaxed mb-8">
                                Estamos aqui para dar todo o suporte necessário — técnico, comercial, jurídico e de
                                marketing — para que sua franquia seja um sucesso absoluto. Você nunca estará sozinho.
                            </p>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-gold/10 border-l-4 border-[#D4A017]">
                                <span className="text-2xl animate-[bounce_4s_infinite]">🚀</span>
                                <p className="font-body font-semibold text-white">
                                    Mais de 40 colaboradores focados no seu resultado.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ══════════════════════════════════════════
          7. BRANCO — CTA Final + Footer
         ══════════════════════════════════════════ */}
            <section className="py-24 px-6 bg-[#F8F6F0]">
                <div
                    ref={ctaRef as React.RefObject<HTMLDivElement>}
                    className={`max-w-xl mx-auto text-center transition-all duration-700 ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <div className="bg-[oklch(0.1998_0.0403_258.29)] border border-gray-100 rounded-3xl p-12 shadow-md">
                        <h2 className="font-display text-4xl lg:text-5x1 font-black text-white leading-tight tracking-tight mb-4">
                            SUA REUNIÃO ESTÁ{" "}
                            <span className="text-gold">CONFIRMADA!</span>
                        </h2>
                        <p className="font-body text-white text-lg leading-relaxed mb-9">
                            Nosso time de expansão já está aguardando por você. Se quiser adiantar alguma dúvida
                            ou precisar de qualquer informação antes da reunião, fale diretamente com a gente.
                        </p>

                        <a
                            href="https://wa.me/554298673007"
                            className="inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl font-body font-bold text-sm uppercase tracking-wider bg-[#22c55e] text-white shadow-lg hover:opacity-90 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 animate-[bounce_4s_infinite]"
                        >
                            <WaSvg cls="w-5 h-5" />
                            Fale com nosso especialista
                        </a>

                        <p className="font-body text-gray-400 text-xs mt-5">
                            Atendimento via WhatsApp · DDD (42) ou (11)
                        </p>
                    </div>

                    <p className="font-body text-sm text-gray-400 mt-10">
                        © 2026 Help Multas — Todos os direitos reservados.
                    </p>
                </div>

                <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-8px); }
          }
        `}</style>
            </section>

        </div>
    );
}