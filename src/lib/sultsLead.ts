/*
 * sultsLead — manda o lead para a Sults (módulo Expansão) via /api/sults-lead.
 * O token fica só no servidor (função da Vercel em api/sults-lead.ts).
 */

import { logEvent } from "./logger";

export interface SultsLeadData {
  origem: string;
  nome: string;
  email: string;
  whatsapp: string;
  capital?: string;
  capitalLabel?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  utm_id?: string;
}

/** Nunca lança erro. `keepalive` garante o envio mesmo com o redirect logo em seguida. */
export function sendToSults(lead: SultsLeadData): Promise<boolean> {
  return fetch("/api/sults-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
    keepalive: true,
  })
    .then(async (res) => {
      const body = await res.json().catch(() => null);
      if (res.ok) {
        logEvent(lead.origem, "crm_success", "Lead criado na Sults", { id: body?.id });
        return true;
      }
      logEvent(lead.origem, "crm_error", `Erro Sults: status ${res.status}`, { response: body });
      return false;
    })
    .catch((e) => {
      logEvent(lead.origem, "crm_error", e instanceof Error ? e.message : "Falha ao enviar para a Sults", {});
      return false;
    });
}
