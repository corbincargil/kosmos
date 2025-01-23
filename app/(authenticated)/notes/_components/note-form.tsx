"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import {
  CreateNoteSchema,
  type Note,
  type CreateNoteInput,
} from "@/types/note";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

interface NewNoteFormProps {
  workspaceUuid: string;
  note?: Note;
  cancelButtonText?: string;
}

export default function NoteForm({
  workspaceUuid,
  note,
  cancelButtonText = "Cancel",
}: NewNoteFormProps) {
  const { toast } = useToast();
  const utils = api.useUtils();
  const [isEditing, setIsEditing] = useState(true);
  const router = useRouter();
  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
      workspaceUuid,
    },
  });

  const { mutate: createNoteMutation, isPending } =
    api.notes.createNote.useMutation({
      onSuccess: () => {
        form.reset();
        utils.notes.getCurrentWorkspaceNotes.invalidate();
        toast({
          title: "Success",
          variant: "success",
          description: "Note created successfully",
        });
        router.back();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to create note",
          variant: "destructive",
        });
      },
    });

  const { mutate: updateNoteMutation } = api.notes.updateNote.useMutation({
    onSuccess: () => {
      utils.notes.getCurrentWorkspaceNotes.invalidate();
      form.reset();
      toast({
        title: "Success",
        variant: "success",
        description: "Note updated successfully",
      });
      router.back();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateNoteInput) => {
    if (note) {
      updateNoteMutation({ id: note.id, data });
    } else {
      createNoteMutation(data);
    }
  };

  const content = form.watch("content");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Note title"
                  className="text-xl font-semibold focus-visible:ring-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormMessage>{form.formState.errors.content?.message}</FormMessage>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Preview" : "Edit"}
          </Button>
        </div>

        <div className="relative min-h-[300px] border rounded-md">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="h-full">
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write your note content here... (Markdown supported)"
                    className={cn(
                      "min-h-[300px] font-mono resize-none p-3",
                      "absolute inset-0 w-full",
                      isEditing ? "opacity-100 z-10" : "opacity-0 -z-10"
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div
            className={cn(
              "absolute inset-0 w-full p-3",
              "prose prose-sm dark:prose-invert max-w-none overflow-y-auto",
              !isEditing ? "opacity-100 z-10" : "opacity-0 -z-10"
            )}
            onClick={() => setIsEditing(true)}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ ...props }) => <p className="my-2" {...props} />,
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
                  <pre
                    className="overflow-x-auto p-2 rounded-lg bg-muted"
                    {...props}
                  />
                ),
                code: ({ ...props }) => (
                  <code className="bg-muted rounded px-1" {...props} />
                ),
              }}
            >
              {content || "Nothing to preview"}
            </ReactMarkdown>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" onClick={() => router.back()} variant="glow">
            {cancelButtonText}
          </Button>
          <Button type="submit" disabled={isPending || !form.formState.isValid}>
            {isPending
              ? note
                ? "Updating..."
                : "Creating..."
              : note
              ? "Update Note"
              : "Create Note"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
