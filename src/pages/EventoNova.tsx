import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import "./EventoNova.css";
import { logEvent } from "@/lib/logger";
import { sendEventLeadToCrm } from "@/lib/eventCrm";

/*
 * /evento — nova versão da LP da aula gratuita.
 * Mesma integração da /evento: Google Sheets + CRM (intake) + Marketing Hub,
 * UTMs/fbp/fbc e redirecionamento para o grupo do WhatsApp.
 */

const PAGE_NAME = "EventoNova";

const GOOGLE_SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzsRnL3wUdKJA9JMIp9xP-Yzg09GmOa3gaYSknUPdsIlkvFO_-vu5QqP7GnZmDhAltucg/exec";

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/K56JiM8uHTi0n8GcdyKwM8";

/* Única fonte de verdade da data da aula (horário de Brasília).
 * Ao trocar a data, todos os textos da página se atualizam sozinhos. */
const EVENT_START_ISO = "2026-10-14T19:00:00-03:00";

const EVENT_START = new Date(EVENT_START_ISO);

const EVENT_DATE_LABEL = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  timeZone: "America/Sao_Paulo",
}).format(EVENT_START);

const EVENT_DAY = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  timeZone: "America/Sao_Paulo",
}).format(EVENT_START);

const EVENT_TIME_LABEL = (() => {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "America/Sao_Paulo",
  }).formatToParts(EVENT_START);
  const h = String(Number(parts.find((p) => p.type === "hour")?.value ?? "0"));
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  return m === "00" ? `${h}h` : `${h}h${m}`;
})();

const PAGE_TITLE = "Aula Gratuita | Mercado de Defesa de Multas | Help Multas";
const IMG = "/image/evento-nova";
const META_PIXEL_ID = "1558928198671104";

/* ─── Telefone ─── */
const DDD = [
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47,
  48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87,
  88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
];

/** Só os 11 dígitos nacionais (sem o 55). */
function phoneDigits(v: string) {
  let d = v.replace(/\D/g, "");
  // "+55 ..." (máscara) ou número colado com DDI: descarta o 55
  if (d.startsWith("55") && (v.trim().startsWith("+") || d.length > 11)) d = d.slice(2);
  return d.slice(0, 11);
}

function maskPhone(d: string) {
  if (!d.length) return "";
  let v = "+55 (" + d.slice(0, 2);
  if (d.length > 2) v += ") " + d.slice(2, 7);
  if (d.length > 7) v += "-" + d.slice(7);
  return v;
}

/** (11) 99999-9999 — mesmo formato que a /evento grava na planilha. */
function formatPhoneForSheet(d: string) {
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Mensagem de erro; "" se válido; null se ainda está digitando sem erro. */
function phoneError(d: string, final: boolean): string | null {
  if (!d.length) return final ? "Digite seu WhatsApp com DDD." : null;
  if (d.length >= 2 && !DDD.includes(Number(d.slice(0, 2)))) return "Esse DDD não existe. Confira o número.";
  if (d.length >= 3 && d[2] !== "9") return "Celular começa com 9 depois do DDD.";
  if (d.length < 11) {
    return final ? `Número incompleto. Faltam ${11 - d.length} dígito${11 - d.length > 1 ? "s" : ""}.` : null;
  }
  const n = d.slice(3);
  if (/^(\d)\1+$/.test(n) || "01234567890123".includes(n) || "98765432109876".includes(n)) {
    return "Esse número parece inválido. Digite seu WhatsApp real.";
  }
  return "";
}

/* ─── Rastreamento de UTMs ───
 * Captura utm_* da URL na primeira visita e guarda em sessionStorage, para
 * não perder a origem do lead se a pessoa navegar antes de enviar. */
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"] as const;

function initTracking() {
  const params = new URLSearchParams(window.location.search);
  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (!value) return;
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // sessionStorage indisponível (modo privado etc.) — ignora
    }
  });
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {} as Record<(typeof UTM_KEYS)[number], string>;
  UTM_KEYS.forEach((key) => {
    let value = params.get(key);
    if (!value) {
      try {
        value = sessionStorage.getItem(key);
      } catch {
        value = null;
      }
    }
    result[key] = value || "";
  });
  return result;
}

function getSubmissionTimestamp() {
  return new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

/* ─── Ícones ─── */
const ICONS = {
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  live: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M10 9l5 2.5-5 2.5z" />
      <path d="M8 21h8" />
    </>
  ),
  building: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V8l7-5 7 5v13" />
      <path d="M10 21v-6h4v6" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14.5L8 22l4-2 4 2-1-7.5" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
} as const;

function Icon({ name, strokeWidth = 1.8 }: { name: keyof typeof ICONS; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

/* Contador dos 79,9 milhões: anima quando entra na tela. */
function CountUp({ to, unit }: { to: number; unit: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fmt = (n: number) => n.toFixed(1).replace(".", ",");
  const [text, setText] = useState(fmt(to));

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        let t0: number | null = null;
        const step = (t: number) => {
          if (t0 === null) t0 = t;
          const p = Math.min((t - t0) / 1800, 1);
          setText(fmt(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <div className="counter" ref={ref} aria-label={`${fmt(to)} ${unit}`}>
      {text}
      <span className="counter-unit"> {unit}</span>
    </div>
  );
}

type FieldKey = "nome" | "email" | "whats";

export default function EventoNova() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroActionsRef = useRef<HTMLDivElement>(null);
  const nomeRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whats, setWhats] = useState("");
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({ nome: false, email: false, whats: false });
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [sent, setSent] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  const sentRef = useRef(false);
  const formOpenRef = useRef(false);
  useEffect(() => {
    formOpenRef.current = formOpen;
  }, [formOpen]);

  /* ─── validação ─── */
  const digits = phoneDigits(whats);
  const nomeBad = nome.trim().length < 3;
  const emailBad = !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim());
  const whatsMsg = phoneError(digits, touched.whats);
  const whatsOk = phoneError(digits, true) === "";

  const touch = (k: FieldKey) => setTouched((t) => (t[k] ? t : { ...t, [k]: true }));

  /* ─── título, UTMs ─── */
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;
    initTracking();
    return () => {
      document.title = previousTitle;
    };
  }, []);

  /* ─── animação de entrada ─── */
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll(".reveal");
    if (!els) return;
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((e) => e.classList.add("on"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((x) => {
          if (!x.isIntersecting) return;
          x.target.classList.add("on");
          io.unobserve(x.target);
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  /* ─── barra fixa no celular, depois do botão do topo ─── */
  useEffect(() => {
    const el = heroActionsRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([r]) => {
      setShowSticky(!r.isIntersecting && r.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ─── rolagem suave (Lenis) ligada ao GSAP ScrollTrigger ─── */
  const pinRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let tick: ((time: number) => void) | null = null;
    if (!reduce) {
      const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    /* Seção "04 tópicos": o bloco (gráfico + timeline) fica fixo na tela, no tamanho que já tem,
     * e a rolagem (scrub) desenha a linha e revela os 4 cards em sequência.
     * Celular (≤640px) e "reduzir movimento": tudo visível, sem animação. */
    const mm = gsap.matchMedia();
    mm.add("(min-width: 641px) and (prefers-reduced-motion: no-preference)", () => {
      const pin = pinRef.current;
      if (!pin) return;
      const steps = gsap.utils.toArray<HTMLElement>(".step", pin);
      const line = pin.querySelector<HTMLElement>(".steps-line i");
      const cta = pin.querySelector<HTMLElement>(".learn .cta-row");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin,
          start: "bottom bottom-=24",
          end: "+=1400",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.set(steps, { autoAlpha: 0, y: 36 });
      if (cta) gsap.set(cta, { autoAlpha: 0, y: 20 });
      if (line) gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

      // a linha chega a cada círculo (25% da largura por tópico) no instante em que o card aparece
      // depois do 4º círculo, a linha segue até a ponta e fecha em 100%
      if (line) {
        tl.to(line, { scaleX: 0.75, duration: 0.66 }, 0);
        tl.to(line, { scaleX: 1, duration: 0.16 }, 0.66);
      }
      steps.forEach((step, i) => {
        const at = i * 0.22;
        tl.to(step, { autoAlpha: 1, y: 0, duration: 0.16, ease: "power2.out" }, at);
        tl.to(
          step.querySelector(".node"),
          { backgroundColor: "#F5BF23", color: "#0B1726", borderColor: "#F5BF23", duration: 0.12 },
          at + 0.04,
        );
      });
      if (cta) tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.84);
      tl.to({}, { duration: 0.04 }); // respiro no fim, antes de liberar a rolagem
    });

    // recalcula as posições quando fontes/imagens terminam de carregar
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
      if (tick) gsap.ticker.remove(tick);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* ─── travar rolagem + Esc enquanto algum pop-up está aberto ─── */
  const anyModal = formOpen || exitOpen;
  useEffect(() => {
    if (!anyModal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenisRef.current?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setFormOpen(false);
      setExitOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      lenisRef.current?.start();
      document.removeEventListener("keydown", onKey);
    };
  }, [anyModal]);

  const openForm = useCallback((source: string) => {
    logEvent(PAGE_NAME, "action", "CTA para o formulário", { source });
    setExitOpen(false);
    setFormOpen(true);
    if (window.innerWidth > 640) window.setTimeout(() => nomeRef.current?.focus({ preventScroll: true }), 80);
  }, []);

  /* ─── abre o formulário assim que a página carrega ─── */
  useEffect(() => {
    const t = window.setTimeout(() => openForm("entrada"), 400);
    return () => window.clearTimeout(t);
  }, [openForm]);

  /* ─── pop-up de saída: uma vez por visita ─── */
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("help_saida") === "1";
    } catch {
      // ignora
    }
    const t0 = Date.now();

    const show = () => {
      if (seen || sentRef.current || formOpenRef.current || Date.now() - t0 < 6000) return;
      seen = true;
      try {
        sessionStorage.setItem("help_saida", "1");
      } catch {
        // ignora
      }
      logEvent(PAGE_NAME, "action", "Pop-up de saída exibido");
      setExitOpen(true);
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 8) show();
    };

    // celular: rolou rápido de volta ao topo depois de descer a página
    let last = window.scrollY;
    let wentDown = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) wentDown = true;
      if (window.innerWidth <= 980 && wentDown && last - y > 120) show();
      last = y;
    };

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* ─── envio ─── */
  async function submitToSheets(data: Record<string, string>) {
    try {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data),
      });
      logEvent(PAGE_NAME, "crm_success", "Envio para Google Sheets concluído");
      return true;
    } catch (err) {
      console.error("[lead-form] Erro de rede ao enviar para o Google Sheets:", err);
      logEvent(PAGE_NAME, "crm_error", "Erro ao enviar para o Google Sheets", {
        error: err instanceof Error ? err.message : String(err),
      });
      return false;
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSendError(false);
    setTouched({ nome: true, email: true, whats: true });

    const focusField = (name: string) => e.currentTarget.querySelector<HTMLInputElement>(`[name="${name}"]`)?.focus();
    if (nomeBad) return void focusField("nome");
    if (emailBad) return void focusField("email");
    if (!whatsOk) return void focusField("whatsapp");

    setSubmitting(true);
    logEvent(PAGE_NAME, "action", "Formulário enviado", { nome, email });

    const utm = getUtmParams();
    const meta = window.getMetaTrackingData?.() || { fbp: "", fbc: "", fbclid: "" };

    // CRM + Marketing Hub (fire-and-forget, nunca lança)
    const crmPromise = sendEventLeadToCrm({
      name: nome.trim(),
      email: email.trim(),
      phone: digits,
      fbp: meta.fbp || "",
      fbc: meta.fbc || "",
      fbclid: meta.fbclid || "",
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      utm_term: utm.utm_term,
      utm_id: utm.utm_id,
    });

    const sheetsPromise = submitToSheets({
      nome: nome.trim(),
      email: email.trim(),
      whatsapp: formatPhoneForSheet(digits),
      dataHora: getSubmissionTimestamp(),
      utmSource: utm.utm_source,
      utmMedium: utm.utm_medium,
      utmCampaign: utm.utm_campaign,
      utmContent: utm.utm_content,
      utmTerm: utm.utm_term,
      pageUrl: window.location.href,
    });

    // espera o CRM (no máx. 5s) — o Lead da Meta só sai se o CRM respondeu OK
    const crmOk = await Promise.race([
      crmPromise,
      new Promise<boolean>((resolve) => window.setTimeout(() => resolve(false), 5000)),
    ]);
    if (crmOk) {
      const eventID = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      window.fbq?.("trackSingle", META_PIXEL_ID, "Lead", { content_name: "Landing Page Evento" }, { eventID });
      logEvent(PAGE_NAME, "pixel_event", "fbq trackSingle Lead disparado", { pixelId: META_PIXEL_ID, eventID });
    } else {
      logEvent(PAGE_NAME, "error", "Lead não disparado no pixel — CRM não respondeu OK");
    }

    const ok = await sheetsPromise;

    if (ok) {
      sentRef.current = true;
      setSent(true);
      setSubmitting(false);
      window.setTimeout(() => {
        window.location.href = WHATSAPP_GROUP_URL;
      }, 1200);
      return;
    }

    setSendError(true);
    setSubmitting(false);
  }

  const fieldClass = (bad: boolean, good = false) => (bad ? "bad" : good ? "good" : undefined);

  const renderForm = (where: "hero" | "modal") => {
    const inModal = where === "modal";
    const p = inModal ? "en" : "en-hero";
    return (
      <>
    {sent ? (
      <div className="form-ok" role="status" aria-live="polite">
        <div className="check">
          <Icon name="check" strokeWidth={2.4} />
        </div>
        <div className="eyebrow">Vaga garantida</div>
        <h3>Sua vaga está confirmada</h3>
        <p className="sub">
          Estamos te levando para o grupo do WhatsApp, onde você recebe o <strong>link da transmissão</strong> e
          os lembretes.
        </p>
        <a className="cta" href={WHATSAPP_GROUP_URL}>
          <span>Entrar no grupo agora</span>
        </a>
      </div>
    ) : (
      <form onSubmit={handleSubmit} noValidate>
        <div className="eyebrow">Inscrição gratuita</div>
        <h3 id={inModal ? "formTitle" : undefined}>Garanta sua vaga na aula</h3>
        <p className="sub">Preencha seus dados para receber o link da transmissão e os lembretes pelo WhatsApp.</p>

        <div className="form-when">
          <span>
            <Icon name="calendar" />
            {EVENT_DATE_LABEL}
          </span>
          <span>
            <Icon name="clock" />
            {EVENT_TIME_LABEL} (Brasília)
          </span>
          <span>
            <Icon name="live" />
            Online
          </span>
        </div>

        <div className="field">
          <label htmlFor={`${p}-nome`}>Nome</label>
          <input
            id={`${p}-nome`}
            name="nome"
            type="text"
            placeholder="Seu nome completo"
            autoComplete="name"
            required
            ref={inModal ? nomeRef : undefined}
            value={nome}
            className={fieldClass(touched.nome && nomeBad)}
            onChange={(e) => setNome(e.target.value)}
            onBlur={() => nome && touch("nome")}
            aria-invalid={touched.nome && nomeBad ? "true" : undefined}
          />
          <span className={"err" + (touched.nome && nomeBad ? " show" : "")} role="alert">
            Digite seu nome.
          </span>
        </div>

        <div className="field">
          <label htmlFor={`${p}-email`}>E-mail</label>
          <input
            id={`${p}-email`}
            name="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            autoComplete="email"
            required
            value={email}
            className={fieldClass(touched.email && emailBad)}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => email && touch("email")}
            aria-invalid={touched.email && emailBad ? "true" : undefined}
          />
          <span className={"err" + (touched.email && emailBad ? " show" : "")} role="alert">
            Digite um e-mail válido.
          </span>
        </div>

        <div className="field">
          <label htmlFor={`${p}-whats`}>WhatsApp</label>
          <div className="phone-wrap">
            <input
              id={`${p}-whats`}
              name="whatsapp"
              type="tel"
              inputMode="numeric"
              maxLength={19}
              placeholder="+55 (00) 00000-0000"
              autoComplete="tel-national"
              required
              value={whats}
              className={fieldClass(!!whatsMsg, whatsOk)}
              onChange={(e) => setWhats(maskPhone(phoneDigits(e.target.value)))}
              onBlur={() => whats && touch("whats")}
              aria-invalid={whatsMsg ? "true" : undefined}
            />
            <span className="ok-ic" aria-hidden="true">
              <Icon name="check" strokeWidth={2.6} />
            </span>
          </div>
          <span className={"err" + (whatsMsg ? " show" : "")} role="alert" aria-live="polite">
            {whatsMsg}
          </span>
        </div>

        {sendError && (
          <p className="err show send-err" role="alert">
            Não foi possível enviar seus dados agora. Tente novamente em instantes.
          </p>
        )}

        <button type="submit" className="cta" disabled={submitting}>
          <span>{submitting ? "Enviando..." : "Garantir minha vaga"}</span>
        </button>
        <div className="form-note">
          <Icon name="lock" strokeWidth={2} />
          Seus dados estão protegidos
        </div>
      </form>
    )}
      </>
    );
  };

  const open = (source: string) => (e: { preventDefault: () => void }) => {
    e.preventDefault();
    openForm(source);
  };

  return (
    <div className="evento-nova" ref={rootRef}>
      {/* FAIXA DO TOPO */}
      <div className="announce">
        <span className="dot" />
        <b>Aula ao vivo e gratuita</b>
        <i />
        {EVENT_DATE_LABEL}
        <i />
        Online
      </div>

      {/* HERO */}
      <section className="hero" id="topo">
        <div className="glow y" style={{ width: 620, height: 620, right: -60, top: 60 }} />

        <div className="wrap hero-grid">
          <div className="hero-copy">
            <img src={`${IMG}/logo-help-escuro.png`} alt="Help Multas" className="hero-logo" width={170} height={38} />
            <h1 className="h-display">
              Como abrir um negócio de defesa de multas na sua cidade sem ser advogado nem especialista em trânsito e{" "}
              <span className="mark">faturar mais de R$ 30 mil por mês</span>
            </h1>
            <p className="lead">
              <strong>Roberson Alvarenga</strong> abre por dentro como funciona uma operação da Help Multas: pouca
              estrutura, equipe enxuta e o caminho até os R$ 30 mil por mês,{" "}
              <strong>mesmo que você nunca tenha ouvido falar em recurso de multa.</strong>
            </p>
          </div>

          <div className="hero-form" ref={heroActionsRef}>
            <div className={"form-card" + (sent ? " sent" : "")}>{renderForm("hero")}</div>
          </div>
        </div>
      </section>

      {/* DOBRA 2 · MERCADO */}
      <section className="market dark" id="mercado">
        <div className="glow y" style={{ width: 520, height: 520, right: -160, top: "22%" }} />
        <div className="glow b" style={{ width: 620, height: 620, left: -220, bottom: -120 }} />
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="tag">
              <span className="dot" />
              O mercado
            </span>
            <h2 className="h-display h2">
              Um mercado gigante que <span className="hl">ainda passa despercebido</span>
            </h2>
            <p className="lead">
              Todos os anos, cerca de <strong>79,9 milhões de multas</strong> são aplicadas no Brasil. Mesmo assim,
              poucas empresas estão preparadas para atender essa demanda.
            </p>
          </div>

          <div className="pin-wrap" ref={pinRef}>
          <div className="stat-band reveal d1" id="statBand">
            <div className="stat-left">
              <div className="eyebrow">Multas aplicadas no Brasil por ano</div>
              <CountUp to={79.9} unit="milhões" />
              <p>Uma demanda que se renova todo ano, em todas as cidades do país.</p>

              <div
                className="split"
                role="img"
                aria-label="Empresas preparadas atendem 5% do mercado; 95% ainda está sem atendimento"
              >
                <div className="split-bar">
                  <i className="seg-y" style={{ flex: 5 }} />
                  <i className="seg-g" style={{ flex: 95 }} />
                </div>
                <div className="split-legend">
                  <div>
                    <span className="sw y" />
                    <b>5%</b> atendido por empresas preparadas
                  </div>
                  <div>
                    <span className="sw g" />
                    <b>95%</b> do mercado ainda sem atendimento
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-right">
              <div className="bubble bubble-dark">Quanto desse mercado está na sua cidade?</div>
              <div className="chart-head">
                <span className="eyebrow">Tamanho e potencial do mercado</span>
                <div className="chart-legend">
                  <span>
                    <i className="ln w" />
                    Multas aplicadas
                  </span>
                  <span>
                    <i className="ln y" />
                    Atendimento
                  </span>
                  <span>
                    <i className="ar g" />
                    Potencial
                  </span>
                </div>
              </div>
              <svg
                className="chart"
                viewBox="0 0 520 250"
                preserveAspectRatio="none"
                aria-label="A demanda de multas cresce e o atendimento fica para trás. O espaço entre as duas linhas é o potencial do mercado."
              >
                <defs>
                  <linearGradient id="gPot" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#2FBF71" stopOpacity=".42" />
                    <stop offset="1" stopColor="#2FBF71" stopOpacity=".10" />
                  </linearGradient>
                </defs>
                <g className="gridlines">
                  <line x1="0" y1="50" x2="520" y2="50" />
                  <line x1="0" y1="110" x2="520" y2="110" />
                  <line x1="0" y1="170" x2="520" y2="170" />
                  <line x1="0" y1="230" x2="520" y2="230" />
                </g>
                <path
                  className="pot"
                  d="M0,150 C90,138 160,120 240,98 C320,76 410,56 520,30 L520,206 C430,208 340,210 240,212 C150,214 80,214 0,215 Z"
                  fill="url(#gPot)"
                />
                <path className="line-w" d="M0,150 C90,138 160,120 240,98 C320,76 410,56 520,30" fill="none" />
                <path className="line-y" d="M0,215 C80,214 150,214 240,212 C340,210 430,208 520,206" fill="none" />
                <circle cx="520" cy="30" r="5" className="dot-w" />
                <circle cx="520" cy="206" r="5" className="dot-y" />
                <text x="300" y="150" className="pot-label">
                  Potencial de mercado
                </text>
              </svg>
              <div className="chart-foot">
                <span>Antes</span>
                <span>Hoje</span>
              </div>
            </div>
          </div>

            <div className="learn" id="topicos">
              <div className="learn-head">
                <h3>Na aula, você vai descobrir</h3>
                <span className="eyebrow">04 tópicos</span>
              </div>
              <div className="steps">
                <span className="steps-line" aria-hidden="true">
                  <i />
                </span>
                {[
                  { n: "01", k: "O mercado", t: "Por que esse mercado continua crescendo" },
                  { n: "02", k: "A operação", t: "Como funciona uma operação de defesa de multas" },
                  { n: "03", k: "O começo", t: "Como começar sem experiência" },
                  { n: "04", k: "A sua cidade", t: "Como identificar a oportunidade na sua cidade" },
                ].map((s) => (
                  <div className="step" key={s.n}>
                    <span className="node">{s.n}</span>
                    <div className="box">
                      <small>{s.k}</small>
                      <p>{s.t}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cta-row">
                <a href="#inscricao" className="cta" onClick={open("mercado")}>
                  <span>Quero conhecer esse mercado</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOBRA 3 · PALESTRANTE */}
      <section className="speaker-sec pad" id="palestrante">
        <div className="glow y" style={{ width: 520, height: 520, left: -160, top: "10%" }} />
        <div className="wrap speaker-grid">
          <div className="photo-stage reveal">
            <div className="portrait-wrap">
              <div className="portrait">
                <div className="portrait-ring" aria-hidden="true" />
                <div className="portrait-circle">
                  <img src={`${IMG}/roberson-perfil.webp`} alt="" aria-hidden="true" />
                </div>
                <img
                  src={`${IMG}/roberson-perfil.webp`}
                  alt="Roberson Alvarenga, fundador da Help Multas"
                  className="p-out"
                  loading="lazy"
                />
              </div>
              {/* Cards: flutuam ao lado da foto no desktop e descem para baixo dela no celular,
                  para nunca cobrir o rosto. */}
              <div className="portrait-chips">
                <div className="chip c3">
                  <span className="ic">
                    <Icon name="building" />
                  </span>
                  <div>
                    <small>Rede Help Multas</small>
                    <b>+80 unidades</b>
                  </div>
                </div>
                <div className="chip c4">
                  <span className="ic">
                    <Icon name="person" />
                  </span>
                  <div>
                    <small>Atendidos</small>
                    <b>100 mil motoristas</b>
                  </div>
                </div>
                <div className="chip c5">
                  <span className="ic">
                    <Icon name="award" />
                  </span>
                  <div>
                    <small>No mercado</small>
                    <b>9 anos de experiência</b>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="speaker reveal d1">
            <span className="tag">
              <span className="dot" />
              Quem conduz a aula
            </span>
            <h2 className="h-display h2">
              Aprenda com quem conhece esse mercado <span className="mark">por dentro</span>
            </h2>
            <p className="lead">
              Roberson Alvarenga é fundador da Help Multas, uma rede com mais de 80 unidades, nove anos de experiência
              e 100 mil motoristas atendidos.
            </p>
            <p className="lead" style={{ marginBottom: 28 }}>
              No dia {EVENT_DAY}, ele vai mostrar como esse mercado funciona e{" "}
              <strong>
                o que você precisa avaliar para transformar essa oportunidade em um negócio na sua cidade.
              </strong>
            </p>

            <div className="date-strip">
              <div className="ds-date">
                <Icon name="calendar" />
                {EVENT_DATE_LABEL}
              </div>
              <div>{EVENT_TIME_LABEL}</div>
              <div>Online</div>
              <div>Gratuito</div>
            </div>
            <a href="#inscricao" className="cta" onClick={open("palestrante")}>
              <span>Quero garantir minha vaga</span>
            </a>
          </div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="foot">
        <div className="wrap">
          <img src="/image/LogotipoHelpinho.png" alt="Help Multas" width={120} height={28} loading="lazy" />
          <p>A maior rede de franquias de recursos de multas do Brasil.</p>
          <a className="foot-link" href="https://www.helpmultas.com/termos-de-uso" target="_blank" rel="noopener noreferrer">
            Termos de uso
          </a>
        </div>
      </footer>

      {/* POP-UP DO FORMULÁRIO */}
      <div className={"modal" + (formOpen ? " open" : "")} id="inscricao" aria-hidden={!formOpen}>
        <div className="modal-bg" onClick={() => setFormOpen(false)} />
        <div
          className={"form-card" + (sent ? " sent" : "")}
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-labelledby="formTitle"
        >
          <button type="button" className="modal-x" aria-label="Fechar" onClick={() => setFormOpen(false)}>
            <Icon name="close" strokeWidth={2} />
          </button>

          {renderForm("modal")}
        </div>
      </div>

      {/* POP-UP DE SAÍDA */}
      <div className={"modal exit" + (exitOpen ? " open" : "")} id="saida" aria-hidden={!exitOpen}>
        <div className="modal-bg" onClick={() => setExitOpen(false)} />
        <div className="exit-card" role="dialog" aria-modal="true" aria-labelledby="exitTitle">
          <button type="button" className="modal-x" aria-label="Fechar" onClick={() => setExitOpen(false)}>
            <Icon name="close" strokeWidth={2} />
          </button>
          <div className="exit-photo">
            <img src={`${IMG}/roberson-hero.webp`} alt="Roberson Alvarenga" loading="lazy" />
          </div>
          <div className="exit-body">
            <div className="eyebrow">Antes de você sair</div>
            <h3 id="exitTitle">Sua vaga na aula ainda não está garantida</h3>
            <p>
              A aula com Roberson Alvarenga é ao vivo e gratuita. Deixe seu WhatsApp e receba o link da transmissão no
              dia {EVENT_DATE_LABEL}.
            </p>
            <a href="#inscricao" className="cta" onClick={open("saida")}>
              <span>Garantir minha vaga</span>
            </a>
            <button type="button" className="exit-no" onClick={() => setExitOpen(false)}>
              Não quero aprender sobre esse mercado
            </button>
          </div>
        </div>
      </div>

      {!sent && (
        <div className={"sticky" + (showSticky && !anyModal ? " show" : "")} aria-hidden={!showSticky}>
          <a
            href="#inscricao"
            className="cta"
            onClick={open("sticky")}
            tabIndex={showSticky ? 0 : -1}
          >
            <span>Quero garantir minha vaga</span>
          </a>
        </div>
      )}
    </div>
  );
}
