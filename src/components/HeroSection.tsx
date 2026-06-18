/*
 * HeroSection — Layout assimétrico melhorado
 *
 * Mobile  → Logo ▸ Form ▸ Copy
 * Desktop → [Logo + Copy] | [Form]
 *
 * Formulário:
 *  - Email e WhatsApp lado a lado
 *  - Novo campo: Ocupação atual (select)
 *  - Novo campo: Melhor horário para contato (select)
 *  - Novos campos incluídos nos payloads Web3Forms e CRM
 */

import { useState, useEffect, useRef } from "react";
import { ChevronDown, BadgeCheck  } from "lucide-react";

const HERO_BG = "/image/fundo.webp";

/* ─── OPTIONS ─── */
const UF_OPTIONS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const CAPITAL_OPTIONS = [
  { value: "30.000", label: "De R$ 0 a R$ 30 mil (não tenho condições de adquirir a franquia atualmente)" },
  { value: "50.000", label: "De R$ 30 mil a R$ 50 mil" },
  { value: "70.000", label: "De R$ 50 mil a R$ 70 mil" },
  { value: "100.000", label: "Acima de R$ 70 mil" },
];

const OCUPACAO_OPTIONS = [
  { value: "clt", label: "Empregado (CLT)" },
  { value: "autonomo", label: "Autônomo / Freelancer" },
  { value: "empresario", label: "Empresário / Empreendedor" },
  { value: "funcionario_publico", label: "Funcionário Público" },
  { value: "desempregado", label: "Desempregado" },
  { value: "estudante", label: "Estudante" },
  { value: "aposentado", label: "Aposentado / Pensionista" },
  { value: "outro", label: "Outro" },
];

const HORARIO_OPTIONS = [
  { value: "manha", label: "Manhã (8h – 12h)" },
  { value: "tarde", label: "Tarde (12h – 18h)" },
  { value: "noite", label: "Noite (18h – 21h)" },
  { value: "qualquer", label: "Qualquer horário" },
];

/* ─── FORMATTERS ─── */
function onlyNumbers(v: string) {
  return v.replace(/\D/g, "");
}

function formatWhatsapp(v: string) {
  const n = onlyNumbers(v).slice(0, 11);
  if (n.length <= 2) return n;
  if (n.length <= 6) return n.replace(/(\d{2})(\d+)/, "($1) $2");
  if (n.length <= 10) return n.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return n.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
}

/* ─────────────────────────────────────────────────────────────
   CustomSelect — dropdown reutilizável (gerencia próprio estado)
   Usado para: Capital, Ocupação e Horário
───────────────────────────────────────────────────────────── */
interface SelectOpt { value: string; label: string }

function CustomSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: SelectOpt[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = options.find((o) => o.value === value);
  const lCls = "text-[oklch(0.1998_0.0403_258.29)] text-[13px] font-bold uppercase tracking-wide";

  return (
    <div className="flex flex-col gap-[7px]" ref={ref}>
      <span className={lCls}>{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`w-full min-h-[50px] border rounded-[14px] px-4 pr-10 text-left text-[15px] outline-none transition-all duration-200 relative
            ${value ? "text-[oklch(0.1998_0.0403_258.29)]" : "text-[#98a2b3]"}
            ${open
              ? "border-[#D4A017] ring-4 ring-[#D4A017]/20 bg-white"
              : "border-[#D9E1E8] bg-white"
            }`}
        >
          {selected?.label || placeholder}
          <span
            className={`absolute right-4 top-1/2 w-2 h-2 border-r-2 border-b-2 border-[oklch(0.1998_0.0403_258.29)]/50 transition-transform duration-200 ${open ? "-translate-y-1/3 rotate-[225deg]" : "-translate-y-2/3 rotate-45"
              }`}
          />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 max-h-56 overflow-y-auto overscroll-contain rounded-[14px] border border-[#D9E1E8] bg-white shadow-[0_18px_34px_rgba(36,55,70,0.16)] p-1.5 flex flex-col gap-0.5"
          >
            {/* clear option */}
            <button
              type="button"
              className="w-full text-left px-3 py-2.5 rounded-[10px] text-[#98a2b3] text-[15px] hover:bg-[#edf2f6]"
              onClick={() => { onChange(""); setOpen(false); }}
            >
              {placeholder}
            </button>

            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={value === opt.value}
                className={`w-full text-left px-3 py-2.5 rounded-[10px] text-[15px] transition-colors duration-150
                  ${value === opt.value
                    ? "bg-[#D4A017]/15 text-[#D4A017] font-bold"
                    : "text-[oklch(0.1998_0.0403_258.29)] hover:bg-[#edf2f6]"
                  }`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HeroSection
───────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    cidade: "",
    uf: "",
    capital: "",
    ocupacao: "",
    horario: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "error" | "success"; text: string } | null>(null);

  // UF ainda tem dropdown próprio (display compacto "UF")
  const [ufOpen, setUfOpen] = useState(false);
  const ufRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ufRef.current && !ufRef.current.contains(e.target as Node)) setUfOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ─────────────────────────────────────────────────────────
     BACKEND — endpoints, keys e lógica 100% preservados
     Apenas adicionados ocupacao/horario aos payloads
  ───────────────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const required: (keyof typeof formData)[] = [
      "nome", "email", "whatsapp", "cidade", "uf",
      "capital", "ocupacao", "horario",
    ];

    for (const key of required) {
      if (!formData[key]) {
        setStatus({ type: "error", text: "Preencha todos os campos antes de continuar." });
        return;
      }
    }

    const wa = onlyNumbers(formData.whatsapp);
    if (wa.length < 10 || wa.length > 11) {
      setStatus({ type: "error", text: "WhatsApp inválido. Digite DDD + número." });
      return;
    }

    setIsSubmitting(true);

    try {
      const meta = window.getMetaTrackingData?.() || {};
      const tracking = window.getTrackingData?.() || {};

      const capitalLabel = CAPITAL_OPTIONS.find((o) => o.value === formData.capital)?.label || formData.capital;
      const ocupacaoLabel = OCUPACAO_OPTIONS.find((o) => o.value === formData.ocupacao)?.label || formData.ocupacao;
      const horarioLabel = HORARIO_OPTIONS.find((o) => o.value === formData.horario)?.label || formData.horario;

      /* 1. WEB3FORMS */
      const web3Payload = {
        access_key: "1f63b8b2-e797-4e97-8308-b9b8509f6449",
        from_name: "Landing Page Franquias",
        subject: `Novo Candidato a Franqueado - ${formData.nome.trim()}`,
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        whatsapp: formData.whatsapp,
        cidade: formData.cidade.trim(),
        uf: formData.uf,
        capital: capitalLabel,
        ocupacao: ocupacaoLabel,
        horario: horarioLabel,
        botcheck: false,
      };

      console.log("WEB3 PAYLOAD:", web3Payload);

      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(web3Payload),
      });

      let web3Result: any = null;
      try { web3Result = await web3Response.json(); } catch { web3Result = null; }

      console.log("WEB3 STATUS:", web3Response.status);
      console.log("WEB3 RESPONSE:", web3Result);

      if (!web3Response.ok || !web3Result?.success) {
        throw new Error(`Erro Web3Forms: ${web3Result?.message || `Status ${web3Response.status}`}`);
      }

      /* 2. CRM */
      const crmPayload = {
        fullName: formData.nome.trim(),
        phone: formData.whatsapp,
        email: formData.email.trim(),
        cidade: formData.cidade.trim(),
        uf: formData.uf,
        capital: formData.capital,
        capitalLabel,
        fbp: meta?.fbp || "",
        fbc: meta?.fbc || "",
        fbclid: meta?.fbclid || "",
        utmSource: tracking?.utm_source || "",
        utmMedium: tracking?.utm_medium || "",
        utmCampaign: tracking?.utm_campaign || "",
        utmContent: tracking?.utm_content || "",
        utmTerm: tracking?.utm_term || "",
        utmId: tracking?.utm_id || "",
      };

      console.log("CRM PAYLOAD:", crmPayload);

      const crmResponse = await fetch("https://crm.helprecurso.com.br/leads/create-by-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "93wkn371eaEbl6P41RlNWhM1xrFGSXdRVjDf3AGC",
        },
        body: JSON.stringify(crmPayload),
      });

      let crmResult: any = null;
      try { crmResult = await crmResponse.json(); } catch { crmResult = null; }

      console.log("CRM STATUS:", crmResponse.status);
      console.log("CRM RESPONSE:", crmResult);

      if (!crmResponse.ok) {
        throw new Error(`Erro CRM: ${crmResult?.message || crmResult?.error || `Status ${crmResponse.status}`}`);
      }

      /* 3. REDIRECT */
      window.location.href = "https://franquias.helpmultas.com.br/obrigado";
    } catch (error) {
      console.error("ERRO COMPLETO:", error);
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Erro ao enviar formulário.",
      });
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    "w-full min-h-[50px] border border-[#D9E1E8] rounded-[14px] px-4 bg-white text-[oklch(0.1998_0.0403_258.29)] text-[15px] outline-none placeholder-[#98a2b3] focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/20 transition-all duration-200";

  const labelCls =
    "text-[oklch(0.1998_0.0403_258.29)] text-[13px] font-bold uppercase tracking-wide";

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[oklch(0.1998_0.0403_258.29)]/60 backdrop-blur-[8px]" />

      <div className="relative z-10 container mx-auto px-5 lg:px-12 flex-1 flex items-center py-10 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">

          {/* ══════════════════════════════════════════
              COLUNA ESQUERDA — Copy
              Desktop: esquerda / Mobile: abaixo do form
          ══════════════════════════════════════════ */}
          <div className="text-white order-2 lg:order-1">
            {/* Logo — desktop only */}
            <div className="hidden lg:block mb-4">
              <img src="/image/LogotipoHelpinho.png" alt="Help Multas" className="h-12 w-auto" />
            </div>

            <span className="gold-line" />


            <h1 className="font-display text-4xl lg:text-[64px] font-black text-white leading-[1.1] tracking-tight mb-4">
              VOCÊ VENDE.{" "}
              <br /><span className="text-gold">NÓS EXECUTAMOS TODA A OPERAÇÃO.</span>
            </h1>

            <p className="font-body text-lg text-white/80 leading-relaxed mb-7 max-w-lg font-semibold">
              <span className="text-gold">Sem Royalties e 50% da venda no seu bolso.</span> <span><br />Nós cuidamos de todo o resto.</span>
            </p>

            <div className="flex items-stretch gap-0 mb-8">
              <div className="w-1 bg-gold rounded-full shrink-0" />
              <div className="pl-5">
                <p className="font-body text-gold/60 text-[11px] font-semibold uppercase tracking-[.15em] mb-1">
                  Investimento a partir de
                </p>
                <p className="font-display text-5xl lg:text-6xl font-black text-gold leading-none tracking-tight">
                  R$ 30 MIL
                </p>
                <p className="font-body text-white/35 text-xs mt-1.5">
                  Taxa de franquia inclusa
                </p>
              </div>
            </div>

            {/* Trust pills — desktop only */}
            <div className="hidden lg:flex gap-1 flex-wrap mb-8">
              {[
                { icon: <BadgeCheck className="w-5 h-5" />, text: "Franquia com mais de 10 ANOS DE MERCADO" },
              ].map((pill) => (
                <div
                  key={pill.text}
                  className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2"
                >
                  <span className="text-gold">{pill.icon}</span>
                  <span className="font-body text-body font-bold text-white/80">{pill.text}</span>
                </div>
              ))}
            </div>

            <a href="#modelo" className="hidden lg:flex items-center gap-2 text-white/40 text-sm hover:text-white transition-colors">
              <ChevronDown className="animate-bounce w-4 h-4" />
              <span className="font-body font-semibold">Role para conhecer o modelo</span>
            </a>
          </div>

          {/* ══════════════════════════════════════════
              COLUNA DIREITA — Formulário
              Mobile: primeiro (order-1), com logo acima
          ══════════════════════════════════════════ */}
          <div id="formulario" className="order-1 lg:order-2">

            {/* Logo + mini hook — mobile only */}
            <div className="lg:hidden flex items-center justify-between mb-5">
              <img src="/image/LogotipoHelpinho.png" alt="Help Multas" className="h-9 w-auto" />
              <div className="text-right">
                <p className="text-gold font-body font-black text-[11px] uppercase tracking-widest leading-tight">
                  Oportunidade 2026
                </p>
                <p className="text-white/70 font-body text-[11px] font-semibold leading-tight">
                  Até R$ 500 Mil / ano
                </p>
              </div>
            </div>

            {/* Card do formulário */}
            <div className="bg-white rounded-[28px] shadow-[0_32px_70px_rgba(0,0,0,0.45)] border border-[#D4A017]/20 p-6 sm:p-10">

              <div className="mb-6">
                <span className="gold-line !mb-0 block mb-4" />
                <h2 className="font-display text-[26px] sm:text-[28px] font-black text-[oklch(0.1998_0.0403_258.29)] leading-tight mb-2">
                  Quero ser um franqueado
                </h2>
                <p className="font-body text-gray-500 text-[15px] leading-relaxed">
                  Preencha seus dados e nosso time de expansão entra em contato em até 24h.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

                {/* Nome */}
                <div className="flex flex-col gap-[7px]">
                  <label className={labelCls} htmlFor="hero-nome">Nome completo</label>
                  <input
                    id="hero-nome"
                    name="nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className={inputCls}
                    required
                  />
                </div>

                {/* Email + WhatsApp — lado a lado */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-[7px]">
                    <label className={labelCls} htmlFor="hero-email">E-mail</label>
                    <input
                      id="hero-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputCls}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-[7px]">
                    <label className={labelCls} htmlFor="hero-whatsapp">WhatsApp</label>
                    <input
                      id="hero-whatsapp"
                      name="whatsapp"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: formatWhatsapp(e.target.value) })
                      }
                      maxLength={15}
                      inputMode="numeric"
                      autoComplete="tel"
                      className={inputCls}
                      required
                    />
                  </div>
                </div>

                {/* Cidade + UF */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-[7px]">
                    <label className={labelCls} htmlFor="hero-cidade">Cidade</label>
                    <input
                      id="hero-cidade"
                      name="cidade"
                      type="text"
                      placeholder="Sua cidade"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      className={inputCls}
                      required
                    />
                  </div>

                  {/* UF — dropdown próprio (compacto) */}
                  <div className="flex flex-col gap-[7px]" ref={ufRef}>
                    <label className={labelCls}>UF</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setUfOpen((o) => !o)}
                        aria-haspopup="listbox"
                        aria-expanded={ufOpen}
                        className={`w-full min-h-[50px] border rounded-[14px] px-4 pr-10 text-left text-[15px] outline-none transition-all duration-200 relative
                          ${formData.uf ? "text-[oklch(0.1998_0.0403_258.29)]" : "text-[#98a2b3]"}
                          ${ufOpen
                            ? "border-[#D4A017] ring-4 ring-[#D4A017]/20 bg-white"
                            : "border-[#D9E1E8] bg-white"
                          }`}
                      >
                        {formData.uf || "UF"}
                        <span
                          className={`absolute right-4 top-1/2 w-2 h-2 border-r-2 border-b-2 border-[oklch(0.1998_0.0403_258.29)]/50 transition-transform duration-200 ${ufOpen ? "-translate-y-1/3 rotate-[225deg]" : "-translate-y-2/3 rotate-45"
                            }`}
                        />
                      </button>

                      {ufOpen && (
                        <div
                          role="listbox"
                          className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 max-h-56 overflow-y-auto overscroll-contain rounded-[14px] border border-[#D9E1E8] bg-white shadow-[0_18px_34px_rgba(36,55,70,0.16)] p-1.5 flex flex-col gap-0.5"
                        >
                          <button
                            type="button"
                            className="w-full text-left px-3 py-2.5 rounded-[10px] text-[#98a2b3] text-[15px] hover:bg-[#edf2f6]"
                            onClick={() => { setFormData((p) => ({ ...p, uf: "" })); setUfOpen(false); }}
                          >
                            Selecione
                          </button>
                          {UF_OPTIONS.map((uf) => (
                            <button
                              key={uf}
                              type="button"
                              role="option"
                              aria-selected={formData.uf === uf}
                              className={`w-full text-left px-3 py-2.5 rounded-[10px] text-[15px] transition-colors duration-150
                                ${formData.uf === uf
                                  ? "bg-[#D4A017]/15 text-[#D4A017] font-bold"
                                  : "text-[oklch(0.1998_0.0403_258.29)] hover:bg-[#edf2f6]"
                                }`}
                              onClick={() => { setFormData((p) => ({ ...p, uf })); setUfOpen(false); }}
                            >
                              {uf}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Capital */}
                <CustomSelect
                  label="Capital disponível para investimento"
                  placeholder="Selecione uma faixa"
                  options={CAPITAL_OPTIONS}
                  value={formData.capital}
                  onChange={(v) => setFormData((p) => ({ ...p, capital: v }))}
                />

                {/* Ocupação + Horário — lado a lado */}
                <div className="grid grid-cols-2 gap-3">
                  <CustomSelect
                    label="Ocupação atual"
                    placeholder="Selecione"
                    options={OCUPACAO_OPTIONS}
                    value={formData.ocupacao}
                    onChange={(v) => setFormData((p) => ({ ...p, ocupacao: v }))}
                  />

                  <CustomSelect
                    label="Melhor horário"
                    placeholder="Selecione"
                    options={HORARIO_OPTIONS}
                    value={formData.horario}
                    onChange={(v) => setFormData((p) => ({ ...p, horario: v }))}
                  />
                </div>

                {/* Status */}
                {status && (
                  <div
                    className={`rounded-[14px] px-4 py-3 text-[14px] leading-[1.5] border font-body
                      ${status.type === "error"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    role="alert"
                    aria-live="polite"
                  >
                    {status.text}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[52px] mt-1 rounded-[14px] bg-gold text-[oklch(0.1998_0.0403_258.29)] font-body font-black text-[15px] uppercase tracking-wide shadow-[0_14px_24px_rgba(212,160,23,0.28)] hover:bg-gold/80 hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? "Enviando dados..." : "Quero ser um franqueado →"}
                </button>

                <p className="text-center text-xs text-gray-400 font-body">
                  Seus dados estão seguros. Sem spam.
                </p>

              </form>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}