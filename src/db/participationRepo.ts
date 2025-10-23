import { getDB } from "./initDB";

export type ParticipationRole = "Attendee" | "Organizer" | "Speaker";

export interface Participation {
  participation_id?: number;
  event_id: number;
  alumni_id: number;
  role: ParticipationRole;
  created_by?: string;
  date_created?: string;
  updated_by?: string;
  date_updated?: string;
  deleted_by?: string;
  is_deleted?: number;
}

export class ParticipationRepo {
  db = getDB();

  create(part: Participation) {
    const stmt = this.db.prepare(`
      INSERT INTO participated_alumni_event (
        event_id, alumni_id, role, created_by, date_created
      ) VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(
      part.event_id,
      part.alumni_id,
      part.role,
      part.created_by || null,
      part.date_created || new Date().toISOString()
    );
  }

  findAllByEvent(event_id: number) {
    return this.db
      .prepare("SELECT * FROM participated_alumni_event WHERE event_id = ? AND is_deleted = 0")
      .all(event_id);
  }

  findAllByAlumni(alumni_id: number) {
    return this.db
      .prepare("SELECT * FROM participated_alumni_event WHERE alumni_id = ? AND is_deleted = 0")
      .all(alumni_id);
  }

  findById(id: number) {
    return this.db
      .prepare("SELECT * FROM participated_alumni_event WHERE participation_id = ?")
      .get(id);
  }

  update(id: number, data: Partial<Participation>) {
    const fields = Object.keys(data)
      .map((k) => `${k} = @${k}`)
      .join(", ");
    this.db
      .prepare(`UPDATE participated_alumni_event SET ${fields} WHERE participation_id = @id`)
      .run({ ...data, id });
  }

  softDelete(id: number, deleted_by?: string) {
    this.db
      .prepare(`UPDATE participated_alumni_event SET is_deleted = 1, deleted_by = ? WHERE participation_id = ?`)
      .run(deleted_by || null, id);
  }
}