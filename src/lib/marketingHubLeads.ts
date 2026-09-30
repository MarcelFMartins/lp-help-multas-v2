/*
 * marketingHubLeads — envio de leads pro Marketing Hub (área Tráfego
 * Pago), em paralelo ao CRM principal e ao CRM de teste. Usado pra casar
 * cada lead com a campanha/conjunto/anúncio da Meta que gerou o clique
 * (via UTM) e montar o ranking de anúncios que mais convertem.
 *
 * Fire-and-forget: nunca lança erro, só loga em caso de falha — não pode
 * atrapalhar o envio pro CRM (mesmo padrão de testCrm.ts).
 */

const MARKETING_HUB_URL = "https://mkt.helpmultas.com/api/leads";
const MARKETING_HUB_TOKEN = import.meta.env.VITE_MARKETING_HUB_LEADS_TOKEN as string | undefined;

export interface MarketingHubLead {
  name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  capital?: string;
  capitalLabel?: string;
  /** Página da LP onde o formulário foi preenchido ("home", "evento"). NÃO é utm_source. */
  page_origin?: string;
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

/** Fire-and-forget: nunca lança erro, só loga em caso de falha. */
export function sendToMarketingHub(lead: MarketingHubLead) {
  if (!MARKETING_HUB_URL || !MARKETING_HUB_TOKEN) return;

  fetch(MARKETING_HUB_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MARKETING_HUB_TOKEN}`,
    },
    body: JSON.stringify(lead),
  })
    .then(async (res) => {
      if (!res.ok) {
        console.error("Erro Marketing Hub:", res.status, await res.text().catch(() => ""));
      } else {
        console.log("Marketing Hub OK");
      }
    })
    .catch((err) => console.error("Erro Marketing Hub:", err));
}
