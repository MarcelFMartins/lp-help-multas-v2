/*
 * blackHelp — configuração da campanha Black Help Multas (01 a 30/11/2026)
 *
 * Tudo que muda conforme as condições definidas pela franqueadora fica aqui:
 * desconto exibido na faixa, prazo, link do grupo VIP e vídeo do CEO.
 */

/** Fim da oferta: 30/11/2026 às 23:59:59 (horário de Brasília) */
export const BLACK_END = new Date("2026-11-30T23:59:59-03:00");

/** Desconto exibido na faixa — HIPÓTESE, aguardando a condição oficial */
export const BLACK_DISCOUNT = {
  prefix: "Até",
  value: "50%",
  suffix: "OFF",
  target: "na taxa de franquia",
};

/** Link do grupo VIP no WhatsApp — TODO: trocar pelo link oficial do grupo */
export const BLACK_VIP_GROUP_URL = "https://chat.whatsapp.com/";

/**
 * Vídeo do recado do CEO (YouTube, 16:9, ~1 min).
 * TODO: trocar pelo ID do vídeo novo da página de obrigado.
 */
export const BLACK_CEO_VIDEO_ID = "UfOancwMTv4";

/** Capa do vídeo do CEO (já com título e nome aplicados na arte) */
export const BLACK_CEO_VIDEO_COVER = "/image/capa-recado-ceo-black.webp";

export type Countdown = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

export function getCountdown(now = Date.now()): Countdown {
  const diff = Math.max(0, BLACK_END.getTime() - now);
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: diff === 0,
  };
}
