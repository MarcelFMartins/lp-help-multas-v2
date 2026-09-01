import { useEffect, useRef, useState } from "react";
import { formatWhatsapp } from "@/components/HeroSection";

const GOOGLE_SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzsRnL3wUdKJA9JMIp9xP-Yzg09GmOa3gaYSknUPdsIlkvFO_-vu5QqP7GnZmDhAltucg/exec";

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/K56JiM8uHTi0n8GcdyKwM8";

const PAGE_TITLE = "Aula Gratuita | Mercado de Defesa de Multas — Help Multas";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

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

interface ChatStep {
  key: "nome" | "email" | "whatsapp";
  botText: string[];
  type: "text" | "email" | "tel";
  placeholder: string;
  validate: (value: string) => string | null;
}

const INTRO_MESSAGES: string[] = [
  "Olá! Sou o assistente virtual da Help Multas.",
  "O Brasil emite mais de **250 milhões de multas** por ano — e você pode faturar com isso.",
  "Vou te fazer **3 perguntas rápidas** pra garantir sua vaga na aula ao vivo.",
];

const CHAT_STEPS: ChatStep[] = [
  {
    key: "nome",
    botText: ["Qual é o seu **nome completo**?"],
    type: "text",
    placeholder: "Digite seu nome completo",
    validate: (v) => (v.trim().length < 3 ? "Digite seu nome completo." : null),
  },
  {
    key: "email",
    botText: ["E qual é o seu **e-mail**?"],
    type: "email",
    placeholder: "seuemail@exemplo.com",
    validate: (v) => (!isValidEmail(v) ? "Digite um e-mail válido." : null),
  },
  {
    key: "whatsapp",
    botText: ["Perfeito. E o seu **WhatsApp com DDD**?"],
    type: "tel",
    placeholder: "(00) 00000-0000",
    validate: (v) => {
      const digits = onlyDigits(v);
      return digits.length < 10 || digits.length > 11 ? "Digite um WhatsApp válido com DDD." : null;
    },
  },
];

const TOTAL_STEPS = CHAT_STEPS.length;

interface Message {
  id: string;
  from: "bot" | "user";
  text: string;
}

interface Answers {
  nome?: string;
  email?: string;
  whatsapp?: string;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function renderWithBold(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

export default function EventoChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const [inputReady, setInputReady] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});

  const startedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  async function pushBotMessages(texts: string[], speedMultiplier = 1) {
    for (const text of texts) {
      setTyping(true);
      await wait((500 + Math.min(text.length * 8, 700)) / speedMultiplier);
      setTyping(false);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), from: "bot", text }]);
      await wait(250 / speedMultiplier);
    }
  }

  async function playIntro() {
    setInputReady(false);
    await wait(400 / 3);
    await pushBotMessages(INTRO_MESSAGES, 3);
    await pushBotMessages(CHAT_STEPS[0].botText, 3);
    setInputReady(true);
  }

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void playIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function submitToSheet(data: Required<Answers>) {
    const utm = getUtmParams();
    try {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          whatsapp: data.whatsapp,
          dataHora: getSubmissionTimestamp(),
          utmSource: utm.utm_source,
          utmMedium: utm.utm_medium,
          utmCampaign: utm.utm_campaign,
          utmContent: utm.utm_content,
          utmTerm: utm.utm_term,
          pageUrl: window.location.href,
        }),
      });
      return { ok: true };
    } catch (err) {
      console.error("[evento-chat] Erro de rede ao enviar para o Google Sheets:", err);
      return { ok: false };
    }
  }

  async function handleSubmit(rawValue: string) {
    const step = CHAT_STEPS[stepIndex];
    const validationError = step.validate(rawValue);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    setInputReady(false);
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), from: "user", text: rawValue }]);
    setInputValue("");

    const merged: Answers = { ...answers, [step.key]: rawValue };
    setAnswers(merged);

    const isLast = stepIndex === TOTAL_STEPS - 1;

    if (isLast) {
      setDone(true);

      // event_id para deduplicação Meta (mesmo padrão do fbq disparado no botão da LP normal)
      const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      if (window.fbq) {
        // Pixel exclusivo do evento-chat: só é inicializado quando o lead envia o formulário completo
        window.fbq("init", "924662103561102");
        window.fbq("track", "PageView");
        window.fbq("track", "Lead", { content_name: "Landing Page Evento — Chat" }, { eventID: eventId });
      }

      await pushBotMessages(["Inscrição recebida! Te levando para o grupo do WhatsApp..."]);
      await submitToSheet(merged as Required<Answers>);
      await wait(600);
      window.location.href = WHATSAPP_GROUP_URL;
      return;
    }

    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);
    await pushBotMessages(CHAT_STEPS[nextIndex].botText);
    setInputReady(true);
  }

  const step = !done ? CHAT_STEPS[stepIndex] : null;
  const answeredCount = done ? TOTAL_STEPS : stepIndex;

  return (
    <div className="min-h-screen flex flex-col items-center bg-[oklch(0.1998_0.0403_258.29)]">
      <header className="w-full max-w-2xl px-5 pt-6 pb-2">
        <img src="/image/LogotipoHelpinho.png" alt="Help Multas" className="h-9 w-auto" />
      </header>

      <main className="w-full max-w-2xl flex-1 flex flex-col px-4 pb-6">
        <div className="h-1.5 rounded-full bg-white/15 overflow-hidden mt-3">
          <div
            className="h-full bg-gold transition-all duration-300 ease-out"
            style={{ width: `${(answeredCount / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <p className="font-body text-white/60 text-[11px] font-semibold uppercase tracking-[.15em] my-3">
          {done ? "Cadastro concluído" : `Pergunta ${stepIndex + 1} de ${TOTAL_STEPS}`}
        </p>

        <div
          ref={scrollRef}
          className="flex-1 min-h-[360px] max-h-[60vh] overflow-y-auto bg-white rounded-[24px] shadow-[0_32px_70px_rgba(0,0,0,0.45)] p-5 flex flex-col gap-3"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-end shrink-0 ${m.from === "bot" ? "justify-start" : "justify-end"}`}
            >
              {m.from === "bot" && (
                <img
                  src="/image/helpinho 3d.png"
                  alt=""
                  className="w-7 h-7 rounded-full mr-2 shrink-0 object-cover"
                />
              )}
              <div
                className={`font-body text-[15px] leading-relaxed rounded-2xl px-4 py-3 max-w-[80%] ${
                  m.from === "bot"
                    ? "bg-[#edf2f6] text-[oklch(0.1998_0.0403_258.29)] rounded-bl-[4px]"
                    : "bg-[oklch(0.1998_0.0403_258.29)] text-white rounded-br-[4px]"
                }`}
              >
                {m.from === "bot" ? renderWithBold(m.text) : m.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex items-end justify-start shrink-0">
              <img
                src="/image/helpinho 3d.png"
                alt=""
                className="w-7 h-7 rounded-full mr-2 shrink-0 object-cover"
              />
              <div className="bg-[#edf2f6] rounded-2xl rounded-bl-[4px] px-4 py-3.5 flex items-center gap-1">
                {[0, 0.15, 0.3].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-[#98a2b3] animate-bounce"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {!done && inputReady && step && (
          <div className="mt-4">
            {error && (
              <p className="text-red-400 text-[13px] font-body mb-2 px-1">{error}</p>
            )}

            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(inputValue.trim());
              }}
            >
              <input
                type={step.type}
                value={inputValue}
                placeholder={step.placeholder}
                onChange={(e) =>
                  setInputValue(
                    step.type === "tel" ? formatWhatsapp(e.target.value) : e.target.value
                  )
                }
                maxLength={step.type === "tel" ? 19 : undefined}
                inputMode={step.type === "tel" ? "numeric" : undefined}
                autoFocus
                className="flex-1 min-h-[50px] border-2 border-[#D9E1E8] rounded-full px-4 bg-white text-[oklch(0.1998_0.0403_258.29)] text-[15px] outline-none placeholder-[#98a2b3] focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all duration-200"
              />
              <button
                type="submit"
                className="shrink-0 min-h-[50px] px-6 rounded-full bg-gold text-[oklch(0.1998_0.0403_258.29)] font-body font-black text-[14px] uppercase tracking-wide hover:bg-gold/80 active:scale-[0.98] transition-all duration-150"
              >
                Enviar
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
