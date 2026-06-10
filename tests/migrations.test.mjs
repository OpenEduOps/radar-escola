import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { DatabaseSync } from "node:sqlite";

const migrationSql = readFileSync(
  new URL("../src-tauri/migrations/001_initial_mvp.sql", import.meta.url),
  "utf8",
);

const requiredTables = [
  "schools",
  "people",
  "roles",
  "user_accounts",
  "access_recovery",
  "management_support",
  "needs",
  "need_involved_people",
  "need_updates",
  "need_action_plan_items",
  "equipment",
  "audit_events",
  "security_exports",
  "security_imports",
];

describe("initial MVP SQLite migration", () => {
  it("roda em banco vazio e cria as tabelas planejadas", () => {
    const database = createMigratedDatabase();

    try {
      const tables = database
        .prepare(
          `
          SELECT name
            FROM sqlite_master
           WHERE type = 'table'
           ORDER BY name
          `,
        )
        .all()
        .map((row) => row.name);

      for (const tableName of requiredTables) {
        assert.equal(
          tables.includes(tableName),
          true,
          `tabela ${tableName} deve existir`,
        );
      }
    } finally {
      database.close();
    }
  });

  it("aplica constraints essenciais de configuracao, acesso e gestao", () => {
    const database = createMigratedDatabase();

    try {
      seedDirector(database);

      database.exec(`
        INSERT INTO schools (
          id,
          name,
          current_director_person_id,
          created_at,
          updated_at
        )
        VALUES ('S-001', 'Escola Municipal Esperanca', 'P-001', '2026-06-01', '2026-06-01');
      `);

      assert.throws(
        () =>
          database.exec(`
            INSERT INTO schools (
              id,
              name,
              current_director_person_id,
              created_at,
              updated_at
            )
            VALUES ('S-002', 'Outra Escola', 'P-001', '2026-06-01', '2026-06-01');
          `),
        /UNIQUE constraint failed/,
      );

      assert.throws(
        () =>
          database.exec(`
            INSERT INTO user_accounts (
              id,
              person_id,
              username,
              password_hash,
              must_change_password,
              active,
              created_at,
              updated_at
            )
            VALUES ('UA-002', 'P-001', 'direcao', '', 0, 1, '2026-06-01', '2026-06-01');
          `),
        /CHECK constraint failed/,
      );
    } finally {
      database.close();
    }
  });

  it("limita apoio de gestao ativo a duas pessoas", () => {
    const database = createMigratedDatabase();

    try {
      seedDirector(database);
      seedPerson(database, "P-002", "Ana Coordenacao", "ana");
      seedPerson(database, "P-003", "Joao Vice", "joao");
      seedPerson(database, "P-004", "Terceiro Apoio", "terceiro");

      database.exec(`
        INSERT INTO management_support (
          id,
          person_id,
          granted_by_person_id,
          granted_at
        )
        VALUES
          ('MS-001', 'P-002', 'P-001', '2026-06-01'),
          ('MS-002', 'P-003', 'P-001', '2026-06-01');
      `);

      assert.throws(
        () =>
          database.exec(`
            INSERT INTO management_support (
              id,
              person_id,
              granted_by_person_id,
              granted_at
            )
            VALUES ('MS-003', 'P-004', 'P-001', '2026-06-01');
          `),
        /management support is limited/,
      );
    } finally {
      database.close();
    }
  });

  it("garante restauracao registrada somente como substituicao total", () => {
    const database = createMigratedDatabase();

    try {
      seedDirector(database);

      assert.throws(
        () =>
          database.exec(`
            INSERT INTO security_imports (
              id,
              format_version,
              source_file_name,
              restore_mode,
              imported_by_person_id,
              imported_at,
              source_checksum
            )
            VALUES (
              'SI-001',
              'radar-escola.security.v1',
              'backup.csv',
              'merge',
              'P-001',
              '2026-06-01',
              'checksum'
            );
          `),
        /CHECK constraint failed/,
      );
    } finally {
      database.close();
    }
  });
});

function createMigratedDatabase() {
  const database = new DatabaseSync(":memory:");

  database.exec("PRAGMA foreign_keys = ON;");
  database.exec(migrationSql);

  return database;
}

function seedDirector(database) {
  seedRole(database);
  seedPerson(database, "P-001", "Maria Direcao", "direcao");
  database.exec(`
    INSERT INTO user_accounts (
      id,
      person_id,
      username,
      password_hash,
      must_change_password,
      active,
      created_at,
      updated_at
    )
    VALUES ('UA-001', 'P-001', 'direcao', 'hash-direcao', 0, 1, '2026-06-01', '2026-06-01');
  `);
}

function seedRole(database) {
  database.exec(`
    INSERT OR IGNORE INTO roles (
      id,
      name,
      active,
      created_at,
      updated_at
    )
    VALUES ('R-001', 'Direcao', 1, '2026-06-01', '2026-06-01');
  `);
}

function seedPerson(database, id, name, username) {
  seedRole(database);
  database.exec(`
    INSERT INTO people (
      id,
      name,
      role_id,
      active,
      created_at,
      updated_at
    )
    VALUES ('${id}', '${name}', 'R-001', 1, '2026-06-01', '2026-06-01');
  `);
}
