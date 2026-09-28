import { useEffect } from "react";
import { useLocation } from "wouter";
import { logEvent } from "@/lib/logger";

const LINK_CLICK_TRACKING_URL =
  "https://mkt.helpmultas.com/api/social/link-clicks";

const LINK_SLUG = "roberson";

// Redirect target for the link in @roberson.alvarenga's Instagram bio.
// Registers the click against his profile in the Marketing Hub dashboard,
// then sends the visitor on to the real homepage — same destination the
// bio link used to point to directly, just with a click logged first.
export default function BioRoberson() {
  const [, setLocation] = useLocation();

  useEffect(() => {

    const query = new URLSearchParams({
      slug: LINK_SLUG,
      url: window.location.href,
      referrer: document.referrer || "",
      user_agent: navigator.userAgent,
    });

    const urlRastreamento =
      `${LINK_CLICK_TRACKING_URL}?${query.toString()}`;

    fetch(urlRastreamento, {
      method: "GET",
      mode: "no-cors",
      keepalive: true,
    }).catch((erro) => {

      console.error(
        "Erro ao registrar clique no link:",
        erro
      );
      logEvent("Bio Roberson", "crm_error", "Erro ao registrar clique no link", {
        error: erro instanceof Error ? erro.message : String(erro),
      });

    });

    setLocation("/", { replace: true });

  }, [setLocation]);

  return null;
}
