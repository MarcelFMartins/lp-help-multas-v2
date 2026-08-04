import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import ChatSelect from "@/components/chat/ChatSelect";
import { CHAT_STEPS, CAPITAL_OPTIONS, INTRO_MESSAGES, UF_OPTIONS } from "@/components/chat/chatSteps";
import { formatWhatsapp } from "@/components/HeroSection";
import { useCidadesPorUf } from "@/hooks/useCidadesPorUf";
import { getLeadIdLp, sendLeadToCrm, notifyTeamByEmail, type ChatAnswers } from "@/lib/chatCrm";

interface Message {
  id: string;
  from: "bot" | "user";
  text: string;
}

const TOTAL_STEPS = CHAT_STEPS.length;
const LEAD_SNAPSHOT_KEY = "lp-chat-lead-nome";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function renderWithBold(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

export default function ChatLP() {
  const [, setLocation] = useLocation();

  const [messages, setMessages] = useState<Message[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const [inputReady, setInputReady] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<ChatAnswers>({});

  const leadIdRef = useRef("");
  const startedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { cidades, loading: loadingCidades } = useCidadesPorUf(answers.uf || "");
  const cidadeOptions = cidades.map((c) => ({ value: c, label: c }));

  useEffect(() => {
    leadIdRef.current = getLeadIdLp();
    if (startedRef.current) return;
    startedRef.current = true;
    void playIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function pushBotMessages(texts: string[]) {
    for (const text of texts) {
      setTyping(true);
      await wait(500 + Math.min(text.length * 8, 700));
      setTyping(false);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), from: "bot", text }]);
      await wait(250);
    }
  }

  async function playIntro() {
    setInputReady(false);
    await wait(400);
    await pushBotMessages(INTRO_MESSAGES);
    await pushBotMessages(CHAT_STEPS[0].botText);
    setInputReady(true);
  }

  async function handleSubmit(rawValue: string, displayLabel?: string) {
    const step = CHAT_STEPS[stepIndex];
    const validationError = step.validate(rawValue);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    const label = displayLabel ?? rawValue;
    setInputReady(false);
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), from: "user", text: label }]);
    setInputValue("");

    const merged: ChatAnswers = { ...answers, [step.key]: rawValue };
    setAnswers(merged);

    const isLast = stepIndex === TOTAL_STEPS - 1;

    if (stepIndex >= 1) {
      void sendLeadToCrm(leadIdRef.current, merged, `${stepIndex}:${step.key}`);
    }

    if (isLast) {
      setDone(true);
      await pushBotMessages(["Perfeito! Recebemos os seus dados."]);
      notifyTeamByEmail(merged);
      try {
        sessionStorage.setItem(LEAD_SNAPSHOT_KEY, merged.nome ?? "");
      } catch {
        /* sessionStorage indisponível; /obrigado apenas não personaliza */
      }
      await wait(500);
      setLocation("/obrigado");
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
        {/* Barra de progresso */}
        <div className="h-1.5 rounded-full bg-white/15 overflow-hidden mt-3">
          <div
            className="h-full bg-gold transition-all duration-300 ease-out"
            style={{ width: `${(answeredCount / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <p className="font-body text-white/60 text-[11px] font-semibold uppercase tracking-[.15em] my-3">
          {done ? "Cadastro concluído" : `Pergunta ${stepIndex + 1} de ${TOTAL_STEPS}`}
        </p>

        {/* Janela de conversa */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-[360px] max-h-[60vh] overflow-y-auto bg-white rounded-[24px] shadow-[0_32px_70px_rgba(0,0,0,0.45)] p-5 flex flex-col gap-3"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-end ${m.from === "bot" ? "justify-start" : "justify-end"}`}
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
            <div className="flex items-end justify-start">
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

        {/* Área de resposta — só aparece quando a última mensagem do bot termina */}
        {!done && inputReady && step && (
          <div className="mt-4">
            {error && (
              <p className="text-red-400 text-[13px] font-body mb-2 px-1">{error}</p>
            )}

            {step.type === "buttons" && (
              <div className="flex flex-col gap-2">
                {CAPITAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSubmit(opt.value, opt.label)}
                    className="w-full text-left font-body font-bold text-[14px] bg-white text-[oklch(0.1998_0.0403_258.29)] border-2 border-gold rounded-2xl px-4 py-3 hover:bg-gold/10 active:scale-[0.98] transition-all duration-150"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {step.type === "uf" && (
              <ChatSelect
                key={step.key}
                placeholder={step.placeholder ?? "Selecione"}
                searchPlaceholder="Buscar estado (UF)..."
                options={UF_OPTIONS}
                value={inputValue}
                onChange={(value, label) => handleSubmit(value, label)}
              />
            )}

            {step.type === "cidade" && (
              <ChatSelect
                key={step.key}
                placeholder={loadingCidades ? "Carregando..." : step.placeholder ?? "Selecione"}
                disabledPlaceholder="Selecione a UF"
                disabled={!answers.uf || loadingCidades}
                searchPlaceholder="Buscar cidade..."
                options={cidadeOptions}
                value={inputValue}
                onChange={(value, label) => handleSubmit(value, label)}
              />
            )}

            {(step.type === "text" || step.type === "email" || step.type === "tel") && (
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
            )}
          </div>
        )}
      </main>
    </div>
  );
}
