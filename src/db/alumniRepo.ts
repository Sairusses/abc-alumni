import { getDB, saveDB } from "./initDB";

export async function getAllAlumni() {
  const db = await getDB();
  const res = db.exec("SELECT * FROM alumni WHERE is_deleted = 0");

  return res[0]?.values || [];
}

export async function addAlumni(data: Record<string, any>) {
  const db = await getDB();

  db.run(
    `INSERT INTO alumni (
      first_name, last_name, middle_name, gender, date_of_birth, email, phone_number,
      address, graduation_year, degree, status, created_by, date_created
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin', date('now'))`,
    [
      data.first_name,
      data.last_name,
      data.middle_name,
      data.gender,
      data.date_of_birth,
      data.email,
      data.phone_number,
      data.address,
      data.graduation_year,
      data.degree,
      data.status,
    ],
  );
  saveDB();
}

export async function updateAlumni(id: number, data: Record<string, any>) {
  const db = await getDB();

  db.run(
    `UPDATE alumni SET first_name=?, last_name=?, email=?, status=?, updated_by='admin', date_updated=date('now')
     WHERE alumni_id=?`,
    [data.first_name, data.last_name, data.email, data.status, id],
  );
  saveDB();
}

export async function deleteAlumni(id: number) {
  const db = await getDB();

  db.run(`UPDATE alumni SET is_deleted=1 WHERE alumni_id=?`, [id]);
  saveDB();
}
