/*
 * ObrigadoBlack — página de obrigado da LP /oportunidade (Black Help Multas)
 *
 * Objetivo único: levar o lead para o grupo VIP.
 *  1. Barra de progresso "Cadastro 90% concluído · falta só 1 etapa"
 *  2. Título "Falta só uma etapa" + recado do CEO (vídeo ~1 min, 16:9)
 *  3. Botão verde "Entrar no grupo VIP"
 *
 * Link do grupo e ID do vídeo ficam em src/lib/blackHelp.ts.
 */

import { useState } from "react";
import { Play } from "lucide-react";
import { BLACK_CEO_VIDEO_COVER, BLACK_CEO_VIDEO_ID, BLACK_VIP_GROUP_URL } from "@/lib/blackHelp";
import { useHeavyMontserrat } from "@/lib/useHeavyMontserrat";
import { logEvent } from "@/lib/logger";
import "./ObrigadoBlack.css";

const WaIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className={className} aria-hidden>
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

const PAGE = "/oportunidade/obrigado";

export default function ObrigadoBlack() {
  useHeavyMontserrat();
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    logEvent(PAGE, "action", "Play no recado do CEO");
  };

  return (
    <div className="ob min-h-screen flex flex-col">
      {/* ── 1. Progresso ── */}
      <div className="ob-progress px-4 py-3 sm:py-4">
        <div className="mx-auto max-w-[760px]">
          <div className="flex items-center justify-between gap-3 text-[13px] sm:text-[14px] text-[#141a24]">
            <p>
              <strong className="font-extrabold">Cadastro 90% concluído</strong>
              <span className="font-medium"> · falta só 1 etapa</span>
            </p>
            <strong className="font-extrabold">90%</strong>
          </div>
          <div
            className="ob-bar mt-2"
            role="progressbar"
            aria-valuenow={90}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Cadastro 90% concluído"
          >
            <div className="ob-bar-fill" style={{ width: "90%" }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em]">
            <span className="text-[#7a6418]">Dados enviados ✓</span>
            <span className="text-[#141a24]">Entrar no grupo VIP</span>
          </div>
        </div>
      </div>

      {/* ── 2. Hero ── */}
      <main className="ob-hero relative flex-1 flex flex-col items-center px-4 pt-8 sm:pt-10 pb-10">
        <div className="ob-hero-bg" aria-hidden />
        <div className="ob-hero-overlay" aria-hidden />

        <div className="relative z-10 w-full max-w-[730px] flex flex-col items-center text-center">
          <img src="/image/H amarelo.png" alt="Help Multas" className="h-14 sm:h-16 w-auto ob-fade" />

          <span className="ob-badge mt-4 ob-fade" style={{ animationDelay: "0.08s" }}>Black Help Multas</span>

          <h1
            className="mt-4 font-black uppercase text-white leading-[1.02] tracking-[-0.01em] text-[34px] sm:text-[48px] lg:text-[52px] ob-fade"
            style={{ animationDelay: "0.16s" }}
          >
            Falta só <span className="text-[#f5c518]">uma etapa</span>
          </h1>

          <p
            className="mt-4 max-w-[560px] text-[15px] sm:text-[17px] leading-relaxed text-white/80 ob-fade"
            style={{ animationDelay: "0.24s" }}
          >
            Assista ao recado do nosso CEO e <strong className="text-white font-bold">entre no grupo VIP</strong>. É lá que a
            condição especial da Black Help Multas é anunciada primeiro.
          </p>

          {/* ── vídeo ── */}
          <div className="ob-video mt-6 w-full ob-fade" style={{ animationDelay: "0.32s" }}>
            <div className="relative aspect-video">
              {playing ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${BLACK_CEO_VIDEO_ID}?autoplay=1&rel=0`}
                  title="Recado do CEO — Black Help Multas"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <button type="button" onClick={play} className="ob-thumb group" aria-label="Assistir ao recado do CEO">
                  {/* capa já traz título, legenda e nome do Roberson */}
                  <img
                    src={BLACK_CEO_VIDEO_COVER}
                    alt="Roberson Alvarenga, CEO da Help Multas — A condição da Black Help Multas. 1 minuto, assista antes de entrar no grupo"
                    className="ob-thumb-cover"
                  />

                  <span className="ob-tag">
                    <span className="ob-tag-dot" /> Recado do CEO
                  </span>

                  <span className="ob-play">
                    <Play className="w-[40%] h-[40%] fill-current ml-[6%]" />
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* ── 3. CTA ── */}
          <a
            href={BLACK_VIP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => logEvent(PAGE, "action", "Clique em Entrar no grupo VIP")}
            className="ob-cta mt-6 ob-fade"
            style={{ animationDelay: "0.4s" }}
          >
            <WaIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            Entrar no grupo VIP
          </a>

          <p className="mt-4 max-w-[380px] text-[13px] leading-snug font-medium text-white/80">
            Grupo só de avisos da equipe Help Multas.{" "}
            <strong className="text-[#f5c518] font-bold">A condição sai lá primeiro</strong>, de 01 a 30/11.
          </p>
        </div>

        <p className="relative z-10 mt-auto pt-12 text-[12px] text-white/45">
          © 2026 Help Multas · Todos os direitos reservados.
        </p>
      </main>
    </div>
  );
}
