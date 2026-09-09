/*
 * Logger central — envia logs de todas as LPs para o Supabase (tabela `logs`)
 * Usado para acompanhar pageviews, ações, erros, eventos de pixel e respostas do CRM
 * de todos os visitantes, visualizáveis em /logs.
 */

const SUPABASE_URL = "https://hzfzvqxowqtaykkhilhd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Q8Zk0PRw_Fc2GmXf7Hhw7A_ggM1mne1";

export type LogType =
  | "pageview"
  | "action"
  | "error"
  | "pixel_event"
  | "crm_success"
  | "crm_error";

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem("__log_session_id");
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem("__log_session_id", id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

export function logEvent(
  page: string,
  type: LogType,
  message: string,
  details?: Record<string, unknown>
) {
  try {
    fetch(`${SUPABASE_URL}/rest/v1/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        page,
        type,
        message,
        details: details ?? null,
        session_id: getSessionId(),
        url: typeof window !== "undefined" ? window.location.href : null,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // never let logging break the app
  }
}

export function initGlobalErrorLogging(page: string) {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (e) => {
    logEvent(page, "error", e.message || "Erro desconhecido", {
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
      stack: e.error?.stack,
    });
  });

  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason;
    logEvent(page, "error", "Promise rejeitada sem tratamento", {
      reason: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
    });
  });
}

export async function fetchLogs(params: {
  limit?: number;
  page?: string;
  type?: string;
  search?: string;
} = {}) {
  const { limit = 200, page, type, search } = params;

  let url = `${SUPABASE_URL}/rest/v1/logs?select=*&order=created_at.desc&limit=${limit}`;
  if (page) url += `&page=eq.${encodeURIComponent(page)}`;
  if (type) url += `&type=eq.${encodeURIComponent(type)}`;
  if (search) url += `&message=ilike.*${encodeURIComponent(search)}*`;

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!res.ok) throw new Error(`Erro ao buscar logs: ${res.status}`);
  return res.json();
}
