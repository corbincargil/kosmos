import { SermonNote } from "@/types/sermon-note";
import { SermonNoteCard } from "./sermon-note-card";

interface SermonNoteGridProps {
  sermonNotes: SermonNote[];
}

export function SermonNoteGrid({ sermonNotes }: SermonNoteGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sermonNotes.map((sermonNote) => (
        <SermonNoteCard key={sermonNote.id} sermonNote={sermonNote} />
      ))}
    </div>
  );
}
