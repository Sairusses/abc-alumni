import axios from "axios";

const API = "http://localhost:5000/api/participated_alumni_event";

export interface Participation {
  participation_id?: number;
  event_id: number;
  alumni_id: number;
  role: string;
  created_by?: string;
  date_created?: string;
  updated_by?: string;
  date_updated?: string;
  deleted_by?: string;
  is_deleted?: number;
}

export interface Event {
  event_id: number;
  name: string;
}

export interface Alumni {
  alumni_id: number;
  first_name: string;
  last_name: string;
}

export const findAllParticipations = async (): Promise<Participation[]> => {
  const res = await axios.get(API);

  return res.data;
};

export const createParticipation = async (
  participation: Partial<Participation>,
) => {
  const res = await axios.post(API, participation);

  return res.data;
};

export const updateParticipation = async (
  id: number,
  participation: Partial<Participation>,
) => {
  const res = await axios.put(`${API}/${id}`, participation);

  return res.data;
};

export const softDeleteParticipation = async (
  id: number,
  deleted_by: string,
) => {
  const res = await axios.delete(`${API}/${id}`, { data: { deleted_by } });

  return res.data;
};

export const findAllEvents = async (): Promise<Event[]> => {
  const res = await axios.get("http://localhost:5000/api/events");

  return res.data;
};

export const findAllAlumni = async (): Promise<Alumni[]> => {
  const res = await axios.get("http://localhost:5000/api/alumni");

  return res.data;
};
