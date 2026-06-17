/*
 * FranqueadoLP — Nova LP de captação de franqueados
 * Inspirada na estrutura da LP Seguralta (franquiaseguralta.com.br)
 * Design system: Navy (#0A1628) + Gold (#D4A017) + Off-white (#F8F6F0)
 *
 * Changelog:
 * - Hero mobile: form aparece antes da headline/stats
 * - ModelosLP: cards maiores, mais respiração e hierarquia visual
 * - FooterLP: footer inline específico desta página (sem importar o componente global)
 */

import { useState, useEffect, useRef } from "react";
import { useInView } from "../hooks/useInView";

/* ─── Color tokens ─── */
const NAVY = "oklch(0.1998 0.0403 258.29)";
const GOLD = "oklch(0.8371 0.1715 85.23)";

/* ─── Form options ─── */
const UF_OPTIONS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const CAPITAL_OPTIONS = [
  { value: "20.000",  label: "Mais de R$ 20 mil"  },
  { value: "30.000",  label: "Mais de R$ 30 mil"  },
  { value: "50.000",  label: "Mais de R$ 50 mil"  },
  { value: "100.000", label: "Mais de R$ 100 mil" },
];

const OCUPACAO_OPTIONS = [
  { value: "clt",             label: "Empregado (CLT)"          },
  { value: "autonomo",        label: "Autônomo / Freelancer"     },
  { value: "empresario",      label: "Empresário / Empreendedor" },
  { value: "funcionario_pub", label: "Funcionário Público"       },
  { value: "desempregado",    label: "Desempregado"              },
  { value: "estudante",       label: "Estudante"                 },
  { value: "aposentado",      label: "Aposentado / Pensionista"  },
];

const HORARIO_OPTIONS = [
  { value: "manha",    label: "Manhã (8h – 12h)"  },
  { value: "tarde",    label: "Tarde (12h – 18h)" },
  { value: "noite",    label: "Noite (18h – 21h)" },
  { value: "qualquer", label: "Qualquer horário"   },
];

/* ─── Helpers ─── */
function onlyNumbers(v: string) { return v.replace(/\D/g, ""); }

function formatWhatsapp(v: string) {
  const n = onlyNumbers(v).slice(0, 11);
  if (n.length <= 2)  return n;
  if (n.length <= 6)  return n.replace(/(\d{2})(\d+)/, "($1) $2");
  if (n.length <= 10) return n.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return n.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
}

/* ─── CustomSelect ─── */
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

/* ─── LeadForm ─── */
function LeadForm() {
  const [formData, setFormData] = useState({
    nome: "", email: "", whatsapp: "", cidade: "",
    uf: "", capital: "", ocupacao: "", horario: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const [ufOpen, setUfOpen] = useState(false);
  const ufRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ufRef.current && !ufRef.current.contains(e.target as Node)) setUfOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const required = ["nome", "email", "whatsapp", "cidade", "uf", "capital", "ocupacao", "horario"];
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
      const meta     = window.getMetaTrackingData();
      const tracking = window.getTrackingData();

      const capitalLabel  = CAPITAL_OPTIONS.find((o) => o.value === formData.capital)?.label  || formData.capital;
      const ocupacaoLabel = OCUPACAO_OPTIONS.find((o) => o.value === formData.ocupacao)?.label || formData.ocupacao;
      const horarioLabel  = HORARIO_OPTIONS.find((o) => o.value === formData.horario)?.label   || formData.horario;

      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "1f63b8b2-e797-4e97-8308-b9b8509f6449",
          from_name:  "LP Franqueado",
          subject:    "Novo Candidato a Franqueado — LP Franqueado",
          nome:       formData.nome,
          email:      formData.email,
          whatsapp:   formData.whatsapp,
          cidade:     formData.cidade,
          uf:         formData.uf,
          capital:    capitalLabel,
          ocupacao:   ocupacaoLabel,
          horario:    horarioLabel,
          fbp:        meta?.fbp    || "",
          fbc:        meta?.fbc    || "",
          fbclid:     meta?.fbclid || "",
        }),
      });
      const web3Result = await web3Response.json();
      if (!web3Response.ok || !web3Result.success) throw new Error("Erro Web3Forms");

      try {
        await fetch("https://crm.helprecurso.com.br/leads/create-by-api-key", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": "93wkn371eaEbl6P41RlNWhM1xrFGSXdRVjDf3AGC" },
          body: JSON.stringify({
            fullName:    formData.nome,
            phone:       formData.whatsapp,
            email:       formData.email,
            capital:     formData.capital,
            capitalLabel,
            fbp:         meta?.fbp    || "",
            fbc:         meta?.fbc    || "",
            fbclid:      meta?.fbclid || "",
            utmSource:   tracking?.utm_source   || "",
            utmMedium:   tracking?.utm_medium   || "",
            utmCampaign: tracking?.utm_campaign || "",
            utmContent:  tracking?.utm_content  || "",
            utmTerm:     tracking?.utm_term     || "",
            utmId:       tracking?.utm_id       || "",
          }),
        });
      } catch (crmError) {
        console.error("Erro CRM:", crmError);
      }

      window.location.href = "https://franquias.helpmultas.com.br/obrigado";
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", text: "Erro ao enviar formulário. Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    "w-full min-h-[50px] border border-[#D9E1E8] rounded-[14px] px-4 bg-white text-[oklch(0.1998_0.0403_258.29)] text-[15px] outline-none placeholder-[#98a2b3] focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/20 transition-all duration-200";
  const labelCls =
    "text-[oklch(0.1998_0.0403_258.29)] text-[13px] font-bold uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-[7px]">
        <label className={labelCls} htmlFor="lp-nome">Nome completo</label>
        <input
          id="lp-nome" name="nome" type="text" placeholder="Digite seu nome completo"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          className={inputCls} required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-[7px]">
          <label className={labelCls} htmlFor="lp-email">E-mail</label>
          <input
            id="lp-email" name="email" type="email" placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputCls} required
          />
        </div>
        <div className="flex flex-col gap-[7px]">
          <label className={labelCls} htmlFor="lp-whatsapp">WhatsApp</label>
          <input
            id="lp-whatsapp" name="whatsapp" type="tel" placeholder="(00) 00000-0000"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsapp(e.target.value) })}
            maxLength={15} inputMode="numeric" autoComplete="tel"
            className={inputCls} required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-[7px]">
          <label className={labelCls} htmlFor="lp-cidade">Cidade</label>
          <input
            id="lp-cidade" name="cidade" type="text" placeholder="Sua cidade"
            value={formData.cidade}
            onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
            className={inputCls} required
          />
        </div>
        <div className="flex flex-col gap-[7px]" ref={ufRef}>
          <label className={labelCls}>UF</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setUfOpen((o) => !o)}
              aria-haspopup="listbox" aria-expanded={ufOpen}
              className={`w-full min-h-[50px] border rounded-[14px] px-4 pr-10 text-left text-[15px] outline-none transition-all duration-200 relative
                ${formData.uf ? "text-[oklch(0.1998_0.0403_258.29)]" : "text-[#98a2b3]"}
                ${ufOpen ? "border-[#D4A017] ring-4 ring-[#D4A017]/20 bg-white" : "border-[#D9E1E8] bg-white"}`}
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
                <button type="button" className="w-full text-left px-3 py-2.5 rounded-[10px] text-[#98a2b3] text-[15px] hover:bg-[#edf2f6]"
                  onClick={() => { setFormData((p) => ({ ...p, uf: "" })); setUfOpen(false); }}>
                  Selecione
                </button>
                {UF_OPTIONS.map((uf) => (
                  <button key={uf} type="button" role="option" aria-selected={formData.uf === uf}
                    className={`w-full text-left px-3 py-2.5 rounded-[10px] text-[15px] transition-colors duration-150
                      ${formData.uf === uf ? "bg-[#D4A017]/15 text-[#D4A017] font-bold" : "text-[oklch(0.1998_0.0403_258.29)] hover:bg-[#edf2f6]"}`}
                    onClick={() => { setFormData((p) => ({ ...p, uf })); setUfOpen(false); }}
                  >{uf}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CustomSelect
        label="Capital disponível para investimento"
        placeholder="Selecione uma faixa"
        options={CAPITAL_OPTIONS}
        value={formData.capital}
        onChange={(v) => setFormData((p) => ({ ...p, capital: v }))}
      />

      <div className="grid grid-cols-2 gap-3">
        <CustomSelect
          label="Ocupação atual" placeholder="Selecione"
          options={OCUPACAO_OPTIONS} value={formData.ocupacao}
          onChange={(v) => setFormData((p) => ({ ...p, ocupacao: v }))}
        />
        <CustomSelect
          label="Melhor horário" placeholder="Selecione"
          options={HORARIO_OPTIONS} value={formData.horario}
          onChange={(v) => setFormData((p) => ({ ...p, horario: v }))}
        />
      </div>

      {status && (
        <div
          className={`rounded-[14px] px-4 py-3 text-[14px] leading-[1.5] border font-body
            ${status.type === "error"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
          role="alert" aria-live="polite"
        >
          {status.text}
        </div>
      )}

      <button
        type="submit" disabled={isSubmitting}
        className="w-full min-h-[54px] mt-1 rounded-[14px] bg-gold text-[oklch(0.1998_0.0403_258.29)] font-body font-black text-[15px] uppercase tracking-wide shadow-[0_14px_24px_rgba(212,160,23,0.28)] hover:bg-gold/80 hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting ? "Enviando dados..." : "Quero ser um franqueado →"}
      </button>

      <p className="text-center text-xs text-gray-400 font-body">
        Seus dados estão seguros. Sem spam, sem compromisso.
      </p>
    </form>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION 1 — HERO
   Mobile: form → copy/stats
   Desktop: copy/stats | form
════════════════════════════════════════════════════════════ */
function HeroLP() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen overflow-hidden"
      style={{ background: NAVY }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Gold glow */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${GOLD}18 0%, transparent 70%)`,
          transform: "translate(-30%, -30%)",
        }}
      />

      {/* Nav */}
      <div className="relative z-10 w-full pt-6">
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <a href="#inicio">
            <img src="/image/LogotipoHelpinho.png" alt="Help Multas" className="h-12 w-auto" />
          </a>
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "O Mercado",    href: "#mercado"      },
              { label: "Diferenciais", href: "#diferenciais" },
              { label: "Modelos",      href: "#modelo"       },
              { label: "Depoimentos",  href: "#depoimentos"  },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-body text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href="#formulario"
            className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-lg font-body font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:opacity-90"
            style={{ background: GOLD, color: NAVY }}
          >
            Quero investir
          </a>
        </div>
      </div>

      {/* Main grid
          Mobile:  flex-col → form first (order-1), then copy (order-2)
          Desktop: grid 2 cols → copy left, form right (natural order) */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-10 pb-24">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* FORM — order-1 mobile, right column desktop */}
          <div
            id="formulario-hero"
            className="order-1 lg:order-2 w-full"
          >
            <div
              className="rounded-[28px] p-7 sm:p-10 shadow-[0_32px_70px_rgba(0,0,0,0.5)]"
              style={{
                background: "white",
                border: `1.5px solid ${GOLD}30`,
              }}
            >
              <div className="mb-6">
                <span className="gold-line block mb-4" />
                <h2 className="font-display text-[26px] sm:text-[28px] font-black text-[oklch(0.1998_0.0403_258.29)] leading-tight mb-2">
                  Quero ser um franqueado
                </h2>
                <p className="font-body text-gray-500 text-[15px] leading-relaxed">
                  Preencha seus dados e nosso time de expansão entra em contato em até 24h.
                </p>
              </div>
              <LeadForm />
            </div>
          </div>

          {/* COPY — order-2 mobile, left column desktop */}
          <div className="order-2 lg:order-1 flex flex-col justify-center pt-0 lg:pt-4">

            <h1 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-black text-white leading-[1.05] tracking-tight mb-6">
              Entre para a maior rede de{" "}
              <em className="text-gold not-italic">defesa de multas</em>{" "}
              do Brasil investindo a partir de{" "}
              <em className="text-gold not-italic">R$ 30 mil</em>
            </h1>

            <p className="font-body text-white/65 text-lg leading-relaxed mb-10 max-w-lg">
              Modelo 100% Done-For-You: você vende, nós fazemos a análise jurídica e protocolo.
              Sem precisar ser advogado.
            </p>

            {/* Trust stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { number: "80+",     label: "Franquias ativas"      },
                { number: "100mil+", label: "Motoristas atendidos"  },
                { number: "27",      label: "Estados presentes"     },
                { number: "10+",     label: "Anos de mercado"       },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col rounded-xl px-4 py-4 border"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.10)" }}
                >
                  <span className="font-display text-2xl font-black" style={{ color: GOLD }}>
                    {stat.number}
                  </span>
                  <span className="font-body text-sm text-white/60 mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: "60px" }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full" fill="oklch(0.96 0.01 75)">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION 2 — MARKET
════════════════════════════════════════════════════════════ */
function MarketLP() {
  const { ref: titleRef, inView: titleInView } = useInView();

  const stats = [
    { number: "86M",    label: "multas por ano",    detail: "O Brasil é campeão mundial em infrações de trânsito — um mercado inesgotável."            },
    { number: "95%",    label: "não recorrem",       detail: "A esmagadora maioria dos motoristas multados desconhece o direito de contestar."          },
    { number: "R$45bi", label: "em infrações/ano",   detail: "Volume financeiro movimentado por multas de trânsito a cada ano no Brasil."               },
    { number: "60-70%", label: "de sucesso",         detail: "Taxa média de recursos deferidos com a metodologia técnica da Help Multas."               },
  ];

  return (
    <section id="mercado" className="relative py-24" style={{ background: "oklch(0.96 0.01 75)" }}>
      <div className="container mx-auto px-6 lg:px-12">
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: GOLD }}>
            O Mercado
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-black leading-tight max-w-3xl mx-auto" style={{ color: NAVY }}>
            O mercado de multas cresce e{" "}
            <span className="text-gold italic">a oportunidade é agora</span>
          </h2>
          <p className="font-body text-lg mt-6 max-w-2xl mx-auto" style={{ color: `${NAVY}99` }}>
            A fiscalização eletrônica expandiu drasticamente — e a demanda reprimida por defesa administrativa
            cria um cenário ideal para quem deseja investir em um negócio sólido e com receita recorrente.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center rounded-2xl p-7 border transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(212,160,23,0.15)]"
              style={{ background: "white", borderColor: "oklch(0.88 0.01 75)" }}
            >
              <span
                className="font-display text-[3rem] font-black leading-none mb-2 group-hover:scale-110 transition-transform duration-300"
                style={{ color: GOLD }}
              >
                {s.number}
              </span>
              <span className="font-display text-base font-bold mb-2" style={{ color: NAVY }}>{s.label}</span>
              <span className="font-body text-sm leading-relaxed" style={{ color: `${NAVY}80` }}>{s.detail}</span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Mercado Bilionário", text: "Com a expansão das câmeras e radares, o número de multas eletrônicas cresce a cada ano — e a maioria dos motoristas nem sabe que pode contestar."  },
            { title: "Defesa Acessível",   text: "A Help Multas democratiza o acesso à defesa administrativa. Você não precisa ser advogado — nossa equipe jurídica cuida de tudo por você."         },
            { title: "Demanda Crescente",  text: "A digitalização da fiscalização de trânsito garante fluxo constante de novos clientes, tornando o negócio previsível e escalável."                 },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl p-7 border transition-all duration-300 hover:border-[#D4A017]/40 group"
              style={{ background: "white", borderColor: "oklch(0.88 0.01 75)" }}
            >
              <h3 className="font-display text-xl font-bold mb-2 group-hover:text-gold transition-colors" style={{ color: NAVY }}>
                {card.title}
              </h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: `${NAVY}80` }}>{card.text}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-8 font-body" style={{ color: `${NAVY}50` }}>
          Fontes: Denatran, SENATRAN, Infosiga, PRF
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION 3 — POR QUE HELP MULTAS
════════════════════════════════════════════════════════════ */
function WhyLP() {
  const { ref, inView } = useInView();

  const items = [
    "Modelo Done-For-You: você vende, nós entregamos o serviço técnico",
    "Sistema próprio de gestão de processos, do cadastro ao protocolo",
    "Equipe jurídica centralizada com especialistas em direito de trânsito",
    "Treinamento completo + suporte comercial e operacional contínuo",
    "Receita recorrente: clientes voltam ao renovar CNH ou ao levar novas multas",
    "Sem necessidade de formação jurídica — qualquer empreendedor pode operar",
    "Operação enxuta: sem estoque, sem produto físico, sem complexidade",
    "Marketing nacional + materiais prontos para captação de clientes",
  ];

  return (
    <section id="diferenciais" className="relative py-24 overflow-hidden" style={{ background: NAVY }}>
      <div
        className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${GOLD}10 0%, transparent 70%)`, transform: "translate(40%, -50%)" }}
      />
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <span className="gold-line" />
            <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: GOLD }}>
              Por que nos escolher
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              Por que investidores escolhem a{" "}
              <em className="not-italic" style={{ color: GOLD }}>Help Multas?</em>
            </h2>
            <p className="font-body text-white/65 text-lg leading-relaxed mb-8">
              Credibilidade, suporte, tecnologia e um modelo operacional que elimina a complexidade
              para que você foque só no que importa: crescer.
            </p>
            <a
              href="#formulario"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px]"
              style={{ background: GOLD, color: NAVY }}
            >
              Quero investir →
            </a>
          </div>

          <div className="flex flex-col gap-3">
            {items.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 rounded-xl px-5 py-4 border transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <span className="text-gold font-bold shrink-0 mt-0.5">✓</span>
                <span className="font-body text-[15px] text-white/80 leading-snug">{item}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION 4 — VÍDEO
════════════════════════════════════════════════════════════ */
function VideoLP() {
  const { ref, inView } = useInView();

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: "oklch(0.96 0.01 75)" }}>
      <div className="container mx-auto px-6 lg:px-12">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: GOLD }}>
            Entenda o modelo
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-black leading-tight max-w-3xl mx-auto" style={{ color: NAVY }}>
            Escale no mercado de defesa de multas com um modelo validado
          </h2>
          <p className="font-body text-lg mt-4 max-w-2xl mx-auto" style={{ color: `${NAVY}80` }}>
            Assista ao vídeo e veja como funciona o modelo que permite crescer com previsibilidade,
            suporte técnico completo e sem precisar ser advogado.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(10,22,40,0.2)]">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/7QaDuGApFig?rel=0&modestbranding=1"
              title="Como funciona a Help Multas"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href="#formulario"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px] shadow-[0_12px_28px_rgba(212,160,23,0.25)]"
            style={{ background: GOLD, color: NAVY }}
          >
            Quero entender o modelo →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION 5 — MODELOS DE NEGÓCIO (cards maiores)
════════════════════════════════════════════════════════════ */
function ModelosLP() {
  const { ref, inView } = useInView();

  const modelos = [
    {
      tag:          "Mais popular",
      name:         "Loja Fisica",
      description:  "Escritório comercial com atendimento presencial e equipe enxuta, fortalecendo presença local e credibilidade na sua cidade.",
      investimento: "R$ 100 mil",
      bullets: [
        "Ponto comercial físico",
        "Equipe de atendimento",
        "Alta visibilidade local",
        "Suporte completo da franqueadora",
      ],
      highlight: false,
    },
    {
      tag:          "Melhor custo-benefício",
      name:         "Home Based",
      description:  "Modalidade 100% remota, ideal para quem deseja iniciar com baixo investimento e flexibilidade total de horários.",
      investimento: "R$ 30 mil",
      bullets: [
        "Operação 100% remota",
        "Sem custo de ponto comercial",
        "Flexibilidade de horários",
        "Suporte completo da franqueadora",
      ],
      highlight: true,
    },
  ];

  return (
    <section id="modelo" className="relative py-24 overflow-hidden" style={{ background: NAVY }}>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${GOLD}08 0%, transparent 70%)` }}
      />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: GOLD }}>
            Modalidades
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight">
            Modelos pensados para a sua realidade
          </h2>
          <p className="font-body text-white/60 text-lg mt-4 max-w-xl mx-auto">
            Escolha o formato que mais se adapta ao seu momento financeiro e objetivo de crescimento.
          </p>
        </div>

        {/* Cards grid — maiores, mais espaço e hierarquia */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {modelos.map((m, i) => (
            <div
              key={m.name}
              className={`relative flex flex-col rounded-3xl transition-all duration-700 overflow-hidden
                ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                ${m.highlight ? "shadow-[0_24px_80px_rgba(212,160,23,0.30)]" : "shadow-[0_8px_40px_rgba(0,0,0,0.30)]"}`}
              style={{
                background:   m.highlight ? "rgba(212,160,23,0.07)" : "rgba(255,255,255,0.05)",
                border:       `1.5px solid ${m.highlight ? `${GOLD}55` : "rgba(255,255,255,0.10)"}`,
                transitionDelay: `${i * 120}ms`,
              }}
            >
              {/* Tag badge */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                style={{ background: m.highlight ? GOLD : "rgba(255,255,255,0.15)" }}
              />

              <div className="p-10 pt-11 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
                      style={{ background: m.highlight ? `${GOLD}25` : "rgba(255,255,255,0.08)", color: m.highlight ? GOLD : "rgba(255,255,255,0.5)" }}
                    >
                      {m.tag}
                    </div>
                    <h3 className="font-display text-3xl font-black text-white">{m.name}</h3>
                  </div>
                </div>

                <p className="font-body text-base text-white/65 leading-relaxed mb-8">
                  {m.description}
                </p>

                {/* Bullets */}
                <ul className="flex flex-col gap-2.5 mb-8">
                  {m.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black"
                        style={{ background: m.highlight ? `${GOLD}25` : "rgba(255,255,255,0.08)", color: m.highlight ? GOLD : "rgba(255,255,255,0.5)" }}
                      >
                        ✓
                      </span>
                      <span className="font-body text-sm text-white/70">{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Investment — destaque total */}
                <div
                  className="rounded-2xl p-6 mb-8"
                  style={{
                    background:   m.highlight ? `${GOLD}12` : "rgba(255,255,255,0.04)",
                    border:       `1px solid ${m.highlight ? `${GOLD}30` : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <p className="font-body text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>
                    Investimento necessário
                  </p>
                  <p className="font-display text-4xl font-black" style={{ color: GOLD }}>
                    {m.investimento}
                  </p>
                </div>

                {/* CTA */}
                <a
                  href="#formulario"
                  className="mt-auto flex items-center justify-center gap-2 py-4 rounded-2xl font-body font-black text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                  style={
                    m.highlight
                      ? { background: GOLD, color: NAVY, boxShadow: `0 12px 32px ${GOLD}40` }
                      : { background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }
                  }
                >
                  Quero investir →
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-10 font-body text-white/25">
          * Faturamento médio estimado. Pode variar conforme perfil comercial, região e dedicação do franqueado.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION 6 — DEPOIMENTOS
════════════════════════════════════════════════════════════ */
function TestimonialsLP() {
  const { ref, inView } = useInView();

  const depoimentos = [
    { nome: "Vinicius",  cidade: "Pato Branco / Curitiba Hauer — PR", estrelas: 5, texto: "O suporte que a franqueadora presta é sensacional. Quando ela pega na mão da gente, literalmente faz a gente crescer. Aqui eu não precisei criar nada do zero — só repliquei o que realmente deu certo", initials: "V" },
    { nome: "Kelly",     cidade: "Criciúma — SC",                     estrelas: 5, texto: "Comecei sozinha e em poucos meses já estava faturando acima das minhas expectativas. O suporte da Help é incrível.",                                                                                                 initials: "K" },
    { nome: "André",     cidade: "Curitiba Centro — PR",              estrelas: 5, texto: "Não falta apoio. A própria franqueadora dá o suporte, chama a gente, incentiva. Ela não só ajuda, ela orienta.",                                                                                                     initials: "A" },
    { nome: "Dani",      cidade: "Joinville — SC",                    estrelas: 5, texto: "Em 1 ano de operação já ultrapassei R$ 1 milhão em faturamento. Nunca imaginei que seria possível com esse modelo.",                                                                                                  initials: "D" },
    { nome: "Raphael",   cidade: "Joinville — SC",                    estrelas: 5, texto: "A verdade sobre a Help Multas é que o modelo realmente funciona. Você tem todo o suporte que precisa para começar e crescer.",                                                                                         initials: "R" },
    { nome: "Alisson",   cidade: "Caçador — SC",                      estrelas: 5, texto: "A Help me proporcionou mais tempo com a minha família. Eu vinha de um emprego que trabalhava de domingo a domingo — hoje trabalho de segunda a sexta e tenho o final de semana inteiro para estar com eles.",         initials: "A" },
  ];

  return (
    <section id="depoimentos" className="relative py-24" style={{ background: "oklch(0.96 0.01 75)" }}>
      <div className="container mx-auto px-6 lg:px-12">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: GOLD }}>
            Histórias reais
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-black leading-tight" style={{ color: NAVY }}>
            Veja quem encontrou na Help Multas{" "}
            <em className="not-italic text-gold">a oportunidade de crescer</em>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {depoimentos.map((d, i) => (
            <div
              key={`${d.nome}-${i}`}
              className={`flex flex-col rounded-2xl p-6 border bg-white transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(10,22,40,0.1)] ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ borderColor: "oklch(0.88 0.01 75)", transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: d.estrelas }).map((_, si) => (
                  <span key={si} className="text-sm" style={{ color: GOLD }}>★</span>
                ))}
              </div>
              <p className="font-body text-sm leading-relaxed flex-1 italic mb-4" style={{ color: `${NAVY}99` }}>
                "{d.texto}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "oklch(0.92 0.005 75)" }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-display text-xs font-black"
                  style={{ background: `${GOLD}20`, color: GOLD }}
                >
                  {d.initials}
                </div>
                <div>
                  <p className="font-body font-bold text-sm" style={{ color: NAVY }}>{d.nome}</p>
                  <p className="font-body text-xs" style={{ color: `${NAVY}60` }}>{d.cidade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#formulario"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px] shadow-[0_12px_28px_rgba(212,160,23,0.25)]"
            style={{ background: GOLD, color: NAVY }}
          >
            Quero saber mais →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION 7 — COMPARATIVO
════════════════════════════════════════════════════════════ */
function ComparisonLP() {
  const { ref, inView } = useInView();

  const rows = [
    { criterio: "Tempo de mercado",         helpMultas: "+ 10 anos",            concA: "Menos de 1 ano",     concB: "1 a 2 anos"       },
    { criterio: "Unidades ativas",          helpMultas: "+ 80 franquias",        concA: "Até 20 unidades",    concB: "20 a 40 unidades" },
    { criterio: "Análise jurídica própria", helpMultas: "Equipe interna",        concA: "Terceirizado",       concB: "Parcial"          },
    { criterio: "Sistema próprio",          helpMultas: "Plataforma dedicada",   concA: "Não possui",         concB: "Básico"           },
    { criterio: "Treinamento contínuo",     helpMultas: "Presencial + EaD",      concA: "Apenas inicial",     concB: "EaD limitado"     },
    { criterio: "Marketing nacional",       helpMultas: "Suporte completo",      concA: "Por conta própria",  concB: "Material básico"  },
  ];

  return (
    <section id="comparativo" className="relative py-24 overflow-hidden" style={{ background: NAVY }}>
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: GOLD }}>
            Comparativo de rede
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight">
            Compare o que realmente{" "}
            <em className="not-italic" style={{ color: GOLD }}>acelera resultado</em>
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.06)" }}>
                <th className="text-left px-5 py-4 font-body text-xs uppercase tracking-wider text-white/40 font-semibold w-[30%]">Critério</th>
                <th className="px-5 py-4 font-body text-xs uppercase tracking-wider font-bold w-[23%]" style={{ color: GOLD }}>Help Multas</th>
                <th className="px-5 py-4 font-body text-xs uppercase tracking-wider text-white/40 font-semibold w-[23%]">Concorrente A</th>
                <th className="px-5 py-4 font-body text-xs uppercase tracking-wider text-white/40 font-semibold w-[23%]">Concorrente B</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.criterio} className="border-t border-white/6 transition-colors duration-150 hover:bg-white/3">
                  <td className="px-5 py-4 font-body text-sm font-semibold text-white/70">{row.criterio}</td>
                  <td className="px-5 py-4 font-body text-sm font-bold text-center" style={{ color: GOLD }}>{row.helpMultas}</td>
                  <td className="px-5 py-4 font-body text-sm text-center text-white/40">{row.concA}</td>
                  <td className="px-5 py-4 font-body text-sm text-center text-white/40">{row.concB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-10">
          <a
            href="#formulario"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px] shadow-[0_12px_28px_rgba(212,160,23,0.25)]"
            style={{ background: GOLD, color: NAVY }}
          >
            Escolha a Help Multas →
          </a>
        </div>
        <p className="text-center text-xs mt-5 font-body text-white/25">
          * Dados estimados com base em informações públicas disponíveis.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION 8 — 3 PASSOS
════════════════════════════════════════════════════════════ */
function StepsLP() {
  const { ref, inView } = useInView();

  const steps = [
    { number: "01", title: "Agende uma conversa com nossa equipe de expansão", desc: "Analisamos seu perfil, sua realidade atual e seus objetivos para entender se a franquia faz sentido para você — sem compromisso." },
    { number: "02", title: "Receba o plano ideal para a sua realidade",        desc: "Escolhemos juntos a modalidade mais adequada (Home Based ou Loja Física), alinhando investimento, potencial e seu momento." },
    { number: "03", title: "Inicie sua operação com suporte completo",         desc: "Você começa a operar com sistema, treinamento, equipe jurídica e marketing — tudo pronto para acelerar seus resultados desde o primeiro dia." },
  ];

  return (
    <section className="relative py-24" style={{ background: "oklch(0.96 0.01 75)" }}>
      <div className="container mx-auto px-6 lg:px-12">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: GOLD }}>
            Como começar
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-black leading-tight" style={{ color: NAVY }}>
            Seus 3 passos para se tornar franqueado
          </h2>
          <p className="font-body text-lg mt-4 max-w-xl mx-auto" style={{ color: `${NAVY}80` }}>
            Nós te guiamos em cada etapa. Para se tornar franqueado Help Multas, basta seguir esses 3 passos simples.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <div
            className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px"
            style={{ background: `linear-gradient(to right, ${GOLD}40, ${GOLD}80, ${GOLD}40)` }}
          />
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`relative flex flex-col items-center text-center rounded-2xl p-8 bg-white border transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ borderColor: "oklch(0.88 0.01 75)", transitionDelay: `${i * 120}ms` }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl font-black mb-5 relative z-10"
                style={{ background: GOLD, color: NAVY }}
              >
                {step.number}
              </div>
              <h3 className="font-display text-xl font-black mb-3 leading-tight" style={{ color: NAVY }}>{step.title}</h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: `${NAVY}70` }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION 9 — CTA FINAL
════════════════════════════════════════════════════════════ */
function CTAFinalLP() {
  const { ref, inView } = useInView();

  return (
    <section id="formulario" className="relative py-24 overflow-hidden" style={{ background: NAVY }}>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }}
      />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${GOLD}12 0%, transparent 70%)`, transform: "translate(30%, -30%)" }}
      />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">

          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="gold-line" />
            <p className="font-body font-semibold text-sm uppercase tracking-widest mb-4" style={{ color: GOLD }}>
              Próximo Passo
            </p>
            <h2 className="font-display text-4xl lg:text-[56px] font-black text-white leading-[1.05] tracking-tight mb-6">
              CHEGOU SUA HORA DE{" "}
              <em className="not-italic" style={{ color: GOLD }}>VIRAR O JOGO!</em>
            </h2>
            <p className="font-body text-white/70 text-lg leading-relaxed mb-10 max-w-md">
              Preencha o formulário e nosso time de expansão entra em contato em até 24 horas
              para apresentar o plano ideal para você.
            </p>
            <div className="flex flex-col gap-3">
              {["Resposta em até 24h", "Dados protegidos", "Vagas por região limitadas"].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl px-5 py-4 border"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.10)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GOLD }} />
                  <span className="font-body text-white/80 text-[15px] font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div
              className="rounded-[28px] p-7 sm:p-10"
              style={{ background: "white", boxShadow: "0 32px 70px rgba(0,0,0,0.5)", border: `1.5px solid ${GOLD}30` }}
            >
              <div className="mb-6">
                <span className="gold-line block mb-4" />
                <h3 className="font-display text-[26px] sm:text-[28px] font-black leading-tight mb-2" style={{ color: NAVY }}>
                  Quero ser um franqueado
                </h3>
                <p className="font-body text-gray-500 text-[15px] leading-relaxed">
                  Preencha seus dados e nosso time de expansão entra em contato em até 24h.
                </p>
              </div>
              <LeadForm />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   FOOTER — específico desta LP
════════════════════════════════════════════════════════════ */
function FooterLP() {
  const socialLinks = [
    {
      label: "Instagram",
      href:  "https://www.instagram.com/helpmultasfranchising?igsh=emc4MXVjNHFqZG5t",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href:  "https://www.facebook.com/profile.php?id=61579753710294&locale=pt_BR",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href:  "https://www.linkedin.com/company/helpmultas/",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      label: "WhatsApp",
      href:  "https://api.whatsapp.com/send/?phone=5542999291211&text&type=phone_number&app_absent=0",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
  ];

  const navLinks = [
    { label: "O Mercado",    href: "#mercado"      },
    { label: "Diferenciais", href: "#diferenciais" },
    { label: "Modelos",      href: "#modelo"       },
    { label: "Depoimentos",  href: "#depoimentos"  },
    { label: "Comparativo",  href: "#comparativo"  },
    { label: "Seja Franqueado", href: "#formulario" },
  ];

  return (
    <footer
      className="font-body text-sm border-t"
      style={{ background: "oklch(0.15 0.03 258)", borderColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}
    >
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-14">

          {/* Brand */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <a href="#inicio">
              <img src="/image/LogotipoHelpinho.png" alt="Help Multas" className="h-12 w-auto" />
            </a>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
              Milhões de multas por ano. Cada uma é uma oportunidade sua.
              Modelo franqueado que transforma clientes em renda.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.50)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = GOLD; (e.currentTarget as HTMLAnchorElement).style.background = `${GOLD}15`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.50)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)"; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "rgba(255,255,255,0.30)" }}>
              Navegação
            </h4>
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-xs transition-colors duration-200 hover:text-white"
                style={{ color: "rgba(255,255,255,0.50)" }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Partners */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold" style={{ color: "rgba(255,255,255,0.30)" }}>
              Parceiros Oficiais
            </h4>
            <div className="flex flex-wrap items-center gap-6 opacity-30 hover:opacity-60 transition-opacity duration-300">
              <a href="https://racing.porsche.com/" target="_blank" rel="noopener noreferrer">
                <img src="/image/porsche motorsport.png" alt="Porsche Motorsport" className="h-5 w-auto object-contain brightness-0 invert" />
              </a>
              <a href="https://www.aceleradorempresarial.com.br/giants-alunos/" target="_blank" rel="noopener noreferrer">
                <img src="/image/download.svg" alt="Giants" className="h-4 w-auto object-contain brightness-0 invert" />
              </a>
              <a href="https://www.aceleradorempresarial.com.br/" target="_blank" rel="noopener noreferrer">
                <img src="/image/grupo_acelerador_icon_png.png" alt="Grupo Acelerador" className="h-6 w-auto object-contain brightness-0 invert" />
              </a>
            </div>

            {/* CTA mini */}
            <a
              href="#formulario"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:opacity-90"
              style={{ background: GOLD, color: NAVY }}
            >
              Quero ser franqueado →
            </a>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }} />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 text-center sm:text-left">
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.30)" }}>
            © 2026 Help Multas Franquias. Todos os direitos reservados. · CNPJ: 26.545.757/0001-54
          </p>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.20)" }}>
            Página exclusiva para captação de franqueados · <a href="/" className="hover:text-white transition-colors">Ir para o site principal</a>
          </p>
        </div>

      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE ROOT
════════════════════════════════════════════════════════════ */
export default function FranqueadoLP() {
  return (
    <div className="min-h-screen">
      <HeroLP />
      <MarketLP />
      <WhyLP />
      <VideoLP />
      <ModelosLP />
      <TestimonialsLP />
      <ComparisonLP />
      <StepsLP />
      <CTAFinalLP />
      <FooterLP />
    </div>
  );
}