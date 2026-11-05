/*
 * /api/sults-lead — cria o lead (negócio) no módulo Expansão da Sults.
 *
 * Roda como função serverless da Vercel para o token da Sults NUNCA ir para o
 * navegador (a própria doc da Sults pede chamada via backend).
 *
 * Doc: https://developers.sults.com.br/v1/api-reference/expansao/criar-negocio.md
 *
 * Variáveis de ambiente (Vercel → Settings → Environment Variables):
 *   SULTS_TOKEN              obrigatório — token v1 (Gestão de Tokens v1, não v2)
 *   SULTS_ETAPA_ID           obrigatório — Expansão > Parâmetros > Funis > Etapas (#ID)
 *   SULTS_RESPONSAVEL_ID     obrigatório — Expansão > Parâmetros > Equipe (#ID)
 *   SULTS_ORIGEM_ID          opcional   — Expansão > Parâmetros > Origens de Negócio
 *   SULTS_CAMPANHA_ID        opcional   — Expansão > Parâmetros > Campanhas
 *   SULTS_EMAIL_MODELO_ID    opcional   — modelo de e-mail enviado ao lead
 *   SULTS_NOTIFICAR_RESPONSAVEL  "false" para não avisar o responsável por e-mail (padrão: avisa)
 */

const SULTS_URL = "https://api.sults.com.br/api/v1/expansao/negocio";

type Req = { method?: string; body?: unknown };
type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (k: string, v: string) => void;
};

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const intEnv = (name: string) => {
  const n = Number(process.env[name]);
  return Number.isInteger(n) && n > 0 ? n : undefined;
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req: Req, res: Res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const token = process.env.SULTS_TOKEN;
  const etapaId = intEnv("SULTS_ETAPA_ID");
  const responsavelId = intEnv("SULTS_RESPONSAVEL_ID");
  if (!token || !etapaId || !responsavelId) {
    return res.status(500).json({ error: "Integração Sults não configurada (SULTS_TOKEN/ETAPA_ID/RESPONSAVEL_ID)" });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as Record<string, unknown> || {};
  } catch {
    return res.status(400).json({ error: "JSON inválido" });
  }

  const nome = str(body.nome, 120);
  const email = str(body.email, 160);
  const phone = str(body.whatsapp, 30).replace(/\D/g, "");
  if (!nome || !email.includes("@") || phone.length < 10) {
    return res.status(400).json({ error: "Nome, e-mail e WhatsApp são obrigatórios" });
  }

  const origem = str(body.origem, 80) || "LP Oportunidade";
  const capitalLabel = str(body.capitalLabel, 160);
  const capitalNum = Number(str(body.capital, 20).replace(/\./g, "").replace(",", "."));
  const utms = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"]
    .map((k) => [k, str(body[k], 200)] as const)
    .filter(([, v]) => v);

  const descricao = [
    `Formulário: ${origem}`,
    capitalLabel && `Capital disponível: ${capitalLabel}`,
    `WhatsApp: ${phone}`,
    ...utms.map(([k, v]) => `${k}: ${v}`),
  ].filter(Boolean).join("\n");

  const origemId = intEnv("SULTS_ORIGEM_ID");
  const campanhaId = intEnv("SULTS_CAMPANHA_ID");
  const emailModelo = intEnv("SULTS_EMAIL_MODELO_ID");

  const payload = {
    ...(emailModelo ? { sendEmailModeloIdToLead: emailModelo } : {}),
    sendNotificationToResponsavel: process.env.SULTS_NOTIFICAR_RESPONSAVEL !== "false",
    negocio: {
      titulo: `${nome} — ${origem}`,
      responsavelId,
      etapaId,
      situacaoId: 1,
      ...(Number.isFinite(capitalNum) && capitalNum > 0 ? { valor: capitalNum } : {}),
      ...(origemId ? { origemId } : {}),
      ...(campanhaId ? { campanhaId } : {}),
      descricao,
    },
    pessoa: { nome, email, phone },
  };

  // 429 (2 req/s por IP) e 5xx: tenta de novo com espera crescente. 4xx: não.
  let last = { status: 0, text: "" };
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(SULTS_URL, {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await r.text();
      last = { status: r.status, text: text.slice(0, 300) };
      if (r.ok) {
        let id: unknown = null;
        try { id = JSON.parse(text)?.id; } catch { /* corpo inesperado */ }
        return res.status(200).json({ ok: true, id });
      }
      if (r.status !== 429 && r.status < 500) break;
    } catch (e) {
      last = { status: 0, text: e instanceof Error ? e.message : "falha de rede" };
    }
    await sleep(600 * (attempt + 1));
  }

  console.error("[sults-lead] falhou", last);
  return res.status(502).json({ ok: false, status: last.status, error: last.text });
}
