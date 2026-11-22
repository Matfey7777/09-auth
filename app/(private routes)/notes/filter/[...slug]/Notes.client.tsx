"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";

import css from "./Notes.module.css";
import { fetchNotes } from "@/lib/api/clientApi";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const perPage = 12;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search,
        tag: tag === "all" ? undefined : tag,
      }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>

        <SearchBox
          value={searchValue}
          onChange={(value) => {
            setSearchValue(value);
            debouncedSearch(value);
          }}
        />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
          />
        )}
      </header>

      {isLoading && <p>Loading notes...</p>}

      {isError && <p>Something went wrong!</p>}

      {!isLoading && !isError && notes.length === 0 && <p>No notes found.</p>}

      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}
