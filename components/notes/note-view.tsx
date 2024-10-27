"use client";

import React, { useState } from "react";
import { Note } from "@/types/note";
import { NotesViewToggle } from "@/components/notes/notes-view-toggle";
import { NoteGrid } from "@/components/notes/note-grid";
import { NoteList } from "@/components/notes/note-list";
import { useSearchParams, useRouter } from "next/navigation";

interface NoteViewProps {
  notes: Note[];
}

export function NoteView({ notes }: NoteViewProps) {
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
          <NotesViewToggle view={view} onViewChange={handleViewChange} />
        </div>
      </div>

      {view === "grid" ? (
        <NoteGrid notes={notes} />
      ) : (
        <NoteList notes={notes} />
      )}
    </div>
  );
}
