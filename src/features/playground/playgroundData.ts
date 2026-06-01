export const PLAYGROUND_TABLE_NAME = "playground";

export type PlaygroundRecord = {
  id: string;
  nome: string;
  descricao: string;
  status: "rascunho" | "em_validacao" | "pronto";
};

export const playgroundRecords: PlaygroundRecord[] = [
  {
    id: "PG-001",
    nome: "Primeiro uso",
    descricao: "Validar abertura do app, configuracao inicial e leitura do menu.",
    status: "em_validacao",
  },
  {
    id: "PG-002",
    nome: "Radar inicial",
    descricao: "Experimentar a navegacao entre lista e detalhe antes do MVP.",
    status: "rascunho",
  },
  {
    id: "PG-003",
    nome: "Validacao QA",
    descricao: "Conferir estados basicos, selecao e detalhe do registro.",
    status: "pronto",
  },
];
