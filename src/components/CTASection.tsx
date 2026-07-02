/*
 * CTASection — CTA Final com urgência e formulário
 *
 * Layout: 2 colunas desktop (copy + urgência | formulário)
 *         Mobile: stacked (copy → form)
 *
 * Formulário: mesmo visual e campos do HeroSection
 *   - inputCls / labelCls / CustomSelect padronizados
 *   - Máscara WhatsApp
 *   - Validação inline (sem alert())
 *   - Campos: nome, email, whatsapp, cidade, uf, capital
 *
 * Backend: 100% preservado
 *   - Web3Forms substituído por n8n + Resend
 *   - CRM em try-catch próprio (erro não bloqueia redirect)
 *   - Redirect idêntico
 */

import { useState, useEffect, useRef } from "react";
import { useInView } from "../hooks/useInView";

const CTA_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663612015267/7JPeai9Kn6mqwVB3QeEreq/cta-bg-KQ56VgudmidAHQMcjAgWNg.webp";

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

/* ─── FORMATTERS ─── */
function onlyNumbers(v: string) { return v.replace(/\D/g, ""); }

function formatWhatsapp(v: string) {
  let n = onlyNumbers(v);

  // Remove o código do país (55), se existir
  if (n.startsWith("55") && n.length > 11) {
    n = n.slice(2);
  }

  n = n.slice(0, 11);

  if (n.length <= 2) return n;
  if (n.length <= 6) return n.replace(/(\d{2})(\d+)/, "($1) $2");
  if (n.length <= 10) return n.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");

  return n.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
}

/* ─── CustomSelect — idêntico ao HeroSection ─── */
interface SelectOpt { value: string; label: string }

function CustomSelect({
  label, placeholder, options, value, onChange,
}: {
  label: string; placeholder: string;
  options: SelectOpt[]; value: string;
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
          <span className={`absolute right-4 top-1/2 w-2 h-2 border-r-2 border-b-2 border-[oklch(0.1998_0.0403_258.29)]/50 transition-transform duration-200 ${
            open ? "-translate-y-1/3 rotate-[225deg]" : "-translate-y-2/3 rotate-45"
          }`} />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 max-h-56 overflow-y-auto overscroll-contain rounded-[14px] border border-[#D9E1E8] bg-white shadow-[0_18px_34px_rgba(36,55,70,0.16)] p-1.5 flex flex-col gap-0.5"
          >
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
   CTASection
───────────────────────────────────────────────────────────── */
export default function CTASection() {
  const { ref: titleRef, inView: titleInView } = useInView();

  const [formData, setFormData] = useState({
    nome:     "",
    email:    "",
    whatsapp: "",
    cidade:   "",
    uf:       "",
    capital:  "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "error" | "success"; text: string } | null>(null);

  /* UF — dropdown próprio (compacto) */
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
     BACKEND — preservado exatamente como no original
     Adicionados apenas: máscara WA, validação inline,
     Ocupação e horário removidos do formulário
  ───────────────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    /* Validação (nova — sem alterar o que é enviado) */
    const required = ["nome", "email", "whatsapp", "cidade", "uf", "capital"];
    for (const key of required) {
      if (!formData[key as keyof typeof formData]) {
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
      /* tracking — sem optional chaining, preservado do original */
      const meta     = window.getMetaTrackingData();
      const tracking = window.getTrackingData();

      const capitalLabel  = CAPITAL_OPTIONS.find((o) => o.value === formData.capital)?.label  || formData.capital;

      /* 1. N8N — notificação por e-mail via Resend (fire-and-forget) */
      fetch("https://n8n.helpmultas.com/webhook/forms-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origem: "Landing Page Franqueado",
          nome:     formData.nome,
          email:    formData.email,
          whatsapp: formData.whatsapp,
          cidade:   formData.cidade,
          uf:       formData.uf,
          capital:  capitalLabel,
          fbp:      meta?.fbp    || "",
          fbc:      meta?.fbc    || "",
          fbclid:   meta?.fbclid || "",
        }),
      }).catch(() => { });

      /* 2. CRM — em try-catch próprio, erro só loga (preservado do original) */
      try {
        const crmPayload = {
          fullName:     formData.nome,
          phone:        formData.whatsapp,
          email:        formData.email,
          capital:      formData.capital,
          capitalLabel,
          fbp:          meta?.fbp    || "",
          fbc:          meta?.fbc    || "",
          fbclid:       meta?.fbclid || "",
          utmSource:    tracking?.utm_source   || "",
          utmMedium:    tracking?.utm_medium   || "",
          utmCampaign:  tracking?.utm_campaign || "",
          utmContent:   tracking?.utm_content  || "",
          utmTerm:      tracking?.utm_term     || "",
          utmId:        tracking?.utm_id       || "",
        };

        const crmResponse = await fetch("https://crm.helprecurso.com.br/leads/create-by-api-key", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key":    "93wkn371eaEbl6P41RlNWhM1xrFGSXdRVjDf3AGC",
          },
          body: JSON.stringify(crmPayload),
        });

        if (!crmResponse.ok) console.error("Erro CRM");
      } catch (crmError) {
        console.error("Erro CRM:", crmError);
      }

      /* 3. REDIRECT — idêntico ao original */
      window.location.href = "https://franquias.helpmultas.com.br/obrigado";

    } catch (error) {
      console.error(error);
      /* alert() substituído por status inline */
      setStatus({ type: "error", text: "Erro ao enviar formulário. Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };
  /* ─── FIM BACKEND ─── */

  const inputCls =
    "w-full min-h-[50px] border border-[#D9E1E8] rounded-[14px] px-4 bg-white text-[oklch(0.1998_0.0403_258.29)] text-[15px] outline-none placeholder-[#98a2b3] focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/20 transition-all duration-200";

  const labelCls =
    "text-[oklch(0.1998_0.0403_258.29)] text-[13px] font-bold uppercase tracking-wide";

  const urgencyItems = [
    { text: "Resposta em até 24h"        },
    { text: "Dados protegidos"            },
    { text: "Vagas por região limitadas"  },
  ];

  return (
    <section
      id="formulario"
      className="relative py-24 overflow-hidden"
      style={{ backgroundImage: `url(${CTA_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[oklch(0.1998_0.0403_258.29)]/90" />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">

          {/* ══════════════════════════════════════════
              ESQUERDA — Copy + urgência
          ══════════════════════════════════════════ */}
          <div
            ref={titleRef as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-700 ${titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="gold-line" />
            <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-4">
              Próximo Passo
            </p>

            <h2 className="font-display text-4xl lg:text-[56px] font-black text-white leading-[1.05] tracking-tight mb-6">
              VENHA FAZER PARTE DESSE{" "}
              <em className="text-gold not-italic">MERCADO</em>
            </h2>

            <p className="font-body text-white/70 text-lg leading-relaxed mb-10 max-w-md">
              Preencha o formulário e nosso time entrará em contato em até 24 horas.
            </p>

            {/* Urgency pills — coluna no desktop */}
            <div className="flex flex-col gap-3">
              {urgencyItems.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center justify-center gap-3 bg-white/5 border border-white/12 rounded-2xl px-5 py-4 w-full text-center"
                >
                  <span className="font-body text-white/80 text-[15px] font-semibold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════
              DIREITA — Card do formulário
          ══════════════════════════════════════════ */}
          <div>
            <div className="bg-white rounded-[28px] shadow-[0_32px_70px_rgba(0,0,0,0.5)] border border-[#D4A017]/20 p-7 sm:p-10">

              {/* Header do card */}
              <div className="mb-6">
                <span className="gold-line !mb-0 block mb-4" />
                <h3 className="font-display text-[26px] sm:text-[28px] font-black text-[oklch(0.1998_0.0403_258.29)] leading-tight mb-2">
                  Quero ser um franqueado
                </h3>
                <p className="font-body text-gray-500 text-[15px] leading-relaxed">
                  Preencha seus dados e nosso time de expansão entra em contato em até 24h.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

                {/* Nome */}
                <div className="flex flex-col gap-[7px]">
                  <label className={labelCls} htmlFor="cta-nome">Nome completo</label>
                  <input
                    id="cta-nome" name="nome" type="text"
                    placeholder="Digite seu nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className={inputCls} required
                  />
                </div>

                {/* Email + WhatsApp */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-[7px]">
                    <label className={labelCls} htmlFor="cta-email">E-mail</label>
                    <input
                      id="cta-email" name="email" type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputCls} required
                    />
                  </div>
                  <div className="flex flex-col gap-[7px]">
                    <label className={labelCls} htmlFor="cta-whatsapp">WhatsApp</label>
                    <input
                      id="cta-whatsapp" name="whatsapp" type="tel"
                      placeholder="(00) 00000-0000"
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: formatWhatsapp(e.target.value) })
                      }
                      maxLength={19} inputMode="numeric" autoComplete="tel"
                      className={inputCls} required
                    />
                  </div>
                </div>

                {/* Cidade + UF */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-[7px]">
                    <label className={labelCls} htmlFor="cta-cidade">Cidade</label>
                    <input
                      id="cta-cidade" name="cidade" type="text"
                      placeholder="Sua cidade"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      className={inputCls} required
                    />
                  </div>

                  {/* UF — dropdown compacto próprio */}
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
                        <span className={`absolute right-4 top-1/2 w-2 h-2 border-r-2 border-b-2 border-[oklch(0.1998_0.0403_258.29)]/50 transition-transform duration-200 ${
                          ufOpen ? "-translate-y-1/3 rotate-[225deg]" : "-translate-y-2/3 rotate-45"
                        }`} />
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
                              key={uf} type="button" role="option" aria-selected={formData.uf === uf}
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