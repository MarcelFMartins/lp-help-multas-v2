import { useInView } from "../hooks/useInView";


const ENTREPRENEUR_IMG = "/image/robber.jpg.jpeg";

const yourTasks = [
  { icon: "💼", task: "Gestão da sua unidade" },
  { icon: "🤝", task: "Prospecção e fechamento de vendas" },
  { icon: "📱", task: "Atendimento comercial ao cliente" },
  { icon: "💻", task: "Inserção de dados no sistema" },
  { icon: "🔄", task: "Relacionamento e pós-venda" },
  { icon: "💰", task: "Recebimento do lucro" },
];

const ourTasks = [
  { icon: "🔍", task: "Análise da multa e do processo" },
  { icon: "📋", task: "Elaboração da defesa jurídica" },
  { icon: "🏛️", task: "Protocolo junto aos órgãos de trânsito" },
  { icon: "⚙️", task: "Sistema próprio de gestão" },
  { icon: "🎓", task: "Treinamento constante" },
  { icon: "📞", task: "Suporte técnico e comercial" },
];

export default function ModelSection() {
  const { ref: titleRef, inView: titleInView } = useInView();
  const { ref: cardsRef, inView: cardsInView } = useInView();

  return (
    <section id="modelo" className="py-24 bg-[oklch(0.98_0.005_75)]">
      <div className="container mx-auto">

        {/* Section header */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="gold-line mx-auto" />
          <p className="font-body font-semibold text-gold text-sm uppercase tracking-widest mb-3">
            O Modelo
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-[oklch(0.1998_0.0403_258.29)] leading-tight max-w-3xl mx-auto">
            VOCÊ NÃO PRECISA SER ADVOGADO.{" "}
            <em className="text-gold not-italic">NÓS FAZEMOS POR VOCÊ.</em>
          </h2>
          <p className="font-body text-[oklch(0.1998_0.0403_258.29)] text-lg mt-4 max-w-2xl mx-auto">
            O modelo Done-For-You da HelpMultas divide as responsabilidades de forma inteligente:
            você cuida do relacionamento e das vendas, nós cuidamos de toda a parte jurídica.
          </p>
        </div>

        {/* Main content: image + responsibilities */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">

          {/* Left: Entrepreneur image */}
          <div
            className={`transition-all duration-700 delay-200 ${cardsInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
            ref={cardsRef as React.RefObject<HTMLDivElement>}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl opacity-20" style={{ background: "oklch(0.8371 0.1715 85.23)" }} />
              <img
                src={ENTREPRENEUR_IMG}
                alt="Franqueado HelpMultas"
                className="relative rounded-2xl w-full object-cover shadow-2xl"
                style={{ maxHeight: "500px", objectPosition: "top" }}
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-[oklch(0.1998_0.0403_258.29)] text-white rounded-xl px-5 py-3 shadow-xl border border-white/10">
                <span className="font-data text-2xl text-gold block">100%</span>
                <span className="font-body text-xs text-white/70">Suporte técnico incluso</span>
              </div>
            </div>
          </div>

          {/* Right: Responsibilities split */}
          <div className="space-y-6">
            {/* Your tasks */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "oklch(0.8371 0.1715 85.23)" }}>
                  👤
                </div>
                <h3 className="font-display text-xl font-bold text-[oklch(0.1998_0.0403_258.29)]">
                  Sua Responsabilidade
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {yourTasks.map((item) => (
                  <div key={item.task} className="flex items-start gap-2 text-base font-semibold">
                    <span className="text-base mt-0.5 shrink-0">{item.icon}</span>
                    <span className="font-body text-[oklch(0.1998_0.0403_258.29)] leading-tight">{item.task}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Our tasks */}
            <div className="rounded-2xl p-6 shadow-sm border border-white/10" style={{ background: "oklch(0.1998 0.0403 258.29)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "oklch(0.8371 0.1715 85.23)" }}>
                  ⚖️
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  Nossa Responsabilidade
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ourTasks.map((item) => (
                  <div key={item.task} className="flex items-start gap-2 text-base font-semibold">
                    <span className="text-base mt-0.5 shrink-0">{item.icon}</span>
                    <span className="font-body text-white/70 leading-tight">{item.task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How it works timeline */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="font-display text-2xl font-bold text-[oklch(0.1998_0.0403_258.29)] text-center mb-8">
            Como funciona na prática
          </h3>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: "01", title: "Cliente te contata", desc: "Motorista com multa busca sua unidade" },
              { step: "02", title: "Você realiza a venda", desc: "Venda do recurso ou da suspensão" },
              { step: "03", title: "Você cadastra", desc: "Insere os dados no sistema HelpMultas" },
              { step: "04", title: "Analisamos", desc: "Nossa equipe jurídica analisa o caso" },
              { step: "05", title: "Defendemos", desc: "Elaboramos e protocolamos a defesa" },
            ].map((step, i) => (
              <div key={step.step} className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {i < 4 && (
                  <div className="hidden md:block absolute top-5 left-[60%] w-full h-0.5 bg-gray-200 z-0" />
                )}
                <div
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-data text-sm mb-3 shrink-0"
                  style={{ background: "oklch(0.8371 0.1715 85.23)", color: "ooklch(0.1998 0.0403 258.29)" }}
                >
                  {step.step}
                </div>
                <h4 className="font-display text-sm font-bold text-[oklch(0.1998_0.0403_258.29)] mb-1">{step.title}</h4>
                <p className="font-body text-xs text-[oklch(0.1998_0.0403_258.29)] leading-tight">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}