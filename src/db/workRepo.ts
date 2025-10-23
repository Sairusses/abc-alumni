import { getDB } from "./initDB";

export type EmploymentStatus = "Current" | "Previous";

export interface WorkHistory {
  employment_id?: number;
  alumni_id: number;
  company_name: string;
  position: string;
  start_date: string;
  end_date?: string;
  status: EmploymentStatus;
  created_by?: string;
  date_created?: string;
  updated_by?: string;
  date_updated?: string;
  deleted_by?: string;
  is_deleted?: number;
}

export class WorkRepo {
  db = getDB();

  create(work: WorkHistory) {
    const stmt = this.db.prepare(`
      INSERT INTO work_history (
        alumni_id, company_name, position, start_date, end_date, status,
        created_by, date_created
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      work.alumni_id,
      work.company_name,
      work.position,
      work.start_date,
      work.end_date || null,
      work.status,
      work.created_by || null,
      work.date_created || new Date().toISOString()
    );
  }

  findAllByAlumni(alumni_id: number) {
    return this.db
      .prepare("SELECT * FROM work_history WHERE alumni_id = ? AND is_deleted = 0")
      .all(alumni_id);
  }

  findById(id: number) {
    return this.db
      .prepare("SELECT * FROM work_history WHERE employment_id = ?")
      .get(id);
  }

  update(id: number, data: Partial<WorkHistory>) {
    const fields = Object.keys(data)
      .map((k) => `${k} = @${k}`)
      .join(", ");
    this.db
      .prepare(`UPDATE work_history SET ${fields} WHERE employment_id = @id`)
      .run({ ...data, id });
  }

  softDelete(id: number, deleted_by?: string) {
    this.db
      .prepare(`UPDATE work_history SET is_deleted = 1, deleted_by = ? WHERE employment_id = ?`)
      .run(deleted_by || null, id);
  }
}
