"use client";

import NoteDetails from "@/components/notes/note-details";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface NoteDetailsProps {
  params: {
    id: string;
  };
}

export default function NoteDetailsPage({ params }: NoteDetailsProps) {
  const { data: noteData } = api.notes.getNoteByUuid.useQuery(params.id, {
    enabled: !!params.id,
  });

  return (
    <>
      <div className="mb-2">
        <Link href="/notes">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Button>
        </Link>
      </div>
      {noteData && <NoteDetails noteData={noteData} />}
    </>
  );
}
