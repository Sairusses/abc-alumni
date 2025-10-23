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

// --- ALUMNI TABLE ENDPOINTS ---
app.get("/api/alumni", (_req, res) => {
  const rows = db.prepare("SELECT * FROM alumni WHERE is_deleted = 0").all();

  res.json(rows);
});

app.get("/api/alumni/:id", (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare("SELECT * FROM alumni WHERE alumni_id = ?").get(id);

  res.json(row);
});

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

app.delete("/api/alumni/:id", (req, res) => {
  const id = Number(req.params.id);
  const { deleted_by } = req.body;
  const stmt = db.prepare(`
    UPDATE alumni SET is_deleted=1, deleted_by=?, date_updated=datetime('now') WHERE alumni_id=?
  `);
  const info = stmt.run(deleted_by, id);

  res.json({ changes: info.changes });
});

// --- WORK HISTORY ENDPOINTS ---
app.get("/api/work_history", (_req, res) => {
  const rows = db
    .prepare("SELECT * FROM work_history WHERE is_deleted = 0")
    .all();

  res.json(rows);
});

app.post("/api/work_history", (req, res) => {
  const {
    alumni_id,
    company_name,
    position,
    start_date,
    end_date,
    status,
    created_by,
  } = req.body;
  const stmt = db.prepare(`
    INSERT INTO work_history 
    (alumni_id, company_name, position, start_date, end_date, status, created_by, date_created) 
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  const info = stmt.run(
    alumni_id,
    company_name,
    position,
    start_date,
    end_date,
    status,
    created_by,
  );

  res.json({ insertedId: info.lastInsertRowid });
});

app.put("/api/work_history/:id", (req, res) => {
  const id = Number(req.params.id);
  const {
    alumni_id,
    company_name,
    position,
    start_date,
    end_date,
    status,
    updated_by,
  } = req.body;
  const stmt = db.prepare(`
    UPDATE work_history
    SET alumni_id=?, company_name=?, position=?, start_date=?, end_date=?, status=?, updated_by=?, date_updated=datetime('now')
    WHERE employment_id=?
  `);
  const info = stmt.run(
    alumni_id,
    company_name,
    position,
    start_date,
    end_date,
    status,
    updated_by,
    id,
  );

  res.json({ changes: info.changes });
});

app.delete("/api/work_history/:id", (req, res) => {
  const id = Number(req.params.id);
  const { deleted_by } = req.body;
  const stmt = db.prepare(`
    UPDATE work_history SET is_deleted=1, deleted_by=?, date_updated=datetime('now') WHERE employment_id=?
  `);
  const info = stmt.run(deleted_by, id);

  res.json({ changes: info.changes });
});

// --- EVENTS ENDPOINTS ---
app.get("/api/events", (_req, res) => {
  const rows = db.prepare("SELECT * FROM events WHERE is_deleted = 0").all();

  res.json(rows);
});

app.post("/api/events", (req, res) => {
  const { name, description, event_date, location, created_by } = req.body;
  const stmt = db.prepare(`
    INSERT INTO events
    (name, description, event_date, location, created_by, date_created)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `);
  const info = stmt.run(name, description, event_date, location, created_by);

  res.json({ insertedId: info.lastInsertRowid });
});

app.put("/api/events/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, description, event_date, location, updated_by } = req.body;
  const stmt = db.prepare(`
    UPDATE events
    SET name=?, description=?, event_date=?, location=?, updated_by=?, date_updated=datetime('now')
    WHERE event_id=?
  `);
  const info = stmt.run(
    name,
    description,
    event_date,
    location,
    updated_by,
    id,
  );

  res.json({ changes: info.changes });
});

app.delete("/api/events/:id", (req, res) => {
  const id = Number(req.params.id);
  const { deleted_by } = req.body;
  const stmt = db.prepare(`
    UPDATE events SET is_deleted=1, deleted_by=?, date_updated=datetime('now') WHERE event_id=?
  `);
  const info = stmt.run(deleted_by, id);

  res.json({ changes: info.changes });
});

// --- PARTICIPATION ENDPOINTS ---
app.get("/api/participated_alumni_event", (_req, res) => {
  const rows = db
    .prepare("SELECT * FROM participated_alumni_event WHERE is_deleted = 0")
    .all();

  res.json(rows);
});

app.post("/api/participated_alumni_event", (req, res) => {
  const { event_id, alumni_id, role, created_by } = req.body;
  const stmt = db.prepare(`
    INSERT INTO participated_alumni_event
    (event_id, alumni_id, role, created_by, date_created)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);
  const info = stmt.run(event_id, alumni_id, role, created_by);

  res.json({ insertedIyd: info.lastInsertRowid });
});

app.put("/api/participated_alumni_event/:id", (req, res) => {
  const id = Number(req.params.id);
  const { event_id, alumni_id, role, updated_by } = req.body;
  const stmt = db.prepare(`
    UPDATE participated_alumni_event
    SET event_id=?, alumni_id=?, role=?, updated_by=?, date_updated=datetime('now')
    WHERE participation_id=?
  `);
  const info = stmt.run(event_id, alumni_id, role, updated_by, id);

  res.json({ changes: info.changes });
});

app.delete("/api/participated_alumni_event/:id", (req, res) => {
  const id = Number(req.params.id);
  const { deleted_by } = req.body;
  const stmt = db.prepare(`
    UPDATE participated_alumni_event
    SET is_deleted=1, deleted_by=?, date_updated=datetime('now')
    WHERE participation_id=?
  `);
  const info = stmt.run(deleted_by, id);

  res.json({ changes: info.changes });
});

// Start server
const PORT = 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
