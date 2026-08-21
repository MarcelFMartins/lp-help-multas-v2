/*
 * testCrm — envio de leads para um CRM secundário (em teste)
 *
 * Usado em paralelo ao CRM principal (crm.helprecurso.com.br) em
 * HeroSection e CTASection. Não bloqueia o fluxo: se falhar, só loga.
 *
 * Para ativar:
 *  1. Preencha TEST_CRM_URL e TEST_CRM_API_KEY abaixo.
 *  2. Ajuste o header de autenticação em buildHeaders, se o novo CRM
 *     não usar o header atual.
 *  3. Ajuste os campos da interface LeadData conforme o payload
 *     esperado pelo novo CRM (o objeto é enviado como veio, sem mapeamento).
 */

const TEST_CRM_URL = "https://crmbackend.helptechbr.com.br/intake/64a9e490-a3b5-4307-80a6-6de2bcd8013b"; 
const TEST_CRM_API_KEY = "5688755898f405e2d96cf4c69f7563470bada5fc8b618c66"; 

function buildHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-intake-secret": TEST_CRM_API_KEY,
  };
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  capital: string;
  capitalLabel: string;
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
export function sendToTestCrm(lead: LeadData) {
  if (!TEST_CRM_URL || !TEST_CRM_API_KEY) return;

  fetch(TEST_CRM_URL, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(lead),
  })
    .then(async (res) => {
      if (!res.ok) {
        console.error("Erro CRM teste:", res.status, await res.text().catch(() => ""));
      } else {
        console.log("CRM teste OK");
      }
    })
    .catch((err) => console.error("Erro CRM teste:", err));
}
