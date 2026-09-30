/*
 * marketingHubLeads — envio de leads pro Marketing Hub (área Tráfego
 * Pago), em paralelo ao CRM principal e ao CRM de teste. Usado pra casar
 * cada lead com a campanha/conjunto/anúncio da Meta que gerou o clique
 * (via UTM) e montar o ranking de anúncios que mais convertem.
 *
 * Nunca lança erro (resolve true/false) — não pode atrapalhar o envio pro CRM.
 * Os formulários aguardam o resultado antes de redirecionar.
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

const MAX_ATTEMPTS = 3;
const ATTEMPT_TIMEOUT_MS = 8000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Envia o lead com retry (rede/5xx) e `keepalive` (a requisição sobrevive ao
 * redirecionamento da página). Nunca lança: resolve `true` se gravou, `false`
 * caso contrário. Quem quiser garantir o envio antes de redirecionar deve
 * dar `await` no retorno; quem não quiser pode ignorá-lo.
 */
export async function sendToMarketingHub(lead: MarketingHubLead): Promise<boolean> {
  if (!MARKETING_HUB_URL || !MARKETING_HUB_TOKEN) return false;

  const body = JSON.stringify(lead);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(MARKETING_HUB_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MARKETING_HUB_TOKEN}`,
        },
        body,
        keepalive: true,
        signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      });
      if (res.ok) {
        console.log("Marketing Hub OK");
        return true;
      }
      console.error("Erro Marketing Hub:", res.status, await res.text().catch(() => ""));
      // 4xx (exceto 408/429) não adianta repetir
      if (res.status < 500 && res.status !== 408 && res.status !== 429) return false;
    } catch (err) {
      console.error(`Erro Marketing Hub (tentativa ${attempt}/${MAX_ATTEMPTS}):`, err);
    }
    if (attempt < MAX_ATTEMPTS) await sleep(500 * attempt);
  }
  return false;
}
