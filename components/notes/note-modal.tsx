"use client";

import { Note } from "@/types/note";
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

dayjs.extend(relativeTime);

interface NoteModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NoteModal({ note, isOpen, onClose }: NoteModalProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isEditing, setIsEditing] = useState(false);

  if (!note) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold border-none px-0 focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
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

        <div className="relative flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={cn(
              "h-full font-mono absolute inset-0 resize-none",
              isEditing ? "opacity-100 z-10" : "opacity-0 -z-10"
            )}
          />
          <div
            className={cn(
              "prose dark:prose-invert max-w-none absolute inset-0 overflow-auto",
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
      </DialogContent>
    </Dialog>
  );
}
