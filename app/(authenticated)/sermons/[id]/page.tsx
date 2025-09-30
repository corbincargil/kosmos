"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkspace } from "@/contexts/workspace-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SermonNoteForm from "../_components/sermon-form";
import { api } from "@/trpc/react";

export default function AddNotePage() {
  const { selectedWorkspace } = useWorkspace();
  const router = useRouter();
  const { id } = useParams();

  const { data: sermonNote, isLoading } =
    api.sermons.getSermonNoteByCuid.useQuery(
      { cuid: id as string },
      {
        enabled: !!id,
      }
    );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!sermonNote) {
    return <div>Note not found</div>;
  }

  if (!selectedWorkspace) {
    return <div>No workspace selected</div>;
  }

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <SermonNoteForm
          workspaceUuid={selectedWorkspace}
          sermonNote={sermonNote}
        />
      </DialogContent>
    </Dialog>
  );
}
