"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { dummyNotes } from "@/dummyNotes";
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
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <NoteDetails params={{ id: noteId }} />
      </DialogContent>
    </Dialog>
  );
}
