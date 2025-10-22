import { getDB, saveDB } from "./initDB";

export async function getAllParticipations() {
  const db = await getDB();
  const res = db.exec(
    "SELECT * FROM participated_alumni_event WHERE is_deleted = 0",
  );

  return res[0]?.values || [];
}

export async function addParticipation(data: Record<string, any>) {
  const db = await getDB();

  db.run(
    `INSERT INTO participated_alumni_event (
      event_id, alumni_id, role, created_by, date_created
    ) VALUES (?, ?, ?, 'admin', date('now'))`,
    [data.event_id, data.alumni_id, data.role],
  );
  saveDB();
}

export async function updateParticipation(
  id: number,
  data: Record<string, any>,
) {
  const db = await getDB();

  db.run(
    `UPDATE participated_alumni_event
     SET event_id=?, alumni_id=?, role=?, updated_by='admin', date_updated=date('now')
     WHERE participation_id=?`,
    [data.event_id, data.alumni_id, data.role, id],
  );
  saveDB();
}

export async function deleteParticipation(id: number) {
  const db = await getDB();

  db.run(
    "UPDATE participated_alumni_event SET is_deleted=1 WHERE participation_id=?",
    [id],
  );
  saveDB();
}
