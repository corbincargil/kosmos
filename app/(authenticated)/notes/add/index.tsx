"use client";

import { useWorkspace } from "@/contexts/workspace-context";
import NoteForm from "../_components/note-form";

export default function AddNotePage() {
  const { selectedWorkspace } = useWorkspace();

  if (!selectedWorkspace) {
    return <div>No workspace selected</div>;
  }

  return (
    <div className="container mx-auto py-6 bg-red-500">
      <NoteForm workspaceUuid={selectedWorkspace} />
    </div>
  );
}
