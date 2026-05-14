/*
 * ThankYouPage — Página de agradecimento após envio do formulário
 * Design: Mantém o background navy com imagem, centraliza a mensagem de sucesso
 * Typography: Fraunces display para headline, Plus Jakarta Sans para corpo
 * Colors: White text on dark navy bg, gold accents
 */

import { CheckCircle, UserPlus, AlertCircle } from "lucide-react";

const HERO_BG = "/image/fundo.webp";

export default function ThankYouPage() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay com blur para manter consistência */}
      <div className="absolute inset-0 bg-[#243746]/60 backdrop-blur-[8px]" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        
        {/* Logo */}
        <div className="mb-12 mt-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <a href="https://franquias.helpmultas.com.br">
            <span className="font-display text-3xl font-bold text-white">
              help<span className="text-gold">multas</span>
            </span>
          </a>
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="bg-gold/20 p-4 rounded-full border border-gold/30 animate-pulse">
            <CheckCircle className="w-16 h-16 text-gold" />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          
          <h1 className="font-display text-4xl lg:text-6xl font-black text-white leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            MUITO <span className="text-gold">OBRIGADO!</span>
          </h1>

          <p className="font-body text-xl text-white/80 leading-relaxed mb-8 font-semibold animate-fade-up" style={{ animationDelay: "0.4s" }}>
            Recebemos seus dados com sucesso.
          </p>

          {/* Card */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6 hover:border-gold/40 transition-all duration-300 group mb-10 text-left animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <h3 className="text-[#facc15] font-bold text-sm md:text-base uppercase tracking-wider mb-6 text-center">
              O que acontece agora?
            </h3>

            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <UserPlus className="w-6 h-6 text-[#22c55e] shrink-0 mt-0.5" strokeWidth={2.5} />
                <p className="text-white text-base md:text-lg leading-relaxed">
                  Nossa equipe de expansão está analisando o seu perfil neste momento.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  className="w-6 h-6 text-[#22c55e] shrink-0 mt-0.5"
                >
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
                <p className="text-white text-base md:text-lg leading-relaxed">
                  Em breve, um de nossos consultores entrará em contato via <strong className="font-bold">WhatsApp</strong> ou <strong className="font-bold">Ligação</strong>.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-[#facc15] shrink-0 mt-0.5" strokeWidth={2.5} />
                <p className="text-white text-base md:text-lg leading-relaxed">
                  Fique atento ao seu telefone com DDD <strong className="font-bold">(42)</strong> ou <strong className="font-bold">(11)</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <a
              href="https://wa.me/554298673007"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:scale-[1.05] active:scale-[0.95] shadow-lg bg-[#22c55e] text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>
              Fale com nosso especialista
            </a>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 mb-5 pt-8 border-white/10 animate-fade-up" style={{ animationDelay: "0.8s" }}>
          <p className="font-body text-sm text-white/40">
            © 2026 Help Multas - Todos os direitos reservados.
          </p>
        </div>
      </div>
    </section>
  );
}