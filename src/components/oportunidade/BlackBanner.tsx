/*
 * BlackBanner — faixa da Black Help Multas no topo da LP /oportunidade
 *
 * Desktop: fitas diagonais animadas + card com selo "ao vivo", desconto,
 *          contador regressivo até 30/11 e CTA que leva ao formulário.
 * Mobile:  versão compacta com listras de advertência em cima e embaixo.
 *
 * Desconto, prazo e textos ficam em src/lib/blackHelp.ts.
 * A faixa some sozinha quando o prazo acaba.
 */

import { useEffect, useState } from "react";
import { BLACK_DISCOUNT, getCountdown, type Countdown } from "@/lib/blackHelp";
import { useHeavyMontserrat } from "@/lib/useHeavyMontserrat";
import "./BlackBanner.css";

const pad = (n: number) => String(n).padStart(2, "0");

function useCountdown(): Countdown {
  const [cd, setCd] = useState(getCountdown);
  useEffect(() => {
    const id = window.setInterval(() => setCd(getCountdown()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return cd;
}

function scrollToForm(e: React.MouseEvent<HTMLAnchorElement>) {
  const form = document.getElementById("formulario");
  if (!form) return;
  e.preventDefault();
  form.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => {
    form.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
  }, 600);
}

/* ─── fitas ─── */
const discountTxt = `${BLACK_DISCOUNT.prefix} ${BLACK_DISCOUNT.value} ${BLACK_DISCOUNT.suffix}`;
const goldWords = ["Black", "Só até 30/11", discountTxt];
const darkWords = ["Black", "Help Multas"];

type Tape = { top: string; rotate: number; variant: "gold" | "dark" | "ghost"; words: string[]; reverse?: boolean };
const tapes: Tape[] = [
  { top: "8%", rotate: -6, variant: "ghost", words: darkWords },
  { top: "22%", rotate: 7, variant: "gold", words: goldWords },
  { top: "40%", rotate: -5, variant: "dark", words: darkWords, reverse: true },
  { top: "62%", rotate: -9, variant: "gold", words: goldWords, reverse: true },
  { top: "78%", rotate: 5, variant: "dark", words: darkWords },
  { top: "90%", rotate: -3, variant: "ghost", words: [discountTxt, "Black"], reverse: true },
];

function TapeRow({ t }: { t: Tape }) {
  const items = Array.from({ length: 10 }, () => t.words).flat();
  const half = (
    <span>
      {items.map((w, i) => (
        <span key={i}>
          {w}
          <span className="bb-star">✦</span>
        </span>
      ))}
    </span>
  );
  return (
    <div
      className={`bb-tape bb-tape--${t.variant}${t.reverse ? " bb-tape--reverse" : ""}`}
      style={{ top: t.top, transform: `rotate(${t.rotate}deg)` }}
    >
      <div className="bb-tape-track">
        {half}
        {half}
      </div>
    </div>
  );
}

/* ─── contador ─── */
function Digits({ cd, size }: { cd: Countdown; size: "lg" | "sm" }) {
  const units = [
    { v: cd.days, l: "Dias" },
    { v: cd.hours, l: "Horas" },
    { v: cd.minutes, l: "Min" },
    { v: cd.seconds, l: "Seg", sec: true },
  ];
  const box = size === "lg" ? "w-[58px] py-2" : "w-[36px] py-1";
  const gap = size === "lg" ? "gap-1.5" : "gap-[3px]";
  const num = size === "lg" ? "text-[26px]" : "text-[17px]";
  const lbl = size === "lg" ? "text-[9px] mt-1" : "text-[7px] mt-0.5";
  return (
    <div className={`flex items-center shrink-0 ${gap}`} role="timer" aria-label={`Faltam ${cd.days} dias, ${cd.hours} horas e ${cd.minutes} minutos`}>
      {units.map((u, i) => (
        <div key={u.l} className={`flex items-center ${gap}`}>
          {i > 0 && <span className="font-extrabold text-white/60" aria-hidden>:</span>}
          <div className={`bb-digit ${u.sec ? "bb-digit--sec" : ""} ${box}`}>
            <span className={`bb-digit-num ${num} ${u.sec ? "bb-gold-text" : ""}`}>{pad(u.v)}</span>
            <span className={`bb-digit-label ${lbl}`}>{u.l}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Brand({ size }: { size: "lg" | "sm" }) {
  return (
    <div>
      <p className={`flex items-center gap-1.5 font-bold uppercase tracking-[0.18em] text-white/85 ${size === "lg" ? "text-[11px] mb-1" : "text-[9px]"}`}>
        <span className="bb-live-dot" /> Ao vivo
      </p>
      <p className={`font-black italic uppercase leading-[0.95] ${size === "lg" ? "text-[28px]" : "text-[15px]"}`}>
        <span className="bb-gold-text pr-1">Black</span>
        {size === "lg" ? <br /> : " "}
        <span className="whitespace-nowrap">Help Multas</span>
      </p>
      {size === "lg" && (
        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">Expansão 2026</p>
      )}
    </div>
  );
}

export default function BlackBanner() {
  useHeavyMontserrat();
  const cd = useCountdown();
  if (cd.done) return null;

  return (
    <section className="bb" aria-label="Black Help Multas — oferta por tempo limitado">
      {/* ───────── Desktop ───────── */}
      <div className="hidden md:flex relative items-center justify-center px-6 py-6 min-h-[245px]">
        <div className="bb-tapes" aria-hidden>
          {tapes.map((t, i) => <TapeRow key={i} t={t} />)}
        </div>

        <div className="bb-card w-full max-w-[830px] grid grid-cols-[1fr_auto_1.35fr] items-center px-7 py-5 gap-0">
          <div className="pr-6 border-r border-white/10">
            <Brand size="lg" />
          </div>

          <div className="px-7 text-center border-r border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">{BLACK_DISCOUNT.prefix}</p>
            <p className="flex items-start justify-center leading-none my-1">
              <span className="bb-gold-text font-black text-[58px] tracking-tight">{BLACK_DISCOUNT.value}</span>
              <span className="bb-gold-text font-black text-[22px] mt-1.5 ml-1">{BLACK_DISCOUNT.suffix}</span>
            </p>
            <p className="text-[12px] font-bold text-white">{BLACK_DISCOUNT.target}</p>
          </div>

          <div className="pl-6 flex flex-col items-stretch">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">A oferta acaba em</p>
              <p className="text-[10px] font-extrabold text-[#f5c518]">30/11</p>
            </div>
            <Digits cd={cd} size="lg" />
            <a href="#formulario" onClick={scrollToForm} className="bb-cta mt-3 h-[42px] text-[13px] px-5 whitespace-nowrap">
              Garantir meu desconto
            </a>
            <p className="mt-2 text-center text-[10px] text-white/55">
              Condição por região. Quando a sua fecha, sai da oferta.
            </p>
          </div>
        </div>
      </div>

      {/* ───────── Mobile ───────── */}
      <div className="md:hidden">
        <div className="bb-hazard" aria-hidden />
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Brand size="sm" />
            <p className="flex items-end gap-1 shrink-0 leading-none">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/70 mb-1">{BLACK_DISCOUNT.prefix}</span>
              <span className="bb-gold-text font-black text-[26px] tracking-tight">{BLACK_DISCOUNT.value}</span>
              <span className="bb-gold-text font-black text-[11px] self-start">{BLACK_DISCOUNT.suffix}</span>
            </p>
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <Digits cd={cd} size="sm" />
            <a href="#formulario" onClick={scrollToForm} className="bb-cta h-[38px] text-[10px] leading-[1.1] text-center tracking-[0.03em] px-2 flex-1 min-w-0">
              Garantir meu desconto
            </a>
          </div>
        </div>
        <div className="bb-hazard" aria-hidden />
      </div>
    </section>
  );
}
