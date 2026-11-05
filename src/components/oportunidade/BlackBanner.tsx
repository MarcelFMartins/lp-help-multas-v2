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

import { useEffect, useRef, useState } from "react";
import { BLACK_DISCOUNT, getCountdown, type Countdown } from "@/lib/blackHelp";
import StickyNav from "@/components/StickyNav";
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
  { top: "4%", rotate: -3, variant: "gold", words: goldWords },
  { top: "36%", rotate: 4, variant: "dark", words: darkWords, reverse: true },
  { top: "68%", rotate: -4, variant: "gold", words: goldWords, reverse: true },
]

const miniTapes: Tape[] = [
  { top: "-4px", rotate: 1.2, variant: "gold", words: goldWords },
  { top: "36%", rotate: -1.5, variant: "dark", words: darkWords, reverse: true },
  { top: "calc(100% - 18px)", rotate: 1, variant: "gold", words: goldWords, reverse: true },
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
function Digits({ cd, size }: { cd: Countdown; size: "md" | "sm" | "xs" }) {
  const units = [
    { v: cd.days, l: "Dias" },
    { v: cd.hours, l: "Horas" },
    { v: cd.minutes, l: "Min" },
    { v: cd.seconds, l: "Seg", sec: true },
  ];
  const { box, gap, num, lbl } = {
    md: { box: "w-[48px] py-1.5", gap: "gap-1", num: "text-[21px]", lbl: "text-[8px] mt-0.5" },
    sm: { box: "w-[36px] py-1", gap: "gap-[3px]", num: "text-[17px]", lbl: "text-[7px] mt-0.5" },
    xs: { box: "w-[30px] py-[3px]", gap: "gap-[2px]", num: "text-[13px]", lbl: "hidden" },
  }[size];
  return (
    <div className={`flex items-center shrink-0 ${gap}`} role="timer" aria-label={`Faltam ${cd.days} dias, ${cd.hours} horas e ${cd.minutes} minutos`}>
      {units.map((u, i) => (
        <div key={u.l} className={`flex items-center ${gap}`}>
          {i > 0 && <span className="font-extrabold text-white/60" aria-hidden>:</span>}
          <div className={`bb-digit ${u.sec ? "bb-digit--sec" : ""} ${box}`}>
            <span className={`bb-digit-num ${num} ${u.sec ? "bb-gold-text" : ""}`}>{pad(u.v)}</span>
            {size !== "xs" && <span className={`bb-digit-label ${lbl}`}>{u.l}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Brand({ size }: { size: "lg" | "sm" }) {
  return (
    <div>
      <p className={`flex items-center gap-1.5 font-bold uppercase tracking-[0.18em] text-white/85 ${size === "lg" ? "text-[10px] mb-1" : "text-[9px]"}`}>
        <span className="bb-live-dot" /> Ao vivo{size === "lg" && <span className="hidden xl:inline text-white/45">&nbsp;· Expansão 2026</span>}
      </p>
      <p className={`font-black italic uppercase leading-[0.95] whitespace-nowrap ${size === "lg" ? "text-[20px] xl:text-[22px]" : "text-[15px]"}`}>
        <span className="bb-gold-text pr-1">Black</span> Help Multas
      </p>
    </div>
  );
}

/** Altura do header fixo da Black */
export const BLACK_BAR_HEIGHT = 78;


export default function BlackBanner() {
  useHeavyMontserrat();
  const cd = useCountdown();
  const ref = useRef<HTMLElement>(null);
  const [compact, setCompact] = useState(false);

  /* barra compacta fixa aparece quando a faixa grande sai da tela */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [cd.done]);

  /* depois de 30/11 a LP volta a usar a nav padrão */
  if (cd.done) return <StickyNav />;

  return (
    <>
      <section ref={ref} className="bb" aria-label="Black Help Multas — oferta por tempo limitado">
        {/* ───────── Desktop (≥1024px) ───────── */}
        <div className="hidden lg:flex relative items-center justify-center px-6 py-3.5">
          <div className="bb-tapes" aria-hidden>
            {tapes.map((t, i) => <TapeRow key={i} t={t} />)}
          </div>

          <div className="bb-card w-full max-w-[1040px] flex items-center justify-between gap-4 xl:gap-7 pl-5 pr-5 xl:pl-6 xl:pr-7 py-3">
            <div className="shrink-0">
              <Brand size="lg" />
            </div>

            <div className="shrink-0 flex flex-col items-center pl-4 xl:pl-7 border-l border-white/10">
              <div className="flex items-start leading-none">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/70 mr-1.5 mt-1">{BLACK_DISCOUNT.prefix}</span>
                <span className="bb-gold-text font-black text-[36px] tracking-tight">{BLACK_DISCOUNT.value}</span>
                <span className="bb-gold-text font-black text-[14px] mt-1 ml-0.5">{BLACK_DISCOUNT.suffix}</span>
              </div>
              <p className="mt-0.5 text-[10px] font-bold text-white whitespace-nowrap">{BLACK_DISCOUNT.target}</p>
            </div>

            <div className="shrink-0 flex flex-col pl-4 xl:pl-7 border-l border-white/10">
              <p className="mb-1 flex justify-between text-[9px] font-bold uppercase tracking-[0.18em] text-white/70 whitespace-nowrap">
                A oferta acaba em <span className="text-[#f5c518] ml-2">30/11</span>
              </p>
              <Digits cd={cd} size="md" />
            </div>

            <div className="flex flex-col items-center shrink-0">
              <a href="#formulario" onClick={scrollToForm} className="bb-cta h-[40px] text-[12px] px-5 whitespace-nowrap">
                Garantir meu desconto
              </a>
              <p className="hidden xl:block mt-1.5 text-center text-[10px] leading-[1.35] text-white/60">
                Condição por região.<br />
                <span className="text-white/80 font-semibold">Quando a sua fecha, sai da oferta.</span>
              </p>
            </div>
          </div>
        </div>

        {/* ───────── Mobile e tablet (<1024px) ───────── */}
        <div className="lg:hidden">
          <div className="bb-hazard" aria-hidden />
          <div className="px-4 py-2.5 mx-auto max-w-[640px]">
            <div className="flex items-center justify-between gap-3">
              <Brand size="sm" />
              <p className="flex items-end gap-1 shrink-0 leading-none">
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/70 mb-1">{BLACK_DISCOUNT.prefix}</span>
                <span className="bb-gold-text font-black text-[26px] tracking-tight">{BLACK_DISCOUNT.value}</span>
                <span className="bb-gold-text font-black text-[11px] self-start">{BLACK_DISCOUNT.suffix}</span>
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <Digits cd={cd} size="sm" />
              <a href="#formulario" onClick={scrollToForm} className="bb-cta h-[38px] text-[10px] leading-[1.1] text-center tracking-[0.03em] px-2 flex-1 min-w-0">
                Garantir meu desconto
              </a>
            </div>
          </div>
          <div className="bb-hazard" aria-hidden />
        </div>
      </section>

      {/* ───────── Header fixo da Black (acompanha a rolagem) ───────── */}
      <header
        className={`bb bb-bar ${compact ? "bb-bar--on" : ""}`}
        style={{ height: BLACK_BAR_HEIGHT }}
        aria-hidden={!compact}
      >
        <div className="bb-tapes bb-tapes--mini" aria-hidden>
          {miniTapes.map((t, i) => <TapeRow key={i} t={t} />)}
        </div>

        <div className="relative h-full flex items-center px-2 md:px-4">
          <div className="bb-card bb-bar-card w-full max-w-[1240px] mx-auto flex items-center justify-between gap-2 md:gap-4 pl-3 pr-2.5 md:pl-5 md:pr-[11px]">
            {/* esquerda: logo + Black + desconto */}
            <div className="flex items-center gap-2 md:gap-3 min-w-0 overflow-hidden leading-none">
              <a href="#inicio" tabIndex={compact ? 0 : -1} className="shrink-0" aria-label="Voltar ao início">
                <img src="/image/H amarelo.png" alt="Help Multas" className="h-6 md:h-7 w-auto" />
              </a>
              <span className="hidden sm:block w-px h-5 bg-white/15" />
              <span className="bb-live-dot shrink-0" />
              <span className="font-black italic uppercase text-[13px] md:text-[15px] whitespace-nowrap">
                <span className="bb-gold-text pr-0.5">Black</span>
                <span className="hidden sm:inline"> Help Multas</span>
              </span>
              <span className="hidden md:inline text-white/30">|</span>
              <span className="whitespace-nowrap text-[11px] md:text-[13px] font-bold">
                <span className="hidden md:inline text-white/70 font-semibold">{BLACK_DISCOUNT.prefix} </span>
                <span className="bb-gold-text font-black">
                  {BLACK_DISCOUNT.value}
                  <span className="hidden sm:inline"> {BLACK_DISCOUNT.suffix}</span>
                </span>
                <span className="hidden xl:inline text-white/70 font-semibold"> {BLACK_DISCOUNT.target}</span>
              </span>
            </div>

            {/* direita: contador + CTA */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">Acaba em</span>
              <Digits cd={cd} size="xs" />
              <a
                href="#formulario"
                onClick={scrollToForm}
                tabIndex={compact ? 0 : -1}
                className="bb-cta ml-1 md:ml-2 h-[34px] md:h-[36px] text-[10px] md:text-[11px] px-3 md:px-5 whitespace-nowrap"
              >
                <span className="md:hidden">Garantir</span>
                <span className="hidden md:inline">Garantir meu desconto</span>
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
