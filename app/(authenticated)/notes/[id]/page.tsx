"use client";

import { dummyNotes } from "@/dummyNotes";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);

interface NotePageProps {
  params: {
    id: string;
  };
}

export default function NotePage({ params }: NotePageProps) {
  const note = dummyNotes.find((n) => n.id === parseInt(params.id, 10));
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isEditing, setIsEditing] = useState(false);

  if (!note) {
    notFound();
  }

  return (
    <div className="container mx-auto p-2 md:p-4">
      <div className="mb-6">
        <Link href="/notes">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-bold mb-2 border-none px-0 focus-visible:ring-0"
        />
        <div className="flex items-center justify-between mb-8">
          <p className="text-muted-foreground">
            Last updated {dayjs(note.updatedAt).fromNow()}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Preview" : "Edit"}
          </Button>
        </div>

        <div className="relative min-h-[500px]">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={cn(
              "min-h-[500px] font-mono absolute inset-0 resize-none",
              isEditing ? "opacity-100 z-10" : "opacity-0 -z-10"
            )}
          />
          <div
            className={cn(
              "prose dark:prose-invert max-w-none absolute inset-0",
              !isEditing ? "opacity-100 z-10" : "opacity-0 -z-10"
            )}
            onClick={() => setIsEditing(true)}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ ...props }) => <p className="my-4" {...props} />,
                a: ({ ...props }) => (
                  <a
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                    {...props}
                  />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc list-inside my-4" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal list-inside my-4" {...props} />
                ),
                pre: ({ ...props }) => (
                  <pre
                    className="overflow-x-auto p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
                    {...props}
                  />
                ),
                code: ({ ...props }) => (
                  <code
                    className="bg-gray-100 dark:bg-gray-800 rounded px-1 break-words whitespace-pre-wrap"
                    {...props}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
