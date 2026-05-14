/*
 * Footer — Rodapé simples e limpo
 * Design: Navy dark, disclaimer legal, links mínimos
 */

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.1998_0.0403_258.29)] py-10 border-t border-white/5">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="#inicio" className="font-display text-xl font-bold text-white">
            help<span className="text-gold">multas</span>
          </a>

          {/* Copyright */}
          <p className="font-body text-xs text-white/40 text-center">
            © 2025 Help Multas Franquias. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
