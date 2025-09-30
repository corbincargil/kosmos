"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkspace } from "@/contexts/workspace-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SermonNoteForm from "../../_components/sermon-form";
import { api } from "@/trpc/react";
import NoteFormLoading from "@/app/(authenticated)/notes/_components/note-form-loading";

export default function InterceptedEditSermonNotePage() {
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
    return (
      <Dialog open={true} onOpenChange={() => router.back()}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogDescription sr-only="true">
            Edit sermon note form
          </DialogDescription>
          <div className="flex justify-center items-center h-full">
            <NoteFormLoading />
          </div>
        </DialogContent>
      </Dialog>
    );
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
          <DialogTitle>Edit Sermon Note</DialogTitle>
          <DialogDescription sr-only="true">
            Edit sermon note form
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <SermonNoteForm
            workspaceUuid={selectedWorkspace}
            sermonNote={sermonNote}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
