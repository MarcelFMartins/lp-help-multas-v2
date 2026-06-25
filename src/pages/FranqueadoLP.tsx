/*
 * FranqueadoLP — LP de venda de franquia Help Multas
 * v5: todos os emojis substituídos por SVGs inline
 */

import { useState, useEffect, useRef } from "react";
import { useInView } from "../hooks/useInView";
import { useScrollTracker } from "../hooks/useScrollTracker";

/* ─── Color tokens ─── */
const NAVY = "oklch(0.1998 0.0403 258.29)";
const GOLD = "oklch(0.8371 0.1715 85.23)";

/* ════════════════════════════════════════════════════════════
   SVG ICON LIBRARY — todos stroke-based, sem emojis
════════════════════════════════════════════════════════════ */
const S = { strokeWidth:"2", strokeLinecap:"round" as const, strokeLinejoin:"round" as const, fill:"none", stroke:"currentColor" };

function IcTrophy({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
function IcDollar({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function IcTrendingUp({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function IcMapPin({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IcCheckCircle({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function IcRocket({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
function IcStore({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
    </svg>
  );
}
function IcStar({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function IcHeart({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
function IcTarget({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function IcRepeat({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}
function IcBriefcase({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
function IcZap({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function IcBarChart({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function IcLayers({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
function IcMegaphone({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}
function IcUsers({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IcLock({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...S}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IcCheck({ className="w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ─── Form options ─── */
const UF_OPTIONS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];
const CAPITAL_OPTIONS = [
  { value: "30.000", label: "De R$ 0 a R$ 30 mil (não tenho condições de adquirir a franquia atualmente)" },
  { value: "50.000", label: "De R$ 30 mil a R$ 50 mil" },
  { value: "70.000", label: "De R$ 50 mil a R$ 70 mil" },
  { value: "100.000", label: "Acima de R$ 70 mil" },
];
const OCUPACAO_OPTIONS = [
  { value:"clt",             label:"Empregado (CLT)"          },
  { value:"autonomo",        label:"Autônomo / Freelancer"     },
  { value:"empresario",      label:"Empresário / Empreendedor" },
  { value:"funcionario_pub", label:"Funcionário Público"       },
  { value:"desempregado",    label:"Desempregado"              },
  { value:"estudante",       label:"Estudante"                 },
  { value:"aposentado",      label:"Aposentado / Pensionista"  },
];
const HORARIO_OPTIONS = [
  { value:"manha",    label:"Manhã (8h – 12h)"  },
  { value:"tarde",    label:"Tarde (12h – 18h)" },
  { value:"noite",    label:"Noite (18h – 21h)" },
  { value:"qualquer", label:"Qualquer horário"   },
];

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
function CustomSelect({ label, placeholder, options, value, onChange }: {
  label: string; placeholder: string; options: SelectOpt[]; value: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const selected = options.find((o) => o.value === value);
  const lCls = "text-[oklch(0.1998_0.0403_258.29)] text-[13px] font-bold uppercase tracking-wide";
  return (
    <div className="flex flex-col gap-[7px]" ref={ref}>
      <span className={lCls}>{label}</span>
      <div className="relative">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}
          className={`w-full min-h-[50px] border rounded-[14px] px-4 pr-10 text-left text-[15px] outline-none transition-all duration-200 relative
            ${value ? "text-[oklch(0.1998_0.0403_258.29)]" : "text-[#98a2b3]"}
            ${open ? "border-[#D4A017] ring-4 ring-[#D4A017]/20 bg-white" : "border-[#D9E1E8] bg-white"}`}>
          {selected?.label || placeholder}
          <span className={`absolute right-4 top-1/2 w-2 h-2 border-r-2 border-b-2 border-[oklch(0.1998_0.0403_258.29)]/50 transition-transform duration-200 ${open ? "-translate-y-1/3 rotate-[225deg]" : "-translate-y-2/3 rotate-45"}`} />
        </button>
        {open && (
          <div role="listbox" className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 max-h-56 overflow-y-auto overscroll-contain rounded-[14px] border border-[#D9E1E8] bg-white shadow-[0_18px_34px_rgba(36,55,70,0.16)] p-1.5 flex flex-col gap-0.5">
            <button type="button" className="w-full text-left px-3 py-2.5 rounded-[10px] text-[#98a2b3] text-[15px] hover:bg-[#edf2f6]" onClick={() => { onChange(""); setOpen(false); }}>{placeholder}</button>
            {options.map((opt) => (
              <button key={opt.value} type="button" role="option" aria-selected={value === opt.value}
                className={`w-full text-left px-3 py-2.5 rounded-[10px] text-[15px] transition-colors duration-150 ${value === opt.value ? "bg-[#D4A017]/15 text-[#D4A017] font-bold" : "text-[oklch(0.1998_0.0403_258.29)] hover:bg-[#edf2f6]"}`}
                onClick={() => { onChange(opt.value); setOpen(false); }}>{opt.label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── LeadForm ─── */
function LeadForm() {
  const [formData, setFormData] = useState({ nome:"", email:"", whatsapp:"", cidade:"", uf:"", capital:"", ocupacao:"", horario:"" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type:"error"|"success"; text:string }|null>(null);
  const [ufOpen, setUfOpen] = useState(false);
  const ufRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) { if (ufRef.current && !ufRef.current.contains(e.target as Node)) setUfOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus(null);
    const required = ["nome","email","whatsapp","cidade","uf","capital","ocupacao","horario"];
    for (const key of required) { if (!formData[key as keyof typeof formData]) { setStatus({ type:"error", text:"Preencha todos os campos antes de continuar." }); return; } }
    const wa = onlyNumbers(formData.whatsapp);
    if (wa.length < 10 || wa.length > 11) { setStatus({ type:"error", text:"WhatsApp inválido. Digite DDD + número." }); return; }
    setIsSubmitting(true);
    try {
      const meta     = window.getMetaTrackingData();
      const tracking = window.getTrackingData();
      const capitalLabel  = CAPITAL_OPTIONS.find((o) => o.value === formData.capital)?.label  || formData.capital;
      const ocupacaoLabel = OCUPACAO_OPTIONS.find((o) => o.value === formData.ocupacao)?.label || formData.ocupacao;
      const horarioLabel  = HORARIO_OPTIONS.find((o) => o.value === formData.horario)?.label   || formData.horario;
      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method:"POST", headers:{"Content-Type":"application/json",Accept:"application/json"},
        body: JSON.stringify({ access_key:"1f63b8b2-e797-4e97-8308-b9b8509f6449", from_name:"LP Franqueado", subject:"Novo Candidato a Franqueado — LP Franqueado", nome:formData.nome, email:formData.email, whatsapp:formData.whatsapp, cidade:formData.cidade, uf:formData.uf, capital:capitalLabel, ocupacao:ocupacaoLabel, horario:horarioLabel, fbp:meta?.fbp||"", fbc:meta?.fbc||"", fbclid:meta?.fbclid||"" }),
      });
      const web3Result = await web3Response.json();
      if (!web3Response.ok || !web3Result.success) throw new Error("Erro Web3Forms");
      try {
        await fetch("https://crm.helprecurso.com.br/leads/create-by-api-key", {
          method:"POST", headers:{"Content-Type":"application/json","x-api-key":"93wkn371eaEbl6P41RlNWhM1xrFGSXdRVjDf3AGC"},
          body: JSON.stringify({ fullName:formData.nome, phone:formData.whatsapp, email:formData.email, capital:formData.capital, capitalLabel, fbp:meta?.fbp||"", fbc:meta?.fbc||"", fbclid:meta?.fbclid||"", utmSource:tracking?.utm_source||"", utmMedium:tracking?.utm_medium||"", utmCampaign:tracking?.utm_campaign||"", utmContent:tracking?.utm_content||"", utmTerm:tracking?.utm_term||"", utmId:tracking?.utm_id||"" }),
        });
      } catch (crmError) { console.error("Erro CRM:", crmError); }
      window.location.href = "https://franquias.helpmultas.com.br/obrigado";
    } catch (error) { console.error(error); setStatus({ type:"error", text:"Erro ao enviar formulário. Tente novamente." }); }
    finally { setIsSubmitting(false); }
  };

  const inputCls = "w-full min-h-[50px] border border-[#D9E1E8] rounded-[14px] px-4 bg-white text-[oklch(0.1998_0.0403_258.29)] text-[15px] outline-none placeholder-[#98a2b3] focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/20 transition-all duration-200";
  const labelCls = "text-[oklch(0.1998_0.0403_258.29)] text-[13px] font-bold uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-[7px]">
        <label className={labelCls} htmlFor="lp-nome">Nome completo</label>
        <input id="lp-nome" name="nome" type="text" placeholder="Digite seu nome completo" value={formData.nome} onChange={(e) => setFormData({...formData, nome:e.target.value})} className={inputCls} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-[7px]">
          <label className={labelCls} htmlFor="lp-email">E-mail</label>
          <input id="lp-email" name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email:e.target.value})} className={inputCls} required />
        </div>
        <div className="flex flex-col gap-[7px]">
          <label className={labelCls} htmlFor="lp-whatsapp">WhatsApp</label>
          <input id="lp-whatsapp" name="whatsapp" type="tel" placeholder="(00) 00000-0000" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp:formatWhatsapp(e.target.value)})} maxLength={15} inputMode="numeric" autoComplete="tel" className={inputCls} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-[7px]">
          <label className={labelCls} htmlFor="lp-cidade">Cidade</label>
          <input id="lp-cidade" name="cidade" type="text" placeholder="Sua cidade" value={formData.cidade} onChange={(e) => setFormData({...formData, cidade:e.target.value})} className={inputCls} required />
        </div>
        <div className="flex flex-col gap-[7px]" ref={ufRef}>
          <label className={labelCls}>UF</label>
          <div className="relative">
            <button type="button" onClick={() => setUfOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={ufOpen}
              className={`w-full min-h-[50px] border rounded-[14px] px-4 pr-10 text-left text-[15px] outline-none transition-all duration-200 relative ${formData.uf?"text-[oklch(0.1998_0.0403_258.29)]":"text-[#98a2b3]"} ${ufOpen?"border-[#D4A017] ring-4 ring-[#D4A017]/20 bg-white":"border-[#D9E1E8] bg-white"}`}>
              {formData.uf || "UF"}
              <span className={`absolute right-4 top-1/2 w-2 h-2 border-r-2 border-b-2 border-[oklch(0.1998_0.0403_258.29)]/50 transition-transform duration-200 ${ufOpen?"-translate-y-1/3 rotate-[225deg]":"-translate-y-2/3 rotate-45"}`} />
            </button>
            {ufOpen && (
              <div role="listbox" className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 max-h-56 overflow-y-auto overscroll-contain rounded-[14px] border border-[#D9E1E8] bg-white shadow-[0_18px_34px_rgba(36,55,70,0.16)] p-1.5 flex flex-col gap-0.5">
                <button type="button" className="w-full text-left px-3 py-2.5 rounded-[10px] text-[#98a2b3] text-[15px] hover:bg-[#edf2f6]" onClick={() => {setFormData((p)=>({...p,uf:""}));setUfOpen(false);}}>Selecione</button>
                {UF_OPTIONS.map((uf) => (
                  <button key={uf} type="button" role="option" aria-selected={formData.uf===uf}
                    className={`w-full text-left px-3 py-2.5 rounded-[10px] text-[15px] transition-colors duration-150 ${formData.uf===uf?"bg-[#D4A017]/15 text-[#D4A017] font-bold":"text-[oklch(0.1998_0.0403_258.29)] hover:bg-[#edf2f6]"}`}
                    onClick={() => {setFormData((p)=>({...p,uf}));setUfOpen(false);}}>{uf}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <CustomSelect label="Capital disponível para investimento" placeholder="Selecione uma faixa" options={CAPITAL_OPTIONS} value={formData.capital} onChange={(v) => setFormData((p)=>({...p,capital:v}))} />
      <div className="grid grid-cols-2 gap-3">
        <CustomSelect label="Ocupação atual" placeholder="Selecione" options={OCUPACAO_OPTIONS} value={formData.ocupacao} onChange={(v) => setFormData((p)=>({...p,ocupacao:v}))} />
        <CustomSelect label="Melhor horário" placeholder="Selecione" options={HORARIO_OPTIONS} value={formData.horario} onChange={(v) => setFormData((p)=>({...p,horario:v}))} />
      </div>
      {status && (
        <div className={`rounded-[14px] px-4 py-3 text-[14px] leading-[1.5] border font-body ${status.type==="error"?"bg-red-50 text-red-700 border-red-200":"bg-emerald-50 text-emerald-700 border-emerald-200"}`} role="alert" aria-live="polite">{status.text}</div>
      )}
      <button type="submit" disabled={isSubmitting} className="w-full min-h-[54px] mt-1 rounded-[14px] bg-gold text-[oklch(0.1998_0.0403_258.29)] font-body font-black text-[15px] uppercase tracking-wide shadow-[0_14px_24px_rgba(212,160,23,0.28)] hover:bg-gold/80 hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
        {isSubmitting ? "Enviando dados..." : "Quero abrir minha franquia →"}
      </button>
      <p className="text-center text-xs text-gray-400 font-body">Análise gratuita · Sem compromisso · Resposta em até 24h</p>
    </form>
  );
}

/* ════════════════════════════════════════════════════════════
   ANNOUNCEMENT BAR
════════════════════════════════════════════════════════════ */
function AnnouncementBarLP() {
  const items: { icon: React.ReactNode; text: string }[] = [
    { icon: <IcTrophy className="w-3.5 h-3.5 shrink-0" />, text: "OPORTUNIDADE DE FRANQUIA 2026" },
    { icon: <IcDollar className="w-3.5 h-3.5 shrink-0" />, text: "Investimento a partir de R$ 30 mil" },
    { icon: <IcTrendingUp className="w-3.5 h-3.5 shrink-0" />, text: "Payback médio: 6 a 12 meses" },
    { icon: <IcMapPin className="w-3.5 h-3.5 shrink-0" />, text: "Vagas limitadas por região" },
    { icon: <IcCheckCircle className="w-3.5 h-3.5 shrink-0" />, text: "Modelo 100% Done-For-You" },
    { icon: <IcRocket className="w-3.5 h-3.5 shrink-0" />, text: "80+ franqueados ativos no Brasil" },
  ];
  const all = [...items, ...items];

  return (
    <div className="w-full overflow-hidden py-2.5 relative z-50" style={{ background: GOLD }}>
      <div className="flex gap-10 whitespace-nowrap ticker-track" style={{ width: "max-content" }}>
        {all.map((item, i) => (
          <span key={i} className="font-body font-black text-[13px] uppercase tracking-wider flex items-center gap-2 shrink-0" style={{ color: NAVY }}>
            {item.icon}
            {item.text}
            <span className="opacity-40 text-base ml-1">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════════════════ */
function HeroLP() {
  return (
    <section id="inicio" data-section="hero" className="relative overflow-hidden" style={{ background: NAVY }}>
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
      />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background:`radial-gradient(circle, ${GOLD}15 0%, transparent 65%)`, transform:"translate(30%, -30%)" }}
      />

      {/* Nav */}
      <div className="relative z-10 w-full pt-5 pb-2">
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <a href="#inicio">
            <img src="/image/LogotipoHelpinho.png" alt="Help Multas" className="h-11 w-auto" />
          </a>
          <div className="hidden md:flex items-center gap-7">
            {[
              { label:"O Negócio",    href:"#mercado"      },
              { label:"Por que nós",  href:"#diferenciais" },
              { label:"Modalidades",  href:"#modelo"       },
              { label:"Depoimentos",  href:"#depoimentos"  },
            ].map((item) => (
              <a key={item.label} href={item.href} className="font-body text-sm font-medium text-white/55 hover:text-white transition-colors duration-200">{item.label}</a>
            ))}
          </div>
          <a href="#formulario" className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-lg font-body font-black text-xs uppercase tracking-wider transition-all duration-200 hover:opacity-90 shadow-[0_4px_14px_rgba(212,160,23,0.35)]" style={{ background:GOLD, color:NAVY }}>
            Quero ser franqueado
          </a>
        </div>
      </div>

      {/* Content grid — form first on mobile */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-8 pb-24">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_480px] gap-10 lg:gap-14 items-start">

          {/* FORM — order-1 mobile */}
          <div className="order-1 lg:order-2 w-full">
            <div className="rounded-[28px] p-7 sm:p-9 shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
              style={{ background:"white", border:`2px solid ${GOLD}35` }}>
              <div className="mb-5">
                {/* Badge sem emoji */}
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4"
                  style={{ background:`${GOLD}15`, border:`1px solid ${GOLD}30` }}>
                  <IcStore className="w-3 h-3" />
                  <span className="text-[11px] font-black uppercase tracking-widest" style={{ color:GOLD }}>
                    Oportunidade de Franquia
                  </span>
                </div>
                <h2 className="font-display text-[24px] sm:text-[26px] font-black leading-tight mb-1.5" style={{ color:NAVY }}>
                  Solicite uma análise gratuita
                </h2>
                <p className="font-body text-gray-500 text-[14px] leading-relaxed">
                  Nosso consultor de expansão entra em contato em até 24h com um plano personalizado para você.
                </p>
              </div>
              <LeadForm />
            </div>
          </div>

          {/* COPY — order-2 mobile */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <h1 className="font-display font-black text-white leading-[1.02] tracking-tight mb-5 py-15"
              style={{ fontSize:"clamp(2.1rem, 4.8vw, 3.6rem)" }}>
              Abra sua{" "}
              <em className="not-italic" style={{ color:GOLD }}>franquia</em>{" "}
              e fature com o mercado de{" "}
              <em className="not-italic" style={{ color:GOLD }}>R$ 45 bilhões</em>{" "}
              em multas de trânsito
            </h1>

            <p className="font-body text-white/65 text-lg leading-relaxed mb-8 max-w-lg">
              Modelo de negócio comprovado: você vende, nós entregamos a defesa jurídica.
              Sem precisar ser advogado, sem estoque, sem complicação.
              <strong className="text-white/90"> 80+ franqueados faturando em 27 estados.</strong>
            </p>

            {/* ROI cards */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label:"Investimento",    value:"R$ 30 mil",  sub:"a partir de"      },
                { label:"Payback médio",   value:"6–12 meses", sub:"retorno estimado"  },
                { label:"Suporte", value:"360",    sub:"para você"       },
              ].map((card) => (
                <div key={card.label} className="flex flex-col rounded-2xl p-4 border text-center text-gold"
                  style={{ background:"rgba(255,255,255,0.05)", borderColor:`${GOLD}25` }}>
                  <span className="font-body text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color:`${GOLD}90` }}>
                    {card.label}
                  </span>
                  <span className="font-display text-xl font-black leading-none mb-0.5" style={{ color:GOLD }}>
                    {card.value}
                  </span>
                  <span className="font-body text-[10px] text-white/40">{card.sub}</span>
                </div>
              ))}
            </div>

            {/* Trust bar — SVG check icons */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {[
                "80+ franqueados ativos",
                "27 estados",
                "+10 anos de mercado",
                "Análise gratuita",
              ].map((t) => (
                <span key={t} className="flex items-center gap-1.5 font-body text-sm font-semibold text-white/55">
                  <IcCheck className="w-3.5 h-3.5 shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height:"60px" }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full" fill="oklch(0.96 0.01 75)">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   TICKER — prova social de franqueados
════════════════════════════════════════════════════════════ */
function TickerLP() {
  const items: { icon: React.ReactNode; text: string }[] = [
    { icon: <IcStar className="w-3.5 h-3.5 shrink-0" />,       text: "Vinicius · Curitiba-PR · Franqueado ativo" },
    { icon: <IcTrendingUp className="w-3.5 h-3.5 shrink-0" />, text: "Dani · Joinville-SC · +R$ 1M faturado em 1 ano" },
    { icon: <IcRocket className="w-3.5 h-3.5 shrink-0" />,     text: "Kelly · Criciúma-SC · Faturando acima das expectativas" },
    { icon: <IcCheckCircle className="w-3.5 h-3.5 shrink-0" />,text: "André · Curitiba-PR · Modelo que realmente funciona" },
    { icon: <IcTrophy className="w-3.5 h-3.5 shrink-0" />,     text: "Raphael · Joinville-SC · Todo suporte que você precisa" },
    { icon: <IcHeart className="w-3.5 h-3.5 shrink-0" />,      text: "Alisson · Caçador-SC · Mais tempo com a família" },
    { icon: <IcMapPin className="w-3.5 h-3.5 shrink-0" />,     text: "+80 franqueados · Ativos em 27 estados do Brasil" },
    { icon: <IcTarget className="w-3.5 h-3.5 shrink-0" />,     text: "Modelo Done-For-You · Sem precisar ser advogado" },
  ];
  const all = [...items, ...items];

  return (
    <div className="w-full overflow-hidden py-3 border-y" style={{ background:"oklch(0.98 0.005 75)", borderColor:"oklch(0.88 0.01 75)" }}>
      <div className="flex gap-12 whitespace-nowrap ticker-track" style={{ width:"max-content" }}>
        {all.map((item, i) => (
          <span key={i} className="font-body text-[13px] font-semibold shrink-0 flex items-center gap-2.5" style={{ color:NAVY }}>
            <span style={{ color:GOLD }}>{item.icon}</span>
            {item.text}
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:GOLD, opacity:0.4 }} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION 2 — O NEGÓCIO
════════════════════════════════════════════════════════════ */
function MarketLP() {
  const { ref, inView } = useInView();

  const insightCards = [
    { Icon: IcTrendingUp, title:"Demanda que só cresce",   text:"Com a expansão das câmeras de fiscalização, o volume de multas eletrônicas aumenta todo ano, garantindo fluxo constante de clientes em potencial." },
    { Icon: IcRepeat,     title:"Receita recorrente",      text:"Clientes voltam para novas multas, renovação de CNH e indicam amigos e familiares. Sua base de clientes se multiplica naturalmente." },
    { Icon: IcTrophy,     title:"Mercado sem líder claro", text:"O segmento ainda está se consolidando. Entrar agora significa construir posição de liderança regional com suporte de uma rede nacional." },
  ];

  return (
    <section id="mercado" data-section="mercado" className="relative py-24" style={{ background:"oklch(0.96 0.01 75)" }}>
      <div className="container mx-auto px-6 lg:px-12">
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color:GOLD }}>O Negócio</p>
          <h2 className="font-display text-4xl lg:text-5xl font-black leading-tight max-w-3xl mx-auto" style={{ color:NAVY }}>
            Por que o mercado de multas é{" "}
            <span className="text-gold italic">um dos negócios mais lucrativos</span>{" "}
            do Brasil?
          </h2>
          <p className="font-body text-lg mt-5 max-w-2xl mx-auto" style={{ color:`${NAVY}80` }}>
            86 milhões de multas por ano, 95% sem defesa, mercado de R$ 45 bilhões.
            Cada multa não contestada é uma venda que você poderia ter feito.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-14">
          {/* Problema */}
          <div className="rounded-2xl p-8 border" style={{ background:"white", borderColor:"oklch(0.88 0.01 75)" }}>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5 text-[11px] font-black uppercase tracking-widest" style={{ background:"#FFF3F3", color:"#D63B3B", border:"1px solid #FECACA" }}>
              O problema no mercado
            </div>
            <div className="flex flex-col gap-5">
              {[
                { stat:"95%",    desc:"dos motoristas multados não recorrem, por desconhecimento ou burocracia" },
                { stat:"86M",    desc:"multas aplicadas por ano no Brasil, número que cresce com a fiscalização eletrônica" },
                { stat:"R$45bi", desc:"movimentados em multas de trânsito por ano, a maioria sem contestação" },
              ].map((item) => (
                <div key={item.stat} className="flex items-start gap-4">
                  <span className="font-display text-3xl font-black shrink-0 leading-none" style={{ color:"#D63B3B" }}>{item.stat}</span>
                  <p className="font-body text-sm leading-relaxed pt-1" style={{ color:`${NAVY}80` }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Oportunidade */}
          <div className="rounded-2xl p-8 border" style={{ background:"white", borderColor:`${GOLD}40`, boxShadow:`0 8px 40px ${GOLD}12` }}>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5 text-[11px] font-black uppercase tracking-widest" style={{ background:`${GOLD}15`, color:GOLD, border:`1px solid ${GOLD}40` }}>
              A sua oportunidade como franqueado
            </div>
            <div className="flex flex-col gap-5">
              {[
                { stat:"60-70%", desc:"de taxa média de sucesso nos recursos, seu principal argumento de venda" },
                { stat:"R$ 30k", desc:"de investimento inicial para ter um negócio em mercado bilionário e com demanda crescente" },
                { stat:"6–12m",  desc:"de payback estimado, retorno do investimento inicial mais rápido que a maioria das franquias" },
              ].map((item) => (
                <div key={item.stat} className="flex items-start gap-4">
                  <span className="font-display text-3xl font-black shrink-0 leading-none" style={{ color:GOLD }}>{item.stat}</span>
                  <p className="font-body text-sm leading-relaxed pt-1" style={{ color:`${NAVY}80` }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {insightCards.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-2xl p-7 border transition-all duration-300 group hover:border-[#D4A017]/50 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(212,160,23,0.12)]" style={{ background:"white", borderColor:"oklch(0.88 0.01 75)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-[#D4A017]/15" style={{ background:"oklch(0.94 0.005 75)" }}>
                <Icon className="w-5 h-5 group-hover:text-gold transition-colors"  />
              </div>
              <h3 className="font-display text-xl font-bold mb-2 group-hover:text-gold transition-colors" style={{ color:NAVY }}>{title}</h3>
              <p className="font-body text-sm leading-relaxed" style={{ color:`${NAVY}80` }}>{text}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-8 font-body" style={{ color:`${NAVY}40` }}>Fontes: Denatran, SENATRAN, Infosiga, PRF</p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION 3 — POR QUE A FRANQUIA HELP MULTAS
════════════════════════════════════════════════════════════ */
function WhyLP() {
  const { ref, inView } = useInView();

  const items: { Icon: React.FC<{ className?: string }>; text: string }[] = [
    { Icon: IcBriefcase,  text:"Modelo Done-For-You: você cuida das vendas, nós cuidamos de tudo que é técnico e jurídico" },
    { Icon: IcZap,        text:"Inicie sem experiência prévia em direito de trânsito, nosso treinamento te prepara do zero" },
    { Icon: IcRepeat,     text:"Receita recorrente garantida: clientes fidelizados voltam e indicam, sua carteira cresce sozinha" },
    { Icon: IcBarChart,   text:"Sistema próprio de gestão: acompanhe cada processo, recebimento e resultado em tempo real" },
    { Icon: IcDollar,     text:"Payback médio de 6 a 12 meses, um dos retornos mais rápidos no mercado de franquias" },
    { Icon: IcLayers,     text:"Operação enxuta: sem estoque, sem produto físico, estrutura mínima, overhead baixíssimo" },
    { Icon: IcMegaphone,  text:"Marketing nacional pronto: materiais, campanhas e estratégias entregues pela franqueadora" },
    { Icon: IcUsers,      text:"Equipe de suporte dedicada: jurídico, comercial e operacional ao seu lado todos os dias" },
  ];

  return (
    <section id="diferenciais" data-section="diferenciais" className="relative py-24 overflow-hidden" style={{ background:NAVY }}>
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background:`radial-gradient(circle, ${GOLD}10 0%, transparent 70%)`, transform:"translate(40%, -50%)" }}
      />
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div ref={ref as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-700 ${inView?"opacity-100 translate-x-0":"opacity-0 -translate-x-8"}`}>
            <span className="gold-line" />
            <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color:GOLD }}>Por que a Help Multas?</p>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
              Por que essa é uma das{" "}
              <em className="not-italic" style={{ color:GOLD }}>melhores franquias</em>{" "}
              do Brasil?
            </h2>
            <p className="font-body text-white/65 text-lg leading-relaxed mb-8">
              Modelo validado, suporte completo e mercado gigante. Você não precisa reinventar nada,
              só precisa seguir o sistema que já funciona para 80+ franqueados.
            </p>
            <a href="#formulario"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-body font-black text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px] shadow-[0_12px_28px_rgba(212,160,23,0.30)]"
              style={{ background:GOLD, color:NAVY }}>
              Quero abrir minha franquia →
            </a>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {items.map(({ Icon, text }, i) => (
              <div key={i}
                className={`flex items-start gap-4 rounded-xl px-5 py-4 border transition-all duration-700 ${inView?"opacity-100 translate-x-0":"opacity-0 translate-x-8"}`}
                style={{ background:"rgba(255,255,255,0.04)", borderColor:"rgba(255,255,255,0.08)", transitionDelay:`${i*55}ms` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background:`${GOLD}20` }}>
                  <Icon className="w-4 h-4"  />
                </div>
                <span className="font-body text-[15px] text-white/80 leading-snug">{text}</span>
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
    <section data-section="video" className="relative py-24 overflow-hidden" style={{ background:"oklch(0.96 0.01 75)" }}>
      <div className="container mx-auto px-6 lg:px-12">
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color:GOLD }}>Entenda o modelo de negócio</p>
          <h2 className="font-display text-4xl lg:text-5xl font-black leading-tight max-w-3xl mx-auto" style={{ color:NAVY }}>
            Veja como funciona o negócio que já transformou 80+ vidas
          </h2>
          <p className="font-body text-lg mt-4 max-w-2xl mx-auto" style={{ color:`${NAVY}80` }}>
            Assista ao vídeo e entenda por que a franquia Help Multas é um dos negócios mais inteligentes para empreender hoje no Brasil.
          </p>
        </div>
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(10,22,40,0.2)]">
          <div className="relative w-full" style={{ paddingBottom:"56.25%" }}>
            <iframe className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/7QaDuGApFig?rel=0&modestbranding=1"
              title="Franquia Help Multas — Como funciona o negócio"
              frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>
        <div className="text-center mt-10">
          <a href="#formulario" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px] shadow-[0_12px_28px_rgba(212,160,23,0.25)]" style={{ background:GOLD, color:NAVY }}>
            Quero conhecer o modelo →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION 5 — MODALIDADES
════════════════════════════════════════════════════════════ */
function ModelosLP() {
  const { ref, inView } = useInView();
  const modelos = [
    {
      tag:"Mais popular", name:"Loja Física",
      description:"Escritório comercial com atendimento presencial e equipe enxuta. Fortalece presença local e credibilidade. Ideal para quem quer escalar.",
      investimento:"R$ 100 mil",
      bullets:["Ponto comercial físico","Equipe de atendimento","Alta visibilidade local","Suporte completo da franqueadora"],
      highlight:false,
    },
    {
      tag:"Melhor custo-benefício", name:"Home Based",
      description:"Operação 100% remota com flexibilidade total de horários e menor custo operacional. Ideal para quem quer começar com o investimento mínimo.",
      investimento:"R$ 30 mil",
      bullets:["Operação 100% remota","Sem custo de ponto comercial","Flexibilidade de horários","Suporte completo da franqueadora"],
      highlight:true,
    },
  ];

  return (
    <section id="modelo" data-section="modelo" className="relative py-24 overflow-hidden" style={{ background:NAVY }}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none" style={{ background:`radial-gradient(ellipse, ${GOLD}08 0%, transparent 70%)` }} />
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color:GOLD }}>Modalidades</p>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight">
            Escolha o formato ideal para o seu investimento
          </h2>
          <p className="font-body text-white/60 text-lg mt-4 max-w-xl mx-auto">
            Dois modelos validados, cada um pensado para um perfil de investidor e momento de vida diferentes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {modelos.map((m, i) => (
            <div key={m.name}
              className={`relative flex flex-col rounded-3xl transition-all duration-700 overflow-hidden ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"} ${m.highlight?"shadow-[0_24px_80px_rgba(212,160,23,0.30)]":"shadow-[0_8px_40px_rgba(0,0,0,0.30)]"}`}
              style={{ background:m.highlight?"rgba(212,160,23,0.07)":"rgba(255,255,255,0.05)", border:`1.5px solid ${m.highlight?`${GOLD}55`:"rgba(255,255,255,0.10)"}`, transitionDelay:`${i*120}ms` }}>
              <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl" style={{ background:m.highlight?GOLD:"rgba(255,255,255,0.15)" }} />
              <div className="p-10 pt-11 flex flex-col flex-1">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-5 self-start"
                  style={{ background:m.highlight?`${GOLD}25`:"rgba(255,255,255,0.08)", color:m.highlight?GOLD:"rgba(255,255,255,0.5)" }}>
                  {m.tag}
                </div>
                <h3 className="font-display text-3xl font-black text-white mb-3">{m.name}</h3>
                <p className="font-body text-base text-white/65 leading-relaxed mb-7">{m.description}</p>
                <ul className="flex flex-col gap-2.5 mb-8">
                  {m.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background:m.highlight?`${GOLD}25`:"rgba(255,255,255,0.08)" }}>
                        <IcCheck className="w-3 h-3"  />
                      </span>
                      <span className="font-body text-sm text-white/70">{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-2xl p-6 mb-8"
                  style={{ background:m.highlight?`${GOLD}12`:"rgba(255,255,255,0.04)", border:`1px solid ${m.highlight?`${GOLD}30`:"rgba(255,255,255,0.08)"}` }}>
                  <p className="font-body text-xs uppercase tracking-widest font-semibold mb-1" style={{ color:"rgba(255,255,255,0.40)" }}>Investimento necessário</p>
                  <p className="font-display text-4xl font-black" style={{ color:GOLD }}>{m.investimento}</p>
                </div>
                <a href="#formulario" className="mt-auto flex items-center justify-center gap-2 py-4 rounded-2xl font-body font-black text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                  style={m.highlight?{background:GOLD,color:NAVY,boxShadow:`0 12px 32px ${GOLD}40`}:{background:"rgba(255,255,255,0.08)",color:"white",border:"1px solid rgba(255,255,255,0.15)"}}>
                  Quero investir neste modelo →
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-10 font-body text-white/25">* Faturamento médio estimado. Pode variar conforme perfil comercial, região e dedicação do franqueado.</p>
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
    { nome:"Vinicius",  cidade:"Pato Branco / Curitiba Hauer — PR", estrelas:5, texto:"O suporte que a franqueadora presta é sensacional. Quando ela pega na mão da gente, literalmente faz a gente crescer. Aqui eu não precisei criar nada do zero — só repliquei o que realmente deu certo.", initials:"V" },
    { nome:"Kelly",     cidade:"Criciúma — SC",                     estrelas:5, texto:"Comecei sozinha e em poucos meses já estava faturando acima das minhas expectativas. O suporte da Help é incrível — eles realmente querem que você dê certo.",                                               initials:"K" },
    { nome:"André",     cidade:"Curitiba Centro — PR",              estrelas:5, texto:"Não falta apoio. A própria franqueadora dá o suporte, chama a gente, incentiva. Ela não só ajuda, ela orienta. Você nunca está sozinho no processo.",                                                      initials:"A" },
    { nome:"Dani",      cidade:"Joinville — SC",                    estrelas:5, texto:"Em 1 ano de operação já ultrapassei R$ 1 milhão em faturamento. Nunca imaginei que seria possível com esse modelo de negócio.",                                                                            initials:"D" },
    { nome:"Raphael",   cidade:"Joinville — SC",                    estrelas:5, texto:"A verdade sobre a Help Multas é que o modelo realmente funciona. Você tem todo o suporte que precisa para começar e crescer com segurança.",                                                                 initials:"R" },
    { nome:"Alisson",   cidade:"Caçador — SC",                      estrelas:5, texto:"A Help me proporcionou mais tempo com a minha família. Eu trabalhava de domingo a domingo — hoje trabalho de segunda a sexta e tenho o final de semana inteiro com eles.",                                  initials:"A" },
  ];
  return (
    <section id="depoimentos" data-section="depoimentos" className="relative py-24" style={{ background:"oklch(0.96 0.01 75)" }}>
      <div className="container mx-auto px-6 lg:px-12">
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color:GOLD }}>Resultados reais</p>
          <h2 className="font-display text-4xl lg:text-5xl font-black leading-tight" style={{ color:NAVY }}>
            Veja quem já abriu a sua franquia{" "}
            <em className="not-italic text-gold">e está lucrando</em>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {depoimentos.map((d, i) => (
            <div key={`${d.nome}-${i}`}
              className={`flex flex-col rounded-2xl p-6 border bg-white transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(10,22,40,0.1)] ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}
              style={{ borderColor:"oklch(0.88 0.01 75)", transitionDelay:`${i*80}ms` }}>
              <div className="flex gap-0.5 mb-3">
                {Array.from({length:d.estrelas}).map((_,si) => (
                  <IcStar key={si} className="w-3.5 h-3.5"  />
                ))}
              </div>
              <p className="font-body text-sm leading-relaxed flex-1 italic mb-4" style={{ color:`${NAVY}99` }}>"{d.texto}"</p>
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor:"oklch(0.92 0.005 75)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-display text-xs font-black" style={{ background:`${GOLD}20`, color:GOLD }}>{d.initials}</div>
                <div>
                  <p className="font-body font-bold text-sm" style={{ color:NAVY }}>{d.nome}</p>
                  <p className="font-body text-xs" style={{ color:`${NAVY}60` }}>{d.cidade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="#formulario" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px] shadow-[0_12px_28px_rgba(212,160,23,0.25)]" style={{ background:GOLD, color:NAVY }}>
            Quero ser o próximo franqueado →
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
    { criterio:"Tempo de mercado",         helpMultas:"+ 10 anos",           concA:"Menos de 1 ano",    concB:"1 a 2 anos"       },
    { criterio:"Unidades ativas",          helpMultas:"+ 80 franquias",       concA:"Até 20 unidades",   concB:"20 a 40 unidades" },
    { criterio:"Análise jurídica própria", helpMultas:"Equipe interna",       concA:"Terceirizado",      concB:"Parcial"          },
    { criterio:"Sistema próprio",          helpMultas:"Plataforma dedicada",  concA:"Não possui",        concB:"Básico"           },
    { criterio:"Treinamento contínuo",     helpMultas:"Presencial + EaD",     concA:"Apenas inicial",    concB:"EaD limitado"     },
    { criterio:"Marketing nacional",       helpMultas:"Suporte completo",     concA:"Por conta própria", concB:"Material básico"  },
  ];
  return (
    <section id="comparativo" data-section="comparativo" className="relative py-24 overflow-hidden" style={{ background:NAVY }}>
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color:GOLD }}>Comparativo</p>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight">
            Compare antes de investir. {" "}
            <em className="not-italic" style={{ color:GOLD }}>A diferença é clara!</em>
          </h2>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full">
            <thead>
              <tr style={{ background:"rgba(255,255,255,0.06)" }}>
                <th className="text-left px-5 py-4 font-body text-xs uppercase tracking-wider text-white/40 font-semibold w-[30%]">Critério</th>
                <th className="px-5 py-4 font-body text-xs uppercase tracking-wider font-bold w-[23%]" style={{ color:GOLD }}>Help Multas</th>
                <th className="px-5 py-4 font-body text-xs uppercase tracking-wider text-white/40 font-semibold w-[23%]">Concorrente A</th>
                <th className="px-5 py-4 font-body text-xs uppercase tracking-wider text-white/40 font-semibold w-[23%]">Concorrente B</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.criterio} className="border-t border-white/6 transition-colors duration-150 hover:bg-white/3">
                  <td className="px-5 py-4 font-body text-sm font-semibold text-white/70">{row.criterio}</td>
                  <td className="px-5 py-4 font-body text-sm font-bold text-center" style={{ color:GOLD }}>{row.helpMultas}</td>
                  <td className="px-5 py-4 font-body text-sm text-center text-white/40">{row.concA}</td>
                  <td className="px-5 py-4 font-body text-sm text-center text-white/40">{row.concB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-10">
          <a href="#formulario" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px] shadow-[0_12px_28px_rgba(212,160,23,0.25)]" style={{ background:GOLD, color:NAVY }}>
            Escolha a Help Multas →
          </a>
        </div>
        <p className="text-center text-xs mt-5 font-body text-white/25">* Dados estimados com base em informações públicas disponíveis.</p>
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
    { number:"01", title:"Solicite uma análise gratuita",     desc:"Preencha o formulário. Nosso consultor de expansão entra em contato em até 24h para entender seu perfil, seus objetivos e responder todas as suas dúvidas — sem compromisso." },
    { number:"02", title:"Receba o plano ideal para você",    desc:"Juntos, escolhemos a modalidade mais adequada (Home Based ou Loja Física), alinhando investimento, expectativa de retorno e momento de vida." },
    { number:"03", title:"Abra e comece a faturar",           desc:"Você inicia a operação com sistema, treinamento, equipe jurídica e marketing prontos — tudo estruturado para você faturar desde os primeiros dias." },
  ];
  return (
    <section data-section="como-comecar" className="relative py-24" style={{ background:"oklch(0.96 0.01 75)" }}>
      <div className="container mx-auto px-6 lg:px-12">
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-sm uppercase tracking-widest mb-3" style={{ color:GOLD }}>Como começar</p>
          <h2 className="font-display text-4xl lg:text-5xl font-black leading-tight" style={{ color:NAVY }}>
            3 passos para abrir sua franquia
          </h2>
          <p className="font-body text-lg mt-4 max-w-xl mx-auto" style={{ color:`${NAVY}80` }}>
            Simples, sem burocracia. Do primeiro contato até a operação funcionando em tempo recorde.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px" style={{ background:`linear-gradient(to right, ${GOLD}40, ${GOLD}80, ${GOLD}40)` }} />
          {steps.map((step, i) => (
            <div key={step.number}
              className={`relative flex flex-col items-center text-center rounded-2xl p-8 bg-white border transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}
              style={{ borderColor:"oklch(0.88 0.01 75)", transitionDelay:`${i*120}ms` }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl font-black mb-5 relative z-10" style={{ background:GOLD, color:NAVY }}>{step.number}</div>
              <h3 className="font-display text-xl font-black mb-3 leading-tight" style={{ color:NAVY }}>{step.title}</h3>
              <p className="font-body text-sm leading-relaxed" style={{ color:`${NAVY}70` }}>{step.desc}</p>
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
  const urgencyItems = [
    { Icon: IcZap,         text:"Análise gratuita e sem compromisso" },
    { Icon: IcLock,        text:"Dados protegidos — sem spam"        },
    { Icon: IcMapPin,      text:"Vagas por região são limitadas"     },
    { Icon: IcCheckCircle, text:"Resposta em até 24 horas"           },
  ];
  return (
    <section id="formulario" data-section="cta-final" className="relative py-24 overflow-hidden" style={{ background:NAVY }}>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }} />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background:`radial-gradient(circle, ${GOLD}12 0%, transparent 70%)`, transform:"translate(30%, -30%)" }} />
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          <div ref={ref as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-700 ${inView?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
            <span className="gold-line" />
            <p className="font-body font-semibold text-sm uppercase tracking-widest mb-4" style={{ color:GOLD }}>Invista agora</p>
            <h2 className="font-display text-4xl lg:text-[52px] font-black text-white leading-[1.05] tracking-tight mb-6">
              CHEGOU SUA HORA DE{" "}
              <em className="not-italic" style={{ color:GOLD }}>ABRIR SEU NEGÓCIO!</em>
            </h2>
            <p className="font-body text-white/70 text-lg leading-relaxed mb-8 max-w-md">
              Solicite uma análise gratuita. Nosso consultor entra em contato em até 24h
              com um plano de negócio personalizado para a sua realidade.
            </p>
            <div className="flex flex-col gap-3">
              {urgencyItems.map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 rounded-2xl px-5 py-3.5 border"
                  style={{ background:"rgba(255,255,255,0.04)", borderColor:"rgba(255,255,255,0.10)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background:`${GOLD}20` }}>
                    <Icon className="w-4 h-4"  />
                  </div>
                  <span className="font-body text-white/80 text-[15px] font-semibold">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="rounded-[28px] p-7 sm:p-10" style={{ background:"white", boxShadow:"0 32px 70px rgba(0,0,0,0.5)", border:`1.5px solid ${GOLD}30` }}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4"
                  style={{ background:`${GOLD}12`, border:`1px solid ${GOLD}25` }}>
                  <IcStore className="w-3 h-3"  />
                  <span className="text-[11px] font-black uppercase tracking-widest" style={{ color:GOLD }}>Oportunidade de Franquia</span>
                </div>
                <span className="gold-line block mb-4" />
                <h3 className="font-display text-[24px] sm:text-[26px] font-black leading-tight mb-2" style={{ color:NAVY }}>Solicite uma análise gratuita</h3>
                <p className="font-body text-gray-500 text-[14px] leading-relaxed">Nosso consultor de expansão vai apresentar um plano de negócio personalizado para você em até 24h.</p>
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
   FOOTER
════════════════════════════════════════════════════════════ */
function FooterLP() {
  const socialLinks = [
    { label:"Instagram", href:"https://www.instagram.com/helpmultasfranchising?igsh=emc4MXVjNHFqZG5t",
      icon:<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg> },
    { label:"Facebook",  href:"https://www.facebook.com/profile.php?id=61579753710294&locale=pt_BR",
      icon:<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> },
    { label:"LinkedIn",  href:"https://www.linkedin.com/company/helpmultas/",
      icon:<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> },
    { label:"WhatsApp",  href:"https://api.whatsapp.com/send/?phone=5542999291211&text&type=phone_number&app_absent=0",
      icon:<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg> },
  ];
  const navLinks = [
    {label:"O Negócio",      href:"#mercado"},
    {label:"Por que nós",    href:"#diferenciais"},
    {label:"Modalidades",    href:"#modelo"},
    {label:"Depoimentos",    href:"#depoimentos"},
    {label:"Comparativo",    href:"#comparativo"},
    {label:"Seja Franqueado",href:"#formulario"},
  ];
  return (
    <footer className="font-body text-sm border-t" style={{ background:"oklch(0.15 0.03 258)", borderColor:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.55)" }}>
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-14">
          <div className="flex flex-col gap-4">
            <a href="#inicio"><img src="/image/LogotipoHelpinho.png" alt="Help Multas" className="h-12 w-auto" /></a>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color:"rgba(255,255,255,0.40)" }}>
              Milhões de multas por ano. Cada uma é uma oportunidade de negócio para os nossos franqueados.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.50)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color=GOLD; (e.currentTarget as HTMLAnchorElement).style.background=`${GOLD}15`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.50)"; (e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.07)"; }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color:"rgba(255,255,255,0.30)" }}>Navegação</h4>
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="text-xs transition-colors duration-200 hover:text-white" style={{ color:"rgba(255,255,255,0.50)" }}>{l.label}</a>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold" style={{ color:"rgba(255,255,255,0.30)" }}>Parceiros Oficiais</h4>
            <div className="flex flex-wrap items-center gap-6 opacity-30 hover:opacity-60 transition-opacity duration-300">
              <a href="https://racing.porsche.com/" target="_blank" rel="noopener noreferrer"><img src="/image/porsche motorsport.png" alt="Porsche Motorsport" className="h-5 w-auto object-contain brightness-0 invert" /></a>
              <a href="https://www.aceleradorempresarial.com.br/giants-alunos/" target="_blank" rel="noopener noreferrer"><img src="/image/download.svg" alt="Giants" className="h-4 w-auto object-contain brightness-0 invert" /></a>
              <a href="https://www.aceleradorempresarial.com.br/" target="_blank" rel="noopener noreferrer"><img src="/image/grupo_acelerador_icon_png.png" alt="Grupo Acelerador" className="h-6 w-auto object-contain brightness-0 invert" /></a>
            </div>
            <a href="#formulario" className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:opacity-90" style={{ background:GOLD, color:NAVY }}>
              Quero ser franqueado →
            </a>
          </div>
        </div>
        <div className="border-t" style={{ borderColor:"rgba(255,255,255,0.06)" }} />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 text-center sm:text-left">
          <p className="text-[11px]" style={{ color:"rgba(255,255,255,0.30)" }}>© 2026 Help Multas Franquias. Todos os direitos reservados. · CNPJ: 26.545.757/0001-54</p>
          <p className="text-[11px]" style={{ color:"rgba(255,255,255,0.20)" }}>
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
  useScrollTracker({
    webhookUrl: "https://n8n.helprecurso.com.br/webhook/scroll-tracker",
    pageName: "franqueado",
  });
  return (
    <div className="min-h-screen">
      <AnnouncementBarLP />
      <HeroLP />
      <TickerLP />
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