"use client";

import { useRouter } from "next/navigation";
import { useWorkspace } from "@/contexts/workspace-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NoteForm from "../../_components/note-form";

export default function AddNotePage() {
  const { selectedWorkspace } = useWorkspace();
  const router = useRouter();

  if (!selectedWorkspace) {
    return <div>No workspace selected</div>;
  }

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
        </DialogHeader>
        <NoteForm workspaceUuid={selectedWorkspace} />
      </DialogContent>
    </Dialog>
  );
}
