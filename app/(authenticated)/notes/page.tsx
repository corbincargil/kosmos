"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { NoteView } from "@/components/notes/note-view";
import { useWorkspace } from "@/contexts/workspace-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NoteModal } from "@/components/notes/note-modal";
import { api } from "@/trpc/react";

export default function Notes() {
  const { selectedWorkspace } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: notesData,
    isLoading: workspaceNotesLoading,
    refetch: workspaceNotesRefetch,
  } = api.notes.getCurrentWorkspaceNotes.useQuery(
    {
      workspaceId: selectedWorkspace,
    },
    {
      enabled: selectedWorkspace !== "all",
    }
  );

  const {
    data: allNotesData,
    isLoading: allNotesLoading,
    refetch: allNotesRefetch,
  } = api.notes.getCurrentUserNotes.useQuery(undefined, {
    enabled: selectedWorkspace === "all",
  });

  const loadingNotes = workspaceNotesLoading || allNotesLoading;

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
      {loadingNotes ? (
        <div className="p-4 text-center text-muted-foreground">
          Loading notes...
        </div>
      ) : notesData?.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No notes found
        </div>
      ) : (
        <NoteView notes={notesData || allNotesData} />
      )}
      <NoteModal
        note={null}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={
          selectedWorkspace === "all" ? allNotesRefetch : workspaceNotesRefetch
        }
      />
    </>
  );
}
