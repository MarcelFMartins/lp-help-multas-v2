/*
 * oportunidadeLead — envio de leads da LP /oportunidade
 *
 * O lead vai para a Sults (Expansão, via /api/sults-lead) e para o Marketing Hub
 * (ranking de anúncios por UTM). Sem n8n, CRM antigo, CRM de teste, Sheets ou Meta.
 * O formulário de origem e as UTMs vão na descrição do negócio.
 */

import { sendToSults } from "./sultsLead";
import { sendToMarketingHub } from "./marketingHubLeads";
import { logEvent } from "./logger";

export const OPORTUNIDADE_SLUG = "/oportunidade";
export const OPORTUNIDADE_THANKS = `${OPORTUNIDADE_SLUG}/obrigado`;

/**
 * Marca (sessionStorage) de que o lead foi confirmado pela Sults.
 * O index.html só carrega a Google Tag (conversão do Google Ads) na página de obrigado
 * se essa marca existir — quem abre o link do obrigado direto não gera conversão.
 * Se mudar o nome aqui, mude também no index.html.
 */
export const OPORTUNIDADE_LEAD_FLAG = "op_lead_ok";

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

  /* 1. Marketing Hub — casa o lead com o anúncio (UTM). Em paralelo; nunca lança erro. */
  const hubPromise = sendToMarketingHub({
    page_origin: "oportunidade",
    name: nome,
    email,
    phone: data.whatsapp,
    capital: data.capital,
    capitalLabel,
    ...utms,
  });

  /* 2. Sults — CRM. Se falhar, o erro aparece no formulário e não redireciona. */
  const sultsOk = await sendToSults({
    origem,
    nome,
    email,
    whatsapp: data.whatsapp,
    capital: data.capital,
    capitalLabel,
    ...utms,
  });

  if (!sultsOk) {
    throw new Error("Não conseguimos enviar seus dados agora. Tente novamente em instantes.");
  }

  /* 3. Redirect — só depois do Marketing Hub concluir */
  const hubOk = await hubPromise;
  if (!hubOk) logEvent(origem, "error", "Marketing Hub não gravou o lead após retries", {});
  try {
    sessionStorage.setItem(OPORTUNIDADE_LEAD_FLAG, String(Date.now()));
  } catch {
    /* sessionStorage indisponível (ex.: modo restrito) — segue sem a marca */
  }
  window.location.href = OPORTUNIDADE_THANKS;
}
