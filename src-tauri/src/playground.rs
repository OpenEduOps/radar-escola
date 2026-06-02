use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::{fs, sync::Mutex};
use tauri::{App, Manager, State};

pub struct PlaygroundDatabase {
    connection: Mutex<Connection>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PlaygroundSnapshot {
    status_records: Vec<StatusPlaygroundRecord>,
    playground_records: Vec<PlaygroundRecord>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StatusPlaygroundMutation {
    status_record: StatusPlaygroundRecord,
    snapshot: PlaygroundSnapshot,
}

#[derive(Debug, Serialize)]
pub struct PlaygroundMutation {
    record: PlaygroundRecord,
    snapshot: PlaygroundSnapshot,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StatusPlaygroundRecord {
    codigo_status: String,
    nome: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PlaygroundRecord {
    id: String,
    nome: String,
    descricao: String,
    codigo_status: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlaygroundDraft {
    nome: String,
    descricao: String,
    codigo_status: String,
}

pub fn open_playground_database(app: &App) -> Result<PlaygroundDatabase, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| format!("Nao foi possivel localizar a pasta de dados: {error}"))?;

    fs::create_dir_all(&app_data_dir)
        .map_err(|error| format!("Nao foi possivel criar a pasta de dados: {error}"))?;

    let database_path = app_data_dir.join("radar-escola.sqlite3");
    let connection = Connection::open(database_path)
        .map_err(|error| format!("Nao foi possivel abrir o banco local: {error}"))?;

    initialize_schema(&connection)?;
    seed_initial_data(&connection)?;

    Ok(PlaygroundDatabase {
        connection: Mutex::new(connection),
    })
}

#[tauri::command]
pub fn playground_load(
    database: State<'_, PlaygroundDatabase>,
) -> Result<PlaygroundSnapshot, String> {
    let connection = lock_connection(&database)?;

    load_snapshot(&connection)
}

#[tauri::command]
pub fn playground_register_status(
    database: State<'_, PlaygroundDatabase>,
    nome: String,
) -> Result<StatusPlaygroundMutation, String> {
    let normalized_name = normalize_required(&nome, "Nome do status e obrigatorio.")?;
    let connection = lock_connection(&database)?;

    if let Some(status_record) = find_status_by_name(&connection, &normalized_name)? {
        return Ok(StatusPlaygroundMutation {
            status_record,
            snapshot: load_snapshot(&connection)?,
        });
    }

    let status_record = StatusPlaygroundRecord {
        codigo_status: next_status_code(&connection)?,
        nome: normalized_name,
    };

    connection
        .execute(
            "INSERT INTO status_playground (codigo_status, nome) VALUES (?1, ?2)",
            params![status_record.codigo_status, status_record.nome],
        )
        .map_err(|error| format!("Nao foi possivel cadastrar status: {error}"))?;

    Ok(StatusPlaygroundMutation {
        status_record,
        snapshot: load_snapshot(&connection)?,
    })
}

#[tauri::command]
pub fn playground_create_record(
    database: State<'_, PlaygroundDatabase>,
    draft: PlaygroundDraft,
) -> Result<PlaygroundMutation, String> {
    let normalized_name = normalize_required(&draft.nome, "Nome e obrigatorio.")?;
    let normalized_description = normalize_required(&draft.descricao, "Descricao e obrigatoria.")?;
    let normalized_status = normalize_required(&draft.codigo_status, "Status e obrigatorio.")?;
    let connection = lock_connection(&database)?;

    ensure_status_exists(&connection, &normalized_status)?;

    let record = PlaygroundRecord {
        id: next_playground_id(&connection)?,
        nome: normalized_name,
        descricao: normalized_description,
        codigo_status: normalized_status,
    };

    connection
        .execute(
            "
            INSERT INTO playground (id, nome, descricao, codigo_status)
            VALUES (?1, ?2, ?3, ?4)
            ",
            params![
                record.id,
                record.nome,
                record.descricao,
                record.codigo_status
            ],
        )
        .map_err(|error| format!("Nao foi possivel cadastrar playground: {error}"))?;

    Ok(PlaygroundMutation {
        record,
        snapshot: load_snapshot(&connection)?,
    })
}

#[tauri::command]
pub fn playground_update_record(
    database: State<'_, PlaygroundDatabase>,
    id: String,
    draft: PlaygroundDraft,
) -> Result<PlaygroundMutation, String> {
    let normalized_id = normalize_required(&id, "Registro playground e obrigatorio.")?;
    let normalized_name = normalize_required(&draft.nome, "Nome e obrigatorio.")?;
    let normalized_description = normalize_required(&draft.descricao, "Descricao e obrigatoria.")?;
    let normalized_status = normalize_required(&draft.codigo_status, "Status e obrigatorio.")?;
    let connection = lock_connection(&database)?;

    ensure_status_exists(&connection, &normalized_status)?;

    connection
        .execute(
            "
            UPDATE playground
               SET nome = ?2,
                   descricao = ?3,
                   codigo_status = ?4,
                   updated_at = CURRENT_TIMESTAMP
             WHERE id = ?1
            ",
            params![
                normalized_id,
                normalized_name,
                normalized_description,
                normalized_status
            ],
        )
        .map_err(|error| format!("Nao foi possivel atualizar playground: {error}"))?;

    let record = find_playground_by_id(&connection, &normalized_id)?
        .ok_or_else(|| "Registro playground nao encontrado.".to_string())?;

    Ok(PlaygroundMutation {
        record,
        snapshot: load_snapshot(&connection)?,
    })
}

#[tauri::command]
pub fn playground_delete_record(
    database: State<'_, PlaygroundDatabase>,
    id: String,
) -> Result<PlaygroundSnapshot, String> {
    let normalized_id = normalize_required(&id, "Registro playground e obrigatorio.")?;
    let connection = lock_connection(&database)?;

    connection
        .execute(
            "DELETE FROM playground WHERE id = ?1",
            params![normalized_id],
        )
        .map_err(|error| format!("Nao foi possivel excluir playground: {error}"))?;

    load_snapshot(&connection)
}

fn initialize_schema(connection: &Connection) -> Result<(), String> {
    connection
        .execute_batch(
            "
            PRAGMA foreign_keys = ON;

            CREATE TABLE IF NOT EXISTS status_playground (
                codigo_status TEXT PRIMARY KEY,
                nome TEXT NOT NULL UNIQUE COLLATE NOCASE,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS playground (
                id TEXT PRIMARY KEY,
                nome TEXT NOT NULL,
                descricao TEXT NOT NULL,
                codigo_status TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (codigo_status)
                    REFERENCES status_playground(codigo_status)
                    ON UPDATE CASCADE
                    ON DELETE RESTRICT
            );
            ",
        )
        .map_err(|error| format!("Nao foi possivel criar schema playground: {error}"))
}

fn seed_initial_data(connection: &Connection) -> Result<(), String> {
    let initial_statuses = [
        ("SP-001", "Status A"),
        ("SP-002", "Status B"),
        ("SP-003", "Status C"),
    ];
    let initial_records = [
        (
            "PG-001",
            "Primeiro uso",
            "Validar abertura do app, configuracao inicial e leitura do menu.",
            "SP-001",
        ),
        (
            "PG-002",
            "Radar inicial",
            "Experimentar a navegacao entre lista e detalhe antes do MVP.",
            "SP-002",
        ),
        (
            "PG-003",
            "Validacao QA",
            "Conferir estados basicos, selecao e detalhe do registro.",
            "SP-003",
        ),
    ];

    for (codigo_status, nome) in initial_statuses {
        connection
            .execute(
                "
                INSERT OR IGNORE INTO status_playground (codigo_status, nome)
                VALUES (?1, ?2)
                ",
                params![codigo_status, nome],
            )
            .map_err(|error| format!("Nao foi possivel semear status: {error}"))?;
    }

    for (id, nome, descricao, codigo_status) in initial_records {
        connection
            .execute(
                "
                INSERT OR IGNORE INTO playground (id, nome, descricao, codigo_status)
                VALUES (?1, ?2, ?3, ?4)
                ",
                params![id, nome, descricao, codigo_status],
            )
            .map_err(|error| format!("Nao foi possivel semear playground: {error}"))?;
    }

    Ok(())
}

fn load_snapshot(connection: &Connection) -> Result<PlaygroundSnapshot, String> {
    Ok(PlaygroundSnapshot {
        status_records: load_status_records(connection)?,
        playground_records: load_playground_records(connection)?,
    })
}

fn load_status_records(connection: &Connection) -> Result<Vec<StatusPlaygroundRecord>, String> {
    let mut statement = connection
        .prepare(
            "
            SELECT codigo_status, nome
              FROM status_playground
             ORDER BY codigo_status
            ",
        )
        .map_err(|error| format!("Nao foi possivel preparar consulta de status: {error}"))?;
    let rows = statement
        .query_map([], |row| {
            Ok(StatusPlaygroundRecord {
                codigo_status: row.get(0)?,
                nome: row.get(1)?,
            })
        })
        .map_err(|error| format!("Nao foi possivel consultar status: {error}"))?;

    collect_rows(rows, "status")
}

fn load_playground_records(connection: &Connection) -> Result<Vec<PlaygroundRecord>, String> {
    let mut statement = connection
        .prepare(
            "
            SELECT id, nome, descricao, codigo_status
              FROM playground
             ORDER BY id
            ",
        )
        .map_err(|error| format!("Nao foi possivel preparar consulta playground: {error}"))?;
    let rows = statement
        .query_map([], |row| {
            Ok(PlaygroundRecord {
                id: row.get(0)?,
                nome: row.get(1)?,
                descricao: row.get(2)?,
                codigo_status: row.get(3)?,
            })
        })
        .map_err(|error| format!("Nao foi possivel consultar playground: {error}"))?;

    collect_rows(rows, "playground")
}

fn find_status_by_name(
    connection: &Connection,
    name: &str,
) -> Result<Option<StatusPlaygroundRecord>, String> {
    let mut statement = connection
        .prepare(
            "
            SELECT codigo_status, nome
              FROM status_playground
             WHERE nome = ?1 COLLATE NOCASE
             LIMIT 1
            ",
        )
        .map_err(|error| format!("Nao foi possivel preparar busca de status: {error}"))?;
    let mut rows = statement
        .query(params![name])
        .map_err(|error| format!("Nao foi possivel buscar status: {error}"))?;

    if let Some(row) = rows
        .next()
        .map_err(|error| format!("Nao foi possivel ler status: {error}"))?
    {
        return Ok(Some(StatusPlaygroundRecord {
            codigo_status: row.get(0).map_err(|error| error.to_string())?,
            nome: row.get(1).map_err(|error| error.to_string())?,
        }));
    }

    Ok(None)
}

fn find_playground_by_id(
    connection: &Connection,
    id: &str,
) -> Result<Option<PlaygroundRecord>, String> {
    let mut statement = connection
        .prepare(
            "
            SELECT id, nome, descricao, codigo_status
              FROM playground
             WHERE id = ?1
             LIMIT 1
            ",
        )
        .map_err(|error| format!("Nao foi possivel preparar busca playground: {error}"))?;
    let mut rows = statement
        .query(params![id])
        .map_err(|error| format!("Nao foi possivel buscar playground: {error}"))?;

    if let Some(row) = rows
        .next()
        .map_err(|error| format!("Nao foi possivel ler playground: {error}"))?
    {
        return Ok(Some(PlaygroundRecord {
            id: row.get(0).map_err(|error| error.to_string())?,
            nome: row.get(1).map_err(|error| error.to_string())?,
            descricao: row.get(2).map_err(|error| error.to_string())?,
            codigo_status: row.get(3).map_err(|error| error.to_string())?,
        }));
    }

    Ok(None)
}

fn ensure_status_exists(connection: &Connection, codigo_status: &str) -> Result<(), String> {
    let mut statement = connection
        .prepare(
            "
            SELECT 1
              FROM status_playground
             WHERE codigo_status = ?1
             LIMIT 1
            ",
        )
        .map_err(|error| format!("Nao foi possivel preparar validacao de status: {error}"))?;
    let mut rows = statement
        .query(params![codigo_status])
        .map_err(|error| format!("Nao foi possivel validar status: {error}"))?;
    let exists = rows
        .next()
        .map_err(|error| format!("Nao foi possivel ler validacao de status: {error}"))?
        .is_some();

    if !exists {
        return Err("Status playground nao encontrado.".to_string());
    }

    Ok(())
}

fn next_status_code(connection: &Connection) -> Result<String, String> {
    next_code(
        load_codes(connection, "SELECT codigo_status FROM status_playground")?,
        "SP",
    )
}

fn next_playground_id(connection: &Connection) -> Result<String, String> {
    next_code(load_codes(connection, "SELECT id FROM playground")?, "PG")
}

fn load_codes(connection: &Connection, sql: &str) -> Result<Vec<String>, String> {
    let mut statement = connection
        .prepare(sql)
        .map_err(|error| format!("Nao foi possivel preparar sequencia: {error}"))?;
    let rows = statement
        .query_map([], |row| row.get::<_, String>(0))
        .map_err(|error| format!("Nao foi possivel consultar sequencia: {error}"))?;

    collect_rows(rows, "sequencia")
}

fn next_code(codes: Vec<String>, prefix: &str) -> Result<String, String> {
    let next_number = codes
        .iter()
        .filter_map(|code| code.strip_prefix(&format!("{prefix}-")))
        .filter_map(|suffix| suffix.parse::<u32>().ok())
        .max()
        .unwrap_or(0)
        + 1;

    Ok(format!("{prefix}-{:03}", next_number))
}

fn normalize_required(value: &str, message: &str) -> Result<String, String> {
    let normalized = value.split_whitespace().collect::<Vec<_>>().join(" ");

    if normalized.is_empty() {
        return Err(message.to_string());
    }

    Ok(normalized)
}

fn lock_connection<'a>(
    database: &'a State<'_, PlaygroundDatabase>,
) -> Result<std::sync::MutexGuard<'a, Connection>, String> {
    database
        .connection
        .lock()
        .map_err(|_| "Banco local do playground esta indisponivel.".to_string())
}

fn collect_rows<T, F>(rows: rusqlite::MappedRows<'_, F>, label: &str) -> Result<Vec<T>, String>
where
    F: FnMut(&rusqlite::Row<'_>) -> rusqlite::Result<T>,
{
    rows.collect::<rusqlite::Result<Vec<_>>>()
        .map_err(|error| format!("Nao foi possivel carregar {label}: {error}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_initialized_connection() -> Connection {
        let connection =
            Connection::open_in_memory().expect("deve abrir SQLite em memoria");

        initialize_schema(&connection).expect("deve criar schema playground");
        seed_initial_data(&connection).expect("deve carregar seed playground");

        connection
    }

    #[test]
    fn initializes_schema_with_seed_data() {
        let connection = create_initialized_connection();
        let snapshot = load_snapshot(&connection).expect("deve carregar snapshot");

        assert_eq!(snapshot.status_records.len(), 3);
        assert_eq!(snapshot.playground_records.len(), 3);
        assert_eq!(snapshot.status_records[0].codigo_status, "SP-001");
        assert_eq!(snapshot.playground_records[0].id, "PG-001");
    }

    #[test]
    fn keeps_seed_idempotent() {
        let connection = create_initialized_connection();

        seed_initial_data(&connection).expect("deve manter seed idempotente");

        let snapshot = load_snapshot(&connection).expect("deve carregar snapshot");

        assert_eq!(snapshot.status_records.len(), 3);
        assert_eq!(snapshot.playground_records.len(), 3);
    }

    #[test]
    fn calculates_next_codes_from_existing_rows() {
        let connection = create_initialized_connection();

        assert_eq!(
            next_status_code(&connection).expect("deve calcular status"),
            "SP-004"
        );
        assert_eq!(
            next_playground_id(&connection).expect("deve calcular playground"),
            "PG-004"
        );
    }

    #[test]
    fn validates_status_relation_before_mutation() {
        let connection = create_initialized_connection();

        assert!(ensure_status_exists(&connection, "SP-001").is_ok());
        assert_eq!(
            ensure_status_exists(&connection, "SP-999")
                .expect_err("deve rejeitar status inexistente"),
            "Status playground nao encontrado."
        );
    }
}
