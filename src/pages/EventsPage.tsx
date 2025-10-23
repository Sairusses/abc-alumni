import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import {
  Event,
  findAllEvents,
  createEvent,
  updateEvent,
  softDeleteEvent,
} from "../db/eventRepo";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState<Partial<Event>>({});
  const [editId, setEditId] = useState<number | null>(null);

  const load = async () => {
    try {
      const rows = await findAllEvents();
      setEvents(rows);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateEvent(editId, form);
      } else {
        await createEvent(form as Event);
      }
      setForm({});
      setEditId(null);
      await load();
    } catch (err) {
      console.error("Failed to save event", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await softDeleteEvent(id, form.updated_by || "unknown_user");
      await load();
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 dark:bg-[#121212] rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Events
      </h1>

      {/* Form */}
      <form
        className="grid grid-cols-2 gap-4 bg-white dark:bg-[#1A1A1A] p-6 rounded-xl shadow-md mb-8"
        onSubmit={handleSubmit}
      >
        <Input
          label="Name"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Input
          label="Event Date"
          type="date"
          value={form.event_date || ""}
          onChange={(e) => setForm({ ...form, event_date: e.target.value })}
        />
        <Input
          label="Location"
          value={form.location || ""}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <Input
          isDisabled={!editId}
          label="Updated By"
          value={form.updated_by || ""}
          onChange={(e) => setForm({ ...form, updated_by: e.target.value })}
        />

        <div className="md:col-span-2">
          <Button className="w-full py-2" type="submit">
            {editId ? "Update Event" : "Add Event"}
          </Button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table aria-label="Events Table" className="min-w-full">
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Location</TableColumn>
            <TableColumn>Updated By</TableColumn>
            <TableColumn>Date Updated</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {events.map((ev) => (
              <TableRow key={ev.event_id}>
                <TableCell>{ev.name}</TableCell>
                <TableCell>{ev.description}</TableCell>
                <TableCell>{ev.event_date}</TableCell>
                <TableCell>{ev.location}</TableCell>
                <TableCell>{ev.updated_by || "—"}</TableCell>
                <TableCell>{ev.date_updated || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onPress={() => {
                        setForm(ev);
                        setEditId(ev.event_id ?? null);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onPress={() => handleDelete(ev.event_id ?? 0)}
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
    </div>
  );
}