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
  const normalizedName = nome.trim();

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
  const normalizedName = draft.nome.trim();
  const normalizedDescription = draft.descricao.trim();

  if (!normalizedName || !normalizedDescription || !draft.codigoStatus) {
    return null;
  }

  const record: PlaygroundRecord = {
    id: buildNextCode(
      records.map((currentRecord) => currentRecord.id),
      "PG",
    ),
    nome: normalizedName,
    descricao: normalizedDescription,
    codigoStatus: draft.codigoStatus,
  };

  return {
    record,
    records: [...records, record],
  };
}

export function isPlaygroundDraftComplete(draft: PlaygroundDraft) {
  return Boolean(
    draft.nome.trim() && draft.descricao.trim() && draft.codigoStatus,
  );
}

export function updatePlaygroundRecord(
  records: PlaygroundRecord[],
  id: string,
  draft: PlaygroundDraft,
) {
  const normalizedName = draft.nome.trim();
  const normalizedDescription = draft.descricao.trim();

  if (!normalizedName || !normalizedDescription || !draft.codigoStatus) {
    return records;
  }

  return records.map((record) =>
    record.id === id
      ? {
          ...record,
          nome: normalizedName,
          descricao: normalizedDescription,
          codigoStatus: draft.codigoStatus,
        }
      : record,
  );
}

export function deletePlaygroundRecord(records: PlaygroundRecord[], id: string) {
  return records.filter((record) => record.id !== id);
}
