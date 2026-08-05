const CRM_ENDPOINT = "https://crm.helprecurso.com.br/leads/lp";
const CRM_API_KEY = import.meta.env.VITE_CRM_API_KEY as string | undefined;
const N8N_WEBHOOK = "https://n8n.helpmultas.com/webhook/forms-email";
const LEAD_ID_KEY = "lp-chat-lead-id";

export interface ChatAnswers {
  nome?: string;
  whatsapp?: string;
  email?: string;
  cidade?: string;
  uf?: string;
  capital?: string;
}

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export function getLeadIdLp(): string {
  let id = localStorage.getItem(LEAD_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(LEAD_ID_KEY, id);
  }
  return id;
}

export async function sendLeadToCrm(leadIdLp: string, answers: ChatAnswers, stepLabel: string) {
  if (!answers.nome) return;

  const meta = window.getMetaTrackingData?.() || {};
  const tracking = window.getTrackingData?.() || {};

  const payload: Record<string, string> = {
    leadIdLp,
    fullName: answers.nome.trim(),
  };
  if (answers.whatsapp) payload.phone = onlyDigits(answers.whatsapp);
  if (answers.email) payload.email = answers.email.trim();
  if (answers.cidade) payload.city = answers.cidade;
  if (answers.uf) payload.state = answers.uf;
  if (answers.capital) payload.potentialValue = answers.capital;

  if (meta.fbp) payload.fbp = meta.fbp;
  if (meta.fbc) payload.fbc = meta.fbc;
  if (meta.fbclid) payload.fbclid = meta.fbclid;
  if (tracking.utm_source) payload.utmSource = tracking.utm_source;
  if (tracking.utm_medium) payload.utmMedium = tracking.utm_medium;
  if (tracking.utm_campaign) payload.utmCampaign = tracking.utm_campaign;
  if (tracking.utm_content) payload.utmContent = tracking.utm_content;
  if (tracking.utm_term) payload.utmTerm = tracking.utm_term;
  if (tracking.utm_id) payload.utmId = tracking.utm_id;

  const tag = `[CRM /chat lead=${leadIdLp} step=${stepLabel}]`;
  console.log(`%c${tag} → POST`, "color: #999", payload);

  try {
    const res = await fetch(CRM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(CRM_API_KEY ? { "x-api-key": CRM_API_KEY } : {}),
      },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => null);

    if (res.ok) {
      console.log(`%c${tag} ← 200 OK`, "color: #22c55e; font-weight: bold", body);
    } else {
      console.error(`%c${tag} ← ${res.status} FALHOU`, "color: #ef4444; font-weight: bold", body);
    }
  } catch (err) {
    console.error(`%c${tag} ← erro de rede`, "color: #ef4444; font-weight: bold", err);
  }
}

/* Fire-and-forget — notifica o time por e-mail (n8n + Resend) na conclusão do chat. */
export function notifyTeamByEmail(answers: ChatAnswers) {
  fetch(N8N_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      origem: "Landing Page Franqueado — Chat",
      nome: answers.nome?.trim() || "",
      email: answers.email?.trim() || "",
      whatsapp: answers.whatsapp || "",
      cidade: answers.cidade || "",
      uf: answers.uf || "",
      capital: answers.capital || "",
    }),
  }).catch(() => {});
}
