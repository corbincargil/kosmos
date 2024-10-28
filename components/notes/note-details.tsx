"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Note } from "@/types/note";
import { useToast } from "@/hooks/use-toast";

dayjs.extend(relativeTime);

interface NoteDetailsProps {
  params: {
    id: string;
  };
}

export default function NoteDetails({ params }: NoteDetailsProps) {
  const { toast } = useToast();
  const [loading] = useState(true);
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      const response = await fetch(`/api/notes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setNote(data);
        setTitle(data.title);
        setContent(data.content);
      } else {
        setNote(null);
      }
    };

    fetchNote();
  }, [params.id]);

  const handleSave = async () => {
    if (!note) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNote(updatedNote);
        toast({
          title: "Success",
          variant: "success",
          description: "Note updated successfully",
        });
      } else {
        throw new Error("Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!note && !loading) {
    return <p>Note not found</p>;
  }

  if (!note && loading) {
    return <p>Loading...</p>;
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
            Last updated {dayjs(note?.updatedAt).fromNow()}
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
              {content}
            </ReactMarkdown>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSave} disabled={isSaving} variant="default">
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
