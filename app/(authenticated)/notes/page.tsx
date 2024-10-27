"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { NoteView } from "@/components/notes/note-view";
import { useUser } from "@clerk/nextjs";
import { useWorkspace } from "@/contexts/workspace-context";
import { useCallback, useEffect, useState } from "react";
import { Note } from "@/types/note";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NoteModal } from "@/components/notes/note-modal";

export default function Notes() {
  const { user } = useUser();
  const { selectedWorkspace } = useWorkspace();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(notes);

  const fetchNotes = useCallback(async () => {
    if (user) {
      const userId = user.publicMetadata.dbUserId as number;
      const queryParam =
        selectedWorkspace === "all"
          ? `userId=${userId}`
          : `workspaceId=${selectedWorkspace}`;

      const response = await fetch(`/api/notes?${queryParam}`);
      if (response.ok) {
        const notesData = await response.json();
        setNotes(notesData);
      }
    }
  }, [user, selectedWorkspace]);

  useEffect(() => {
    fetchNotes();
  }, [user, selectedWorkspace, fetchNotes]);

  return (
    <>
      <CardHeader className="p-2">
        <div className="flex justify-between items-center">
          <CardTitle>Notes</CardTitle>
          <Button size="sm" variant="glow" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </CardHeader>
      {notes.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No notes found
        </div>
      ) : (
        <NoteView notes={notes} />
      )}
      <NoteModal
        note={null}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchNotes}
      />
    </>
  );
}
