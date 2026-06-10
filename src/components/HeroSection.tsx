/*
 * HeroSection — Seção hero com layout assimétrico
 * Design: Background com imagem de estrada/navy, texto à esquerda, formulário à direita
 * Typography: Fraunces display para headline, Plus Jakarta Sans para corpo
 * Colors: White text on dark navy bg, gold accents
 * Form: visual padronizado com o LeadFormSection (PreReunião)
 */

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useInView, useCounter } from "@/hooks/useInView";

const HERO_BG = "/image/fundo.webp";

const UF_OPTIONS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const CAPITAL_OPTIONS = [
  { value: "20.000", label: "Mais de R$ 20 mil" },
  { value: "30.000", label: "Mais de R$ 30 mil" },
  { value: "50.000", label: "Mais de R$ 50 mil" },
  { value: "100.000", label: "Mais de R$ 100 mil" },
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

export default function HeroSection() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    cidade: "",
    uf: "",
    capital: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const [ufOpen, setUfOpen] = useState(false);
  const [capitalOpen, setCapitalOpen] = useState(false);

  const ufRef = useRef<HTMLDivElement>(null);
  const capitalRef = useRef<HTMLDivElement>(null);

  // Fecha dropdowns ao clicar fora
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ufRef.current && !ufRef.current.contains(e.target as Node)) {
        setUfOpen(false);
      }

      if (capitalRef.current && !capitalRef.current.contains(e.target as Node)) {
        setCapitalOpen(false);
      }
    }

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // Validações
    const required: (keyof typeof formData)[] = [
      "nome",
      "email",
      "whatsapp",
      "cidade",
      "uf",
      "capital",
    ];

    for (const key of required) {
      if (!formData[key]) {
        setStatus({
          type: "error",
          text: "Preencha todos os campos antes de continuar.",
        });
        return;
      }
    }

    const wa = onlyNumbers(formData.whatsapp);

    if (wa.length < 10 || wa.length > 11) {
      setStatus({
        type: "error",
        text: "WhatsApp inválido. Digite DDD + número.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      /*
        =========================================
        TRACKING
        =========================================
      */

      const meta = window.getMetaTrackingData?.() || {};
      const tracking = window.getTrackingData?.() || {};

      const capitalLabel =
        CAPITAL_OPTIONS.find((opt) => opt.value === formData.capital)?.label ||
        formData.capital;

      /*
        =========================================
        1. WEB3FORMS
        =========================================
      */

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

        botcheck: false,
      };

      console.log("WEB3 PAYLOAD:", web3Payload);

      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(web3Payload),
      });

      let web3Result: any = null;

      try {
        web3Result = await web3Response.json();
      } catch {
        web3Result = null;
      }

      console.log("WEB3 STATUS:", web3Response.status);
      console.log("WEB3 RESPONSE:", web3Result);

      if (!web3Response.ok || !web3Result?.success) {
        throw new Error(
          `Erro Web3Forms: ${web3Result?.message || `Status ${web3Response.status}`
          }`
        );
      }

      /*
        =========================================
        2. CRM
        =========================================
  
        Agora o CRM NÃO é mais opcional.
        Se o CRM falhar, NÃO redireciona.
      */

      const crmPayload = {
        fullName: formData.nome.trim(),
        phone: formData.whatsapp,
        email: formData.email.trim(),

        cidade: formData.cidade.trim(),
        uf: formData.uf,
        capital: formData.capital,
        capitalLabel,

        // META
        fbp: meta?.fbp || "",
        fbc: meta?.fbc || "",
        fbclid: meta?.fbclid || "",

        // UTMS
        utmSource: tracking?.utm_source || "",
        utmMedium: tracking?.utm_medium || "",
        utmCampaign: tracking?.utm_campaign || "",
        utmContent: tracking?.utm_content || "",
        utmTerm: tracking?.utm_term || "",
        utmId: tracking?.utm_id || "",
      };

      console.log("CRM PAYLOAD:", crmPayload);

      const crmResponse = await fetch(
        "https://crm.helprecurso.com.br/leads/create-by-api-key",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            "x-api-key": "93wkn371eaEbl6P41RlNWhM1xrFGSXdRVjDf3AGC",
          },
          body: JSON.stringify(crmPayload),
        }
      );

      let crmResult: any = null;

      try {
        crmResult = await crmResponse.json();
      } catch {
        crmResult = null;
      }

      console.log("CRM STATUS:", crmResponse.status);
      console.log("CRM RESPONSE:", crmResult);

      if (!crmResponse.ok) {
        throw new Error(
          `Erro CRM: ${crmResult?.message ||
          crmResult?.error ||
          `Status ${crmResponse.status}`
          }`
        );
      }

      /*
        =========================================
        3. REDIRECT
        =========================================
  
        Só chega aqui se Web3Forms e CRM derem certo.
      */

      window.location.href = "https://franquias.helpmultas.com.br/obrigado";
    } catch (error) {
      console.error("ERRO COMPLETO:", error);

      setStatus({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Erro ao enviar formulário.",
      });

      // Garante que NÃO redireciona em caso de erro.
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  function AnimatedStat({
    value,
    suffix,
    label,
  }: {
    value: number;
    suffix: string;
    label: string;
  }) {
    const { ref, inView } = useInView();
    const count = useCounter(value, 2500, inView);

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="flex flex-col items-center text-center p-4"
      >
        <span className="font-body text-4xl lg:text-4xl font-bold text-gold leading-none">
          {count}
          {suffix}
        </span>

        <span className="font-display text-sm font-bold text-white mt-2">
          {label}
        </span>
      </div>
    );
  }

  /* classes compartilhadas — mesmo visual do form da PreReunião */
  const inputCls =
    "w-full min-h-[50px] border border-[#D9E1E8] rounded-[14px] px-4 bg-white text-[oklch(0.1998_0.0403_258.29)] text-[15px] outline-none placeholder-[#98a2b3] focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/20 transition-all duration-200";

  const labelCls =
    "text-[oklch(0.1998_0.0403_258.29)] text-[13px] font-bold uppercase tracking-wide";

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[oklch(0.1998_0.0403_258.29)]/60 backdrop-blur-[8px]" />

      <div className="relative z-10 container mx-auto px-6 lg:px-12 flex-1 flex items-center py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Left: Copy */}
          <div className="text-white">
            {/* Logo */}
            <div className="mb-3">
              <img
                src="/image/LogotipoHelpinho.png"
                alt="Help Multas"
                className="h-12 w-auto"
              />
            </div>

            {/* Gold line */}
            <span className="gold-line" />

            {/* Pre-headline */}
            <p className="text-gold font-body font-semibold text-sm uppercase tracking-widest mb-3">
              Oportunidade de Negócio 2026
            </p>

            {/* Main headline */}
            <h1 className="font-display text-3xl lg:text-6xl xl:text-6xl font-black leading-[1.05] mb-3">
              BILHÕES EM MULTAS TODOS OS ANOS.{" "}
              <span className="text-gold">SEU NEGÓCIO ESTÁ AQUI.</span>
            </h1>

            {/* Sub-headline */}
            <p className="font-body text-lg text-white/80 leading-relaxed mb-4 max-w-lg font-semibold">
              Não tem expertise? Sem problema. Você só vende. A gente defende. Você lucra.
            </p>

            {/* Highlight box */}
            <div className="bg-gradient-to-r from-gold/20 to-gold/10 rounded-xl p-4 mb-8 border border-gold/30">
              <p className="font-body text-sm text-gold/90 mb-2 font-semibold">
                Potencial de faturamento:
              </p>

              <p className="font-display text-3xl font-bold text-gold mb-2">
                Até R$ 500 Mil por ano
              </p>

              <p className="font-body text-sm text-white/80 font-semibold">
                Investimento a partir de R$ 30 mil
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 mb-10">
              {[
                { value: 80, suffix: "+", label: "Franquias no Brasil" },
                { value: 100, suffix: "K+", label: "Motoristas Atendidos" },
                { value: 10, suffix: "", label: "Anos de Mercado" },
                { value: 27, suffix: "", label: "Estados Atendidos" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl">
                  <AnimatedStat {...stat} />
                </div>
              ))}
            </div>

            {/* Scroll indicator */}
            <a
              href="#modelo"
              className="hidden lg:flex items-center gap-2 text-white/40 text-sm hover:text-white transition-colors"
            >
              <ChevronDown className="animate-bounce w-4 h-4" />
              <span className="font-body font-semibold">
                Role para conhecer o modelo
              </span>
            </a>
          </div>

          {/* Right: Form card — visual padronizado com LeadFormSection */}
          <div id="formulario">
            <div className="bg-white rounded-[28px] shadow-[0_32px_70px_rgba(0,0,0,0.45)] border border-[#D4A017]/20 p-7 sm:p-10">
              {/* header do card */}
              <div className="mb-7">
                <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                  <span className="gold-line !mb-0" />
                </div>

                <h2 className="font-display text-[26px] sm:text-[28px] font-black text-[oklch(0.1998_0.0403_258.29)] leading-tight mb-2">
                  Quero ser um franqueado
                </h2>

                <p className="font-body text-gray-500 text-[15px] leading-relaxed">
                  Preencha seus dados e nosso time de expansão entra em contato em até 24h.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                {/* nome */}
                <div className="flex flex-col gap-[7px]">
                  <label className={labelCls} htmlFor="hero-nome">
                    Nome completo
                  </label>

                  <input
                    id="hero-nome"
                    name="nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    className={inputCls}
                    required
                  />
                </div>

                {/* email */}
                <div className="flex flex-col gap-[7px]">
                  <label className={labelCls} htmlFor="hero-email">
                    E-mail
                  </label>

                  <input
                    id="hero-email"
                    name="email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={inputCls}
                    required
                  />
                </div>

                {/* whatsapp */}
                <div className="flex flex-col gap-[7px]">
                  <label className={labelCls} htmlFor="hero-whatsapp">
                    WhatsApp
                  </label>

                  <input
                    id="hero-whatsapp"
                    name="whatsapp"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsapp: formatWhatsapp(e.target.value),
                      })
                    }
                    maxLength={15}
                    inputMode="numeric"
                    autoComplete="tel"
                    className={inputCls}
                    required
                  />
                </div>

                {/* cidade + uf */}
                <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 110px" }}>
                  <div className="flex flex-col gap-[7px]">
                    <label className={labelCls} htmlFor="hero-cidade">
                      Cidade
                    </label>

                    <input
                      id="hero-cidade"
                      name="cidade"
                      type="text"
                      placeholder="Sua cidade"
                      value={formData.cidade}
                      onChange={(e) =>
                        setFormData({ ...formData, cidade: e.target.value })
                      }
                      className={inputCls}
                      required
                    />
                  </div>

                  {/* custom UF select */}
                  <div className="flex flex-col gap-[7px]" ref={ufRef}>
                    <label className={labelCls}>UF</label>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setUfOpen((o) => !o)}
                        className={`w-full min-h-[50px] border rounded-[14px] px-4 pr-10 text-left text-[15px] outline-none transition-all duration-200 relative
                          ${formData.uf ? "text-[oklch(0.1998_0.0403_258.29)]" : "text-[#98a2b3]"}
                          ${ufOpen
                            ? "border-[#D4A017] ring-4 ring-[#D4A017]/20 bg-white"
                            : "border-[#D9E1E8] bg-white focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/20"
                          }`}
                        aria-haspopup="listbox"
                        aria-expanded={ufOpen}
                      >
                        {formData.uf || "UF"}

                        <span
                          className={`absolute right-4 top-1/2 w-2 h-2 border-r-2 border-b-2 border-[oklch(0.1998_0.0403_258.29)]/50 transition-transform duration-200 ${ufOpen
                              ? "-translate-y-1/3 rotate-[225deg]"
                              : "-translate-y-2/3 rotate-45"
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
                            onClick={() => {
                              setFormData((p) => ({ ...p, uf: "" }));
                              setUfOpen(false);
                            }}
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
                              onClick={() => {
                                setFormData((p) => ({ ...p, uf }));
                                setUfOpen(false);
                              }}
                            >
                              {uf}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* capital — custom select */}
                <div className="flex flex-col gap-[7px]" ref={capitalRef}>
                  <label className={labelCls}>
                    Capital disponível para investimento
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCapitalOpen((o) => !o)}
                      className={`w-full min-h-[50px] border rounded-[14px] px-4 pr-10 text-left text-[15px] outline-none transition-all duration-200 relative
                        ${formData.capital ? "text-[oklch(0.1998_0.0403_258.29)]" : "text-[#98a2b3]"}
                        ${capitalOpen
                          ? "border-[#D4A017] ring-4 ring-[#D4A017]/20 bg-white"
                          : "border-[#D9E1E8] bg-white focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/20"
                        }`}
                      aria-haspopup="listbox"
                      aria-expanded={capitalOpen}
                    >
                      {CAPITAL_OPTIONS.find((o) => o.value === formData.capital)?.label ||
                        "Selecione uma faixa"}

                      <span
                        className={`absolute right-4 top-1/2 w-2 h-2 border-r-2 border-b-2 border-[oklch(0.1998_0.0403_258.29)]/50 transition-transform duration-200 ${capitalOpen
                            ? "-translate-y-1/3 rotate-[225deg]"
                            : "-translate-y-2/3 rotate-45"
                          }`}
                      />
                    </button>

                    {capitalOpen && (
                      <div
                        role="listbox"
                        className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 max-h-56 overflow-y-auto overscroll-contain rounded-[14px] border border-[#D9E1E8] bg-white shadow-[0_18px_34px_rgba(36,55,70,0.16)] p-1.5 flex flex-col gap-0.5"
                      >
                        {CAPITAL_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            role="option"
                            aria-selected={formData.capital === opt.value}
                            className={`w-full text-left px-3 py-2.5 rounded-[10px] text-[15px] transition-colors duration-150
                              ${formData.capital === opt.value
                                ? "bg-[#D4A017]/15 text-[#D4A017] font-bold"
                                : "text-[oklch(0.1998_0.0403_258.29)] hover:bg-[#edf2f6]"
                              }`}
                            onClick={() => {
                              setFormData((p) => ({ ...p, capital: opt.value }));
                              setCapitalOpen(false);
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* status message */}
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

                {/* submit */}
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