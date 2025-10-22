import { getDB, saveDB } from "./initDB";

export async function getAllEvents() {
  const db = await getDB();
  const res = db.exec("SELECT * FROM events WHERE is_deleted = 0");

  return res[0]?.values || [];
}

export async function addEvent(data: Record<string, any>) {
  const db = await getDB();

  db.run(
    `INSERT INTO events (name, description, event_date, location, created_by, date_created)
     VALUES (?, ?, ?, ?, 'admin', date('now'))`,
    [data.name, data.description, data.event_date, data.location],
  );
  saveDB();
}

export async function updateEvent(id: number, data: Record<string, any>) {
  const db = await getDB();

  db.run(
    `UPDATE events
     SET name=?, description=?, event_date=?, location=?, updated_by='admin', date_updated=date('now')
     WHERE event_id=?`,
    [data.name, data.description, data.event_date, data.location, id],
  );
  saveDB();
}

export async function deleteEvent(id: number) {
  const db = await getDB();

  db.run("UPDATE events SET is_deleted=1 WHERE event_id=?", [id]);
  saveDB();
}
