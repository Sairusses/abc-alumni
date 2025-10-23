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
  getAllWorkHistory,
  addWorkHistory,
  updateWorkHistory,
  deleteWorkHistory,
} from "../db/workRepo";

interface WorkHistory {
  employment_id: number;
  alumni_id: number;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string;
  status: string;
}

export default function WorkHistoryPage() {
  const [records, setRecords] = useState<WorkHistory[]>([]);
  const [form, setForm] = useState({
    alumni_id: "",
    company_name: "",
    position: "",
    start_date: "",
    end_date: "",
    status: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const load = async () => {
    const rows = await getAllWorkHistory();
    const data: WorkHistory[] = rows.map((r: any[]) => ({
      employment_id: Number(r[0]) || 0,
      alumni_id: Number(r[1]) || 0,
      company_name: String(r[2] || ""),
      position: String(r[3] || ""),
      start_date: String(r[4] || ""),
      end_date: String(r[5] || ""),
      status: String(r[6] || ""),
    }));

    setRecords(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await updateWorkHistory(editId, form);
    else await addWorkHistory(form);
    setForm({
      alumni_id: "",
      company_name: "",
      position: "",
      start_date: "",
      end_date: "",
      status: "",
    });
    setEditId(null);
    load();
  };

  const handleDelete = async (id: number) => {
    await deleteWorkHistory(id);
    load();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">💼 Work History</h1>

      {/* Form */}
      <form
        className="space-y-3 bg-white p-4 rounded-lg shadow"
        onSubmit={handleSubmit}
      >
        <Input
          label="Alumni ID"
          value={form.alumni_id}
          onChange={(e) => setForm({ ...form, alumni_id: e.target.value })}
        />
        <Input
          label="Company Name"
          value={form.company_name}
          onChange={(e) => setForm({ ...form, company_name: e.target.value })}
        />
        <Input
          label="Position"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />
        <Input
          label="Start Date"
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
        />
        <Input
          label="End Date"
          type="date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
        />
        <Input
          label="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        />
        <Button color="primary" type="submit">
          {editId ? "Update" : "Add"}
        </Button>
      </form>

      {/* Table */}
      <Table aria-label="Work History Table" className="mt-6">
        <TableHeader>
          <TableColumn>Alumni ID</TableColumn>
          <TableColumn>Company</TableColumn>
          <TableColumn>Position</TableColumn>
          <TableColumn>Start</TableColumn>
          <TableColumn>End</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {records.map((r) => (
            <TableRow key={r.employment_id}>
              <TableCell>{r.alumni_id}</TableCell>
              <TableCell>{r.company_name}</TableCell>
              <TableCell>{r.position}</TableCell>
              <TableCell>{r.start_date}</TableCell>
              <TableCell>{r.end_date}</TableCell>
              <TableCell>{r.status}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onPress={() => {
                      setForm(r);
                      setEditId(r.employment_id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onPress={() => handleDelete(r.employment_id)}
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
