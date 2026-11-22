import { cookies } from "next/headers";
import { api } from "@/app/api/api";
import { FetchNotesParams } from "./clientApi";

export const getMe = async () => {
  const cookieStore = await cookies();

  const { data } = await api.get("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};

export const fetchNotes = async (params: FetchNotesParams) => {
  const cookieStore = await cookies();

  const { data } = await api.get("/notes", {
    params,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};

export const fetchNoteById = async (id: string) => {
  const cookieStore = await cookies();

  const { data } = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};

export const checkSession = async (cookieHeader: string) => {
  const response = await api.get("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response;
};
