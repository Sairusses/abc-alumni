import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import {
  WorkHistory,
  findAllWork,
  createWork,
  updateWork,
  softDeleteWork,
  Alumni,
  findAllAlumni,
} from "../db/workRepo";

export default function WorkHistoryPage() {
  const [work, setWork] = useState<WorkHistory[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [form, setForm] = useState<Partial<WorkHistory>>({});
  const [editId, setEditId] = useState<number | null>(null);

  const load = async () => {
    try {
      const [workRows, alumniRows] = await Promise.all([
        findAllWork(),
        findAllAlumni(),
      ]);

      setWork(workRows);
      setAlumni(alumniRows);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateWork(editId, form);
      } else {
        await createWork(form as WorkHistory);
      }
      setForm({});
      setEditId(null);
      await load();
    } catch (err) {
      console.error("Failed to save work history", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await softDeleteWork(id, form.updated_by || "unknown_user");
      await load();
    } catch (err) {
      console.error("Failed to delete work history", err);
    }
  };

  const statusOptions: WorkHistory["status"][] = ["Current", "Previous"];

  // Preload alumni into key-label format for Select
  const alumniOptions = alumni.map((a) => ({
    key: String(a.alumni_id),
    label: `${a.first_name} ${a.last_name}`,
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 dark:bg-[#121212] rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Work History
      </h1>

      {/* Form */}
      <form
        className="grid grid-cols-2 gap-4 bg-white dark:bg-[#1A1A1A] p-6 rounded-xl shadow-md mb-8"
        onSubmit={handleSubmit}
      >
        <Select
          items={alumniOptions}
          label="Alumni"
          placeholder="Select Alumni"
          selectedKeys={form.alumni_id ? [String(form.alumni_id)] : []}
          onChange={(e) =>
            setForm({ ...form, alumni_id: Number(e.target.value) })
          }
        >
          {(item) => <SelectItem>{item.label}</SelectItem>}
        </Select>

        <Input
          label="Company Name"
          value={form.company_name || ""}
          onChange={(e) => setForm({ ...form, company_name: e.target.value })}
        />
        <Input
          label="Position"
          value={form.position || ""}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />
        <Input
          label="Start Date"
          type="date"
          value={form.start_date || ""}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
        />
        <Input
          label="End Date"
          type="date"
          value={form.end_date || ""}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
        />

        <Select
          items={statusOptions.map((s) => ({ key: s, label: s }))}
          label="Status"
          placeholder="Select Status"
          selectedKeys={form.status ? [form.status] : []}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value as WorkHistory["status"],
            })
          }
        >
          {(item) => <SelectItem>{item.label}</SelectItem>}
        </Select>

        <Input
          isDisabled={!editId}
          label="Updated By"
          value={form.updated_by || ""}
          onChange={(e) => setForm({ ...form, updated_by: e.target.value })}
        />

        <div className="md:col-span-1" />

        <div className="md:col-span-2">
          <Button className="w-full py-2" type="submit">
            {editId ? "Update Record" : "Add Record"}
          </Button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table aria-label="Work History Table" className="min-w-full">
          <TableHeader>
            <TableColumn>Alumni</TableColumn>
            <TableColumn>Company</TableColumn>
            <TableColumn>Position</TableColumn>
            <TableColumn>Start Date</TableColumn>
            <TableColumn>End Date</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Updated By</TableColumn>
            <TableColumn>Date Updated</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {work.map((w) => {
              const alumniName = alumni.find(
                (a) => a.alumni_id === w.alumni_id,
              );

              return (
                <TableRow key={w.employment_id}>
                  <TableCell>
                    {alumniName
                      ? `${alumniName.first_name} ${alumniName.last_name}`
                      : "—"}
                  </TableCell>
                  <TableCell>{w.company_name}</TableCell>
                  <TableCell>{w.position}</TableCell>
                  <TableCell>{w.start_date}</TableCell>
                  <TableCell>{w.end_date || "—"}</TableCell>
                  <TableCell>{w.status}</TableCell>
                  <TableCell>{w.updated_by || "—"}</TableCell>
                  <TableCell>{w.date_updated || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onPress={() => {
                          setForm(w);
                          setEditId(w.employment_id ?? null);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onPress={() => handleDelete(w.employment_id ?? 0)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
