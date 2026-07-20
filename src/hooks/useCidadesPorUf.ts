import { useEffect, useState } from "react";

export function useCidadesPorUf(uf: string) {
  const [cidades, setCidades] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uf) {
      setCidades([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then((res) => res.json())
      .then((data: Array<{ nome: string }>) => {
        if (cancelled) return;
        setCidades(data.map((d) => d.nome).sort((a, b) => a.localeCompare(b, "pt-BR")));
      })
      .catch(() => {
        if (!cancelled) setCidades([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [uf]);

  return { cidades, loading };
}
