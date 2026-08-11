import { useEffect } from "react";

const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbyXsFEYPl6M2LnExhlPTdjXHtEi21eqkmt6mIdRGdDu6lRQPdixkV3e5omd2KXzsb3_/exec";

// Cole aqui o link NORMAL fornecido pelo WhatsApp
const WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/BVITyqulUYtHu4gY4W2Fly";

const TEMPO_REDIRECIONAMENTO = 500;

export default function GrupoWhatsApp() {
  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search);

    const pegarParametro = (nome: string) =>
      parametros.get(nome) ?? "";

    const origem = pegarParametro("origem");
    const campanha = pegarParametro("campanha");
    const conteudo = pegarParametro("conteudo");
    const termo = pegarParametro("termo");
    const identificador = pegarParametro("id");

    const urlAtual = window.location.href;
    const paginaAnterior = document.referrer || "";
    const userAgent = navigator.userAgent;

    const query = new URLSearchParams({
      origem,
      campanha,
      conteudo,
      termo,
      id: identificador,
      url: urlAtual,
      referrer: paginaAnterior,
      user_agent: userAgent,
    });

    const urlRastreamento =
      `${GOOGLE_SHEETS_URL}?${query.toString()}`;

    /*
    ==========================================
    ENVIA O RASTREAMENTO
    ==========================================
    */

    fetch(urlRastreamento, {
      method: "GET",
      mode: "no-cors",
      keepalive: true,
    }).catch((erro) => {
      console.error("Erro ao registrar acesso:", erro);
    });

    /*
    ==========================================
    DESCOBRE SE É CELULAR
    ==========================================
    */

    const ehMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    /*
    ==========================================
    PEGA O CÓDIGO DO GRUPO
    ==========================================
    */

    const codigoGrupo =
      WHATSAPP_GROUP_URL
        .replace("https://chat.whatsapp.com/", "")
        .split("?")[0]
        .split("#")[0];

    /*
    ==========================================
    DEFINE DESTINO
    ==========================================
    */

    let destinoWhatsApp: string;

    if (ehMobile) {
      // No celular deixa o próprio WhatsApp
      // decidir como abrir o convite
      destinoWhatsApp =
        `https://chat.whatsapp.com/${codigoGrupo}`;
    } else {
      // No computador pula a tela intermediária
      // e abre diretamente o WhatsApp Web
      destinoWhatsApp =
        `https://web.whatsapp.com/accept?code=${codigoGrupo}`;
    }

    /*
    ==========================================
    REDIRECIONA
    ==========================================
    */

    const timer = window.setTimeout(() => {
      window.location.replace(destinoWhatsApp);
    }, TEMPO_REDIRECIONAMENTO);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "400px",
          textAlign: "center",
          background: "#fff",
          padding: "40px 30px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div className="grupo-loader" />

        <h1
          style={{
            fontSize: "22px",
            margin: "0 0 10px",
          }}
        >
          Entrando no grupo...
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "15px",
            margin: 0,
          }}
        >
          Você será direcionado para o WhatsApp.
        </p>
      </div>

      <style>{`
        .grupo-loader {
          width: 45px;
          height: 45px;
          margin: 0 auto 20px;
          border: 4px solid #eeeeee;
          border-top-color: #25D366;
          border-radius: 50%;
          animation: girar 1s linear infinite;
        }

        @keyframes girar {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}