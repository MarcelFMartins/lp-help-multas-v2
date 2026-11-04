/*
 * aulaIndicaLead — envio de leads da LP /aula-indica (aula gratuita Help Indica).
 *
 * Diferente das LPs de franquia: o lead aqui é um parceiro indicador, então
 * NÃO vai para o CRM de franquia nem para o intake do /evento.
 *
 * Integrações:
 *  1. Marketing Hub (page_origin "aula-indica") — já funciona com o token atual.
 *  2. CRM intake próprio do Help Indica — preencher AULA_INDICA_CRM_URL/SECRET.
 *  3. Google Sheets (backup) — preencher AULA_INDICA_SHEETS_URL.
 * Enquanto a URL de uma integração estiver vazia, ela é ignorada.
 *
 * O redirecionamento para o grupo do WhatsApp acontece sempre: falha de
 * integração nunca impede a pessoa de entrar no grupo da aula.
 */

import { sendToMarketingHub } from "./marketingHubLeads";
import { logEvent } from "./logger";

export const AULA_INDICA_SLUG = "/aula-indica";

/* TODO backend: criar o intake no CRM (pipeline Help Indica) e colar aqui. */
const AULA_INDICA_CRM_URL = "";
const AULA_INDICA_CRM_SECRET = "";

/* TODO backend: publicar o Apps Script da planilha da aula e colar aqui. */
const AULA_INDICA_SHEETS_URL = "";

/** Tempo máximo esperando as integrações antes de abrir o grupo. */
const MAX_WAIT_MS = 4000;

const PAGE_NAME = "AulaIndica";

export interface AulaIndicaLead {
  name: string;
  email: string;
  /** Só dígitos, 10 ou 11 (sem 55). */
  phone: string;
  fbp?: string;
  fbc?: string;
  fbclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  utm_id?: string;
}

function sendToCrm(lead: AulaIndicaLead): Promise<boolean> {
  if (!AULA_INDICA_CRM_URL) return Promise.resolve(false);
  return fetch(AULA_INDICA_CRM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-intake-secret": AULA_INDICA_CRM_SECRET },
    body: JSON.stringify({ ...lead, origem: "aula-indica" }),
    keepalive: true,
  })
    .then(async (res) => {
      if (res.ok) {
        logEvent(PAGE_NAME, "crm_success", "CRM Help Indica respondeu OK");
        return true;
      }
      logEvent(PAGE_NAME, "crm_error", `Erro CRM Help Indica: status ${res.status}`, {
        response: await res.text().catch(() => ""),
      });
      return false;
    })
    .catch((err) => {
      logEvent(PAGE_NAME, "crm_error", "Erro de rede no CRM Help Indica", { error: String(err) });
      return false;
    });
}

function sendToSheets(lead: AulaIndicaLead): Promise<boolean> {
  if (!AULA_INDICA_SHEETS_URL) return Promise.resolve(false);
  const d = lead.phone;
  return fetch(AULA_INDICA_SHEETS_URL, {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      nome: lead.name,
      email: lead.email,
      whatsapp: d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`,
      dataHora: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
      utmSource: lead.utm_source,
      utmMedium: lead.utm_medium,
      utmCampaign: lead.utm_campaign,
      utmContent: lead.utm_content,
      utmTerm: lead.utm_term,
      pageUrl: window.location.href,
    }),
  })
    .then(() => true)
    .catch(() => false);
}

/** Nunca lança. Resolve quando todas as integrações terminaram ou após MAX_WAIT_MS. */
export async function submitAulaIndicaLead(lead: AulaIndicaLead) {
  logEvent(PAGE_NAME, "action", "Formulário enviado", { nome: lead.name, email: lead.email });

  const all = Promise.all([
    sendToMarketingHub({ ...lead, page_origin: "aula-indica" }),
    sendToCrm(lead),
    sendToSheets(lead),
  ]);
  await Promise.race([all, new Promise((resolve) => window.setTimeout(resolve, MAX_WAIT_MS))]);
}
