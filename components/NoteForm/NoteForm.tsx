"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createNote } from "@/lib/api/clientApi";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";

import css from "./NoteForm.module.css";

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      clearDraft();

      await queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      router.push("/notes/filter/all");
    },
  });

  const formAction = async (formData: FormData) => {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const tag = String(formData.get("tag") ?? "Todo") as NoteTag;

    if (title.length < 3 || title.length > 50) {
      return;
    }

    if (content.length > 500) {
      return;
    }

    await createMutation.mutateAsync({
      title,
      content,
      tag,
    });
  };

  return (
    <form action={formAction} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          minLength={3}
          maxLength={50}
          required
          defaultValue={draft.title}
          onChange={(event) => setDraft({ title: event.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          maxLength={500}
          defaultValue={draft.content}
          onChange={(event) => setDraft({ content: event.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          required
          onChange={(event) => setDraft({ tag: event.target.value as NoteTag })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
