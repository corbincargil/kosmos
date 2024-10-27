import { Note } from "@/types/note";
import { Card } from "@/components/ui/card";
import dayjs from "dayjs";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
}

export function NoteList({ notes }: NoteListProps) {
  return (
    <div className="flex flex-col space-y-2">
      {notes.map((note) => (
        <Link href={`/notes/${note.id}`} key={note.id}>
          <Card key={note.id} className="hover:bg-accent transition-colors">
            <div className="flex flex-col p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm md:text-lg">{note.title}</h3>
                <span className="text-xs text-muted-foreground">
                  {dayjs(note.updatedAt).fromNow()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {note.content}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
