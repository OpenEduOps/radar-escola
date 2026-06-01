export const PLAYGROUND_TABLE_NAME = "playground";
export const STATUS_PLAYGROUND_TABLE_NAME = "status_playground";

export type StatusPlaygroundRecord = {
  codigoStatus: string;
  nome: string;
};

export type PlaygroundRecord = {
  id: string;
  nome: string;
  descricao: string;
  codigoStatus: string;
};

export const statusPlaygroundRecords: StatusPlaygroundRecord[] = [
  {
    codigoStatus: "SP-001",
    nome: "Status A",
  },
  {
    codigoStatus: "SP-002",
    nome: "Status B",
  },
  {
    codigoStatus: "SP-003",
    nome: "Status C",
  },
];

export const playgroundRecords: PlaygroundRecord[] = [
  {
    id: "PG-001",
    nome: "Primeiro uso",
    descricao: "Validar abertura do app, configuracao inicial e leitura do menu.",
    codigoStatus: "SP-001",
  },
  {
    id: "PG-002",
    nome: "Radar inicial",
    descricao: "Experimentar a navegacao entre lista e detalhe antes do MVP.",
    codigoStatus: "SP-002",
  },
  {
    id: "PG-003",
    nome: "Validacao QA",
    descricao: "Conferir estados basicos, selecao e detalhe do registro.",
    codigoStatus: "SP-003",
  },
];
