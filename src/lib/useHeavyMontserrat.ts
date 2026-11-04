/*
 * Carrega os pesos 800/900 da Montserrat só nas páginas da Black Help Multas
 * (o index.html carrega até 700; o restante do site não muda).
 */
import { useEffect } from "react";

const HREF = "https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&display=swap";

export function useHeavyMontserrat() {
  useEffect(() => {
    if (document.querySelector(`link[href="${HREF}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = HREF;
    document.head.appendChild(link);
  }, []);
}
