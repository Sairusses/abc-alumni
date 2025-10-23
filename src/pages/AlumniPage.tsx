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

import { Alumni, findAll, create, update, softDelete } from "@/backend/alumniHelper.ts";

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [form, setForm] = useState<Partial<Alumni>>({});
  const [editId, setEditId] = useState<number | null>(null);

  // Load alumni from API
  const load = async () => {
    try {
      const rows = await findAll();

      setAlumni(rows);
    } catch (err) {
      console.error("Failed to load alumni", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await update(editId, form);
      } else {
        await create(form as Alumni);
      }
      setForm({});
      setEditId(null);
      await load();
    } catch (err) {
      console.error("Failed to save alumni", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await softDelete(id, form.updated_by || "unknown_user");
      await load();
    } catch (err) {
      console.error("Failed to delete alumni", err);
    }
  };

  // Dropdown options
  const years = Array.from({ length: 50 }, (_, i) =>
    String(1980 + i),
  ).reverse();
  const degreeOptions = [
    "BSCS - Bachelor of Science in Computer Science",
    "BSIT - Bachelor of Science in Information Technology",
    "BSBA - Bachelor of Science in Business Administration",
    "BSEd - Bachelor of Secondary Education",
    "BSCE - Bachelor of Science in Civil Engineering",
  ];
  const statusOptions: Alumni["status"][] = [
    "Employed",
    "Unemployed",
    "Self-Employed",
    "Studying",
  ];
  const genderOptions: Alumni["gender"][] = ["M", "F"];

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 dark:bg-[#121212] rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        ABC Alumni Database
      </h1>

      {/* Form */}
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-[#1A1A1A] p-6 rounded-xl shadow-md"
        onSubmit={handleSubmit}
      >
        <Input
          label="First Name"
          value={form.first_name || ""}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />
        <Input
          label="Last Name"
          value={form.last_name || ""}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
        <Input
          label="Middle Name"
          value={form.middle_name || ""}
          onChange={(e) => setForm({ ...form, middle_name: e.target.value })}
        />

        <Select
          label="Gender"
          placeholder="Select Gender"
          selectedKeys={form.gender ? [form.gender] : []}
          onChange={(e) =>
            setForm({ ...form, gender: e.target.value as Alumni["gender"] })
          }
        >
          {genderOptions.map((g) => (
            <SelectItem key={g}>{g}</SelectItem>
          ))}
        </Select>

        <Input
          label="Date of Birth"
          type="date"
          value={form.date_of_birth || ""}
          onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
        />
        <Input
          label="Email"
          value={form.email || ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Phone Number"
          value={form.phone_number || ""}
          onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
        />
        <Input
          label="Address"
          value={form.address || ""}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <Select
          label="Graduation Year"
          placeholder="Select Year"
          selectedKeys={
            form.graduation_year ? [String(form.graduation_year)] : []
          }
          onChange={(e) =>
            setForm({ ...form, graduation_year: Number(e.target.value) })
          }
        >
          {years.map((year) => (
            <SelectItem key={year}>{year}</SelectItem>
          ))}
        </Select>

        <Select
          label="Degree"
          placeholder="Select Degree"
          selectedKeys={form.degree ? [form.degree] : []}
          onChange={(e) => setForm({ ...form, degree: e.target.value })}
        >
          {degreeOptions.map((deg) => (
            <SelectItem key={deg}>{deg}</SelectItem>
          ))}
        </Select>

        <Select
          label="Status"
          placeholder="Select Status"
          selectedKeys={form.status ? [form.status] : []}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value as Alumni["status"] })
          }
        >
          {statusOptions.map((st) => (
            <SelectItem key={st}>{st}</SelectItem>
          ))}
        </Select>

        <Input
          isDisabled={!editId}
          label="Updated By"
          placeholder="Enter your username"
          value={form.updated_by || ""}
          onChange={(e) => setForm({ ...form, updated_by: e.target.value })}
        />

        <div className="md:col-span-2 mt-4">
          <Button className="w-full py-2 font-semibold" type="submit">
            {editId ? "Update Record" : "Add Record"}
          </Button>
        </div>
      </form>

      {/* Table */}
      <Table aria-label="Alumni Table" className="mt-8">
        <TableHeader>
          <TableColumn>First Name</TableColumn>
          <TableColumn>Last Name</TableColumn>
          <TableColumn>Gender</TableColumn>
          <TableColumn>Degree</TableColumn>
          <TableColumn>Graduation Year</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Updated By</TableColumn>
          <TableColumn>Date Updated</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {alumni.map((a) => (
            <TableRow key={a.alumni_id}>
              <TableCell>{a.first_name}</TableCell>
              <TableCell>{a.last_name}</TableCell>
              <TableCell>{a.gender}</TableCell>
              <TableCell>{a.degree}</TableCell>
              <TableCell>{a.graduation_year}</TableCell>
              <TableCell>{a.status}</TableCell>
              <TableCell>{a.updated_by || "—"}</TableCell>
              <TableCell>{a.date_updated || "—"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onPress={() => {
                      setForm(a);
                      setEditId(a.alumni_id ?? null);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onPress={() => handleDelete(a.alumni_id ?? 0)}
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
