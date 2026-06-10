PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL COLLATE NOCASE,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  inactive_at TEXT,
  UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS people (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role_id TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  inactive_at TEXT,
  FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CHECK (length(trim(name)) > 0)
);

CREATE TABLE IF NOT EXISTS schools (
  id TEXT PRIMARY KEY,
  singleton_key INTEGER NOT NULL DEFAULT 1 CHECK (singleton_key = 1),
  name TEXT NOT NULL,
  current_director_person_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (current_director_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  UNIQUE (singleton_key),
  CHECK (length(trim(name)) > 0)
);

CREATE TABLE IF NOT EXISTS user_accounts (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  must_change_password INTEGER NOT NULL CHECK (must_change_password IN (0, 1)),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_login_at TEXT,
  FOREIGN KEY (person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  UNIQUE (username),
  CHECK (length(trim(username)) > 0),
  CHECK (length(trim(password_hash)) > 0)
);

CREATE TABLE IF NOT EXISTS access_recovery (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL UNIQUE,
  token_hash TEXT NOT NULL,
  recovery_question TEXT NOT NULL,
  recovery_answer_hash TEXT NOT NULL,
  token_was_shown INTEGER NOT NULL DEFAULT 1 CHECK (token_was_shown IN (0, 1)),
  invalidated_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (account_id)
    REFERENCES user_accounts(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CHECK (length(trim(token_hash)) > 0),
  CHECK (length(trim(recovery_question)) > 0),
  CHECK (length(trim(recovery_answer_hash)) > 0)
);

CREATE TABLE IF NOT EXISTS management_support (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL UNIQUE,
  granted_by_person_id TEXT NOT NULL,
  granted_at TEXT NOT NULL,
  revoked_by_person_id TEXT,
  revoked_at TEXT,
  FOREIGN KEY (person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  FOREIGN KEY (granted_by_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  FOREIGN KEY (revoked_by_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TRIGGER IF NOT EXISTS management_support_limit_insert
BEFORE INSERT ON management_support
WHEN NEW.revoked_at IS NULL
  AND (
    SELECT COUNT(*)
      FROM management_support
     WHERE revoked_at IS NULL
  ) >= 2
BEGIN
  SELECT RAISE(ABORT, 'management support is limited to two active people');
END;

CREATE TRIGGER IF NOT EXISTS management_support_limit_update
BEFORE UPDATE OF revoked_at ON management_support
WHEN NEW.revoked_at IS NULL
  AND OLD.revoked_at IS NOT NULL
  AND (
    SELECT COUNT(*)
      FROM management_support
     WHERE revoked_at IS NULL
       AND id <> OLD.id
  ) >= 2
BEGIN
  SELECT RAISE(ABORT, 'management support is limited to two active people');
END;

CREATE TABLE IF NOT EXISTS needs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL CHECK (
    status IN ('registered', 'in_progress', 'resolved', 'cancelled')
  ),
  created_by_person_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  resolved_at TEXT,
  resolution_summary TEXT,
  resolved_by_person_id TEXT,
  cancelled_at TEXT,
  cancellation_reason TEXT,
  cancelled_by_person_id TEXT,
  FOREIGN KEY (created_by_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  FOREIGN KEY (resolved_by_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  FOREIGN KEY (cancelled_by_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CHECK (length(trim(title)) > 0),
  CHECK (length(trim(description)) > 0),
  CHECK (length(trim(location)) > 0)
);

CREATE TABLE IF NOT EXISTS need_involved_people (
  id TEXT PRIMARY KEY,
  need_id TEXT NOT NULL,
  person_id TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_by_person_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  removed_by_person_id TEXT,
  removed_at TEXT,
  FOREIGN KEY (need_id)
    REFERENCES needs(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  FOREIGN KEY (created_by_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  FOREIGN KEY (removed_by_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS need_involved_people_active_unique
  ON need_involved_people (need_id, person_id)
  WHERE active = 1;

CREATE TABLE IF NOT EXISTS need_updates (
  id TEXT PRIMARY KEY,
  need_id TEXT NOT NULL,
  author_person_id TEXT NOT NULL,
  update_type TEXT NOT NULL CHECK (update_type IN ('progress', 'technical_closure')),
  description TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (need_id)
    REFERENCES needs(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (author_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CHECK (length(trim(description)) > 0)
);

CREATE TABLE IF NOT EXISTS need_action_plan_items (
  id TEXT PRIMARY KEY,
  need_id TEXT NOT NULL,
  description TEXT NOT NULL,
  responsible_person_id TEXT,
  created_by_person_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  completed_by_person_id TEXT,
  completed_at TEXT,
  FOREIGN KEY (need_id)
    REFERENCES needs(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (responsible_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  FOREIGN KEY (created_by_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  FOREIGN KEY (completed_by_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CHECK (length(trim(description)) > 0)
);

CREATE TABLE IF NOT EXISTS equipment (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  identification TEXT COLLATE NOCASE,
  current_state TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  inactive_at TEXT,
  CHECK (length(trim(name)) > 0),
  CHECK (length(trim(location)) > 0),
  CHECK (length(trim(current_state)) > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS equipment_active_identification_unique
  ON equipment (identification)
  WHERE identification IS NOT NULL AND active = 1;

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  actor_person_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  summary TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  FOREIGN KEY (actor_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CHECK (length(trim(event_type)) > 0),
  CHECK (length(trim(entity_type)) > 0),
  CHECK (length(trim(entity_id)) > 0),
  CHECK (length(trim(summary)) > 0)
);

CREATE TABLE IF NOT EXISTS security_exports (
  id TEXT PRIMARY KEY,
  format_version TEXT NOT NULL,
  file_name TEXT NOT NULL,
  destination_hint TEXT NOT NULL,
  exported_by_person_id TEXT NOT NULL,
  exported_at TEXT NOT NULL,
  checksum TEXT NOT NULL,
  FOREIGN KEY (exported_by_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CHECK (length(trim(format_version)) > 0),
  CHECK (length(trim(file_name)) > 0),
  CHECK (length(trim(checksum)) > 0)
);

CREATE TABLE IF NOT EXISTS security_imports (
  id TEXT PRIMARY KEY,
  format_version TEXT NOT NULL,
  source_file_name TEXT NOT NULL,
  restore_mode TEXT NOT NULL CHECK (restore_mode = 'replace_all'),
  imported_by_person_id TEXT NOT NULL,
  imported_at TEXT NOT NULL,
  source_checksum TEXT NOT NULL,
  FOREIGN KEY (imported_by_person_id)
    REFERENCES people(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CHECK (length(trim(format_version)) > 0),
  CHECK (length(trim(source_file_name)) > 0),
  CHECK (length(trim(source_checksum)) > 0)
);
