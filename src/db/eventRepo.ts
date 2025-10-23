import { getDB } from "./initDB";

export interface Event {
  event_id?: number;
  name: string;
  description?: string;
  event_date: string;
  location?: string;
  created_by?: string;
  date_created?: string;
  updated_by?: string;
  date_updated?: string;
  deleted_by?: string;
  is_deleted?: number;
}

export class EventRepo {
  db = getDB();

  create(event: Event) {
    const stmt = this.db.prepare(`
      INSERT INTO events (
        name, description, event_date, location, created_by, date_created
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      event.name,
      event.description || null,
      event.event_date,
      event.location || null,
      event.created_by || null,
      event.date_created || new Date().toISOString()
    );
  }

  findAll() {
    return this.db.prepare("SELECT * FROM events WHERE is_deleted = 0").all();
  }

  findById(id: number) {
    return this.db.prepare("SELECT * FROM events WHERE event_id = ?").get(id);
  }

  update(id: number, data: Partial<Event>) {
    const fields = Object.keys(data)
      .map((k) => `${k} = @${k}`)
      .join(", ");
    this.db.prepare(`UPDATE events SET ${fields} WHERE event_id = @id`).run({ ...data, id });
  }

  softDelete(id: number, deleted_by?: string) {
    this.db
      .prepare(`UPDATE events SET is_deleted = 1, deleted_by = ? WHERE event_id = ?`)
      .run(deleted_by || null, id);
  }
}