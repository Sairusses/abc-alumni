import initSqlJs, { Database } from "sql.js";

let db: Database | null = null;

export async function getDB(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  db = new SQL.Database();
  createTables(db);

  return db;
}

function createTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS alumni (
      alumni_id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT,
      last_name TEXT,
      middle_name TEXT,
      gender TEXT,
      date_of_birth TEXT,
      email TEXT,
      phone_number TEXT,
      address TEXT,
      graduation_year INTEGER,
      degree TEXT,
      status TEXT,
      created_by TEXT,
      date_created TEXT,
      updated_by TEXT,
      date_updated TEXT,
      deleted_by TEXT,
      is_deleted INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS work_history (
      employment_id INTEGER PRIMARY KEY AUTOINCREMENT,
      alumni_id INTEGER,
      company_name TEXT,
      position TEXT,
      start_date TEXT,
      end_date TEXT,
      status TEXT,
      created_by TEXT,
      date_created TEXT,
      updated_by TEXT,
      date_updated TEXT,
      deleted_by TEXT,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY(alumni_id) REFERENCES alumni(alumni_id)
    );

    CREATE TABLE IF NOT EXISTS events (
      event_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      event_date TEXT,
      location TEXT,
      created_by TEXT,
      date_created TEXT,
      updated_by TEXT,
      date_updated TEXT,
      deleted_by TEXT,
      is_deleted INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS participated_alumni_event (
       participation_id INTEGER PRIMARY KEY AUTOINCREMENT,
       event_id INTEGER,
       alumni_id INTEGER,
       role TEXT,
       created_by TEXT,
       date_created TEXT,
       updated_by TEXT,
       date_updated TEXT,
       deleted_by TEXT,
       is_deleted INTEGER DEFAULT 0,
       FOREIGN KEY(event_id) REFERENCES events(event_id),
       FOREIGN KEY(alumni_id) REFERENCES alumni(alumni_id)
     );
  `);
}

export function saveDB() {
  if (!db) return;
  const data = db.export();

  localStorage.setItem("abc_alumni", JSON.stringify(Array.from(data)));
}

export function loadDB(SQL: any) {
  const saved = localStorage.getItem("abc_alumni");

  if (saved) {
    const uInt8Array = new Uint8Array(JSON.parse(saved));

    db = new SQL.Database(uInt8Array);
  }
}
