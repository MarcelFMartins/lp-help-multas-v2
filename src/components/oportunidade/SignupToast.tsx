/*
 * SignupToast — notificação "Mais uma pessoa se cadastrou!"
 *
 * Para não parecer repetitiva/artificial:
 *  - intervalos irregulares (45s–2min30s), com a primeira após ~25–45s
 *  - cada aviso varia a frase de apoio (cidade + "há X min")
 *  - a contagem do dia e o horário do próximo aviso ficam no localStorage,
 *    então recarregar a página não reinicia o ciclo nem repete a sequência
 *  - a contagem recomeça num valor aleatório a cada novo dia
 *  - não dispara com a aba oculta
 */

import { useEffect, useState } from "react";
import { UserCheck, X } from "lucide-react";
import { WA_URL } from "./whatsapp";

const STORAGE_KEY = "lp_op_signup_toast";
const VISIBLE_MS = 6000;

const CIDADES = [
  "Curitiba/PR", "Florianópolis/SC", "São Paulo/SP", "Belo Horizonte/MG",
  "Goiânia/GO", "Porto Alegre/RS", "Campinas/SP", "Joinville/SC",
  "Londrina/PR", "Ribeirão Preto/SP", "Uberlândia/MG", "Salvador/BA",
  "Fortaleza/CE", "Recife/PE", "Brasília/DF", "Cuiabá/MT",
];

interface Stored {
  day: string;
  count: number;
  nextAt: number;
}

const rand = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));
const today = () => new Date().toISOString().slice(0, 10);

function read(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

function write(s: Stored) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* storage indisponível — segue sem cache */
  }
}

function loadState(): Stored {
  const saved = read();
  if (saved && saved.day === today()) return saved;
  return { day: today(), count: rand(9, 17), nextAt: Date.now() + rand(25, 45) * 1000 };
}

export default function SignupToast() {
  const [toast, setToast] = useState<{ count: number; cidade: string; ago: string } | null>(null);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;
    let lastCidade = "";

    const schedule = () => {
      const state = loadState();
      write(state);
      showTimer = setTimeout(fire, Math.max(state.nextAt - Date.now(), 2000));
    };

    const fire = () => {
      if (document.hidden) {
        // aba em segundo plano: tenta de novo em breve, sem acumular avisos
        showTimer = setTimeout(fire, 10_000);
        return;
      }

      const state = loadState();
      state.count += 1;
      state.nextAt = Date.now() + rand(45, 150) * 1000;
      write(state);

      let cidade = CIDADES[rand(0, CIDADES.length - 1)];
      if (cidade === lastCidade) cidade = CIDADES[(CIDADES.indexOf(cidade) + 1) % CIDADES.length];
      lastCidade = cidade;

      const mins = rand(0, 4);
      setToast({
        count: state.count,
        cidade,
        ago: mins === 0 ? "agora mesmo" : `há ${mins} min`,
      });

      hideTimer = setTimeout(() => setToast(null), VISIBLE_MS);
      showTimer = setTimeout(fire, state.nextAt - Date.now());
    };

    schedule();
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    // fica acima do botão do WhatsApp (bottom-5 + 56px de altura), sem sobrepor
    <div
      className={`fixed bottom-24 right-5 z-[60] w-[calc(100vw-2.5rem)] sm:w-80 transition-all duration-500 ${
        toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      role="status"
      aria-live="polite"
    >
      {toast && (
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 bg-white rounded-2xl border border-[#D4A017]/30 shadow-[0_12px_32px_rgba(0,0,0,0.3)] pl-3 pr-2 py-3 hover:border-[#D4A017] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#22c55e]/15 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5 text-[#22c55e]" />
          </div>
          <div className="min-w-0">
            <p className="font-body font-bold text-[14px] text-[oklch(0.1998_0.0403_258.29)] leading-tight">
              Mais uma pessoa se cadastrou!
            </p>
            <p className="font-body text-[12px] text-gray-500 leading-snug mt-0.5">
              {toast.cidade} · {toast.ago}
            </p>
            <p className="font-body text-[12px] text-gray-500 leading-snug">
              {toast.count} cadastros hoje
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setToast(null);
            }}
            aria-label="Fechar notificação"
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </a>
      )}
    </div>
  );
}
