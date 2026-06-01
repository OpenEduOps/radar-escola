export const PLAYGROUND_TABLE_NAME = "playground";
export const STATUS_PLAYGROUND_TABLE_NAME = "status_playground";

export type StatusPlaygroundRecord = {
  id: string;
  nome: string;
};

export type PlaygroundRecord = {
  id: string;
  nome: string;
  descricao: string;
  statusPlaygroundId: string;
};

export const statusPlaygroundRecords: StatusPlaygroundRecord[] = [
  {
    id: "SP-001",
    nome: "Status A",
  },
  {
    id: "SP-002",
    nome: "Status B",
  },
  {
    id: "SP-003",
    nome: "Status C",
  },
];

export const playgroundRecords: PlaygroundRecord[] = [
  {
    id: "PG-001",
    nome: "Primeiro uso",
    descricao: "Validar abertura do app, configuracao inicial e leitura do menu.",
    statusPlaygroundId: "SP-001",
  },
  {
    id: "PG-002",
    nome: "Radar inicial",
    descricao: "Experimentar a navegacao entre lista e detalhe antes do MVP.",
    statusPlaygroundId: "SP-002",
  },
  {
    id: "PG-003",
    nome: "Validacao QA",
    descricao: "Conferir estados basicos, selecao e detalhe do registro.",
    statusPlaygroundId: "SP-003",
  },
];
