import axios from "axios";

const API = "http://localhost:5000/api/alumni";

export interface Alumni {
  alumni_id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  gender: "M" | "F";
  date_of_birth: string;
  email: string;
  phone_number: string;
  address: string;
  graduation_year: number;
  degree: string;
  status: "Employed" | "Unemployed" | "Self-Employed" | "Studying";
  updated_by?: string;
  date_updated?: string;
}

export const findAll = async (): Promise<Alumni[]> => {
  const res = await axios.get(API);
  return res.data;
};

export const create = async (alumni: Partial<Alumni>) => {
  const res = await axios.post(API, alumni);
  return res.data;
};

export const update = async (id: number, alumni: Partial<Alumni>) => {
  const res = await axios.put(`${API}/${id}`, alumni);
  return res.data;
};

export const softDelete = async (id: number, deleted_by: string) => {
  const res = await axios.delete(`${API}/${id}`, { data: { deleted_by } });
  return res.data;
};
