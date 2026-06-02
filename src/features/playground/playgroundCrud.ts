import type {
  PlaygroundRecord,
  StatusPlaygroundRecord,
} from "./playgroundData.ts";

export type PlaygroundDraft = Pick<
  PlaygroundRecord,
  "nome" | "descricao" | "codigoStatus"
>;

export type StatusRegistrationResult = {
  statusRecord: StatusPlaygroundRecord;
  statusRecords: StatusPlaygroundRecord[];
};

export type PlaygroundCreationResult = {
  record: PlaygroundRecord;
  records: PlaygroundRecord[];
};

function buildNextCode(currentCodes: string[], prefix: string) {
  const codePattern = new RegExp(`^${prefix}-(\\d+)$`);
  const nextNumber =
    currentCodes.reduce((highest, currentCode) => {
      const codeMatch = currentCode.match(codePattern);
      const codeNumber = codeMatch ? Number(codeMatch[1]) : Number.NaN;

      return Number.isFinite(codeNumber) && codeNumber > highest
        ? codeNumber
        : highest;
    }, 0) + 1;

  return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
}

export function normalizePlaygroundText(value: string) {
  return value.split(/\s+/u).filter(Boolean).join(" ");
}

export function getStatusName(
  statusRecords: StatusPlaygroundRecord[],
  codigoStatus: string,
) {
  return (
    statusRecords.find(
      (statusRecord) => statusRecord.codigoStatus === codigoStatus,
    )?.nome ?? "Status nao encontrado"
  );
}

export function registerStatusPlayground(
  statusRecords: StatusPlaygroundRecord[],
  nome: string,
): StatusRegistrationResult | null {
  const normalizedName = normalizePlaygroundText(nome);

  if (!normalizedName) {
    return null;
  }

  const existingStatus = statusRecords.find(
    (statusRecord) =>
      statusRecord.nome.toLocaleLowerCase() ===
      normalizedName.toLocaleLowerCase(),
  );

  if (existingStatus) {
    return {
      statusRecord: existingStatus,
      statusRecords,
    };
  }

  const statusRecord: StatusPlaygroundRecord = {
    codigoStatus: buildNextCode(
      statusRecords.map((record) => record.codigoStatus),
      "SP",
    ),
    nome: normalizedName,
  };

  return {
    statusRecord,
    statusRecords: [...statusRecords, statusRecord],
  };
}

export function createPlaygroundRecord(
  records: PlaygroundRecord[],
  draft: PlaygroundDraft,
): PlaygroundCreationResult | null {
  const normalizedName = normalizePlaygroundText(draft.nome);
  const normalizedDescription = normalizePlaygroundText(draft.descricao);
  const normalizedStatus = normalizePlaygroundText(draft.codigoStatus);

  if (!normalizedName || !normalizedDescription || !normalizedStatus) {
    return null;
  }

  const record: PlaygroundRecord = {
    id: buildNextCode(
      records.map((currentRecord) => currentRecord.id),
      "PG",
    ),
    nome: normalizedName,
    descricao: normalizedDescription,
    codigoStatus: normalizedStatus,
  };

  return {
    record,
    records: [...records, record],
  };
}

export function isPlaygroundDraftComplete(draft: PlaygroundDraft) {
  return Boolean(
    normalizePlaygroundText(draft.nome) &&
      normalizePlaygroundText(draft.descricao) &&
      normalizePlaygroundText(draft.codigoStatus),
  );
}

export function updatePlaygroundRecord(
  records: PlaygroundRecord[],
  id: string,
  draft: PlaygroundDraft,
) {
  const normalizedName = normalizePlaygroundText(draft.nome);
  const normalizedDescription = normalizePlaygroundText(draft.descricao);
  const normalizedStatus = normalizePlaygroundText(draft.codigoStatus);

  if (!normalizedName || !normalizedDescription || !normalizedStatus) {
    return records;
  }

  return records.map((record) =>
    record.id === id
      ? {
          ...record,
          nome: normalizedName,
          descricao: normalizedDescription,
          codigoStatus: normalizedStatus,
        }
      : record,
  );
}

export function deletePlaygroundRecord(records: PlaygroundRecord[], id: string) {
  return records.filter((record) => record.id !== id);
}
