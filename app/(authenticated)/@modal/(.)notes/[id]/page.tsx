"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import NoteDetails from "@/components/notes/note-details";

dayjs.extend(relativeTime);

export default function InterceptedNotePage({
  params: { id: noteId },
}: {
  params: { id: string };
}) {
  const router = useRouter();

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="max-w-6xl h-[96vh] flex flex-col">
        <NoteDetails params={{ id: noteId }} />
      </DialogContent>
    </Dialog>
  );
}
