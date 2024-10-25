"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { NoteView } from "@/components/notes/note-view";
import { dummyNotes } from "@/dummyNotes";

export default function Notes() {
  return (
    <>
      <CardHeader className="p-2">
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      {dummyNotes.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No notes found
        </div>
      ) : (
        <NoteView notes={dummyNotes} />
      )}
    </>
  );
}
