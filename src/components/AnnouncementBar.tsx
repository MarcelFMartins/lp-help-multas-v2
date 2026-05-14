/*
 * AnnouncementBar — Barra de urgência no topo
 * Design: Navy dark + gold text, ticker de urgência
 */

const items = [
  <><span className="text-white/80">Apenas <span className="text-gold font-semibold">franqueados selecionados</span> são aceitos</span></>,
  <><span className="text-gold font-semibold">+80 escritórios</span><span className="text-white/80">em operação no Brasil</span></>,
  <><span className="text-gold font-semibold">+100 mil motoristas</span><span className="text-white/80">atendidos</span></>,
  <><span className="text-white/80">Mercado de multas movimenta</span><span className="text-gold font-semibold">bilhões por ano</span></>,
];

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-[oklch(0.1998_0.0403_258.29)] py-2.5 overflow-hidden">
      <div className="flex overflow-hidden">
        <div className="ticker-track flex gap-12 whitespace-nowrap items-center">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="flex items-center gap-2 text-sm font-body font-medium shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
