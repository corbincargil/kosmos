"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
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
import {
  SermonNoteWithImages,
  UpdateSermonNote,
  UpdateSermonNoteSchema,
} from "@/types/sermon-note";
import MarkdownEditor from "../../_components/markdown-editor";

interface NoteFormProps {
  workspaceUuid: string;
  sermonNote?: SermonNoteWithImages;
  cancelButtonText?: string;
}

export default function SermonNoteForm({
  sermonNote,
  cancelButtonText = "Close",
}: NoteFormProps) {
  const { toast } = useToast();
  const utils = api.useUtils();
  const router = useRouter();

  const [hasContentChanges, setHasContentChanges] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState(
    sermonNote?.markdown || ""
  );
  const [lastSavedTitle, setLastSavedTitle] = useState(sermonNote?.title || "");

  const form = useForm<UpdateSermonNote>({
    resolver: zodResolver(UpdateSermonNoteSchema),
    defaultValues: {
      title: sermonNote?.title || "",
      markdown: sermonNote?.markdown || "",
      cuid: sermonNote?.cuid || "",
    },
  });

  function handleError() {
    toast({
      title: "Error",
      description: `Failed to ${sermonNote ? "update" : "create"} sermon note`,
      variant: "destructive",
    });
  }

  //* create note mutation
  //   const { mutate: createSermonNote, isPending: isCreating } =
  //     api.sermons.createSermonNote.useMutation({
  //       onSuccess: () => {
  //         utils.sermons.getCurrentWorkspaceSermonNotes.invalidate();
  //         form.reset();
  //         toast({
  //           title: "Success",
  //           variant: "success",
  //           description: "Sermon note created successfully",
  //         });
  //         router.back();
  //       },
  //       onError: handleError,
  //     });

  //* update note mutation
  const { mutate: updateSermonNote, isPending: isUpdating } =
    api.sermons.updateSermonNoteByCuid.useMutation({
      onSuccess: () => {
        utils.sermons.getCurrentWorkspaceSermonNotes.invalidate();
        utils.sermons.getSermonNoteByCuid.invalidate({
          cuid: sermonNote?.cuid || "",
        });
        setLastSavedContent(form.getValues("markdown"));
        setLastSavedTitle(form.getValues("title"));
        setHasContentChanges(false);
      },
      onError: handleError,
    });

  const hasChanges =
    sermonNote && (hasContentChanges || form.watch("title") !== lastSavedTitle);
  const isSaving = isUpdating;

  const onSubmit = useCallback(
    (data: UpdateSermonNote) => {
      updateSermonNote({ cuid: sermonNote?.cuid || "", data });
    },
    [sermonNote, updateSermonNote]
  );

  useEffect(() => {
    if (!sermonNote || !hasChanges || isSaving) return;

    const timer = setTimeout(() => {
      form.handleSubmit(onSubmit)();
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasChanges, sermonNote, form, isSaving, onSubmit]);

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
          name="markdown"
          render={({ field }) => (
            <FormItem className="flex-1 min-h-0">
              <FormControl>
                <MarkdownEditor
                  content={field.value}
                  images={sermonNote?.images}
                  onChange={(value) => form.setValue("markdown", value)}
                  onCompareContent={setHasContentChanges}
                  lastSavedContent={lastSavedContent}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" onClick={() => router.back()} variant="glow">
            {cancelButtonText}
          </Button>
          <Button type="submit" disabled={isSaving || !form.formState.isValid}>
            {isSaving ? "Saving..." : sermonNote ? "Save" : "Create Note"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
