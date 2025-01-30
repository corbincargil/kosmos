"use client";

import { useState } from "react";
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
      createNoteMutation({ ...data, content: data.content || "" });
    }
  };

  const content = form.watch("content");
  console.log(content);

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
          <FormMessage>
            {form.formState.errors.content?.message as string}
          </FormMessage>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Preview" : "Edit"}
          </Button>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RichTextEditor content={content} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

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
