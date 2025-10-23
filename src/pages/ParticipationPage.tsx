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
  Participation,
  findAllParticipations,
  createParticipation,
  updateParticipation,
  softDeleteParticipation,
  findAllEvents,
  findAllAlumni,
  Event,
  Alumni,
} from "../db/participationRepo";

export default function ParticipationPage() {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [form, setForm] = useState<Partial<Participation>>({});
  const [editId, setEditId] = useState<number | null>(null);

  const load = async () => {
    try {
      const [pRows, eRows, aRows] = await Promise.all([
        findAllParticipations(),
        findAllEvents(),
        findAllAlumni(),
      ]);

      setParticipations(pRows);
      setEvents(eRows);
      setAlumni(aRows);
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
        await updateParticipation(editId, form);
      } else {
        await createParticipation(form as Participation);
      }
      setForm({});
      setEditId(null);
      await load();
    } catch (err) {
      console.error("Failed to save participation", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await softDeleteParticipation(id, form.updated_by || "unknown_user");
      await load();
    } catch (err) {
      console.error("Failed to delete participation", err);
    }
  };

  const eventOptions = events.map((e) => ({
    key: String(e.event_id),
    label: e.name,
  }));

  const alumniOptions = alumni.map((a) => ({
    key: String(a.alumni_id),
    label: `${a.first_name} ${a.last_name}`,
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 dark:bg-[#121212] rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Event Participation
      </h1>

      {/* Form */}
      <form
        className="grid grid-cols-2 gap-4 bg-white dark:bg-[#1A1A1A] p-6 rounded-xl shadow-md mb-8"
        onSubmit={handleSubmit}
      >
        <Select
          items={eventOptions}
          label="Event"
          placeholder="Select Event"
          selectedKeys={form.event_id ? [String(form.event_id)] : []}
          onChange={(e) =>
            setForm({ ...form, event_id: Number(e.target.value) })
          }
        >
          {(item) => <SelectItem>{item.label}</SelectItem>}
        </Select>

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

        <Select
          label="Role"
          selectedKeys={[form.role || ""]}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <SelectItem key="Attendee">Attendee</SelectItem>
          <SelectItem key="Organizer">Organizer</SelectItem>
          <SelectItem key="Speaker">Speaker</SelectItem>
        </Select>

        <Input
          isDisabled={!editId}
          label="Updated By"
          value={form.updated_by || ""}
          onChange={(e) => setForm({ ...form, updated_by: e.target.value })}
        />

        <div className="md:col-span-2">
          <Button className="w-full py-2" type="submit">
            {editId ? "Update Record" : "Add Record"}
          </Button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table aria-label="Participation Table" className="min-w-full">
          <TableHeader>
            <TableColumn>Event</TableColumn>
            <TableColumn>Alumni</TableColumn>
            <TableColumn>Role</TableColumn>
            <TableColumn>Updated By</TableColumn>
            <TableColumn>Date Updated</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {participations.map((p) => {
              const eventName = events.find((e) => e.event_id === p.event_id);
              const alumniName = alumni.find(
                (a) => a.alumni_id === p.alumni_id,
              );

              return (
                <TableRow key={p.participation_id}>
                  <TableCell>{eventName ? eventName.name : "—"}</TableCell>
                  <TableCell>
                    {alumniName
                      ? `${alumniName.first_name} ${alumniName.last_name}`
                      : "—"}
                  </TableCell>
                  <TableCell>{p.role}</TableCell>
                  <TableCell>{p.updated_by || "—"}</TableCell>
                  <TableCell>{p.date_updated || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onPress={() => {
                          setForm(p);
                          setEditId(p.participation_id ?? null);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onPress={() => handleDelete(p.participation_id ?? 0)}
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
