use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use std::{fs, sync::Mutex};
use tauri::{App, Manager, State};

pub struct RadarDatabase {
    connection: Mutex<Connection>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RadarState {
    school: Option<School>,
    people: Vec<Person>,
    needs: Vec<Need>,
    next_ids: NextIds,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct NextIds {
    person: u32,
    need: u32,
    update: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct School {
    id: String,
    name: String,
    director_person_id: String,
    created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Person {
    id: String,
    name: String,
    username: String,
    role_name: String,
    profile: String,
    password_hash: String,
    recovery_token_hash: Option<String>,
    recovery_question: Option<String>,
    recovery_answer_hash: Option<String>,
    must_change_password: bool,
    active: bool,
    created_at: String,
    updated_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Need {
    id: String,
    title: String,
    description: String,
    location: String,
    priority: String,
    status: String,
    involved_person_ids: Vec<String>,
    updates: Vec<NeedUpdate>,
    created_by_person_id: String,
    created_at: String,
    updated_at: String,
    resolved_at: Option<String>,
    resolution_summary: Option<String>,
    resolved_by_person_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct NeedUpdate {
    id: String,
    author_person_id: String,
    description: String,
    created_at: String,
}

pub fn open_radar_database(app: &App) -> Result<RadarDatabase, String> {
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

    Ok(RadarDatabase {
        connection: Mutex::new(connection),
    })
}

#[tauri::command]
pub fn radar_load_state(database: State<'_, RadarDatabase>) -> Result<RadarState, String> {
    let connection = lock_connection(&database)?;

    load_state(&connection)
}

#[tauri::command]
pub fn radar_save_state(
    database: State<'_, RadarDatabase>,
    state: RadarState,
) -> Result<RadarState, String> {
    let mut connection = lock_connection(&database)?;

    save_state(&mut connection, &state)?;
    load_state(&connection)
}

fn initialize_schema(connection: &Connection) -> Result<(), String> {
    connection
        .execute_batch(
            "
            PRAGMA foreign_keys = ON;

            CREATE TABLE IF NOT EXISTS radar_people (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                username TEXT NOT NULL UNIQUE COLLATE NOCASE,
                role_name TEXT NOT NULL,
                profile TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                recovery_token_hash TEXT,
                recovery_question TEXT,
                recovery_answer_hash TEXT,
                must_change_password INTEGER NOT NULL CHECK (must_change_password IN (0, 1)),
                active INTEGER NOT NULL CHECK (active IN (0, 1)),
                created_at TEXT NOT NULL,
                updated_at TEXT
            );

            CREATE TABLE IF NOT EXISTS radar_schools (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                director_person_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (director_person_id)
                    REFERENCES radar_people(id)
                    ON UPDATE CASCADE
                    ON DELETE RESTRICT
            );

            CREATE TABLE IF NOT EXISTS radar_needs (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                location TEXT NOT NULL,
                priority TEXT NOT NULL,
                status TEXT NOT NULL,
                created_by_person_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                resolved_at TEXT,
                resolution_summary TEXT,
                resolved_by_person_id TEXT,
                FOREIGN KEY (created_by_person_id)
                    REFERENCES radar_people(id)
                    ON UPDATE CASCADE
                    ON DELETE RESTRICT,
                FOREIGN KEY (resolved_by_person_id)
                    REFERENCES radar_people(id)
                    ON UPDATE CASCADE
                    ON DELETE SET NULL
            );

            CREATE TABLE IF NOT EXISTS radar_need_involved_people (
                need_id TEXT NOT NULL,
                person_id TEXT NOT NULL,
                position INTEGER NOT NULL,
                PRIMARY KEY (need_id, person_id),
                FOREIGN KEY (need_id)
                    REFERENCES radar_needs(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,
                FOREIGN KEY (person_id)
                    REFERENCES radar_people(id)
                    ON UPDATE CASCADE
                    ON DELETE RESTRICT
            );

            CREATE TABLE IF NOT EXISTS radar_need_updates (
                id TEXT PRIMARY KEY,
                need_id TEXT NOT NULL,
                author_person_id TEXT NOT NULL,
                description TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (need_id)
                    REFERENCES radar_needs(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,
                FOREIGN KEY (author_person_id)
                    REFERENCES radar_people(id)
                    ON UPDATE CASCADE
                    ON DELETE RESTRICT
            );
            ",
        )
        .map_err(|error| format!("Nao foi possivel criar schema Radar: {error}"))
}

fn save_state(connection: &mut Connection, state: &RadarState) -> Result<(), String> {
    let transaction = connection
        .transaction()
        .map_err(|error| format!("Nao foi possivel iniciar gravacao Radar: {error}"))?;

    transaction
        .execute_batch(
            "
            PRAGMA foreign_keys = ON;
            DELETE FROM radar_need_updates;
            DELETE FROM radar_need_involved_people;
            DELETE FROM radar_needs;
            DELETE FROM radar_schools;
            DELETE FROM radar_people;
            ",
        )
        .map_err(|error| format!("Nao foi possivel limpar estado Radar: {error}"))?;

    for person in &state.people {
        transaction
            .execute(
                "
                INSERT INTO radar_people (
                    id,
                    name,
                    username,
                    role_name,
                    profile,
                    password_hash,
                    recovery_token_hash,
                    recovery_question,
                    recovery_answer_hash,
                    must_change_password,
                    active,
                    created_at,
                    updated_at
                )
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)
                ",
                params![
                    person.id,
                    person.name,
                    person.username,
                    person.role_name,
                    person.profile,
                    person.password_hash,
                    person.recovery_token_hash,
                    person.recovery_question,
                    person.recovery_answer_hash,
                    bool_to_i64(person.must_change_password),
                    bool_to_i64(person.active),
                    person.created_at,
                    person.updated_at,
                ],
            )
            .map_err(|error| format!("Nao foi possivel salvar pessoa Radar: {error}"))?;
    }

    if let Some(school) = &state.school {
        transaction
            .execute(
                "
                INSERT INTO radar_schools (id, name, director_person_id, created_at)
                VALUES (?1, ?2, ?3, ?4)
                ",
                params![
                    school.id,
                    school.name,
                    school.director_person_id,
                    school.created_at,
                ],
            )
            .map_err(|error| format!("Nao foi possivel salvar escola Radar: {error}"))?;
    }

    for need in &state.needs {
        transaction
            .execute(
                "
                INSERT INTO radar_needs (
                    id,
                    title,
                    description,
                    location,
                    priority,
                    status,
                    created_by_person_id,
                    created_at,
                    updated_at,
                    resolved_at,
                    resolution_summary,
                    resolved_by_person_id
                )
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)
                ",
                params![
                    need.id,
                    need.title,
                    need.description,
                    need.location,
                    need.priority,
                    need.status,
                    need.created_by_person_id,
                    need.created_at,
                    need.updated_at,
                    need.resolved_at,
                    need.resolution_summary,
                    need.resolved_by_person_id,
                ],
            )
            .map_err(|error| format!("Nao foi possivel salvar necessidade Radar: {error}"))?;

        for (position, person_id) in need.involved_person_ids.iter().enumerate() {
            transaction
                .execute(
                    "
                    INSERT INTO radar_need_involved_people (need_id, person_id, position)
                    VALUES (?1, ?2, ?3)
                    ",
                    params![need.id, person_id, position as i64],
                )
                .map_err(|error| format!("Nao foi possivel salvar envolvido Radar: {error}"))?;
        }

        for update in &need.updates {
            transaction
                .execute(
                    "
                    INSERT INTO radar_need_updates (
                        id,
                        need_id,
                        author_person_id,
                        description,
                        created_at
                    )
                    VALUES (?1, ?2, ?3, ?4, ?5)
                    ",
                    params![
                        update.id,
                        need.id,
                        update.author_person_id,
                        update.description,
                        update.created_at,
                    ],
                )
                .map_err(|error| format!("Nao foi possivel salvar andamento Radar: {error}"))?;
        }
    }

    transaction
        .commit()
        .map_err(|error| format!("Nao foi possivel concluir gravacao Radar: {error}"))
}

fn load_state(connection: &Connection) -> Result<RadarState, String> {
    let people = load_people(connection)?;
    let school = load_school(connection)?;
    let needs = load_needs(connection)?;
    let next_ids = NextIds {
        person: next_code_number(people.iter().map(|person| person.id.as_str()), "P"),
        need: next_code_number(needs.iter().map(|need| need.id.as_str()), "N"),
        update: next_code_number(
            needs
                .iter()
                .flat_map(|need| need.updates.iter().map(|update| update.id.as_str())),
            "U",
        ),
    };

    Ok(RadarState {
        school,
        people,
        needs,
        next_ids,
    })
}

fn load_school(connection: &Connection) -> Result<Option<School>, String> {
    connection
        .query_row(
            "
            SELECT id, name, director_person_id, created_at
              FROM radar_schools
             ORDER BY created_at DESC, id DESC
             LIMIT 1
            ",
            [],
            |row| {
                Ok(School {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    director_person_id: row.get(2)?,
                    created_at: row.get(3)?,
                })
            },
        )
        .optional()
        .map_err(|error| format!("Nao foi possivel carregar escola Radar: {error}"))
}

fn load_people(connection: &Connection) -> Result<Vec<Person>, String> {
    let mut statement = connection
        .prepare(
            "
            SELECT
                id,
                name,
                username,
                role_name,
                profile,
                password_hash,
                recovery_token_hash,
                recovery_question,
                recovery_answer_hash,
                must_change_password,
                active,
                created_at,
                updated_at
              FROM radar_people
             ORDER BY id
            ",
        )
        .map_err(|error| format!("Nao foi possivel preparar pessoas Radar: {error}"))?;
    let rows = statement
        .query_map([], |row| {
            Ok(Person {
                id: row.get(0)?,
                name: row.get(1)?,
                username: row.get(2)?,
                role_name: row.get(3)?,
                profile: row.get(4)?,
                password_hash: row.get(5)?,
                recovery_token_hash: row.get(6)?,
                recovery_question: row.get(7)?,
                recovery_answer_hash: row.get(8)?,
                must_change_password: row.get::<_, i64>(9)? == 1,
                active: row.get::<_, i64>(10)? == 1,
                created_at: row.get(11)?,
                updated_at: row.get(12)?,
            })
        })
        .map_err(|error| format!("Nao foi possivel consultar pessoas Radar: {error}"))?;

    collect_rows(rows, "pessoas Radar")
}

fn load_needs(connection: &Connection) -> Result<Vec<Need>, String> {
    let mut statement = connection
        .prepare(
            "
            SELECT
                id,
                title,
                description,
                location,
                priority,
                status,
                created_by_person_id,
                created_at,
                updated_at,
                resolved_at,
                resolution_summary,
                resolved_by_person_id
              FROM radar_needs
             ORDER BY created_at DESC, id DESC
            ",
        )
        .map_err(|error| format!("Nao foi possivel preparar necessidades Radar: {error}"))?;
    let rows = statement
        .query_map([], |row| {
            Ok(Need {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
                location: row.get(3)?,
                priority: row.get(4)?,
                status: row.get(5)?,
                involved_person_ids: Vec::new(),
                updates: Vec::new(),
                created_by_person_id: row.get(6)?,
                created_at: row.get(7)?,
                updated_at: row.get(8)?,
                resolved_at: row.get(9)?,
                resolution_summary: row.get(10)?,
                resolved_by_person_id: row.get(11)?,
            })
        })
        .map_err(|error| format!("Nao foi possivel consultar necessidades Radar: {error}"))?;
    let mut needs = collect_rows(rows, "necessidades Radar")?;

    for need in &mut needs {
        need.involved_person_ids = load_involved_person_ids(connection, &need.id)?;
        need.updates = load_need_updates(connection, &need.id)?;
    }

    Ok(needs)
}

fn load_involved_person_ids(
    connection: &Connection,
    need_id: &str,
) -> Result<Vec<String>, String> {
    let mut statement = connection
        .prepare(
            "
            SELECT person_id
              FROM radar_need_involved_people
             WHERE need_id = ?1
             ORDER BY position, person_id
            ",
        )
        .map_err(|error| format!("Nao foi possivel preparar envolvidos Radar: {error}"))?;
    let rows = statement
        .query_map(params![need_id], |row| row.get::<_, String>(0))
        .map_err(|error| format!("Nao foi possivel consultar envolvidos Radar: {error}"))?;

    collect_rows(rows, "envolvidos Radar")
}

fn load_need_updates(connection: &Connection, need_id: &str) -> Result<Vec<NeedUpdate>, String> {
    let mut statement = connection
        .prepare(
            "
            SELECT id, author_person_id, description, created_at
              FROM radar_need_updates
             WHERE need_id = ?1
             ORDER BY created_at, id
            ",
        )
        .map_err(|error| format!("Nao foi possivel preparar andamentos Radar: {error}"))?;
    let rows = statement
        .query_map(params![need_id], |row| {
            Ok(NeedUpdate {
                id: row.get(0)?,
                author_person_id: row.get(1)?,
                description: row.get(2)?,
                created_at: row.get(3)?,
            })
        })
        .map_err(|error| format!("Nao foi possivel consultar andamentos Radar: {error}"))?;

    collect_rows(rows, "andamentos Radar")
}

fn bool_to_i64(value: bool) -> i64 {
    if value {
        1
    } else {
        0
    }
}

fn next_code_number<'a>(codes: impl Iterator<Item = &'a str>, prefix: &str) -> u32 {
    codes
        .filter_map(|code| code.strip_prefix(&format!("{prefix}-")))
        .filter_map(|suffix| suffix.parse::<u32>().ok())
        .max()
        .unwrap_or(0)
        + 1
}

fn lock_connection<'a>(
    database: &'a State<'_, RadarDatabase>,
) -> Result<std::sync::MutexGuard<'a, Connection>, String> {
    database
        .connection
        .lock()
        .map_err(|_| "Banco local do Radar esta indisponivel.".to_string())
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

        initialize_schema(&connection).expect("deve criar schema Radar");

        connection
    }

    fn sample_state() -> RadarState {
        RadarState {
            school: Some(School {
                id: "S-001".to_string(),
                name: "Escola Municipal Esperanca".to_string(),
                director_person_id: "P-001".to_string(),
                created_at: "2026-06-01T12:00:00.000Z".to_string(),
            }),
            people: vec![
                Person {
                    id: "P-001".to_string(),
                    name: "Maria Direcao".to_string(),
                    username: "direcao".to_string(),
                    role_name: "Direcao".to_string(),
                    profile: "direction".to_string(),
                    password_hash: "hash-direcao".to_string(),
                    recovery_token_hash: Some("hash-token".to_string()),
                    recovery_question: Some("Bairro onde cresceu".to_string()),
                    recovery_answer_hash: Some("hash-resposta".to_string()),
                    must_change_password: false,
                    active: true,
                    created_at: "2026-06-01T12:00:00.000Z".to_string(),
                    updated_at: None,
                },
                Person {
                    id: "P-002".to_string(),
                    name: "Ana Coordenacao".to_string(),
                    username: "ana".to_string(),
                    role_name: "Coordenacao".to_string(),
                    profile: "user".to_string(),
                    password_hash: "hash-123456".to_string(),
                    recovery_token_hash: Some("hash-token-ana".to_string()),
                    recovery_question: Some("Apelido de infancia".to_string()),
                    recovery_answer_hash: Some("hash-ana".to_string()),
                    must_change_password: false,
                    active: true,
                    created_at: "2026-06-01T12:10:00.000Z".to_string(),
                    updated_at: Some("2026-06-01T12:20:00.000Z".to_string()),
                },
            ],
            needs: vec![Need {
                id: "N-001".to_string(),
                title: "Computador da secretaria nao liga".to_string(),
                description: "Equipamento usado para atendimento esta parado.".to_string(),
                location: "Secretaria".to_string(),
                priority: "high".to_string(),
                status: "resolved".to_string(),
                involved_person_ids: vec!["P-002".to_string()],
                updates: vec![NeedUpdate {
                    id: "U-001".to_string(),
                    author_person_id: "P-002".to_string(),
                    description: "Fonte foi testada e precisa de troca.".to_string(),
                    created_at: "2026-06-01T13:00:00.000Z".to_string(),
                }],
                created_by_person_id: "P-001".to_string(),
                created_at: "2026-06-01T12:30:00.000Z".to_string(),
                updated_at: "2026-06-01T14:00:00.000Z".to_string(),
                resolved_at: Some("2026-06-01T14:00:00.000Z".to_string()),
                resolution_summary: Some("Fonte substituida.".to_string()),
                resolved_by_person_id: Some("P-001".to_string()),
            }],
            next_ids: NextIds {
                person: 3,
                need: 2,
                update: 2,
            },
        }
    }

    #[test]
    fn loads_empty_state_from_new_database() {
        let connection = create_initialized_connection();
        let state = load_state(&connection).expect("deve carregar estado vazio");

        assert!(state.school.is_none());
        assert!(state.people.is_empty());
        assert!(state.needs.is_empty());
        assert_eq!(state.next_ids.person, 1);
        assert_eq!(state.next_ids.need, 1);
        assert_eq!(state.next_ids.update, 1);
    }

    #[test]
    fn saves_and_loads_complete_radar_flow() {
        let mut connection = create_initialized_connection();
        let state = sample_state();

        save_state(&mut connection, &state).expect("deve salvar estado Radar");

        let loaded_state = load_state(&connection).expect("deve recarregar estado Radar");

        assert_eq!(
            loaded_state.school.expect("deve ter escola").name,
            state.school.unwrap().name
        );
        assert_eq!(loaded_state.people.len(), 2);
        assert_eq!(loaded_state.people[1].username, "ana");
        assert_eq!(loaded_state.needs.len(), 1);
        assert_eq!(loaded_state.needs[0].involved_person_ids, vec!["P-002"]);
        assert_eq!(
            loaded_state.needs[0].updates[0].description,
            "Fonte foi testada e precisa de troca."
        );
        assert_eq!(loaded_state.needs[0].status, "resolved");
        assert_eq!(loaded_state.next_ids.person, 3);
        assert_eq!(loaded_state.next_ids.need, 2);
        assert_eq!(loaded_state.next_ids.update, 2);
    }

    #[test]
    fn replaces_state_transactionally() {
        let mut connection = create_initialized_connection();
        let first_state = sample_state();
        let mut second_state = sample_state();

        second_state.people.pop();
        second_state.needs.clear();
        second_state.school = None;

        save_state(&mut connection, &first_state).expect("deve salvar primeiro estado");
        save_state(&mut connection, &second_state).expect("deve substituir estado");

        let loaded_state = load_state(&connection).expect("deve recarregar estado substituido");

        assert!(loaded_state.school.is_none());
        assert_eq!(loaded_state.people.len(), 1);
        assert!(loaded_state.needs.is_empty());
        assert_eq!(loaded_state.next_ids.person, 2);
        assert_eq!(loaded_state.next_ids.need, 1);
        assert_eq!(loaded_state.next_ids.update, 1);
    }
}
