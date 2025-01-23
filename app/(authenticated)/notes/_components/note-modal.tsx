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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { useWorkspace } from "@/contexts/workspace-context";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";

dayjs.extend(relativeTime);

interface NoteModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function NoteModal({ note, isOpen, onClose, onSave }: NoteModalProps) {
  const { user } = useUser();
  const { selectedWorkspace } = useWorkspace();
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isEditing, setIsEditing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { mutate: createNoteMutation } = api.notes.createNote.useMutation({
    onSuccess: () => {
      onSave();
      onClose();
      setTitle("");
      setContent("");

      toast({
        title: "Success",
        variant: "success",
        description: "Note created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl h-[90vh] flex flex-col"
        aria-describedby="note-dialog-description"
      >
        <DialogHeader className="mt-6 flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <DialogTitle>New Note</DialogTitle>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold border-none px-2 focus-visible:ring-0"
              placeholder="Note title"
            />
          </div>
        </DialogHeader>
        <DialogDescription> </DialogDescription>
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">
            {note
              ? `Last updated ${dayjs(note.updatedAt).fromNow()}`
              : "New note"}
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

        <div className="flex justify-end mt-4">
          <Button
            onClick={() => {
              setIsSaving(true);
              createNoteMutation({
                title,
                content,
                workspaceUuid: selectedWorkspace,
                userId: Number(user?.publicMetadata.dbUserId),
              });
            }}
            disabled={isSaving || !title.trim()}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
