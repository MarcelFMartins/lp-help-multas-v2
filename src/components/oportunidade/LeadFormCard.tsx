/*
 * LeadFormCard — card de formulário da LP /oportunidade
 * Mesmo visual do root, sem campos de UF/Cidade.
 */

import { useState, useEffect, useRef } from "react";
import {
  CAPITAL_OPTIONS,
  formatWhatsapp,
  onlyNumbers,
  submitOportunidadeLead,
} from "@/lib/oportunidadeLead";
import { logEvent } from "@/lib/logger";

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

  return (
    <div className="flex flex-col gap-[7px]" ref={ref}>
      <span className="text-[oklch(0.1998_0.0403_258.29)] text-[13px] font-bold uppercase tracking-wide">{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`w-full min-h-[50px] border rounded-[14px] px-4 pr-10 text-left text-[15px] outline-none transition-all duration-200 relative
            ${value ? "text-[oklch(0.1998_0.0403_258.29)]" : "text-[#98a2b3]"}
            ${open ? "border-[#D4A017] ring-4 ring-[#D4A017]/20 bg-white" : "border-[#D9E1E8] bg-white"}`}
        >
          {selected?.label || placeholder}
          <span
            className={`absolute right-4 top-1/2 w-2 h-2 border-r-2 border-b-2 border-[oklch(0.1998_0.0403_258.29)]/50 transition-transform duration-200 ${open ? "-translate-y-1/3 rotate-[225deg]" : "-translate-y-2/3 rotate-45"}`}
          />
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
                    : "text-[oklch(0.1998_0.0403_258.29)] hover:bg-[#edf2f6]"}`}
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

const inputCls =
  "w-full min-h-[50px] border border-[#D9E1E8] rounded-[14px] px-4 bg-white text-[oklch(0.1998_0.0403_258.29)] text-[15px] outline-none placeholder-[#98a2b3] focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/20 transition-all duration-200";

const labelCls =
  "text-[oklch(0.1998_0.0403_258.29)] text-[13px] font-bold uppercase tracking-wide";

interface Props {
  /** Prefixo dos ids dos inputs ("hero", "cta") */
  idPrefix: string;
  /** Nome do formulário nos logs/planilha */
  origem: string;
  /** Classes do card (padding/sombra) */
  className: string;
  Heading: "h2" | "h3";
}

export default function LeadFormCard({ idPrefix, origem, className, Heading }: Props) {
  const [formData, setFormData] = useState({ nome: "", email: "", whatsapp: "", capital: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    for (const key of ["nome", "email", "whatsapp", "capital"] as const) {
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
      await submitOportunidadeLead(formData, origem);
    } catch (error) {
      console.error("ERRO COMPLETO:", error);
      logEvent(origem, "error", error instanceof Error ? error.message : "Erro ao enviar formulário", {
        stack: error instanceof Error ? error.stack : undefined,
      });
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Erro ao enviar formulário.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-[28px] border border-[#D4A017]/20 ${className}`}>
      <div className="mb-6">
        <span className="gold-line !mb-0 block mb-4" />
        <Heading className="font-display text-[26px] sm:text-[28px] font-black text-[oklch(0.1998_0.0403_258.29)] leading-tight mb-2">
          Quero ser um franqueado
        </Heading>
        <p className="font-body text-gray-500 text-[15px] leading-relaxed">
          Preencha seus dados e nosso time de expansão entra em contato em até 24h.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-[7px]">
          <label className={labelCls} htmlFor={`${idPrefix}-nome`}>Nome completo *</label>
          <input
            id={`${idPrefix}-nome`}
            name="nome"
            type="text"
            placeholder="Digite seu nome completo"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className={inputCls}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-[7px]">
            <label className={labelCls} htmlFor={`${idPrefix}-email`}>E-mail *</label>
            <input
              id={`${idPrefix}-email`}
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
            <label className={labelCls} htmlFor={`${idPrefix}-whatsapp`}>WhatsApp *</label>
            <input
              id={`${idPrefix}-whatsapp`}
              name="whatsapp"
              type="tel"
              placeholder="(00) 00000-0000"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsapp(e.target.value) })}
              maxLength={19}
              inputMode="numeric"
              autoComplete="tel"
              className={inputCls}
              required
            />
          </div>
        </div>

        <CustomSelect
          label="Capital disponível para investimento *"
          placeholder="Selecione uma faixa"
          options={CAPITAL_OPTIONS}
          value={formData.capital}
          onChange={(v) => setFormData((p) => ({ ...p, capital: v }))}
        />

        {status && (
          <div
            className={`rounded-[14px] px-4 py-3 text-[14px] leading-[1.5] border font-body
              ${status.type === "error"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
            role="alert"
            aria-live="polite"
          >
            {status.text}
          </div>
        )}

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
  );
}
