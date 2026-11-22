import { NoteTag } from "@/types/note";
import { proxyServer } from "./api";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}
export interface RegisterParams {
  email: string;
  password: string;
}

export interface UpdateMeParams {
  username: string;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export const getMe = async () => {
  const { data } = await proxyServer.get("/users/me");
  return data;
};

export const fetchNotes = async (params: FetchNotesParams) => {
  const { data } = await proxyServer.get("/notes", { params });
  return data;
};

export const login = async (params: LoginParams) => {
  const { data } = await proxyServer.post("/auth/login", params);
  return data;
};

export const register = async (params: RegisterParams) => {
  const { data } = await proxyServer.post("/auth/register", params);
  return data;
};

export const logout = async () => {
  const { data } = await proxyServer.post("/auth/logout");
  return data;
};

export const checkSession = async () => {
  const { data } = await proxyServer.get("/auth/session");
  return data;
};

export const updateMe = async (params: UpdateMeParams) => {
  const { data } = await proxyServer.patch("/users/me", params);
  return data;
};

export const fetchNoteById = async (id: string) => {
  const { data } = await proxyServer.get(`/notes/${id}`);
  return data;
};

export const createNote = async (body: CreateNoteParams) => {
  const { data } = await proxyServer.post("/notes", body);
  return data;
};

export const deleteNote = async (id: string) => {
  const { data } = await proxyServer.delete(`/notes/${id}`);
  return data;
};
