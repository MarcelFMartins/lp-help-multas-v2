import { useEffect, useRef, useState, type FormEvent } from "react";

const GOOGLE_SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzsRnL3wUdKJA9JMIp9xP-Yzg09GmOa3gaYSknUPdsIlkvFO_-vu5QqP7GnZmDhAltucg/exec";

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/K56JiM8uHTi0n8GcdyKwM8";

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
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

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

type FieldErrors = {
  nome?: string;
  email?: string;
  whatsapp?: string;
};

export default function Evento() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setModalOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => nomeRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [modalOpen]);

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
      return { ok: true };
    } catch (err) {
      console.error("[lead-form] Erro de rede ao enviar para o Google Sheets:", err);
      return { ok: false };
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
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

    const utm = getUtmParams();
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

  return (
    <div className="evento-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__media-wrap">
          <img
            className="hero__media"
            src="/image/fundo-evento.png"
            alt="Roberson Alvarenga, fundador da Help Multas"
            width={1000}
            height={1481}
          />
          <div className="hero__media-gradient" aria-hidden="true" />

          <div className="hero__brand">
            <img
              src="/image/LogotipoHelpinho.png"
              alt="Help Multas"
              className="hero__logo"
              width={150}
              height={44}
            />
            <span className="hero__live-badge">
              <span className="dot" aria-hidden="true" />
              AO VIVO: 26 de agosto · 12h
            </span>
          </div>
        </div>

        <div className="hero__body">
          <div className="hero__copy">
            <h1 id="hero-title" className="hero__title">
              Como faturar com as{" "}
              <span className="highlight">250 milhões de multas aplicadas por ano</span> que quase
              ninguém explora <span className="highlight">na sua cidade</span>.
            </h1>
            <p className="hero__subtitle">
              A única live onde você vai ver, na prática, como funciona o mercado de defesa de
              multas. Sem scripts prontos ou promessas vazias.
            </p>
          </div>

          <div className="hero__cta">
            <p className="hero__cta-caption">
              Clique no botão abaixo e faça seu <strong>CADASTRO GRATUITO:</strong>
            </p>
            <button type="button" className="btn btn--primary btn--lg hero__cta-btn" onClick={() => setModalOpen(true)}>
              Sim! Quero me cadastrar
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <footer className="mini-footer">
        <div className="container mini-footer__inner">
          <p>Copyright © Help Multas, 2026</p>
          <a href="https://www.helpmultas.com/termos-de-uso" target="_blanck">Termos de Uso</a>
        </div>
      </footer>

      {modalOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button
              type="button"
              className="modal-close"
              aria-label="Fechar"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>

            <h2 id="modal-title" className="modal-title">
              Preencha <span className="highlight">seus dados</span> abaixo e garanta sua vaga na{" "}
              <span className="highlight">Aula ao Vivo</span>:
            </h2>

            <form className="lead-form" noValidate onSubmit={handleSubmit}>
              <div className="field">
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
                  />
                </div>
                <span className="field__error" id="lf-whatsapp-error" role="alert">
                  {errors.whatsapp}
                </span>
              </div>

              {status && (
                <div
                  className={`field__status field__status--${status.type}`}
                  role="status"
                  aria-live="polite"
                >
                  {status.message}
                </div>
              )}

              <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
                {submitting ? "Enviando..." : "Garantir minha vaga gratuita"}
              </button>
            </form>

            <p className="modal-benefit">
              Você vai receber o <strong>link da transmissão</strong> e os lembretes pelo WhatsApp.
            </p>

            <p className="modal-legal">
              * Importante: o e-mail informado deve ser válido para que você receba os conteúdos.
              Os campos com * são obrigatórios para conclusão do formulário.
            </p>
          </div>
        </div>
      )}

      <style>{`
/* ============================================================
   Help Multas — Aula ao Vivo (Landing Page de Inscrição)
   Reutiliza os tokens do Design System da página de Franquias
   ============================================================ */

@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap");

/* ─── Tokens (Franquias LP) ─── */
.evento-page {
  --navy-deep: oklch(0.1998 0.0403 258.29);
  --navy-mid: oklch(0.3274 0.0363 242.96);
  --gold: oklch(0.8371 0.1715 85.23);
  --gold-hex: #fcbf00;
  --gold-hover: #e0a800;
  --offwhite: oklch(0.98 0.005 75);
  --white: #ffffff;
  --danger: #dc2626;

  --font-display: "Montserrat", system-ui, sans-serif;
  --font-body: "Montserrat", system-ui, sans-serif;

  --container-max: 1280px;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --radius-pill: 999px;

  --shadow-card: 0 32px 70px rgba(0, 0, 0, 0.45);
  --shadow-soft: 0 6px 20px rgba(23, 36, 44, 0.25);
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --duration: 200ms;
}

/* ─── Reset & Base ─── */
.evento-page *,
.evento-page *::before,
.evento-page *::after { box-sizing: border-box; }

.evento-page {
  margin: 0;
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  color: var(--white);
  background: var(--navy-deep);
  -webkit-font-smoothing: antialiased;
}

.evento-page img { max-width: 100%; height: auto; display: block; }
.evento-page a { color: inherit; text-decoration: none; }
.evento-page button { font-family: inherit; cursor: pointer; }
.evento-page h1,
.evento-page h2 { font-family: var(--font-display); margin: 0; line-height: 1.1; }
.evento-page p { margin: 0; }

.evento-page :focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

.evento-page .container {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2rem);
}

.evento-page .highlight { color: var(--gold-hex); }

/* ─── Buttons ─── */
.evento-page .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  min-height: 52px;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: var(--radius-pill);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: transform var(--duration) var(--ease),
    background var(--duration) var(--ease),
    opacity var(--duration) var(--ease);
}

.evento-page .btn svg { width: 18px; height: 18px; flex-shrink: 0; }

.evento-page .btn:active { transform: scale(0.98); }

.evento-page .btn--primary {
  background: var(--gold);
  color: var(--navy-deep);
  box-shadow: 0 14px 24px rgba(252, 191, 0, 0.28);
}

.evento-page .btn--primary:hover { background: var(--gold-hover); transform: translateY(-1px); }

.evento-page .btn--lg { min-height: 56px; padding-inline: 2rem; font-size: 1rem; }

.evento-page .btn--block { width: 100%; text-transform: uppercase; }

.evento-page .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* ─── Hero (100vh) ─── */
.evento-page .hero {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--navy-deep);
  overflow: hidden;
  animation: evento-fade-in 0.6s var(--ease);
}

.evento-page .hero__media-wrap {
  position: relative;
  width: calc(100% - 2rem);
  max-width: 480px;
  margin: 1.5rem auto 0;
  border-radius: var(--radius-xl);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  box-shadow: var(--shadow-soft);
  flex-shrink: 0;
}

.evento-page .hero__media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.evento-page .hero__media-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(6, 13, 22, 0.65) 0%, rgba(6, 13, 22, 0) 45%);
  pointer-events: none;
}

.evento-page .hero__brand {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
}

.evento-page .hero__logo { height: 28px; width: auto; object-fit: contain; }

.evento-page .hero__live-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.875rem;
  background: rgba(6, 13, 22, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-pill);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  backdrop-filter: blur(4px);
}

.evento-page .hero__live-badge .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4d4d;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(255, 77, 77, 0.25);
}

.evento-page .hero__body {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  padding: 2rem 1.25rem clamp(2rem, 6vw, 3rem);
}

.evento-page .hero__copy { max-width: 640px; }

.evento-page .hero__title {
  font-size: clamp(1.75rem, 4.6vw, 3rem);
  font-weight: 900;
  color: var(--white);
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.evento-page .hero__subtitle {
  font-size: clamp(0.9375rem, 1.4vw, 1.0625rem);
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  max-width: 560px;
}

.evento-page .hero__cta { flex-shrink: 0; }

.evento-page .hero__cta-caption {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.evento-page .hero__cta-caption strong {
  color: var(--gold-hex);
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.evento-page .hero__cta-btn { width: 100%; }

@media (min-width: 640px) {
  .evento-page .hero__cta-btn { width: auto; }
}

@media (min-width: 1024px) {
  .evento-page .hero__media-wrap {
    position: absolute;
    inset: 0;
    width: 100%;
    max-width: none;
    margin: 0;
    border-radius: 0;
    aspect-ratio: auto;
    box-shadow: none;
  }

  .evento-page .hero__media { object-position: 70% 22%; }

  .evento-page .hero__media-gradient {
    background: linear-gradient(
      90deg,
      var(--navy-deep) 0%,
      rgba(10, 22, 40, 0.92) 30%,
      rgba(10, 22, 40, 0.55) 55%,
      rgba(10, 22, 40, 0.1) 78%,
      rgba(10, 22, 40, 0) 100%
    );
  }

  .evento-page .hero__brand {
    top: 2.5rem;
    left: clamp(1rem, 4vw, 2rem);
  }

  .evento-page .hero__logo { height: 34px; }

  .evento-page .hero__body {
    max-width: var(--container-max);
    margin-inline: auto;
    width: 100%;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: 3rem;
    padding: 2rem clamp(1rem, 4vw, 2rem) clamp(3rem, 7vw, 5rem);
  }

  .evento-page .hero__cta { text-align: right; max-width: 340px; }
}

/* ─── Mini footer ─── */
.evento-page .mini-footer {
  background: var(--navy-deep);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-block: 1.25rem;
}

.evento-page .mini-footer__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
}

.evento-page .mini-footer__inner a { transition: color var(--duration) var(--ease); }
.evento-page .mini-footer__inner a:hover { color: var(--gold); }

@media (min-width: 640px) {
  .evento-page .mini-footer__inner {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

/* ─── Modal ─── */
.evento-page .modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(4, 9, 15, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  animation: evento-fade-in 0.2s var(--ease);
}

.evento-page .modal-card {
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  background:
    radial-gradient(120% 120% at 15% 0%, rgba(252, 191, 0, 0.1), transparent 55%),
    linear-gradient(160deg, #122a42 0%, var(--navy-deep) 55%, #060d16 100%);
  border: 1px solid rgba(252, 191, 0, 0.2);
  border-radius: var(--radius-xl);
  padding: clamp(1.75rem, 4vw, 2.5rem);
  box-shadow: var(--shadow-card);
  animation: evento-modal-in 0.25s var(--ease);
}

.evento-page .modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.375rem;
  line-height: 1;
  transition: background var(--duration) var(--ease);
}

.evento-page .modal-close:hover { background: rgba(255, 255, 255, 0.18); }

.evento-page .modal-title {
  font-size: clamp(1.25rem, 3vw, 1.625rem);
  font-weight: 900;
  color: var(--white);
  line-height: 1.35;
  margin-bottom: 1.5rem;
  padding-right: 1.75rem;
}

.evento-page .modal-benefit {
  margin-top: 1.25rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
}

.evento-page .modal-benefit strong { color: var(--gold-hex); }

.evento-page .modal-legal {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.5;
}

/* ─── Form ─── */
.evento-page .lead-form {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

.evento-page .field { display: flex; flex-direction: column; gap: 0.4375rem; }

.evento-page .field label {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.8);
}

.evento-page .phone-input {
  position: relative;
  display: flex;
  align-items: center;
}

.evento-page .phone-input__prefix {
  position: absolute;
  left: 1rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  pointer-events: none;
}

.evento-page .field .phone-input input {
  padding-left: 3.125rem;
}

.evento-page .field input {
  width: 100%;
  min-height: 50px;
  padding-inline: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-pill);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--white);
  background: rgba(255, 255, 255, 0.06);
  outline: none;
  transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
}

.evento-page .field input::placeholder { color: rgba(255, 255, 255, 0.4); }

.evento-page .field input:focus {
  border-color: var(--gold-hex);
  box-shadow: 0 0 0 4px rgba(252, 191, 0, 0.18);
}

.evento-page .field input[aria-invalid="true"] {
  border-color: #f87171;
}

.evento-page .field__error {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #f87171;
  min-height: 1em;
  padding-inline: 0.25rem;
}

.evento-page .field__status {
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
}

.evento-page .field__status--success {
  background: rgba(34, 197, 94, 0.14);
  border: 1px solid rgba(34, 197, 94, 0.35);
  color: #4ade80;
}

.evento-page .field__status--error {
  background: rgba(220, 38, 38, 0.14);
  border: 1px solid rgba(220, 38, 38, 0.35);
  color: #f87171;
}

/* ─── Motion ─── */
@keyframes evento-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes evento-modal-in {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .evento-page .hero,
  .evento-page .modal-backdrop,
  .evento-page .modal-card { animation: none; }
}
      `}</style>
    </div>
  );
}
