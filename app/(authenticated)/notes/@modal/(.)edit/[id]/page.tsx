"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import NoteForm from "../../../_components/note-form";
import NoteFormLoading from "../../../_components/note-form-loading";

export default function InterceptedEditNotePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const { data: noteData, isLoading } = api.notes.getNoteByUuid.useQuery(
    params.id,
    {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      staleTime: 0,
    }
  );

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={() => router.back()}>
        <DialogContent className="max-w-6xl h-[96vh] flex flex-col p-12">
          <div className="flex justify-center items-center h-full">
            <NoteFormLoading />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!noteData) {
    return <div>Note not found</div>;
  }

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="max-w-6xl h-[96vh] flex flex-col p-12">
        <NoteForm workspaceUuid={noteData.workspaceUuid} note={noteData} />
      </DialogContent>
    </Dialog>
  );
}
