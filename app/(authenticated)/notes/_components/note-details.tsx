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
import { Note } from "@/types/note";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";

dayjs.extend(relativeTime);

interface NoteDetailsProps {
  noteData?: Note;
}

export default function NoteDetails({ noteData }: NoteDetailsProps) {
  const { toast } = useToast();
  const utils = api.useUtils();
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: updateNoteMutation, isPending } =
    api.notes.updateNote.useMutation({
      onSuccess: () => {
        utils.notes.getCurrentWorkspaceNotes.invalidate();

        toast({
          title: "Success",
          variant: "success",
          description: "Note updated successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update note",
          variant: "destructive",
        });
      },
    });

  if (!noteData) {
    return <p>Note not found</p>;
  }

  return (
    <div className="h-full flex flex-col flex-1">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold border-none px-0 focus-visible:ring-0"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">
            Last updated {dayjs(noteData?.updatedAt).fromNow()}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Preview" : "Edit"}
          </Button>
        </div>

        <div className="relative h-[calc(100vh-250px)] border border-gray-400 rounded-lg">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={cn(
              "h-full font-mono absolute inset-0 resize-none overflow-y-auto bg-secondary border border-workspace-lighter",
              isEditing ? "opacity-100 z-10" : "opacity-0 -z-10"
            )}
          />
          <div
            className={cn(
              "m-2 prose dark:prose-invert max-w-none absolute inset-0 overflow-y-auto",
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
              {noteData?.content}
            </ReactMarkdown>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            onClick={() =>
              updateNoteMutation({
                id: noteData.id,
                title,
                content,
                workspaceUuid: noteData.workspaceUuid,
              })
            }
            disabled={isPending}
            variant="default"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
