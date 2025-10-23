import { useEffect, useState } from "react";
import { Button, Input } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";

import {
  getAllParticipations,
  addParticipation,
  updateParticipation,
  deleteParticipation,
} from "../db/participationRepo";

interface Participation {
  participation_id: number;
  event_id: number;
  alumni_id: number;
  role: string;
}

export default function ParticipationPage() {
  const [records, setRecords] = useState<Participation[]>([]);
  const [form, setForm] = useState({
    event_id: "",
    alumni_id: "",
    role: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const load = async () => {
    const rows = await getAllParticipations();
    const data: Participation[] = rows.map((r: any[]) => ({
      participation_id: Number(r[0]) || 0,
      event_id: Number(r[1]) || 0,
      alumni_id: Number(r[2]) || 0,
      role: String(r[3] || ""),
    }));

    setRecords(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await updateParticipation(editId, form);
    else await addParticipation(form);
    setForm({ event_id: "", alumni_id: "", role: "" });
    setEditId(null);
    load();
  };

  const handleDelete = async (id: number) => {
    await deleteParticipation(id);
    load();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🗣️ Event Participation</h1>

      {/* Form */}
      <form
        className="space-y-3 bg-white p-4 rounded-lg shadow"
        onSubmit={handleSubmit}
      >
        <Input
          label="Event ID"
          value={form.event_id}
          onChange={(e) => setForm({ ...form, event_id: e.target.value })}
        />
        <Input
          label="Alumni ID"
          value={form.alumni_id}
          onChange={(e) => setForm({ ...form, alumni_id: e.target.value })}
        />
        <Input
          label="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
        <Button color="primary" type="submit">
          {editId ? "Update" : "Add"}
        </Button>
      </form>

      {/* Table */}
      <Table aria-label="Participation Table" className="mt-6">
        <TableHeader>
          <TableColumn>Event ID</TableColumn>
          <TableColumn>Alumni ID</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {records.map((r) => (
            <TableRow key={r.participation_id}>
              <TableCell>{r.event_id}</TableCell>
              <TableCell>{r.alumni_id}</TableCell>
              <TableCell>{r.role}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onPress={() => {
                      setForm(r);
                      setEditId(r.participation_id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onPress={() => handleDelete(r.participation_id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
