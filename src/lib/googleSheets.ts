const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxG23e8F6iiV9vEpv_kWtHe5uiuvktnx5gE71oTWG136o_Jqm1yNHkVljvGJ5zH9KoD/exec";

export interface SheetsLeadData {
  origem: string;
  nome: string;
  email: string;
  whatsapp: string;
  cidade?: string;
  uf?: string;
  capital?: string;
  capitalLabel?: string;
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
export function sendToGoogleSheets(lead: SheetsLeadData) {
  if (!GOOGLE_SHEETS_URL) return;

  fetch(GOOGLE_SHEETS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(lead),
  })
    .then(async (res) => {
      if (!res.ok) {
        console.error("Erro Google Sheets:", res.status, await res.text().catch(() => ""));
      } else {
        console.log("Google Sheets OK");
      }
    })
    .catch((err) => console.error("Erro Google Sheets:", err));
}
