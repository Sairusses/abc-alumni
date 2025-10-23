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
  getAllEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../db/eventRepo";

interface Event {
  event_id: number;
  name: string;
  description: string;
  event_date: string;
  location: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    event_date: "",
    location: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const load = async () => {
    const rows = await getAllEvents();
    const data: Event[] = rows.map((r: any[]) => ({
      event_id: Number(r[0]) || 0,
      name: String(r[1] || ""),
      description: String(r[2] || ""),
      event_date: String(r[3] || ""),
      location: String(r[4] || ""),
    }));

    setEvents(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await updateEvent(editId, form);
    else await addEvent(form);
    setForm({ name: "", description: "", event_date: "", location: "" });
    setEditId(null);
    load();
  };

  const handleDelete = async (id: number) => {
    await deleteEvent(id);
    load();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📅 Events</h1>

      <form
        className="space-y-3 bg-white p-4 rounded-lg shadow"
        onSubmit={handleSubmit}
      >
        <Input
          label="Event Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Input
          label="Event Date"
          type="date"
          value={form.event_date}
          onChange={(e) => setForm({ ...form, event_date: e.target.value })}
        />
        <Input
          label="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <Button color="primary" type="submit">
          {editId ? "Update" : "Add"}
        </Button>
      </form>

      <Table aria-label="Events Table" className="mt-6">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Location</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {events.map((e) => (
            <TableRow key={e.event_id}>
              <TableCell>{e.name}</TableCell>
              <TableCell>{e.description}</TableCell>
              <TableCell>{e.event_date}</TableCell>
              <TableCell>{e.location}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onPress={() => {
                      setForm(e);
                      setEditId(e.event_id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onPress={() => handleDelete(e.event_id)}
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
