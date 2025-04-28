import { Note } from "@/types/note";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import RichTextEditor from "../../_components/rich-text-editor";

dayjs.extend(relativeTime);

interface NoteCardProps {
  note: Note;
  className?: string;
}

export function NoteCard({ note, className }: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchParams = useSearchParams();

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      className={cn(
        "hover:shadow-sm hover:shadow-workspace-lighter hover:scale-[1.01] transition-all relative cursor-pointer overflow-hidden",
        !isExpanded && "max-h-[400px]"
      )}
    >
      <Link
        href={`/notes/edit/${note.uuid}?${searchParams.toString()}`}
        className={className}
      >
        <CardHeader className="p-2 md:p-4 lg:p-6">
          <CardTitle className="text-md lg:text-lg">{note.title}</CardTitle>
          <CardDescription>
            Last updated {dayjs(note.updatedAt).fromNow()}
          </CardDescription>
        </CardHeader>

        <CardContent className="max-h-[600px] overflow-y-auto">
          <RichTextEditor content={note.content} readOnly />
        </CardContent>
      </Link>
      {isExpanded ? (
        <Button
          onClick={handleButtonClick}
          variant="glow"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-950"
        >
          Hide
        </Button>
      ) : (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none shadow-lg" />
          <Button
            onClick={handleButtonClick}
            variant="outline"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-950"
          >
            View more
          </Button>
        </>
      )}
    </Card>
  );
}
