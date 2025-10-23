import path from "path";

import Database from "better-sqlite3";

const dbPath = path.resolve(__dirname, "abc-alumni.sqlite");

let db: Database.Database | null = null;

export function getDB(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
  }

  return db;
}
