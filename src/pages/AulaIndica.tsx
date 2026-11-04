import { useEffect, useRef, useState, type FormEvent } from "react";
import "./AulaIndica.css";
import { logEvent } from "@/lib/logger";
import { submitAulaIndicaLead } from "@/lib/aulaIndicaLead";

/*
 * /aula-indica — LP da aula gratuita do Help Indica (com Rafa).
 * Adaptada da LP estática "LP INDICA": valida o formulário, envia o lead
 * (ver lib/aulaIndicaLead) e abre o grupo da aula no WhatsApp.
 */

const PAGE_NAME = "AulaIndica";

/* Única fonte de verdade da data da aula (horário de Brasília).
 * A partir deste horário a página encerra as inscrições sozinha. */
const EVENT_START_ISO = "2026-11-11T13:30:00-03:00";

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/BlL88vNSYkyHEvf21rXYqZ?s=cl&p=i&mlu=4&ilr=4&iam=2";

const PAGE_TITLE = "Help Indica — Aula gratuita com Rafa | 11 de novembro";
const IMG = "/image/aula-indica";
const META_PIXEL_ID = "948091398277124"; // pixel Parceiros (Help Indica)

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"] as const;

/* Guarda as UTMs da primeira visita para não perder a origem do lead. */
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

/* ─── Telefone ─── */
function normalizePhone(v: string) {
  let d = v.replace(/\D/g, "");
  if ((d.length === 12 || d.length === 13) && d.startsWith("55")) d = d.slice(2);
  return d;
}

const isValidPhone = (d: string) => /^[1-9]{2}(?:9\d{8}|[2-5]\d{7})$/.test(d);

function formatPhone(d: string) {
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return null;
}

const hasStarted = () => Date.now() >= Date.parse(EVENT_START_ISO);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export default function AulaIndica() {
  const [closed, setClosed] = useState(hasStarted);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const statusRef = useRef<HTMLParagraphElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const openVideoRef = useRef<HTMLButtonElement>(null);
  const closeVideoRef = useRef<HTMLButtonElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;
    initTracking();
    return () => {
      document.title = previousTitle;
    };
  }, []);

  /* ─── encerra as inscrições no horário da aula ─── */
  useEffect(() => {
    const update = () => setClosed(hasStarted());
    const id = window.setInterval(update, 30000);
    window.addEventListener("focus", update);
    // voltar do WhatsApp pelo "voltar" do navegador restaura a página: libera o botão
    const onShow = () => {
      setSubmitting(false);
      update();
    };
    window.addEventListener("pageshow", onShow);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", update);
      window.removeEventListener("pageshow", onShow);
    };
  }, []);

  useEffect(() => {
    if (closed) document.title = "Help Indica — Edição de 11 de novembro de 2026";
  }, [closed]);

  /* ─── anima cada passo uma vez ao entrar na tela ─── */
  useEffect(() => {
    const steps = stepsRef.current?.querySelectorAll(".mechanism-step");
    if (!steps || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in-view");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [closed]);

  useEffect(() => {
    if (status) statusRef.current?.focus({ preventScroll: true });
  }, [status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    if (hasStarted()) return void setClosed(true);

    const form = e.currentTarget;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const phoneInput = form.elements.namedItem("whatsapp") as HTMLInputElement;
    const name = nameInput.value.trim().replace(/\s+/g, " ");
    const digits = normalizePhone(phoneInput.value);

    nameInput.setCustomValidity(name.length >= 2 ? "" : "Informe seu nome.");
    phoneInput.setCustomValidity(
      isValidPhone(digits) ? "" : "Informe um WhatsApp válido com DDD, por exemplo (42) 99999-9999.",
    );
    if (!form.reportValidity()) return;

    setStatus("");
    setSubmitting(true);

    const utm = getUtmParams();
    const meta = window.getMetaTrackingData?.() || { fbp: "", fbc: "", fbclid: "" };
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();

    await submitAulaIndicaLead({
      name,
      email,
      phone: digits,
      fbp: meta.fbp || "",
      fbc: meta.fbc || "",
      fbclid: meta.fbclid || "",
      ...utm,
    });

    const utmSource = utm.utm_source.toLowerCase();
    if (utmSource === "ig" || utmSource === "fb") {
      const eventID = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      window.fbq?.("trackSingle", META_PIXEL_ID, "Lead", { content_name: "Aula Help Indica" }, { eventID });
      logEvent(PAGE_NAME, "pixel_event", "fbq trackSingle Lead disparado", { pixelId: META_PIXEL_ID, eventID, utmSource });
    }

    try {
      window.location.assign(WHATSAPP_GROUP_URL);
    } catch {
      setSubmitting(false);
      setStatus("Não foi possível abrir o grupo. Tente novamente.");
    }
  }

  /* ─── depoimento em vídeo ─── */
  function openVideo() {
    const dialog = dialogRef.current;
    if (!dialog || typeof dialog.showModal !== "function") {
      window.location.href = `${IMG}/depoimento-junior.mp4`;
      return;
    }
    document.body.style.overflow = "hidden";
    dialog.showModal();
    closeVideoRef.current?.focus();
    // o clique do visitante libera o autoplay com som; se o navegador bloquear, ficam os controles
    if (videoRef.current) videoRef.current.currentTime = 0; // sempre começa do início
    videoRef.current?.play().catch(() => {});
    logEvent(PAGE_NAME, "action", "Abriu depoimento em vídeo");
  }

  function onDialogClose() {
    videoRef.current?.pause();
    document.body.style.overflow = "";
    openVideoRef.current?.focus({ preventScroll: true });
  }

  function onDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target !== e.currentTarget) return;
    const box = e.currentTarget.getBoundingClientRect();
    if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) {
      e.currentTarget.close();
    }
  }

  return (
    <div className="aula-indica">
      <a className="skip-link" href="#inscricao">
        Ir para a inscrição
      </a>
      <div className="page-shell">
        <header className="masthead">
          <a href={window.location.pathname} aria-label="Help Indica — início">
            <img className="brand" src={`${IMG}/help-indica.svg`} width="770" height="220" alt="Help Indica" />
          </a>
          <p className="edition">
            {closed ? (
              "HELP INDICA • EDIÇÃO 11/11/2026"
            ) : (
              <>
                AULA GRATUITA <span aria-hidden="true">•</span> ONLINE E AO VIVO
              </>
            )}
          </p>
        </header>

        <main className="campaign">
          <div className="copy">
            <div
              className="event-meta"
              aria-label={
                closed
                  ? "Edição de 11 de novembro de 2026, às 13h30, horário de Brasília."
                  : "11 de novembro de 2026, às 13h30, horário de Brasília. Online e ao vivo."
              }
            >
              <time className="date" dateTime={EVENT_START_ISO}>
                11 NOV <span>2026</span>
              </time>
              <div className="event-details">
                <strong>13h30 • Brasília</strong>
                <span>{closed ? "Edição de 11/11/2026" : "Online e ao vivo"}</span>
              </div>
            </div>

            {closed ? (
              <h1>Help Indica: você indica. A Help Multas cuida do motorista.</h1>
            ) : (
              <h1>
                Como <span className="highlight">ganhar dinheiro</span> com os motoristas que você já conhece
                indicando quem precisa de ajuda com multas ou CNH, sem vender nem{" "}
                <span className="keep-together">fazer o recurso.</span>
              </h1>
            )}

            <div className="mechanism-block" aria-labelledby="mechanism">
              {closed ? (
                <h2 id="mechanism">
                  Esta é a página da aula de 11 de novembro de 2026, às 13h30. No Help Indica, você indica e a Help
                  Multas atende, fecha a venda e cuida do recurso. As inscrições para esta edição estão encerradas.
                </h2>
              ) : (
                <h2 id="mechanism">
                  <span className="mechanism-highlight">Você indica.</span> A Help cuida de tudo. Sua indicação pode
                  virar dinheiro.
                </h2>
              )}
              <ol className="mechanism-flow" role="list" aria-label="Como funciona o Help Indica" ref={stepsRef}>
                <li className="mechanism-step">
                  <span className="step-marker">
                    <span className="step-number">01</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                      <circle cx="7" cy="7" r="3" />
                      <path d="M1.5 20v-2a5.5 5.5 0 0 1 11 0v2M17 5h5m-2-2 2 2-2 2M17 10a3 3 0 0 1 0 6m0 2h2a3 3 0 0 1 3 3" />
                    </svg>
                  </span>
                  <div className="step-copy">
                    <strong className="step-title">Você conecta</strong>
                    <p>Indique um motorista que precisa de ajuda com multas ou problemas na CNH.</p>
                  </div>
                </li>
                <li className="mechanism-step">
                  <span className="step-marker">
                    <span className="step-number">02</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                      <path d="M4 13v-2a8 8 0 0 1 16 0v2M20 18v1a3 3 0 0 1-3 3h-3" />
                      <rect x="2" y="11" width="5" height="8" rx="2" />
                      <rect x="17" y="11" width="5" height="8" rx="2" />
                    </svg>
                  </span>
                  <div className="step-copy">
                    <strong className="step-title">A Help resolve o atendimento</strong>
                    <p>A equipe atende o motorista, conduz a venda e cuida do recurso.</p>
                  </div>
                </li>
                <li className="mechanism-step">
                  <span className="step-marker">
                    <span className="step-number">03</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 11v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7M3 8h9M16 5l2 2 4-4" />
                      <path d="M17 13h5v5h-5a2.5 2.5 0 0 1 0-5Z" />
                    </svg>
                  </span>
                  <div className="step-copy">
                    <strong className="step-title">
                      <span className="mechanism-highlight">Você recebe</span>
                    </strong>
                    <p>Quando a indicação vira uma venda elegível, você recebe conforme as regras do programa.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <aside className="signup" id="inscricao" aria-label="Inscrição no webinar Help Indica">
            <p className="presenter-note">
              <span>
                Com <strong>Rafa</strong>
              </span>
              <span>Help Indica</span>
            </p>
            <div className="signup-panel">
              {closed ? (
                <div className="event-closed">
                  <p className="form-label">INSCRIÇÕES ENCERRADAS</p>
                  <p>
                    Data desta edição:
                    <br />
                    <strong>
                      11 de novembro de 2026,
                      <br />
                      às 13h30, horário de Brasília.
                    </strong>
                  </p>
                </div>
              ) : (
                <>
                  <p className="form-label">SUA INSCRIÇÃO GRATUITA</p>
                  <form onSubmit={handleSubmit}>
                    <div className="field">
                      <label htmlFor="ai-name">Nome</label>
                      <input
                        id="ai-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        minLength={2}
                        maxLength={120}
                        onInput={(e) => e.currentTarget.setCustomValidity("")}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="ai-email">E-mail</label>
                      <input id="ai-email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254} />
                    </div>
                    <div className="field">
                      <label htmlFor="ai-whatsapp">
                        WhatsApp <span>com DDD</span>
                      </label>
                      <input
                        id="ai-whatsapp"
                        name="whatsapp"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        required
                        maxLength={22}
                        aria-describedby="ai-contact-note"
                        onInput={(e) => e.currentTarget.setCustomValidity("")}
                        onBlur={(e) => {
                          const formatted = formatPhone(normalizePhone(e.currentTarget.value));
                          if (formatted) e.currentTarget.value = formatted;
                        }}
                      />
                    </div>
                    <label className="consent">
                      <input type="checkbox" name="consent" required />
                      <span>
                        Li e estou de acordo com a{" "}
                        <a href="https://www.helpmultas.com/politica-de-privacidade" target="_blank" rel="noopener noreferrer">
                          Política de Privacidade
                        </a>
                        .
                      </span>
                    </label>
                    <button className="primary-button" type="submit" disabled={submitting} aria-busy={submitting || undefined}>
                      {submitting ? (
                        "ABRINDO O GRUPO DA AULA…"
                      ) : (
                        <>
                          <span>
                            QUERO APRENDER A GANHAR
                            <br className="desktop-break" /> COM INDICAÇÕES
                          </span>
                          <ArrowIcon />
                        </>
                      )}
                    </button>
                    <p ref={statusRef} className="form-status" role="status" tabIndex={-1}>
                      {status}
                    </p>
                    <p id="ai-contact-note" className="contact-note">
                      Entre no grupo para receber o acesso e os lembretes da aula pelo WhatsApp.
                    </p>
                  </form>
                </>
              )}
            </div>
          </aside>

          <div className="proof">
            <button
              type="button"
              className="proof-trigger"
              ref={openVideoRef}
              onClick={openVideo}
              aria-haspopup="dialog"
              aria-controls="ai-testimonial-dialog"
            >
              <span className="proof-thumbnail">
                <img src={`${IMG}/junior.webp`} width="540" height="960" alt="Júnior, parceiro do Help Indica" loading="lazy" />
                <span className="play-symbol" aria-hidden="true">
                  <svg width="14" height="16" viewBox="0 0 14 16">
                    <path d="M2 1L13 8L2 15Z" fill="currentColor" />
                  </svg>
                </span>
              </span>
              <span className="proof-copy">
                <span className="eyebrow">QUEM JÁ INDICA</span>
                <strong>Júnior · Liva’s Despachante</strong>
                <span className="watch-label">
                  Assista ao depoimento <span aria-hidden="true">↗</span>
                </span>
              </span>
            </button>
          </div>
        </main>

        <footer className="footer">
          <img src={`${IMG}/help-indica.svg`} width="770" height="220" alt="Help Indica" />
          <p>© 2026 Help Indica</p>
          <div>
            <a href="https://www.helpmultas.com/politica-de-privacidade" target="_blank" rel="noopener noreferrer">
              Privacidade
            </a>
            <a href="https://www.helpmultas.com/termos-de-uso" target="_blank" rel="noopener noreferrer">
              Termos de uso
            </a>
          </div>
        </footer>
      </div>

      <dialog id="ai-testimonial-dialog" ref={dialogRef} aria-labelledby="ai-video-label" onClose={onDialogClose} onClick={onDialogClick}>
        <div className="dialog-top">
          <p id="ai-video-label">Júnior · Liva’s Despachante</p>
          <button type="button" ref={closeVideoRef} onClick={() => dialogRef.current?.close()} aria-label="Fechar depoimento">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
        </div>
        <video ref={videoRef} controls playsInline preload="metadata" poster={`${IMG}/junior.webp`}>
          <source src={`${IMG}/depoimento-junior.mp4`} type="video/mp4" />
          Seu navegador não suporta vídeo. <a href={`${IMG}/depoimento-junior.mp4`}>Abrir o depoimento</a>.
        </video>
        <p className="dialog-note">Trecho do depoimento original.</p>
      </dialog>
    </div>
  );
}
