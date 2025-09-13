"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/contexts/workspace-context";
import { api } from "@/trpc/react";
import UploadSermon from "./_components/upload-sermon";
import { SermonNoteView } from "./_components/sermon-note-view";

export default function Sermons() {
  const { selectedWorkspace } = useWorkspace();

  const { data: sermonNotesData, isLoading: workspaceSermonNotesLoading } =
    api.sermons.getCurrentWorkspaceSermonNotes.useQuery(
      {
        workspaceId: selectedWorkspace,
      },
      {
        enabled: selectedWorkspace !== "all",
      }
    );

  const { data: allSermonNotesData, isLoading: allSermonNotesLoading } =
    api.sermons.getCurrentUserSermonNotes.useQuery(undefined, {
      enabled: selectedWorkspace === "all",
    });

  const loadingSermonNotes =
    workspaceSermonNotesLoading || allSermonNotesLoading;

  return (
    <>
      <CardHeader className="p-2">
        <div className="flex justify-between items-center">
          <CardTitle>Sermons</CardTitle>
          <UploadSermon />
        </div>
      </CardHeader>
      {loadingSermonNotes ? (
        <div className="p-4 text-center text-muted-foreground">
          Loading sermon notes...
        </div>
      ) : (sermonNotesData?.length === 0 && selectedWorkspace !== "all") ||
        (allSermonNotesData?.length === 0 && selectedWorkspace === "all") ? (
        <div className="p-4 text-center text-muted-foreground">
          <div className="space-y-2">
            <p className="text-lg font-medium">No sermon notes yet</p>
            <p className="text-sm">
              Upload your first sermon image to get started
            </p>
          </div>
        </div>
      ) : (
        <SermonNoteView sermonNotes={sermonNotesData || allSermonNotesData} />
      )}
    </>
  );
}
