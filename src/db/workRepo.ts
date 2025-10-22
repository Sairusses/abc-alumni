import { getDB, saveDB } from "./initDB";

export async function getAllWorkHistory() {
  const db = await getDB();
  const res = db.exec("SELECT * FROM work_history WHERE is_deleted = 0");

  return res[0]?.values || [];
}

export async function addWorkHistory(data: Record<string, any>) {
  const db = await getDB();

  db.run(
    `INSERT INTO work_history (
      alumni_id, company_name, position, start_date, end_date, status,
      created_by, date_created
    ) VALUES (?, ?, ?, ?, ?, ?, 'admin', date('now'))`,
    [
      data.alumni_id,
      data.company_name,
      data.position,
      data.start_date,
      data.end_date,
      data.status,
    ],
  );
  saveDB();
}

export async function updateWorkHistory(id: number, data: Record<string, any>) {
  const db = await getDB();

  db.run(
    `UPDATE work_history
     SET company_name=?, position=?, start_date=?, end_date=?, status=?, updated_by='admin', date_updated=date('now')
     WHERE employment_id=?`,
    [
      data.company_name,
      data.position,
      data.start_date,
      data.end_date,
      data.status,
      id,
    ],
  );
  saveDB();
}

export async function deleteWorkHistory(id: number) {
  const db = await getDB();

  db.run("UPDATE work_history SET is_deleted=1 WHERE employment_id=?", [id]);
  saveDB();
}
