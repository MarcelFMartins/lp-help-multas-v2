/*
 * SearchableSelect — dropdown com campo de busca embutido
 * Reutilizado para UF e Cidade (Hero + CTA)
 */

import { useState, useEffect, useRef, useMemo } from "react";

export interface SelectOpt { value: string; label: string; keywords?: string }

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export default function SearchableSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  disabledPlaceholder,
}: {
  label: string;
  placeholder: string;
  options: SelectOpt[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  disabledPlaceholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const lCls = "text-[oklch(0.1998_0.0403_258.29)] text-[13px] font-bold uppercase tracking-wide";

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = normalize(query);
    return options.filter(
      (o) => normalize(o.label).includes(q) || (o.keywords && normalize(o.keywords).includes(q))
    );
  }, [options, query]);

  return (
    <div className="flex flex-col gap-[7px]" ref={ref}>
      <span className={lCls}>{label}</span>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`w-full min-h-[50px] border rounded-[14px] pl-4 pr-9 text-left text-[15px] outline-none transition-all duration-200 relative flex items-center
            ${value ? "text-[oklch(0.1998_0.0403_258.29)]" : "text-[#98a2b3]"}
            ${disabled ? "bg-[#f2f4f6] cursor-not-allowed opacity-70" : "bg-white"}
            ${open
              ? "border-[#D4A017] ring-4 ring-[#D4A017]/20 bg-white"
              : "border-[#D9E1E8]"
            }`}
        >
          <span className="block w-full truncate">
            {selected?.label || (disabled ? (disabledPlaceholder || placeholder) : placeholder)}
          </span>
          <span
            className={`absolute right-3 sm:right-4 top-1/2 w-2 h-2 shrink-0 border-r-2 border-b-2 border-[oklch(0.1998_0.0403_258.29)]/50 transition-transform duration-200 ${open ? "-translate-y-1/3 rotate-[225deg]" : "-translate-y-2/3 rotate-45"
              }`}
          />
        </button>

        {open && !disabled && (
          <div
            role="listbox"
            className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 rounded-[14px] border border-[#D9E1E8] bg-white shadow-[0_18px_34px_rgba(36,55,70,0.16)] p-1.5 flex flex-col gap-1"
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full min-h-[38px] border border-[#D9E1E8] rounded-[10px] px-3 text-[14px] outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 text-[oklch(0.1998_0.0403_258.29)]"
            />

            <div className="max-h-52 overflow-y-auto overscroll-contain flex flex-col gap-0.5">
              <button
                type="button"
                className="w-full text-left px-3 py-2.5 rounded-[10px] text-[#98a2b3] text-[15px] hover:bg-[#edf2f6]"
                onClick={() => { onChange(""); setOpen(false); setQuery(""); }}
              >
                {placeholder}
              </button>

              {filtered.length === 0 && (
                <p className="px-3 py-2.5 text-[14px] text-[#98a2b3]">Nenhum resultado</p>
              )}

              {filtered.map((opt) => (
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
                  onClick={() => { onChange(opt.value); setOpen(false); setQuery(""); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
