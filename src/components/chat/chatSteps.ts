export type ChatStepType = "text" | "tel" | "email" | "uf" | "cidade" | "buttons";

export interface ChatStepOption {
  value: string;
  label: string;
  keywords?: string;
}

export interface ChatStep {
  key: "nome" | "whatsapp" | "email" | "uf" | "cidade" | "capital";
  botText: string[];
  type: ChatStepType;
  placeholder?: string;
  validate: (value: string) => string | null;
}

export const INTRO_MESSAGES: string[] = [
  "Olá! Sou o assistente virtual da Help Multas Franquias.",
  "O Brasil emite mais de **70 milhões de multas** por ano — cada uma delas é uma **oportunidade de negócio**.",
  "Vou te fazer **6 perguntas rápidas** para entender seu perfil e te conectar com nosso time de expansão em até **24h**.",
];

const UF_NOMES: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará",
  DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão",
  MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais", PA: "Pará",
  PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte", RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima",
  SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins",
};

export const UF_OPTIONS: ChatStepOption[] = Object.keys(UF_NOMES).map((uf) => ({
  value: uf,
  label: uf,
  keywords: UF_NOMES[uf],
}));

/* Mesmos rótulos do formulário atual (CAPITAL_OPTIONS em HeroSection.tsx), para os
   dados do CRM ficarem uniformes entre a home e o chat. O texto vai literal em
   potentialValue, então o value é o próprio label. */
export const CAPITAL_OPTIONS: ChatStepOption[] = [
  { value: "De R$ 0 a R$ 30 mil (não tenho condições de adquirir a franquia atualmente)", label: "De R$ 0 a R$ 30 mil (não tenho condições de adquirir a franquia atualmente)" },
  { value: "De R$ 30 mil a R$ 50 mil", label: "De R$ 30 mil a R$ 50 mil" },
  { value: "De R$ 50 mil a R$ 70 mil", label: "De R$ 50 mil a R$ 70 mil" },
  { value: "Acima de R$ 70 mil", label: "Acima de R$ 70 mil" },
];

export const CHAT_STEPS: ChatStep[] = [
  {
    key: "nome",
    botText: ["Qual é o seu **nome completo**?"],
    type: "text",
    placeholder: "Digite seu nome completo",
    validate: (v) => (v.trim().length < 3 ? "Digite seu nome completo." : null),
  },
  {
    key: "whatsapp",
    botText: ["Perfeito. Qual o seu **WhatsApp com DDD**?"],
    type: "tel",
    placeholder: "(00) 00000-0000",
    validate: (v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length < 10 || digits.length > 11 ? "Digite um WhatsApp válido com DDD." : null;
    },
  },
  {
    key: "email",
    botText: ["E qual é o seu **e-mail**?"],
    type: "email",
    placeholder: "seuemail@exemplo.com",
    validate: (v) => (!/^\S+@\S+\.\S+$/.test(v) ? "Digite um e-mail válido." : null),
  },
  {
    key: "uf",
    botText: ["Em qual **estado** você quer abrir sua unidade?"],
    type: "uf",
    placeholder: "Selecione o estado",
    validate: (v) => (!v ? "Selecione um estado." : null),
  },
  {
    key: "cidade",
    botText: ["E em qual **cidade**?"],
    type: "cidade",
    placeholder: "Selecione a cidade",
    validate: (v) => (!v ? "Selecione uma cidade." : null),
  },
  {
    key: "capital",
    botText: ["Última pergunta.", "Quanto você tem **disponível para investir** na franquia?"],
    type: "buttons",
    validate: (v) => (!v ? "Selecione uma opção." : null),
  },
];
