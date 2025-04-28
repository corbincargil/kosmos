"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import {
  CreateNoteSchema,
  type Note,
  type CreateNoteInput,
} from "@/types/note";
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
import RichTextEditor from "../../_components/rich-text-editor";

interface NoteFormProps {
  workspaceUuid: string;
  note?: Note;
  cancelButtonText?: string;
}

export default function NoteForm({
  workspaceUuid,
  note,
  cancelButtonText = "Close",
}: NoteFormProps) {
  const { toast } = useToast();
  const utils = api.useUtils();
  const router = useRouter();

  const [hasContentChanges, setHasContentChanges] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState(note?.content || "");
  const [lastSavedTitle, setLastSavedTitle] = useState(note?.title || "");

  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
      workspaceUuid,
    },
  });

  function handleError() {
    toast({
      title: "Error",
      description: `Failed to ${note ? "update" : "create"} note`,
      variant: "destructive",
    });
  }

  //* create note mutation
  const { mutate: createNote, isPending: isCreating } =
    api.notes.createNote.useMutation({
      onSuccess: () => {
        utils.notes.getCurrentWorkspaceNotes.invalidate();
        form.reset();
        toast({
          title: "Success",
          variant: "success",
          description: "Note created successfully",
        });
        router.back();
      },
      onError: handleError,
    });

  //* update note mutation
  const { mutate: updateNote, isPending: isUpdating } =
    api.notes.updateNote.useMutation({
      onSuccess: () => {
        utils.notes.getCurrentWorkspaceNotes.invalidate();
        utils.notes.getNoteByUuid.invalidate(note?.uuid || "");
        setLastSavedContent(form.getValues("content"));
        setLastSavedTitle(form.getValues("title"));
        setHasContentChanges(false);
      },
      onError: handleError,
    });

  const hasChanges =
    note && (hasContentChanges || form.watch("title") !== lastSavedTitle);
  const isSaving = isCreating || isUpdating;

  const onSubmit = useCallback(
    (data: CreateNoteInput) => {
      if (note) {
        updateNote({ id: note.id, data });
      } else {
        createNote({ ...data, content: data.content || "" });
      }
    },
    [note, createNote, updateNote]
  );

  useEffect(() => {
    if (!note || !hasChanges || isSaving) return;

    const timer = setTimeout(() => {
      form.handleSubmit(onSubmit)();
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasChanges, note, form, isSaving, onSubmit]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
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
                  className="text-3xl font-extrabold border-none focus-visible:ring-workspace-lighter"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pl-4 text-sm text-muted-foreground min-h-[20px]">
          {hasChanges && "Unsaved changes"}
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1 min-h-0">
              <FormControl>
                <div className="h-full overflow-auto">
                  <RichTextEditor
                    content={field.value}
                    onChange={(value) => form.setValue("content", value)}
                    onCompareContent={setHasContentChanges}
                    lastSavedContent={lastSavedContent}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" onClick={() => router.back()} variant="glow">
            {cancelButtonText}
          </Button>
          <Button type="submit" disabled={isSaving || !form.formState.isValid}>
            {isSaving ? "Saving..." : note ? "Save" : "Create Note"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
