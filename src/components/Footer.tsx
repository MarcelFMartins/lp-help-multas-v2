import type { ReactNode } from "react";


interface FooterLink {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export default function Footer() {
  const menuColumns: FooterColumn[] = [
    {
      title: "Menu",
      links: [
        { label: "Inicio", href: "#inicio" },
        { label: "O Mercado", href: "#mercado" },
        { label: "Depoimentos", href: "#depoimentos" },
        { label: "Oportunidades", href: "#oportunidade" },
        { label: "O Modelo", href: "#modelo" },
        { label: "Help Experience", href: "#experiencia" },
        { label: "Nosso time", href: "#equipe" },
      ],
    },
    {
      title: "Franquias",
      links: [
        { label: "Quero ser um Franqueado", href: "#inicio" },
      ],
    },
    {
      title: "Siga-nos",
      links: [
        {
          label: "Facebook",
          href: "https://www.facebook.com/profile.php?id=61579753710294&locale=pt_BR",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          )
        },
        {
          label: "Instagram",
          href: "https://www.instagram.com/helpmultasfranchising?igsh=emc4MXVjNHFqZG5t",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          )
        },
        {
          label: "Linkedin",
          href: "https://www.linkedin.com/company/helpmultas/",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          )
        },
        {
          label: "Whatsapp",
          href: "https://api.whatsapp.com/send/?phone=5542999291211&text&type=phone_number&app_absent=0",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          )
        },
      ],
    },
  ];

  return (
    <footer className="bg-[oklch(0.1998_0.0403_258.29)] text-white/70 font-body text-sm pt-12 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4 max-w-7xl">


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 xl:gap-16 pb-12">

          <div className="sm:col-span-2 lg:col-span-2 flex flex-col gap-1">
            <a href="#inicio">
              <img
                src="/image/LogotipoHelpinho.png"
                alt="Help Multas"
                className="h-14"
              />
            </a>
            <p className="text-xs text-white/55 max-w-sm leading-relaxed">
              Milhões de multas por ano. Cada uma é uma oportunidade sua.
              Modelo franqueado que transforma clientes em renda.
            </p>
          </div>

          {menuColumns.map((col, idx) => (
            <div key={idx} className="sm:col-span-1 lg:col-span-1 flex flex-col gap-3">
              <h4 className="text-white font-semibold font-display text-xs uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-gold transition-colors duration-200 group"
                    >
                      {link.icon && <span className="text-white/40 group-hover:text-gold transition-colors duration-200">{link.icon}</span>}
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 my-6"></div>

        <div className="flex flex-col items-center justify-between gap-6 py-2 md:flex-row text-center md:text-left">
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">
            Parceiros Oficiais
          </span>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-30 hover:opacity-60 transition-opacity duration-300">
            <a href="https://racing.porsche.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <img
                src="/image/porsche motorsport.png"
                alt="Porsche Motorsport"
                className="h-5 md:h-6 w-auto object-contain brightness-0 invert"
              />
            </a>
            <a href="https://www.aceleradorempresarial.com.br/giants-alunos/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <img
                src="/image/download.svg"
                alt="Giants"
                className="h-4 md:h-5 w-auto object-contain brightness-0 invert"
              />
            </a>
            <a href="https://www.aceleradorempresarial.com.br/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <img
                src="/image/grupo_acelerador_icon_png.png"
                alt="Grupo Acelerador"
                className="h-6 md:h-7 w-auto object-contain brightness-0 invert"
              />
            </a>
          </div>
        </div>


        <div className="border-t border-white/5 my-6"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 text-center md:text-left">
          <p className="text-[11px] text-white/40 leading-relaxed max-w-md md:max-w-none">
            © 2026 Help Multas Franquias. Todos os direitos reservados. <br className="block sm:hidden" /> CNPJ: 26.545.757/0001-54
          </p>
        </div>
      </div>
    </footer>
  );
}