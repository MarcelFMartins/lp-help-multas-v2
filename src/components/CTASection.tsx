/*
 * CTASection — CTA Final com urgência e formulário
 * Design: Dark navy background with golden CTA image, urgency elements
 * Narrative: Última chance de converter — urgência + formulário simplificado
 */

import { useState } from "react";
import { useInView } from "../hooks/useInView";

const CTA_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663612015267/7JPeai9Kn6mqwVB3QeEreq/cta-bg-KQ56VgudmidAHQMcjAgWNg.webp";

export default function CTASection() {
  const { ref: titleRef, inView: titleInView } = useInView();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    cidade: "",
    uf: "",
    capital: "",
  });
  // Novo estado adicionado
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Novo estado para controlar o botão durante o envio
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          // 1. INSIRA SUA CHAVE AQUI:
          access_key: "1f63b8b2-e797-4e97-8308-b9b8509f6449",

          // 2. SEUS DADOS DO FORMULÁRIO:
          ...formData,

          // 3. CONFIGURAÇÕES ADICIONAIS DO WEB3FORMS:
          from_name: "Landing Page Franquias", // Nome que aparecerá como remetente
          subject: "Novo Candidato a Franqueado", // Assunto do e-mail
        }),
      });

      const result = await response.json();

      // O Web3Forms retorna um JSON com a propriedade "success" igual a true
      if (response.ok && result.success) {
        // Redirecionamento controlado pelo seu código
        window.location.href = "https://franquias.helpmultas.com.br/obrigado";
      } else {
        alert("Ocorreu um erro ao enviar. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Ocorreu um erro na conexão. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="formulario"
      className="relative py-24 overflow-hidden"
      style={{
        backgroundImage: `url(${CTA_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[oklch(0.1998_0.0403_258.29)]/90" />

      <div className="relative z-10 container mx-auto">
        <div className="max-w-3xl mx-auto text-center">

          {/* Header */}
          <div
            ref={titleRef as React.RefObject<HTMLDivElement>}
            className={`mb-12 transition-all duration-700 ${titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="gold-line mx-auto" />
            <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-3">
              Próximo Passo
            </p>
            <h2 className="font-display text-4xl lg:text-6xl font-black text-white leading-tight mb-6">
              VENHA FAZER PARTE DESSE{" "}
              <em className="text-gold not-italic">MERCADO</em>
            </h2>
            <p className="font-body text-white/70 text-lg max-w-xl mx-auto">
              Preencha o formulário e nosso time
              entrará em contato em até 24 horas.
            </p>
          </div>

          {/* Urgency indicators */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { icon: "⏰", text: "Resposta em até 24h" },
              { icon: "🔒", text: "Dados protegidos" },
              { icon: "📍", text: "Vagas por região limitadas" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 bg-[oklch(0.1998_0.0403_258.29)] rounded-full px-4 py-2 border border-white/20"
              >
                <span className="text-base">{item.icon}</span>
                <span className="font-body text-white/80 text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Simplified form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-lg mx-auto">
            <h3 className="font-display text-2xl font-bold text-[oklch(0.1998_0.0403_258.29)] mb-6">
              Quero ser um franqueado
            </h3>

            {/* Trocamos action e method pelo onSubmit */}
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
    </section>
  );
}