import { Note } from "@/types/note";
import { NoteCard } from "../../../../components/notes/note-card";

interface NotePreviewProps {
  notes: Note[];
}

export function NotePreview({ notes }: NotePreviewProps) {
  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
