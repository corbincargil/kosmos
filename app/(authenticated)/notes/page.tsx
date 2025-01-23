"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/contexts/workspace-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { api } from "@/trpc/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NoteView } from "./_components/note-view";
import { useRouter } from "next/navigation";

export default function Notes() {
  const { selectedWorkspace } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();

  const { data: notesData, isLoading: workspaceNotesLoading } =
    api.notes.getCurrentWorkspaceNotes.useQuery(
      {
        workspaceId: selectedWorkspace,
      },
      {
        enabled: selectedWorkspace !== "all",
      }
    );

  const { data: allNotesData, isLoading: allNotesLoading } =
    api.notes.getCurrentUserNotes.useQuery(undefined, {
      enabled: selectedWorkspace === "all",
    });

  const loadingNotes = workspaceNotesLoading || allNotesLoading;

  return (
    <>
      <CardHeader className="p-2">
        <div className="flex justify-between items-center">
          <CardTitle>Notes</CardTitle>
          <TooltipProvider>
            <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
              <TooltipTrigger asChild>
                <span
                  onClick={() => {
                    if (selectedWorkspace === "all") {
                      setShowTooltip(true);
                    }
                  }}
                >
                  <Button
                    size="sm"
                    variant="glow"
                    onClick={() =>
                      router.push(`/notes/add?workspace=${selectedWorkspace}`)
                    }
                    disabled={selectedWorkspace === "all"}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Note
                  </Button>
                </span>
              </TooltipTrigger>
              {selectedWorkspace === "all" && (
                <TooltipContent>
                  <p>Select a specific workspace to create notes</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      {loadingNotes ? (
        <div className="p-4 text-center text-muted-foreground">
          Loading notes...
        </div>
      ) : notesData?.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No notes found
        </div>
      ) : (
        <NoteView notes={notesData || allNotesData} />
      )}
    </>
  );
}
