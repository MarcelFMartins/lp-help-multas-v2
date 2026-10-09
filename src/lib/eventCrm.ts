/*
 * eventCrm — envio de leads das páginas de evento (/evento e /evento-chat)
 * para o webhook de intake do CRM.
 */

import { sendToMarketingHub } from "./marketingHubLeads";

const EVENT_CRM_URL = "https://crmbackend.helptechbr.com.br/intake/bf9eaae4-8be8-47b8-b690-e0d5c5e9fa3b";
const EVENT_CRM_SECRET = "bca8c0ea773490589eea83df0a5ef751f30e96c2145addf7";

export interface EventLeadData {
  name: string;
  email: string;
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

/** Nunca lança erro. Resolve `true` somente se o CRM respondeu OK (quem não precisar do resultado pode ignorar a Promise). */
export function sendEventLeadToCrm(lead: EventLeadData): Promise<boolean> {
  // Em paralelo, sem depender do CRM: casa o lead com o anúncio (via UTM) no
  // Marketing Hub, igual ao Hero/CTA da home.
  sendToMarketingHub({ ...lead, page_origin: "evento" });

  return fetch(EVENT_CRM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-intake-secret": EVENT_CRM_SECRET,
    },
    body: JSON.stringify(lead),
  })
    .then(async (res) => {
      if (!res.ok) {
        console.error("Erro CRM evento:", res.status, await res.text().catch(() => ""));
        return false;
      }
      console.log("CRM evento OK");
      return true;
    })
    .catch((err) => {
      console.error("Erro CRM evento:", err);
      return false;
    });
}
