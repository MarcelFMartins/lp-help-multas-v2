/*
 * HeroSection — Seção hero com layout assimétrico
 * Design: Background com imagem de estrada/navy, texto à esquerda, formulário à direita
 * Typography: Fraunces display para headline, Plus Jakarta Sans para corpo
 * Colors: White text on dark navy bg, gold accents
 */

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useInView, useCounter } from "@/hooks/useInView";

const HERO_BG = "/image/fundo.webp";

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

  // Novo estado para controlar o botão durante o envio
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // TRACKING META
      const meta = window.getMetaTrackingData();

      /*
        ==================================
        PAYLOAD PADRÃO
        ==================================
      */

      const payload = {
        nome: formData.nome,
        email: formData.email,
        whatsapp: formData.whatsapp,
        cidade: formData.cidade,
        uf: formData.uf,
        capital: formData.capital,

        fbp: meta?.fbp || "",
        fbc: meta?.fbc || "",
        fbclid: meta?.fbclid || "",
      };

      /*
        ==================================
        1. WEB3FORMS
        ==================================
      */

      const web3Response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            access_key: "1f63b8b2-e797-4e97-8308-b9b8509f6449",

            ...payload,

            from_name: "Landing Page Franquias",
            subject: "Novo Candidato a Franqueado",
          }),
        }
      );

      const web3Result = await web3Response.json();

      // ERRO WEB3FORMS
      if (!web3Response.ok || !web3Result.success) {
        throw new Error("Erro Web3Forms");
      }

      /*
        ==================================
        2. CRM
        ==================================
      */

      const crmPayload = {
        fullName: formData.nome,
        phone: formData.whatsapp,
        email: formData.email,

        // META
        fbp: meta?.fbp || "",
        fbc: meta?.fbc || "",
        fbclid: meta?.fbclid || "",
      };

      const crmResponse = await fetch(
        "https://crm.helprecurso.com.br/leads/create-by-api-key",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "KsPHxXtwBQ5SfhJd7au0R_IcnmbfhJd7spj5FwbYe8Kt3iEAYi",
          },

          body: JSON.stringify(crmPayload),
        }
      );

      // ERRO CRM
      if (!crmResponse.ok) {
        throw new Error("Erro CRM");
      }

      /*
        ==================================
        3. REDIRECT
        ==================================
      */

      window.location.href =
        "https://franquias.helpmultas.com.br/obrigado";

    } catch (error) {
      console.error(error);

      alert("Erro ao enviar formulário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  function AnimatedStat({ value, suffix, label }: {
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
        <span className="font-data text-6xl lg:text-4xl font-semibold text-gold leading-none">
          {count}{suffix}
        </span>
        <span className="font-display text-sm font-bold text-white mt-2">{label}</span>
      </div>
    );
  }


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
              BILHÕES EM MULTAS TODOS OS ANOS. <span className="text-gold">SEU NEGÓCIO ESTÁ AQUI.</span>
            </h1>

            {/* Sub-headline */}
            <p className="font-body text-lg text-white/80 leading-relaxed mb-4 max-w-lg font-semibold">
              Não tem expertise? Sem problema. Você só vende. A gente defende. Você lucra.
            </p>

            {/* Highlight box */}
            <div className="bg-gradient-to-r from-gold/20 to-gold/10 rounded-xl p-4 mb-8 border border-gold/30">
              <p className="font-body text-sm text-gold/90 mb-2 font-semibold">Potencial de faturamento:</p>
              <p className="font-display text-3xl font-bold text-gold mb-2">Até R$ 500 Mil por ano</p>
              <p className="font-body text-sm text-white/80 font-semibold">Investimento a partir de R$ 30 mil</p>
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
            <a href="#modelo" className="hidden lg:flex items-center gap-2 text-white/40 text-sm hover:text-white transition-colors">
              <ChevronDown className="animate-bounce w-4 h-4" />
              <span className="font-body font-semibold">Role para conhecer o modelo</span>
            </a>
          </div>


          {/* Right: Form card */}
          <div id="formulario">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-white/10">
              <div className="mb-6">
                <span className="gold-line" />
                <h2 className="font-display text-2xl font-bold text-[oklch(0.1998_0.0403_258.29)] leading-tight">
                  Quero ser um franqueado
                </h2>
                <p className="font-body text-sm text-[oklch(0.50_0.02_250)] mt-1">
                  Preencha e nosso time entra em contato em até 24h
                </p>
              </div>

              {/* Trocamos action e method pelo onSubmit do React */}
              <form
                onSubmit={handleSubmit}
                className="space-y-3"
              >
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome completo"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.8371_0.1715_85.23)] focus:border-transparent transition-all"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Melhor e-mail"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.8371_0.1715_85.23)] focus:border-transparent transition-all"
                />

                <input
                  type="tel"
                  name="whatsapp"
                  placeholder="WhatsApp com DDD"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.8371_0.1715_85.23)] focus:border-transparent transition-all"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="cidade"
                    placeholder="Cidade"
                    required
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.8371_0.1715_85.23)] focus:border-transparent transition-all"
                  />
                  <select
                    name="uf"
                    required
                    value={formData.uf}
                    onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.8371_0.1715_85.23)] focus:border-transparent transition-all text-gray-500"
                  >
                    <option value="">UF</option>
                    {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>

                <select
                  name="investimento"
                  required
                  value={formData.capital}
                  onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.8371_0.1715_85.23)] focus:border-transparent transition-all text-gray-500"
                >
                  <option value="">Capital disponível para investimento</option>
                  <option value="10.000">Mais de R$ 10 mil</option>
                  <option value="30.000">Mais de R$ 30 mil</option>
                  <option value="50.000">Mais de R$ 50 mil</option>
                  <option value="100.000">Mais de R$ 100 mil</option>
                </select>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-lg font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ background: "oklch(0.8371 0.1715 85.23)", color: "oklch(0.1998 0.0403 258.29)" }}
                >
                  {isSubmitting ? "Enviando..." : "Quero ser um franqueado →"}
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