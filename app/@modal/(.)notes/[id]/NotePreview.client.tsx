"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api/clientApi";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

export default function NotePreviewClient() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        {isLoading && <p>Loading note...</p>}

        {isError && <p>Something went wrong!</p>}

        {note && (
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
              <span className={css.tag}>{note.tag}</span>
            </div>

            <p className={css.content}>{note.content}</p>

            <p className={css.date}>
              {new Date(note.createdAt).toLocaleDateString()}
            </p>

            <button type="button" className={css.backBtn} onClick={handleClose}>
              ← Back to notes
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
