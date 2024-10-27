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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";
import Link from "next/link";

dayjs.extend(relativeTime);

interface NoteCardProps {
  note: Note;
  className?: string;
}

export function NoteCard({ note, className }: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all relative cursor-pointer",
        !isExpanded && "max-h-[400px]"
      )}
    >
      <CardHeader className="p-2 md:p-4 lg:p-6">
        <a href={`/notes/${note.id}`} className={className}>
          <CardTitle className="text-md lg:text-lg hover:text-blue-500 transition-colors">
            {note.title}
          </CardTitle>
        </a>
        <CardDescription>
          Last updated {dayjs(note.updatedAt).fromNow()}
        </CardDescription>
      </CardHeader>
      <Link href={`/notes/${note.id}`} className={className}>
        <CardContent className="p-2 md:p-4 lg:p-6 flex-1 overflow-hidden">
          <div className="prose dark:prose-invert prose-sm max-w-none [&>*]:break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className={cn(
                "mb-8",
                !isExpanded && "max-h-[calc(400px-160px)] overflow-hidden"
              )}
              components={{
                p: ({ ...props }) => <p className="my-1" {...props} />,
                a: ({ ...props }) => (
                  <a
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                    {...props}
                  />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc list-inside my-2" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal list-inside my-2" {...props} />
                ),
                pre: ({ ...props }) => (
                  <pre className="overflow-x-auto" {...props} />
                ),
                code: ({ ...props }) => (
                  <code
                    className="bg-gray-100 dark:bg-gray-800 rounded px-1 break-words whitespace-pre-wrap"
                    {...props}
                  />
                ),
              }}
            >
              {note.content}
            </ReactMarkdown>
          </div>
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
