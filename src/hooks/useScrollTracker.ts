import { useEffect, useRef } from "react";

/* ─── Tipos ─────────────────────────────────────────────── */
interface ScrollTrackerConfig {
  /** URL do webhook n8n. Ex: 'https://n8n.helprecurso.com.br/webhook/scroll-tracker' */
  webhookUrl: string;
  /** Nome da página. Ex: 'franqueado' | 'indica' | 'home' */
  pageName: string;
  /** Milestones de scroll em % a registrar. Padrão: [25, 50, 75, 90, 100] */
  milestones?: number[];
}

interface ScrollPayload {
  pagina: string;
  url: string;
  scroll_maximo: number;
  milestones_atingidos: string[];
  secoes_vistas: string[];
  duracao_segundos: number;
  timestamp: string;
  dispositivo: "mobile" | "desktop";
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  utm_id?: string;
  fbp?: string;
  fbc?: string;
  fbclid?: string;
}

/* ─── Hook ──────────────────────────────────────────────── */
export function useScrollTracker({
  webhookUrl,
  pageName,
  milestones: milestoneTargets = [25, 50, 75, 90, 100],
}: ScrollTrackerConfig): void {
  const startTime      = useRef<number>(Date.now());
  const maxScroll      = useRef<number>(0);
  const milestonesHit  = useRef<Set<number>>(new Set());
  const sectionsViewed = useRef<Set<string>>(new Set());
  const sent           = useRef<boolean>(false);
  const observerRef    = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Reset ao montar (SPA route change)
    startTime.current      = Date.now();
    maxScroll.current      = 0;
    milestonesHit.current  = new Set();
    sectionsViewed.current = new Set();
    sent.current           = false;

    /* ── Scroll depth ───────────────────────────────────── */
    const onScroll = () => {
      const el           = document.documentElement;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight <= 0) return;
      const pct = Math.round((window.scrollY / scrollHeight) * 100);
      if (pct > maxScroll.current) maxScroll.current = pct;
      milestoneTargets.forEach((m) => {
        if (pct >= m) milestonesHit.current.add(m);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── Seções via IntersectionObserver ────────────────── */
    // Marque qualquer elemento com  data-section="nome"  para rastreá-lo.
    // Já feito em FranqueadoLP.tsx e IndicaLP.tsx.
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const name   =
              target.dataset.section ||
              target.id              ||
              target.tagName.toLowerCase();
            sectionsViewed.current.add(name);
          }
        });
      },
      { threshold: 0.3 } // 30% visível = seção "vista"
    );

    const timer = setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>("[data-section]")
        .forEach((el) => observerRef.current?.observe(el));
    }, 200);

    /* ── Envio dos dados ─────────────────────────────────── */
    const send = () => {
      if (sent.current) return;
      sent.current = true;

      const tracking = typeof (window as any).getTrackingData === "function"
        ? (window as any).getTrackingData() : {};
      const meta = typeof (window as any).getMetaTrackingData === "function"
        ? (window as any).getMetaTrackingData() : {};

      const payload: ScrollPayload = {
        pagina:               pageName,
        url:                  window.location.href,
        scroll_maximo:        maxScroll.current,
        milestones_atingidos: [...milestonesHit.current]
          .sort((a, b) => a - b)
          .map((n) => `${n}%`),
        secoes_vistas:        [...sectionsViewed.current],
        duracao_segundos:     Math.round((Date.now() - startTime.current) / 1000),
        timestamp:            new Date().toISOString(),
        dispositivo:          window.innerWidth < 768 ? "mobile" : "desktop",
        ...tracking,
        ...meta,
      };

      // sendBeacon: confiável mesmo no beforeunload / visibilitychange
      // Blob com application/json → n8n já recebe parsado, sem precisar de Code node
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      const ok = navigator.sendBeacon(webhookUrl, blob);

      // Fallback: fetch com keepalive se sendBeacon falhar
      if (!ok) {
        fetch(webhookUrl, {
          method:    "POST",
          headers:   { "Content-Type": "application/json" },
          body:      JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {/* silencia em produção */});
      }
    };

    const onBeforeUnload     = () => send();
    const onVisibilityChange = () => { if (document.visibilityState === "hidden") send(); };

    window.addEventListener("beforeunload",       onBeforeUnload);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("scroll",             onScroll);
      window.removeEventListener("beforeunload",       onBeforeUnload);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observerRef.current?.disconnect();
      clearTimeout(timer);
    };
  }, [webhookUrl, pageName]);
}
