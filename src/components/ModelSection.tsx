import { useInView } from "../hooks/useInView";

const yourTasks = [
  "Gestão da unidade",
  "Prospecção e vendas",
  "Atendimento comercial",
  "Cadastro no sistema",
  "Relacionamento com clientes (Pós Venda)",
  "Gestão dos resultados",
];

const ourTasks = [
  "Análise técnica dos processos",
  "Elaboração das defesas",
  "Protocolos junto aos órgãos",
  "Sistema próprio de gestão",
  "Treinamento contínuo",
  "Suporte técnico e comercial",
];

const processSteps = [
  {
    number: "01",
    title: "Captação",
    description:
      "O cliente procura sua unidade para resolver a infração.",
  },
  {
    number: "02",
    title: "Venda",
    description:
      "Você realiza o fechamento comercial do serviço.",
  },
  {
    number: "03",
    title: "Cadastro",
    description:
      "As informações são inseridas no sistema da franqueadora.",
  },
  {
    number: "04",
    title: "Análise",
    description:
      "Nossa equipe jurídica avalia toda a documentação.",
  },
  {
    number: "05",
    title: "Execução",
    description:
      "A defesa é elaborada e protocolada pela Help Multas.",
  },
];

export default function ModelSection() {
  const { ref: titleRef, inView: titleInView } = useInView();
  const { ref: contentRef, inView: contentInView } = useInView();

  return (
    <section
      id="modelo"
      className="py-24 bg-[oklch(0.98_0.005_75)] overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`max-w-4xl mx-auto text-center mb-20 transition-all duration-700 ${titleInView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
        >
          <span className="gold-line mx-auto mb-6" />

          <p className="font-body text-sm uppercase tracking-[0.3em] text-gold font-semibold mb-4">
            Modelo Operacional
          </p>

          <h2 className="font-display text-4xl lg:text-6xl font-black text-[oklch(0.1998_0.0403_258.29)] leading-[1.1]">
            VOCÊ VENDE.
            <br />
            <span className="text-gold">
              NÓS EXECUTAMOS TODA A OPERAÇÃO.
            </span>
          </h2>

          <p className="font-body text-lg text-[oklch(0.1998_0.0403_258.29)]/80 mt-6 leading-relaxed">
            A franqueadora cuida da estrutura técnica e jurídica enquanto você
            foca em crescimento comercial, relacionamento e expansão da unidade.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={contentRef as React.RefObject<HTMLDivElement>}
          className={`grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto transition-all duration-700 ${contentInView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
            }`}
        >
          {/* Sua atuação */}
          <div className="bg-white rounded-[32px] border border-black/5 p-10 shadow-sm">
            <div className="mb-8">
              <p className="font-body text-sm uppercase tracking-[0.2em] text-gold mb-3 font-bold">
                Sua atuação
              </p>

              <h3 className="font-display text-3xl lg:text-4xl font-black text-[oklch(0.1998_0.0403_258.29)] leading-tight">
                Comercial e relacionamento
              </h3>
            </div>

            <div className="space-y-5">
              {yourTasks.map((task) => (
                <div
                  key={task}
                  className="flex items-center gap-4 border-b border-black/5 pb-5"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      background: "oklch(0.8371 0.1715 85.23)",
                    }}
                  />

                  <p className="font-body text-base lg:text-lg text-[oklch(0.1998_0.0403_258.29)] font-medium">
                    {task}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Nossa atuação */}
          <div
            className="rounded-[32px] p-10 border border-white/10 shadow-xl"
            style={{
              background: "oklch(0.1998 0.0403 258.29)",
            }}
          >
            <div className="mb-8">
              <p className="font-body text-sm uppercase tracking-[0.2em] text-gold mb-3 font-bold">
                Nossa atuação
              </p>

              <h3 className="font-display text-3xl lg:text-4xl font-black text-white leading-tight">
                Jurídico e operação técnica
              </h3>
            </div>

            <div className="space-y-5">
              {ourTasks.map((task) => (
                <div
                  key={task}
                  className="flex items-center gap-4 border-b border-white/10 pb-5"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      background: "oklch(0.8371 0.1715 85.23)",
                    }}
                  />

                  <p className="font-body text-base lg:text-lg text-white/80 font-medium">
                    {task}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* Processo */}
        <div className="mt-24">
          <div className="text-center mb-14">
            <p className="font-body text-sm uppercase tracking-[0.3em] text-gold font-semibold mb-3">
              Fluxo operacional
            </p>

            <h3 className="font-display text-4xl font-black text-[oklch(0.1998_0.0403_258.29)]">
              COMO FUNCIONA NA PRÁTICA
            </h3>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="relative bg-white rounded-[24px] p-8 border border-black/5 shadow-sm"
              >
                <span className="font-data text-5xl text-gold absolute top-5 right-5">
                  {step.number}
                </span>

                <div
                  className="w-12 h-1 rounded-full mb-6"
                  style={{
                    background: "oklch(0.8371 0.1715 85.23)",
                  }}
                />

                <h4 className="font-display text-2xl font-bold text-[oklch(0.1998_0.0403_258.29)] mb-3">
                  {step.title}
                </h4>

                <p className="font-body text-sm leading-relaxed text-[oklch(0.1998_0.0403_258.29)]/70">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}