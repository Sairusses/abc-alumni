import axios from "axios";

const API = "http://localhost:5000/api/work_history";

export interface WorkHistory {
  employment_id?: number;
  alumni_id: number;
  company_name: string;
  position: string;
  start_date: string;
  end_date?: string;
  status: "Current" | "Previous";
  created_by?: string;
  date_created?: string;
  updated_by?: string;
  date_updated?: string;
  deleted_by?: string;
  is_deleted?: number;
}

export interface Alumni {
  alumni_id: number;
  first_name: string;
  last_name: string;
}

export const findAllWork = async (): Promise<WorkHistory[]> => {
  const res = await axios.get(API);

  return res.data;
};

export const createWork = async (work: Partial<WorkHistory>) => {
  const res = await axios.post(API, work);

  return res.data;
};

export const updateWork = async (id: number, work: Partial<WorkHistory>) => {
  const res = await axios.put(`${API}/${id}`, work);

  return res.data;
};

export const softDeleteWork = async (id: number, deleted_by: string) => {
  const res = await axios.delete(`${API}/${id}`, { data: { deleted_by } });

  return res.data;
};

export const findAllAlumni = async (): Promise<Alumni[]> => {
  const res = await axios.get("http://localhost:5000/api/alumni");

  return res.data;
};
