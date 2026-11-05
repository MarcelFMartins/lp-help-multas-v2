/*
 * oportunidadeLead — envio de leads da LP /oportunidade
 *
 * O lead vai SOMENTE para a Sults (Expansão), via /api/sults-lead.
 * Sem n8n, CRM, CRM de teste, Marketing Hub, Google Sheets ou Meta.
 * O formulário de origem e as UTMs vão na descrição do negócio.
 */

import { sendToSults } from "./sultsLead";
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

  logEvent(origem, "action", "Formulário enviado", { nome, email });

  /* Sults — única integração. Se falhar, o erro aparece no formulário e não redireciona. */
  const ok = await sendToSults({
    origem,
    nome,
    email,
    whatsapp: data.whatsapp,
    capital: data.capital,
    capitalLabel,
    utm_source: tracking.utm_source || "",
    utm_medium: tracking.utm_medium || "",
    utm_campaign: tracking.utm_campaign || "",
    utm_content: tracking.utm_content || "",
    utm_term: tracking.utm_term || "",
    utm_id: tracking.utm_id || "",
  });

  if (!ok) {
    throw new Error("Não conseguimos enviar seus dados agora. Tente novamente em instantes.");
  }

  window.location.href = OPORTUNIDADE_THANKS;
}
