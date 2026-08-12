import { useEffect } from "react";

const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbyXsFEYPl6M2LnExhlPTdjXHtEi21eqkmt6mIdRGdDu6lRQPdixkV3e5omd2KXzsb3_/exec";

const WHATSAPP_NUMBER = "554298673007";

const MENSAGEM =
  "Olá! Vim do Grupo do Evento. Gostaria de mais informações!";

const TEMPO_REDIRECIONAMENTO = 300;

export default function GrupoWhatsApp() {

  useEffect(() => {
    const parametros =
      new URLSearchParams(window.location.search);

    const pegarParametro = (nome: string) => {
      return parametros.get(nome) ?? "";
    };

    const origem =
      pegarParametro("origem");

    const campanha =
      pegarParametro("campanha");

    const conteudo =
      pegarParametro("conteudo");

    const termo =
      pegarParametro("termo");

    const identificador =
      pegarParametro("id");

    const urlAtual =
      window.location.href;

    const paginaAnterior =
      document.referrer || "";

    const userAgent =
      navigator.userAgent;

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

    fetch(urlRastreamento, {
      method: "GET",
      mode: "no-cors",
      keepalive: true,
    }).catch((erro) => {

      console.error(
        "Erro ao registrar acesso:",
        erro
      );

    });

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        MENSAGEM
      )}`;

    const timer =
      window.setTimeout(() => {

        window.location.replace(
          whatsappUrl
        );

      }, TEMPO_REDIRECIONAMENTO);

    return () => {

      window.clearTimeout(timer);

    };

  }, []);

  return (

    <main className="whatsapp-page">

      <div className="whatsapp-container">

        <div className="whatsapp-loader" />

        <h1>
          Abrindo o WhatsApp...
        </h1>

        <p>
          Você será direcionado para nossa equipe.
        </p>

      </div>


      <style>{`

        * {
          box-sizing: border-box;
        }

        .whatsapp-page {

          margin: 0;

          min-height: 100vh;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 20px;

          font-family: Arial, sans-serif;

          background: #f5f5f5;

        }


        .whatsapp-container {

          width: 90%;
          max-width: 400px;

          text-align: center;

          background: #ffffff;

          padding: 40px 30px;

          border-radius: 16px;

          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.08);

        }


        .whatsapp-loader {

          width: 45px;
          height: 45px;

          margin: 0 auto 20px;

          border: 4px solid #eeeeee;

          border-top-color: #25d366;

          border-radius: 50%;

          animation:
            whatsapp-girar 1s linear infinite;

        }


        .whatsapp-container h1 {

          margin: 0 0 10px;

          font-size: 22px;

          color: #111111;

        }


        .whatsapp-container p {

          margin: 0;

          color: #666666;

          font-size: 15px;

        }


        @keyframes whatsapp-girar {

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