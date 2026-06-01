export const PLAYGROUND_TABLE_NAME = "playground";

export type PlaygroundRecord = {
  id: string;
  title: string;
  status: "rascunho" | "em_validacao" | "pronto";
  owner: string;
  updatedAt: string;
  summary: string;
  nextStep: string;
};

export const playgroundRecords: PlaygroundRecord[] = [
  {
    id: "PG-001",
    title: "Primeiro uso",
    status: "em_validacao",
    owner: "Direcao",
    updatedAt: "2026-06-01",
    summary: "Validar abertura do app, configuracao inicial e leitura do menu.",
    nextStep: "Conectar este fluxo ao bootstrap SQLite.",
  },
  {
    id: "PG-002",
    title: "Radar inicial",
    status: "rascunho",
    owner: "Equipe de produto",
    updatedAt: "2026-06-01",
    summary: "Experimentar a navegacao entre lista e detalhe antes do MVP.",
    nextStep: "Trocar seed local por consulta da tabela playground.",
  },
  {
    id: "PG-003",
    title: "Validacao QA",
    status: "pronto",
    owner: "QA",
    updatedAt: "2026-06-01",
    summary: "Conferir estados basicos, selecao e detalhe do registro.",
    nextStep: "Criar teste automatizado quando o runner de UI existir.",
  },
];
