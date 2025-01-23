"use client";

import { api } from "@/trpc/react";
import NoteForm from "../../_components/note-form";
import NoteFormLoading from "../../_components/note-form-loading";

export default function EditNotePage({ params }: { params: { id: string } }) {
  const {
    data: noteData,
    isLoading,
    isError,
  } = api.notes.getNoteByUuid.useQuery(params.id, {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  if (isLoading) {
    return <NoteFormLoading />;
  }

  if (isError || !noteData) {
    return <div>Note not found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <NoteForm
        workspaceUuid={noteData.workspaceUuid}
        note={noteData}
        cancelButtonText="Back"
      />
    </div>
  );
}
