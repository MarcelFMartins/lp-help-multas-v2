# LP /aula-indica — Aula gratuita Help Indica

Adaptação da LP estática `PROJETOS/LP INDICA` para o projeto React, no slug **`/aula-indica`**
(o `/indica` já existe e continua sendo a LP de parceiro antiga).

## O que já foi feito (frontend)

| Arquivo | O quê |
|---|---|
| `src/pages/AulaIndica.tsx` | Página (mesmo layout e textos da LP INDICA) |
| `src/pages/AulaIndica.css` | CSS original, todo escopado em `.aula-indica` (não afeta outras páginas) |
| `src/lib/aulaIndicaLead.ts` | Envio do lead (Marketing Hub + CRM + Planilha) |
| `src/App.tsx` | Rota `/aula-indica` |
| `index.html` | `/aula-indica` usa o **Pixel Parceiros** (948091398277124) |
| `public/image/aula-indica/` | Logo Help Indica, foto e vídeo do Júnior |

Diferenças em relação à LP original:
- A original **não salvava o lead** — só abria o grupo do WhatsApp. Agora o lead é enviado
  para as integrações antes de abrir o grupo (espera no máximo 4s; falha de integração
  **nunca** impede a pessoa de entrar no grupo).
- Captura UTMs, fbp/fbc/fbclid e dispara `Lead` no Pixel Parceiros quando `utm_source` é `ig`/`fb`.
- Logs no `/logs` com a página `AulaIndica`.
- Inscrições se encerram sozinhas em `11/11/2026 13h30` (constante `EVENT_START_ISO`).

## O que falta — BACKEND

1. **CRM (intake do Help Indica)** — criar um intake/webhook no CRM
   (`crmbackend.helptechbr.com.br/intake/...`) para o pipeline **Help Indica / Parceiros**.
   Não usar o intake do `/evento` (é o funil de franquia).
   Payload que a página envia (JSON, header `x-intake-secret`):
   ```json
   { "name": "", "email": "", "phone": "42999999999", "origem": "aula-indica",
     "fbp": "", "fbc": "", "fbclid": "",
     "utm_source": "", "utm_medium": "", "utm_campaign": "", "utm_content": "", "utm_term": "", "utm_id": "" }
   ```
   Depois, colar URL e secret em `src/lib/aulaIndicaLead.ts`:
   `AULA_INDICA_CRM_URL` e `AULA_INDICA_CRM_SECRET`.

2. **Google Sheets (backup)** — criar uma planilha com as colunas
   `nome, email, whatsapp, dataHora, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, pageUrl`,
   publicar um Apps Script (mesmo modelo do usado pela `/evento`) como Web App
   e colar a URL em `AULA_INDICA_SHEETS_URL`.

3. **Marketing Hub** — já funciona com o token atual (`VITE_MARKETING_HUB_LEADS_TOKEN`).
   Os leads chegam com `page_origin: "aula-indica"`. Se o Hub filtrar/agrupar por
   `page_origin`, cadastrar esse novo valor lá.

Enquanto os itens 1 e 2 estiverem vazios, a página funciona normalmente e só envia para o Marketing Hub.

## O que falta — FRONTEND / marketing

1. **Conferir o link do grupo do WhatsApp** (`WHATSAPP_GROUP_URL` em `AulaIndica.tsx`).
   Hoje está o da LP original. Se for usar o redirecionador `sndflw.com` como no `/evento`, trocar.
2. **Data da aula** — para uma nova edição, trocar `EVENT_START_ISO` e os textos com
   "11 NOV / 11/11/2026" na página.
3. **Variável na Vercel** — conferir que `VITE_MARKETING_HUB_LEADS_TOKEN` está configurada no projeto.
4. **Testar em produção** com `?utm_source=teste` e conferir o lead no Marketing Hub, CRM e planilha.
5. URL final das campanhas: `https://franquias.helpmultas.com.br/aula-indica?utm_source=...`

## Publicar

```bash
git push -u origin feat/lp-aula-indica
```
Abrir o PR para `main`; a Vercel publica ao fazer o merge.
