/*
 * oportunidadeLead — envio de leads da LP /oportunidade
 *
 * Mesmas integrações da LP do root (n8n, CRM, CRM de teste, Marketing Hub e
 * Google Sheets), mas SEM nada da Meta (fbp/fbc/fbclid e Pixel) e SEM cidade/UF.
 * O lead é identificado por page_origin/origem "oportunidade" + UTMs.
 */

import { sendToTestCrm } from "./testCrm";
import { sendToMarketingHub } from "./marketingHubLeads";
import { sendToGoogleSheets } from "./googleSheets";
import { logEvent } from "./logger";

export const OPORTUNIDADE_SLUG = "/oportunidade";
export const OPORTUNIDADE_THANKS = `${OPORTUNIDADE_SLUG}/obrigado`;

export const CAPITAL_OPTIONS = [
  { value: "30.000", label: "De R$ 0 a R$ 30 mil (não tenho condições de adquirir a franquia atualmente)" },
  { value: "50.000", label: "De R$ 30 mil a R$ 50 mil" },
  { value: "70.000", label: "De R$ 50 mil a R$ 70 mil" },
  { value: "100.000", label: "Acima de R$ 70 mil" },
];

export function onlyNumbers(v: string) {
  return v.replace(/\D/g, "");
}

export function formatWhatsapp(v: string) {
  let n = onlyNumbers(v);
  if (n.startsWith("55") && n.length > 11) n = n.slice(2);
  n = n.slice(0, 11);

  if (n.length <= 2) return n;
  if (n.length <= 6) return n.replace(/(\d{2})(\d+)/, "($1) $2");
  if (n.length <= 10) return n.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return n.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
}

export interface OportunidadeFormData {
  nome: string;
  email: string;
  whatsapp: string;
  capital: string;
}

/** `origem` identifica o formulário dentro da página (ex.: "Oportunidade (Hero)"). */
export async function submitOportunidadeLead(data: OportunidadeFormData, origem: string) {
  const nome = data.nome.trim();
  const email = data.email.trim();
  const tracking = window.getTrackingData?.() || ({} as Partial<ReturnType<typeof window.getTrackingData>>);

  const capitalLabel = CAPITAL_OPTIONS.find((o) => o.value === data.capital)?.label || data.capital;

  const utms = {
    utm_source: tracking.utm_source || "",
    utm_medium: tracking.utm_medium || "",
    utm_campaign: tracking.utm_campaign || "",
    utm_content: tracking.utm_content || "",
    utm_term: tracking.utm_term || "",
    utm_id: tracking.utm_id || "",
  };

  logEvent(origem, "action", "Formulário enviado", { nome, email });

  /* 1. N8N — notificação por e-mail (fire-and-forget) */
  fetch("https://n8n.helpmultas.com/webhook/forms-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      origem: "Landing Page Franqueado (Oportunidade)",
      nome,
      email,
      whatsapp: data.whatsapp,
      capital: capitalLabel,
    }),
  }).catch(() => { });

  /* 2. CRM de teste (fire-and-forget) */
  sendToTestCrm({
    name: nome,
    email,
    phone: data.whatsapp,
    capital: data.capital,
    capitalLabel,
    ...utms,
  });

  /* 3. Marketing Hub (aguardado antes do redirect) */
  const hubPromise = sendToMarketingHub({
    page_origin: "oportunidade",
    name: nome,
    email,
    phone: data.whatsapp,
    capital: data.capital,
    capitalLabel,
    ...utms,
  });

  /* 4. Google Sheets (fire-and-forget) */
  sendToGoogleSheets({
    origem,
    nome,
    email,
    whatsapp: data.whatsapp,
    capital: data.capital,
    capitalLabel,
    ...utms,
  });

  /* 5. CRM principal — erro aqui interrompe o fluxo (igual à Hero do root) */
  const crmResponse = await fetch("https://crm.helprecurso.com.br/leads/create-by-api-key", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "93wkn371eaEbl6P41RlNWhM1xrFGSXdRVjDf3AGC",
    },
    body: JSON.stringify({
      fullName: nome,
      phone: data.whatsapp,
      email,
      capital: data.capital,
      capitalLabel,
      utmSource: utms.utm_source,
      utmMedium: utms.utm_medium,
      utmCampaign: utms.utm_campaign,
      utmContent: utms.utm_content,
      utmTerm: utms.utm_term,
      utmId: utms.utm_id,
    }),
  });

  let crmResult: any = null;
  try { crmResult = await crmResponse.json(); } catch { crmResult = null; }

  if (!crmResponse.ok) {
    logEvent(origem, "crm_error", `Erro CRM: status ${crmResponse.status}`, {
      status: crmResponse.status,
      response: crmResult,
    });
    throw new Error(`Erro CRM: ${crmResult?.message || crmResult?.error || `Status ${crmResponse.status}`}`);
  }

  logEvent(origem, "crm_success", "CRM respondeu com sucesso", {
    status: crmResponse.status,
    response: crmResult,
  });

  /* 6. Redirect — só depois do Marketing Hub concluir */
  const hubOk = await hubPromise;
  if (!hubOk) logEvent(origem, "error", "Marketing Hub não gravou o lead após retries", {});
  window.location.href = OPORTUNIDADE_THANKS;
}
