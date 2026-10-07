import { useEffect, useRef, useState, type FormEvent } from "react";
import "./Evento.css";
import { logEvent } from "@/lib/logger";
import { sendEventLeadToCrm } from "@/lib/eventCrm";

const GOOGLE_SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzsRnL3wUdKJA9JMIp9xP-Yzg09GmOa3gaYSknUPdsIlkvFO_-vu5QqP7GnZmDhAltucg/exec";

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/K56JiM8uHTi0n8GcdyKwM8";

/* Única fonte de verdade da data da aula (horário de Brasília).
 * Ao trocar a data, os textos da página e o contador se atualizam sozinhos. */
const EVENT_START_ISO = "2026-10-14T19:00:00-03:00";

const EVENT_START = new Date(EVENT_START_ISO);

const EVENT_DATE_LABEL = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
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

const PAGE_TITLE = "Aula Gratuita | Mercado de Defesa de Multas — Help Multas";

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

function formatWhatsapp(v: string) {
  let digits = onlyDigits(v);
  if (digits.length > 11 && digits.startsWith("55")) {
    digits = digits.slice(2);
  }
  const n = digits.slice(0, 11);
  if (n.length <= 2) return n;
  if (n.length <= 6) return n.replace(/(\d{2})(\d+)/, "($1) $2");
  if (n.length <= 10) return n.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return n.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

/* ─── Rastreamento de UTMs ───
 * Captura utm_source/medium/campaign/content/term da URL na primeira
 * visita e guarda em sessionStorage, para não perder a origem do lead
 * mesmo que o formulário seja enviado depois de o usuário abrir o modal.
 */
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"] as const;

function initTracking() {
  const params = new URLSearchParams(window.location.search);
  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) {
      try {
        sessionStorage.setItem(key, value);
      } catch {
        // sessionStorage indisponível (modo privado, etc.) — ignora
      }
    }
  });
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  const result: Record<(typeof UTM_KEYS)[number], string> = {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
    utm_id: "",
  };
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

/* Contador regressivo: só aparece enquanto a aula ainda não começou. */
function Countdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = EVENT_START.getTime() - now;
  if (diff <= 0) return null;

  const total = Math.floor(diff / 1000);
  const units = [
    { value: Math.floor(total / 86400), label: "dias" },
    { value: Math.floor((total % 86400) / 3600), label: "horas" },
    { value: Math.floor((total % 3600) / 60), label: "min" },
    { value: total % 60, label: "seg" },
  ];

  return (
    <div className="countdown" role="timer" aria-label="Tempo restante para a aula">
      <span className="countdown__title">A aula começa em</span>
      <div className="countdown__units">
        {units.map((u) => (
          <div className="countdown__unit" key={u.label}>
            <strong>{String(u.value).padStart(2, "0")}</strong>
            <span>{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type FieldErrors = {
  nome?: string;
  email?: string;
  whatsapp?: string;
};

/* ─── Ícones (SVG inline, herdam currentColor) ─── */
const ICON_PATHS = {
  check: <polyline points="20 6 9 17 4 12" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </>
  ),
  arrow: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  video: (
    <>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </>
  ),
  gift: (
    <>
      <path d="M20 12v10H4V12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  quote: (
    <>
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2H4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2h4" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2h-4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2h4" />
    </>
  ),
} as const;

function Icon({ name }: { name: keyof typeof ICON_PATHS }) {
  return (
    <svg
      className="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

export default function Evento() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const nomeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    initTracking();
  }, []);

  function validate(): FieldErrors {
    const next: FieldErrors = {};

    if (!nome.trim()) {
      next.nome = "Digite seu nome.";
    }

    if (!email.trim()) {
      next.email = "Digite seu e-mail.";
    } else if (!isValidEmail(email)) {
      next.email = "Digite um e-mail válido.";
    }

    const waDigits = onlyDigits(whatsapp);
    if (!waDigits) {
      next.whatsapp = "Digite seu WhatsApp.";
    } else if (waDigits.length < 10 || waDigits.length > 11) {
      next.whatsapp = "Digite um WhatsApp válido com DDD.";
    }

    setErrors(next);
    return next;
  }

  async function submitLead(data: {
    nome: string;
    email: string;
    whatsapp: string;
    dataHora: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmContent: string;
    utmTerm: string;
    pageUrl: string;
  }) {
    try {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data),
      });
      logEvent("Evento", "crm_success", "Envio para Google Sheets concluído");
      return { ok: true };
    } catch (err) {
      console.error("[lead-form] Erro de rede ao enviar para o Google Sheets:", err);
      logEvent("Evento", "crm_error", "Erro ao enviar para o Google Sheets", {
        error: err instanceof Error ? err.message : String(err),
      });
      return { ok: false };
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setStatus(null);

    const fieldErrors = validate();
    if (fieldErrors.nome) {
      nomeRef.current?.focus();
      return;
    }
    if (fieldErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (fieldErrors.whatsapp) {
      whatsappRef.current?.focus();
      return;
    }

    setSubmitting(true);
    logEvent("Evento", "action", "Formulário enviado", { nome, email });

    const utm = getUtmParams();

    const meta = window.getMetaTrackingData?.() || {};
    sendEventLeadToCrm({
      name: nome.trim(),
      email: email.trim(),
      phone: onlyDigits(whatsapp),
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

    const result = await submitLead({
      nome: nome.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      dataHora: getSubmissionTimestamp(),
      utmSource: utm.utm_source,
      utmMedium: utm.utm_medium,
      utmCampaign: utm.utm_campaign,
      utmContent: utm.utm_content,
      utmTerm: utm.utm_term,
      pageUrl: window.location.href,
    });

    if (result.ok) {
      setStatus({
        type: "success",
        message: "Inscrição recebida! Redirecionando para o grupo do WhatsApp...",
      });
      setNome("");
      setEmail("");
      setWhatsapp("");
      window.setTimeout(() => {
        window.location.href = WHATSAPP_GROUP_URL;
      }, 1200);
      return;
    }

    setStatus({
      type: "error",
      message: "Não foi possível enviar seus dados agora. Tente novamente em instantes.",
    });
    setSubmitting(false);
  }

  /* Barra fixa de CTA no mobile: aparece quando o formulário sai da tela. */
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const formModalRef = useRef<HTMLDialogElement>(null);
  const [inlineFormHeight, setInlineFormHeight] = useState(0);

  useEffect(() => {
    const dialog = formModalRef.current;
    if (!dialog) return;
    if (formModalOpen && !dialog.open) {
      dialog.showModal();
      nomeRef.current?.focus({ preventScroll: true });
    } else if (!formModalOpen && dialog.open) {
      dialog.close();
    }
  }, [formModalOpen]);

  useEffect(() => {
    if (!formModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [formModalOpen]);

  useEffect(() => {
    const el = formRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setShowStickyCta(!entry.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function openFormModal() {
    logEvent("Evento", "action", "CTA para o formulário em modal");
    setInlineFormHeight(formRef.current?.getBoundingClientRect().height ?? 0);
    setFormModalOpen(true);
  }

  const signupForm = (
<div className="signup">
              {status?.type === "success" ? (
                <div className="success" role="status" aria-live="polite">
                  <span className="success__icon" aria-hidden="true">
                    <Icon name="check" />
                  </span>
                  <h2 className="success__title">Vaga garantida!</h2>
                  <p className="success__text">
                    Estamos te levando para o grupo do WhatsApp, onde você recebe o{" "}
                    <strong>link da aula</strong> e os lembretes.
                  </p>
                  <a className="btn btn--whatsapp btn--block" href={WHATSAPP_GROUP_URL}>
                    Entrar no grupo agora
                    <Icon name="arrow" />
                  </a>
                </div>
              ) : (
                <>
                  <div className="signup__head">
                    <div>
                      <h2 className="signup__title">Garanta sua vaga gratuita</h2>
                      <p className="signup__hint">Leva menos de 1 minuto.</p>
                    </div>
                    <Countdown />
                  </div>

                  <form className="lead-form" noValidate onSubmit={handleSubmit}>
                    <div className="field field--full">
                      <label htmlFor="lf-nome">Nome*</label>
                      <input
                        id="lf-nome"
                        name="nome"
                        type="text"
                        placeholder="Digite seu nome completo"
                        autoComplete="name"
                        required
                        ref={nomeRef}
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        aria-invalid={errors.nome ? "true" : undefined}
                        aria-describedby="lf-nome-error"
                      />
                      <span className="field__error" id="lf-nome-error" role="alert">
                        {errors.nome}
                      </span>
                    </div>

                    <div className="field">
                      <label htmlFor="lf-email">E-mail*</label>
                      <input
                        id="lf-email"
                        name="email"
                        type="email"
                        placeholder="seuemail@exemplo.com"
                        autoComplete="email"
                        required
                        ref={emailRef}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={errors.email ? "true" : undefined}
                        aria-describedby="lf-email-error"
                      />
                      <span className="field__error" id="lf-email-error" role="alert">
                        {errors.email}
                      </span>
                    </div>

                    <div className="field">
                      <label htmlFor="lf-whatsapp">WhatsApp*</label>
                      <div className="phone-input">
                        <span className="phone-input__prefix" aria-hidden="true">+55</span>
                        <input
                          id="lf-whatsapp"
                          name="whatsapp"
                          type="tel"
                          placeholder="(00) 00000-0000"
                          autoComplete="tel"
                          inputMode="numeric"
                          maxLength={15}
                          required
                          ref={whatsappRef}
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))}
                          aria-invalid={errors.whatsapp ? "true" : undefined}
                          aria-describedby="lf-whatsapp-error"
                        />
                      </div>
                      <span className="field__error" id="lf-whatsapp-error" role="alert">
                        {errors.whatsapp}
                      </span>
                    </div>

                    {status && (
                      <div
                        className={`field__status field__status--${status.type} field--full`}
                        role="status"
                        aria-live="polite"
                      >
                        {status.message}
                      </div>
                    )}

                    <button type="submit" className="btn btn--primary btn--block field--full" disabled={submitting}>
                      {submitting ? "Enviando..." : "Quero minha vaga gratuita"}
                      {!submitting && <Icon name="arrow" />}
                    </button>
                  </form>

                  <p className="signup__note">
                    <Icon name="lock" />
                    <span>Você recebe o <strong>link da transmissão</strong> e os lembretes pelo WhatsApp.</span>
                  </p>
                </>
              )}
            </div>
  );

  return (
    <div className="evento-page">
      <header className="event-header"><div className="event-wrap event-header__inner">
        <a href="/evento" aria-label="Help Multas — início"><img src="/image/LogotipoHelpinho.png" alt="Help Multas" width={150} height={44} /></a>
        <span className="event-header__label">ENCONTRO ONLINE / AULA GRATUITA</span>
        <button type="button" className="event-header__link" onClick={openFormModal} aria-haspopup="dialog">Inscreva-se <Icon name="arrow" /></button>
      </div></header>
      <main>
        <section className="event-hero" aria-labelledby="hero-title">
          <div className="event-wrap event-hero__layout">
            <div className="event-hero__story">
              <picture className="event-hero__photo"><source media="(max-width: 600px)" srcSet="/image/fundo-evento-mobile.webp" /><img src="/image/fundo-evento.webp" alt="Roberson Alvarenga em frente à Help Multas" width={1672} height={941} fetchPriority="high" /></picture>
              <div className="event-hero__copy">
                <p className="event-kicker"><span /> COM ROBERSON ALVARENGA</p>
                <h1 id="hero-title">Como faturar com<br />as 80 milhões<br />de multas aplicadas<br />por ano que quase<br /><em>ninguém explora<br />na sua cidade</em></h1>
                <p className="event-hero__intro">Participe de uma aula ao vivo com Roberson Alvarenga e descubra como funciona o mercado de defesa de multas, por que ele continua crescendo e como pessoas comuns estão construindo negócios nesse setor, mesmo sem serem advogadas ou especialistas em trânsito.</p>
                <span className="event-hero__caption">Uma conversa sobre o negócio.<br />A operação. E por onde começar.</span>
              </div>
              <div className="event-hero__host"><strong>Roberson Alvarenga</strong><span>Fundador da Help Multas</span></div>
            </div>
            <div className="event-signup-slot" id="inscricao" ref={formRef} style={{ minHeight: formModalOpen ? inlineFormHeight : undefined }}>{!formModalOpen && signupForm}</div>
          </div>
          <div className="event-datebar"><div className="event-wrap event-datebar__inner">
            <span><Icon name="calendar" /><strong>{EVENT_DATE_LABEL}</strong></span>
            <span><Icon name="clock" /><strong>{EVENT_TIME_LABEL}</strong><small>Horário de Brasília</small></span>
            <span><Icon name="video" /><strong>Online e ao vivo</strong></span>
            <span className="event-datebar__free"><button type="button" onClick={openFormModal} aria-haspopup="dialog">Participação gratuita <Icon name="arrowUpRight" /></button></span>
          </div></div>
        </section>
        <section className="event-program event-wrap" aria-labelledby="program-title">
          <div className="event-program__intro"><p className="event-kicker">01 / A CONVERSA</p><h2 id="program-title">Antes de decidir,<br /><em>entenda o negócio.</em></h2><p>Para quem quer conhecer o mercado de defesa de multas e avaliar a possibilidade de atuar na própria cidade.</p><button className="event-text-link" type="button" onClick={openFormModal} aria-haspopup="dialog">Quero participar <Icon name="arrow" /></button></div>
          <div className="event-program__list">{[
            { n: "01", title: "O mercado, sem rodeios.", text: "Como funciona a defesa de multas e onde estão as oportunidades para quem quer empreender." },
            { n: "02", title: "A operação por dentro.", text: "Do atendimento ao suporte jurídico: o papel de quem empreende e o trabalho da equipe técnica." },
            { n: "03", title: "O começo na sua cidade.", text: "O que observar para avaliar esse negócio e os primeiros passos para atuar com a Help Multas." },
          ].map(item => <article className="event-program__item" key={item.n}><span>{item.n}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><span className="event-program__arrow" aria-hidden="true"><Icon name="arrowUpRight" /></span></article>)}</div>
        </section>
        <section className="event-about" aria-labelledby="about-title"><div className="event-wrap">
          <div className="event-about__top"><div className="event-about__copy"><p className="event-kicker">02 / QUEM ESTÁ DO OUTRO LADO</p><h2 id="about-title">Experiência de quem<br /><em>vive esse mercado.</em></h2><p>Roberson Alvarenga é fundador da Help Multas. Na aula, compartilha a experiência de construir uma rede de franquias e mostra como a operação funciona no dia a dia.</p><dl className="event-numbers"><div><dt>80+</dt><dd>franquias no Brasil</dd></div><div><dt>10 anos</dt><dd>de história da Help</dd></div><div><dt>27</dt><dd>estados atendidos</dd></div></dl></div>
            <figure className="event-team"><img src="/image/TIME.jpg" alt="Equipe Help Multas reunida em frente à loja" width={1080} height={1350} loading="lazy" /><figcaption>A Help é feita de gente.<span>Equipe Help Multas / Brasil</span></figcaption></figure>
          </div>
          <div className="event-questions"><div><p className="event-kicker">ANTES DE PARTICIPAR</p><h3>O essencial, respondido.</h3><button type="button" className="btn btn--primary event-questions__cta" onClick={openFormModal} aria-haspopup="dialog">Garantir minha vaga gratuita <Icon name="arrow" /></button></div><div className="event-questions__list">{[
            { q: "A aula é gratuita?", a: "Sim. Tanto a inscrição quanto a participação na aula são gratuitas." },
            { q: "Como recebo o link?", a: "Depois do cadastro, você é direcionado ao grupo do WhatsApp. Enviamos o link da transmissão e os lembretes por lá." },
            { q: "Preciso ser advogado?", a: "Não. A equipe jurídica da Help Multas cuida da análise, elaboração da defesa e protocolo nos órgãos de trânsito." },
          ].map(item => <details key={item.q}><summary>{item.q}<span aria-hidden="true" /></summary><p>{item.a}</p></details>)}</div></div>
        </div></section>
      </main>
      <dialog
        ref={formModalRef}
        className="event-form-modal"
        aria-label="Inscrição na aula gratuita"
        onClose={() => setFormModalOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            setFormModalOpen(false);
          }
        }}
      >
        {formModalOpen && <>
          <button type="button" className="event-form-modal__close" aria-label="Fechar formulário" onClick={() => setFormModalOpen(false)}><Icon name="close" /></button>
          {signupForm}
        </>}
      </dialog>
      <footer className="event-footer"><div className="event-wrap"><p>© {new Date().getFullYear()} Help Multas</p><span>Defender motoristas. Abrir caminhos.</span><a href="https://www.helpmultas.com/termos-de-uso" target="_blank" rel="noopener noreferrer">Termos de uso <Icon name="arrowUpRight" /></a></div></footer>
      {status?.type !== "success" && <div className={"sticky-cta" + (showStickyCta ? " is-visible" : "")} aria-hidden={!showStickyCta}><div><strong>Aula gratuita</strong><span>{EVENT_DATE_LABEL} · {EVENT_TIME_LABEL}</span></div><button type="button" className="btn btn--primary" onClick={openFormModal} aria-haspopup="dialog" tabIndex={showStickyCta ? 0 : -1}>Quero participar <Icon name="arrow" /></button></div>}
    </div>
  );
}
