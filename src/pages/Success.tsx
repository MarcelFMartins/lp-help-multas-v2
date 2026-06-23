import { CheckCircle, UserPlus, AlertCircle } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const HERO_BG = "/image/fundo.webp";

/* ─── HELPERS ─── */
const WaSvg = ({ cls }: { cls: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className={cls}>
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);


/* ══════════════════════════════════════════════ */
export default function ThankYouPage() {
  const { ref: ctaRef, inView: ctaInView } = useInView();

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
                  Nossa equipe está analisando o seu perfil neste momento.
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
              href="https://wa.me/554288675156"
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
