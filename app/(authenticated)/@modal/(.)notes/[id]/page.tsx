"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import NoteDetails from "@/components/notes/note-details";
import { api } from "@/trpc/react";
import { NoteDetailsProps } from "@/app/(authenticated)/notes/[id]/page";

export default function InterceptedNotePage({ params }: NoteDetailsProps) {
  const router = useRouter();

  const { data: noteData } = api.notes.getNoteByUuid.useQuery(params.id, {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="max-w-6xl h-[96vh] flex flex-col">
        {noteData && <NoteDetails key={noteData.id} noteData={noteData} />}
      </DialogContent>
    </Dialog>
  );
}
