import axios from "axios";

const API = "http://localhost:5000/api/events";

export interface Event {
  event_id?: number;
  name: string;
  description: string;
  event_date: string;
  location: string;
  created_by?: string;
  date_created?: string;
  updated_by?: string;
  date_updated?: string;
  deleted_by?: string;
  is_deleted?: number;
}

export const findAllEvents = async (): Promise<Event[]> => {
  const res = await axios.get(API);

  return res.data;
};

export const createEvent = async (event: Partial<Event>) => {
  const res = await axios.post(API, event);

  return res.data;
};

export const updateEvent = async (id: number, event: Partial<Event>) => {
  const res = await axios.put(`${API}/${id}`, event);

  return res.data;
};

export const softDeleteEvent = async (id: number, deleted_by: string) => {
  const res = await axios.delete(`${API}/${id}`, { data: { deleted_by } });

  return res.data;
};
