import path from "path";

import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const app = express();

app.use(cors());
app.use(express.json());

// SQLite database
const dbPath = path.resolve("./abc-alumni.sqlite");
const db = new Database(dbPath);

// --- API Endpoints ---

app.get("/api/alumni", (_req, res) => {
  const rows = db.prepare("SELECT * FROM alumni WHERE is_deleted = 0").all();

  res.json(rows);
});

app.get("/api/alumni/:id", (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare("SELECT * FROM alumni WHERE alumni_id = ?").get(id);

  res.json(row);
});

// Add a new alumni
app.post("/api/alumni", (req, res) => {
  const {
    first_name,
    last_name,
    middle_name,
    gender,
    date_of_birth,
    email,
    phone_number,
    address,
    graduation_year,
    degree,
    status,
    created_by,
  } = req.body;
  const stmt = db.prepare(`
    INSERT INTO alumni 
    (first_name, last_name, middle_name, gender, date_of_birth, email, phone_number, address, graduation_year, degree, status, created_by, date_created) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  const info = stmt.run(
    first_name,
    last_name,
    middle_name,
    gender,
    date_of_birth,
    email,
    phone_number,
    address,
    graduation_year,
    degree,
    status,
    created_by,
  );

  res.json({ insertedId: info.lastInsertRowid });
});

// Update alumni
app.put("/api/alumni/:id", (req, res) => {
  const id = Number(req.params.id);
  const {
    first_name,
    last_name,
    middle_name,
    gender,
    date_of_birth,
    email,
    phone_number,
    address,
    graduation_year,
    degree,
    status,
    updated_by,
  } = req.body;
  const stmt = db.prepare(`
    UPDATE alumni 
    SET first_name=?, last_name=?, middle_name=?, gender=?, date_of_birth=?, email=?, phone_number=?, address=?, graduation_year=?, degree=?, status=?, updated_by=?, date_updated=datetime('now')
    WHERE alumni_id=?
  `);
  const info = stmt.run(
    first_name,
    last_name,
    middle_name,
    gender,
    date_of_birth,
    email,
    phone_number,
    address,
    graduation_year,
    degree,
    status,
    updated_by,
    id,
  );

  res.json({ changes: info.changes });
});

// delete alumni
app.delete("/api/alumni/:id", (req, res) => {
  const id = Number(req.params.id);
  const { deleted_by } = req.body;
  const stmt = db.prepare(`
    UPDATE alumni SET is_deleted=1, deleted_by=?, date_updated=datetime('now') WHERE alumni_id=?
  `);
  const info = stmt.run(deleted_by, id);

  res.json({ changes: info.changes });
});

// Start server
const PORT = 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
