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

  const nomeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    if (!prefersReducedMotion) {
      document.documentElement.style.scrollBehavior = "smooth";
    }
    return () => {
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const revealEls = pageRef.current?.querySelectorAll(".reveal") ?? [];
    revealEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
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

  async function submitLead(data: { nome: string; email: string; whatsapp: string }) {
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

    const result = await submitLead({
      nome: nome.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
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

  function scrollToForm(focusName?: boolean) {
    const target = document.getElementById("inscricao");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (focusName) {
      window.setTimeout(() => {
        nomeRef.current?.focus();
      }, 500);
    }
  }

  return (
    <div className="evento-page" ref={pageRef}>
      <header className="top-bar">
        <div className="container top-bar__inner">
          <img
            src="/image/LogotipoHelpinho.png"
            alt="Help Multas"
            className="top-bar__logo"
            width={150}
            height={44}
          />
          <span className="top-bar__badge">
            <span className="dot" aria-hidden="true" />
            Aula ao vivo gratuita
          </span>
        </div>
      </header>

      <main>
        {/* ═══════════════ DOBRA 1 — HERO + FORMULÁRIO ═══════════════ */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__overlay" aria-hidden="true" />
          <div className="container hero__content">
            <div className="hero__grid">
              <div className="hero__main">
                <h1 id="hero-title" className="hero__title">
                  Como faturar com as{" "}
                  <span className="highlight">250 milhões de multas aplicadas por ano</span> que
                  quase ninguém explora <span className="highlight">na sua cidade</span>
                </h1>

                <p className="hero__subtitle">
                  Descubra
                  como funciona o <strong>mercado de defesa de multas</strong>, por que ele continua <strong>crescendo</strong> e
                  como pessoas comuns estão construindo negócios nesse setor, <strong>mesmo sem serem
                  advogadas ou especialistas em trânsito.</strong>
                </p>

                <div className="hero__meta">
                  <span className="meta-pill">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    19 de agosto de 2026
                  </span>
                  <span className="meta-pill">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    12h
                  </span>
                  <span className="meta-pill">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Online
                  </span>
                  <span className="meta-pill">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                    Gratuito
                  </span>
                </div>

                <div className="hero__actions">
                  <a
                    href="#inscricao"
                    className="btn btn--primary btn--lg"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToForm();
                    }}
                  >
                    Quero garantir minha vaga gratuita →
                  </a>
                </div>
              </div>

              {/* Formulário */}
              <aside className="form-card" id="inscricao" aria-labelledby="form-title">
                <span className="gold-line" />
                <h2 id="form-title" className="form-card__title">
                  Garanta sua vaga
                </h2>
                <p className="form-card__desc">
                  Preencha seus dados para receber o link da transmissão e os lembretes pelo
                  WhatsApp.
                </p>

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
                    {submitting ? "Enviando..." : "Quero participar da aula gratuita"}
                  </button>
                </form>
              </aside>
            </div>
          </div>
        </section>

        {/* ═══════════════ DOBRA 2 — A OPORTUNIDADE ═══════════════ */}
        <section className="section opportunity" aria-labelledby="opportunity-title">
          <div className="container">
            <header className="section-header section-header--center reveal">
              <span className="gold-line" />
              <h2 id="opportunity-title" className="section-title">
                Um mercado gigante que ainda passa <span className="highlight">despercebido</span>
              </h2>
              <p className="section-desc">
                Todos os anos, cerca de 250 milhões de multas são aplicadas no Brasil. Mesmo
                assim, poucas empresas estão preparadas para atender essa demanda.
              </p>
            </header>

            <p className="opportunity__lead reveal">Na aula, você vai descobrir:</p>

            <div className="cards-grid cards-grid--4">
              <article className="card reveal">
                <div className="card__icon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M3 3v18h18" />
                    <path d="M18 9l-5 5-4-4-3 3" />
                  </svg>
                </div>
                <p className="card__desc">Por que esse mercado continua crescendo</p>
              </article>
              <article className="card reveal">
                <div className="card__icon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                  </svg>
                </div>
                <p className="card__desc">Como funciona uma operação de defesa de multas</p>
              </article>
              <article className="card reveal">
                <div className="card__icon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <p className="card__desc">Como começar mesmo sem ser advogado</p>
              </article>
              <article className="card reveal">
                <div className="card__icon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <p className="card__desc">Como identificar a oportunidade na sua cidade</p>
              </article>
            </div>

            <div className="opportunity__cta reveal">
              <a
                href="#inscricao"
                className="btn btn--secondary btn--lg"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToForm(true);
                }}
              >
                Quero conhecer esse mercado
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════ DOBRA 3 — AUTORIDADE ═══════════════ */}
        <section className="section speaker" aria-labelledby="speaker-title">
          <div className="container">
            <div className="speaker__grid">
              <div className="speaker__photo-wrap reveal">
                <div className="speaker__deco" aria-hidden="true" />
                <figure className="speaker__photo">
                  <img
                    src="/image/rober.jpg"
                    alt="Roberson Alvarenga, fundador da Help Multas"
                    width={320}
                    height={427}
                    loading="lazy"
                  />
                </figure>
              </div>
              <div className="speaker__info reveal">
                <span className="gold-line" />
                <p className="eyebrow">Palestrante</p>
                <h2 id="speaker-title" className="section-title">
                  Aprenda com quem conhece esse mercado <span className="highlight">por dentro</span>
                </h2>
                <p className="speaker__bio-lead">
                  Roberson Alvarenga é fundador da Help Multas, uma rede com mais de 80 unidades,
                  dez anos de experiência e 100 mil motoristas atendidos.
                </p>

                <div className="stats-row">
                  <div className="stat-card">
                    <span className="stat-card__value">+80</span>
                    <span className="stat-card__label">Unidades</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-card__value">10 anos</span>
                    <span className="stat-card__label">De experiência</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-card__value">100 mil</span>
                    <span className="stat-card__label">Motoristas atendidos</span>
                  </div>
                </div>

                <p className="speaker__bio">
                  No dia 19, ele vai mostrar como esse mercado funciona e o que você precisa
                  avaliar para transformar essa oportunidade em um negócio na sua cidade.
                </p>

                <p className="speaker__event-line">19 de agosto · 12h · Online · Gratuito</p>

                <a
                  href="#inscricao"
                  className="btn btn--primary btn--lg"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToForm(true);
                  }}
                >
                  Quero garantir minha vaga →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Encerramento */}
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <img
                src="/image/LogotipoHelpinho.png"
                alt="Help Multas"
                className="footer__logo"
                width={150}
                height={44}
              />
              <p className="footer__tagline">
                A maior rede de franquias de recursos de multas do Brasil. Aula ao vivo e
                gratuita em 19 de agosto de 2026, às 12h.
              </p>
            </div>

            <nav className="footer__nav" aria-label="Links Help Multas">
              <div>
                <h3 className="footer__col-title">Aula ao vivo</h3>
                <ul className="footer__links">
                  <li>
                    <a href="#hero-title">Sobre a aula</a>
                  </li>
                  <li>
                    <a href="#opportunity-title">A oportunidade</a>
                  </li>
                  <li>
                    <a href="#speaker-title">Palestrante</a>
                  </li>
                  <li>
                    <a href="#inscricao">Garantir vaga</a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="footer__col-title">Help Multas</h3>
                <ul className="footer__links">
                  <li>
                    <a href="https://www.helpmultas.com/" target="_blank" rel="noopener noreferrer">
                      Site oficial
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://franquias.helpmultas.com.br/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Franquias
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/helpmultasfranchising"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <hr className="footer__divider" />
          <div className="footer__bottom">
            <p>© 2026 Help Multas. Todos os direitos reservados.</p>
            <p>CNPJ: 26.545.757/0001-54</p>
          </div>
        </div>
      </footer>

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
  --cream: #f8f6f0;
  --white: #ffffff;
  --text-muted: oklch(0.5 0.02 250);
  --border: #d9e1e8;
  --border-light: rgba(255, 255, 255, 0.1);
  --danger: #dc2626;

  --font-display: "Montserrat", system-ui, sans-serif;
  --font-body: "Montserrat", system-ui, sans-serif;

  --container-max: 1280px;
  --section-py: clamp(4rem, 8vw, 6rem);
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --radius-pill: 999px;

  --shadow-card: 0 32px 70px rgba(0, 0, 0, 0.45);
  --shadow-soft: 0 6px 20px rgba(23, 36, 44, 0.1);
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
  color: var(--navy-deep);
  background: var(--offwhite);
  -webkit-font-smoothing: antialiased;
}

.evento-page img { max-width: 100%; height: auto; display: block; }
.evento-page a { color: inherit; text-decoration: none; }
.evento-page button { font-family: inherit; cursor: pointer; }
.evento-page h1,
.evento-page h2,
.evento-page h3 { font-family: var(--font-display); margin: 0; line-height: 1.1; }
.evento-page p { margin: 0; }

.evento-page :focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

.evento-page .container {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2rem);
}

.evento-page .section { padding-block: var(--section-py); }

.evento-page .section-header { max-width: 720px; margin-bottom: clamp(2rem, 5vw, 3rem); }
.evento-page .section-header--center { text-align: center; margin-inline: auto; }

.evento-page .gold-line {
  display: block;
  width: 60px;
  height: 3px;
  background: var(--gold);
  margin-bottom: 1rem;
}

.evento-page .section-header--center .gold-line { margin-inline: auto; }

.evento-page .eyebrow {
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--gold-hex);
  margin-bottom: 0.75rem;
}

.evento-page .section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 900;
  color: var(--navy-mid);
  letter-spacing: -0.02em;
}

.evento-page .highlight { color: var(--gold-hex); }

.evento-page .speaker .highlight,
.evento-page .opportunity .highlight { color: var(--gold-hex); }

.evento-page .hero .highlight { color: var(--gold); }

.evento-page .section-desc {
  margin-top: 1rem;
  font-size: 1.0625rem;
  color: var(--text-muted);
  line-height: 1.7;
}

/* ─── Buttons ─── */
.evento-page .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 52px;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: transform var(--duration) var(--ease),
    background var(--duration) var(--ease),
    opacity var(--duration) var(--ease);
}

.evento-page .btn:active { transform: scale(0.98); }

.evento-page .btn--primary {
  background: var(--gold);
  color: var(--navy-deep);
  box-shadow: 0 14px 24px rgba(252, 191, 0, 0.28);
}

.evento-page .btn--primary:hover { background: var(--gold-hover); transform: translateY(-1px); }

.evento-page .btn--secondary {
  background: var(--navy-deep);
  color: var(--white);
}

.evento-page .btn--secondary:hover { opacity: 0.9; transform: translateY(-1px); }

.evento-page .btn--lg { min-height: 56px; padding-inline: 2rem; font-size: 1rem; }

.evento-page .btn--block { width: 100%; }

.evento-page .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* ─── Top bar ─── */
.evento-page .top-bar {
  background: var(--navy-deep);
  padding-block: 0.875rem;
}

.evento-page .top-bar__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.625rem 1rem;
}

.evento-page .top-bar__logo { height: 32px; width: auto; object-fit: contain; }

.evento-page .top-bar__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.875rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-pill);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
}

.evento-page .top-bar__badge .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold);
  flex-shrink: 0;
}

/* ─── Hero ─── */
.evento-page .hero {
  position: relative;
  overflow: hidden;
  background: var(--navy-deep) url("/image/fundo.webp") center / cover no-repeat;
}

.evento-page .hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(26, 45, 61, 0.72);
  backdrop-filter: blur(6px);
}

.evento-page .hero__content {
  position: relative;
  z-index: 1;
  padding-block: clamp(2.5rem, 6vw, 4.5rem);
}

.evento-page .hero__grid {
  display: grid;
  gap: clamp(2rem, 5vw, 3rem);
  align-items: center;
}

@media (min-width: 1024px) {
  .evento-page .hero__grid { grid-template-columns: 1.1fr 0.9fr; }
}

.evento-page .hero__title {
  font-size: clamp(2rem, 4.6vw, 3.25rem);
  font-weight: 900;
  color: var(--white);
  letter-spacing: -0.02em;
  margin-bottom: 1.25rem;
}

.evento-page .hero__subtitle {
  font-size: clamp(1rem, 1.6vw, 1.125rem);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  max-width: 560px;
}

.evento-page .hero__subtitle strong { color: var(--white); }

.evento-page .hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.evento-page .meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-pill);
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

.evento-page .meta-pill svg { width: 16px; height: 16px; color: var(--gold); flex-shrink: 0; }

.evento-page .hero__actions { display: flex; }

@media (max-width: 480px) {
  .evento-page .hero__actions { width: 100%; }
  .evento-page .hero__actions .btn { width: 100%; }
}

/* ─── Form card ─── */
.evento-page .form-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: clamp(1.5rem, 4vw, 2.25rem);
  box-shadow: var(--shadow-card);
  border: 1px solid rgba(252, 191, 0, 0.2);
  scroll-margin-top: 1.5rem;
}

.evento-page .form-card__title {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--navy-deep);
  margin-bottom: 0.5rem;
}

.evento-page .form-card__desc {
  font-size: 0.9375rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

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
  color: var(--navy-deep);
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
  color: var(--navy-deep);
  pointer-events: none;
}

.evento-page .field .phone-input input {
  padding-left: 3.125rem;
}

.evento-page .field input {
  width: 100%;
  min-height: 50px;
  padding-inline: 1rem;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--navy-deep);
  background: var(--white);
  outline: none;
  transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
}

.evento-page .field input::placeholder { color: #98a2b3; }

.evento-page .field input:focus {
  border-color: var(--gold-hex);
  box-shadow: 0 0 0 4px rgba(252, 191, 0, 0.18);
}

.evento-page .field input[aria-invalid="true"] {
  border-color: var(--danger);
}

.evento-page .field__error {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--danger);
  min-height: 1em;
}

.evento-page .field__status {
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
}

.evento-page .field__status--success {
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #15803d;
}

.evento-page .field__status--error {
  background: rgba(220, 38, 38, 0.08);
  border: 1px solid rgba(220, 38, 38, 0.25);
  color: var(--danger);
}

/* ─── Opportunity (Dobra 2) ─── */
.evento-page .opportunity { background: var(--white); }

.evento-page .opportunity__lead {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--navy-deep);
  text-align: center;
  margin-bottom: 1.5rem;
}

.evento-page .cards-grid { display: grid; gap: 1.25rem; }

.evento-page .cards-grid--4 { grid-template-columns: 1fr; }

@media (min-width: 640px) {
  .evento-page .cards-grid--4 { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .evento-page .cards-grid--4 { grid-template-columns: repeat(4, 1fr); }
}

.evento-page .card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.875rem;
  background: var(--cream);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  border: 1px solid #eee;
  transition: transform var(--duration) var(--ease), border-color var(--duration) var(--ease);
}

.evento-page .card:hover { transform: translateY(-4px); border-color: rgba(252, 191, 0, 0.35); }

.evento-page .card__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(252, 191, 0, 0.14);
  border-radius: var(--radius-sm);
  color: var(--gold-hex);
  flex-shrink: 0;
}

.evento-page .card__icon svg { width: 24px; height: 24px; }

.evento-page .card__desc {
  font-size: 1rem;
  font-weight: 700;
  color: var(--navy-deep);
  line-height: 1.5;
}

.evento-page .opportunity__cta {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

/* ─── Speaker (Dobra 3) ─── */
.evento-page .speaker { background: var(--cream); }

.evento-page .speaker__grid {
  display: grid;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .evento-page .speaker__grid { grid-template-columns: 420px 1fr; }
}

.evento-page .speaker__photo-wrap {
  position: relative;
  max-width: 320px;
  margin-inline: auto;
}

@media (min-width: 1024px) {
  .evento-page .speaker__photo-wrap { max-width: 100%; }
}

.evento-page .speaker__photo {
  margin: 0;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  border: 2px solid #eee;
}

.evento-page .speaker__photo img { width: 100%; aspect-ratio: 3/4; object-fit: cover; object-position: top; }

.evento-page .speaker__deco {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 64px;
  height: 64px;
  background: var(--gold);
  border-radius: var(--radius-md);
  z-index: -1;
}

.evento-page .speaker__bio-lead {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--navy-deep);
  line-height: 1.6;
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.evento-page .speaker .stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.875rem;
  margin-bottom: 2rem;
}

.evento-page .stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.25rem 0.75rem;
  background: var(--navy-deep);
  border-radius: var(--radius-lg);
}

.evento-page .stat-card__value {
  font-size: clamp(1.375rem, 3vw, 1.75rem);
  font-weight: 900;
  color: var(--gold);
  line-height: 1;
}

.evento-page .stat-card__label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--white);
  margin-top: 0.5rem;
}

.evento-page .speaker__bio {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.evento-page .speaker__event-line {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--navy-mid);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 1.75rem;
}

/* ─── Footer ─── */
.evento-page .footer {
  position: relative;
  overflow: hidden;
  background: var(--navy-deep);
  color: rgba(255, 255, 255, 0.7);
  padding-block: clamp(3rem, 6vw, 4rem) 2rem;
  font-size: 0.875rem;
}

.evento-page .footer::before {
  content: "";
  position: absolute;
  top: -80px;
  right: -80px;
  width: 260px;
  height: 260px;
  background: var(--gold);
  opacity: 0.06;
  border-radius: 50%;
  pointer-events: none;
}

.evento-page .footer__grid {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.5rem;
  padding-bottom: 2.5rem;
}

@media (min-width: 640px) {
  .evento-page .footer__grid { flex-direction: row; justify-content: space-between; align-items: flex-start; }
}

.evento-page .footer__brand { display: flex; flex-direction: column; align-items: flex-start; gap: 1.125rem; max-width: 320px; }

.evento-page .footer__logo { height: 44px; width: auto; object-fit: contain; }

.evento-page .footer__tagline {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
}

.evento-page .footer__nav { display: flex; flex-wrap: wrap; gap: 2.5rem; }

.evento-page .footer__col-title {
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gold);
  margin-bottom: 0.875rem;
}

.evento-page .footer__links {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.evento-page .footer__links a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.65);
  transition: color var(--duration) var(--ease);
}

.evento-page .footer__links a:hover { color: var(--gold); }

.evento-page .footer__links svg { width: 16px; height: 16px; flex-shrink: 0; opacity: 0.7; }

.evento-page .footer__divider {
  position: relative;
  z-index: 1;
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-block: 0 1.5rem;
}

.evento-page .footer__bottom {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

@media (min-width: 640px) {
  .evento-page .footer__bottom { flex-direction: row; justify-content: space-between; text-align: left; }
}

/* ─── Scroll reveal ─── */
.evento-page .reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
}

.evento-page .reveal.is-visible { opacity: 1; transform: translateY(0); }

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .evento-page .reveal { opacity: 1; transform: none; transition: none; }
}
      `}</style>
    </div>
  );
}
