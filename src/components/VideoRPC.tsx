export default function VideoSection() {
  return (
    <section className="py-24 lg:py-32 bg-[oklch(0.1998_0.0403_258.29)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <video
              controls
              playsInline
              preload="none"
              poster="/image/fundo.webp"
              className="w-full aspect-video object-cover"
            >
              <source src="video-rpc.mp4" type="video/mp4" />
            </video>
          </div>
          <p className="mt-2 text-left text-xs text-white/50 pl-1">
            Fonte: RPC
          </p>
        </div>
      </div>
      {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="font-body text-white/70 mb-6 max-w-2xl mx-auto">
            Esses dados mostram que o mercado está em expansão real.
            A oportunidade é concreta.
          </p>

          <a
            href="#inicio"
            className="inline-block px-8 py-4 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-lg"
            style={{
              background: "oklch(0.8371 0.1715 85.23)",
              color: "oklch(0.1998 0.0403 258.29)",
            }}
          >
            Aproveitar essa oportunidade
          </a>
        </div>
    </section>
  );
}