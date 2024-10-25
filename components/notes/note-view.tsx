"use client";

import React, { useState } from "react";
import { Note } from "@/types/note";
import { NotesViewToggle } from "@/components/notes/notes-view-toggle";
import { NoteGrid } from "@/components/notes/note-grid";
import { NoteList } from "@/components/notes/note-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

interface NoteViewProps {
  notes: Note[];
  userId: number;
  onNotesChanged?: () => Promise<void>;
}

export const NoteView: React.FC<NoteViewProps> = ({ notes }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultView = (searchParams.get("view") as "grid" | "list") || "grid";
  const [view, setView] = useState<"grid" | "list">(defaultView);

  const handleViewChange = (newView: "grid" | "list") => {
    const params = new URLSearchParams(searchParams);
    params.set("view", newView);
    router.push(`?${params.toString()}`);
    setView(newView);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="w-full p-2 md:p-4">
          <div className="flex justify-between items-center">
            <NotesViewToggle view={view} onViewChange={handleViewChange} />
            <Button size="sm" variant="glow">
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <NoteGrid notes={notes} />
      ) : (
        <NoteList notes={notes} />
      )}
    </div>
  );
};
