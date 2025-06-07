"use client";

import { useState } from "react";
import WorkspaceList from "./_components/workspace-list";
import WorkspaceForm from "./_components/workspace-form";
import { useWorkspace } from "@/contexts/workspace-context";
import { Workspace } from "@/types/workspace";
import DeleteWorkspaceModal from "./_components/delete-workspace-modal";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const { workspaces } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingWorkspace, setDeletingWorkspace] = useState<Workspace | null>(
    null
  );

  const openDeleteModal = (workspace: Workspace) => {
    setDeletingWorkspace(workspace);
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Workspaces</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          >
          Add Workspace
        </Button>
          </div>
        <WorkspaceList
          workspaces={workspaces}
          onDeleteWorkspace={openDeleteModal}
        />
      <div>
        <div className="mt-4 p-2 text-xs text-muted-foreground/70 border-t border-border">
          <Tooltip>
            <TooltipTrigger>
              <span className="mr-2">app version</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                <span className="font-semibold">Ref:</span> {process.env.NEXT_PUBLIC_BRANCH || "unavailable"}
              </p>
              <p>
                <span className="font-semibold">Build Time:</span> {process.env.NEXT_PUBLIC_BUILD_TIME || "--:--:--"} UTC (GMT)
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Add New Workspace
            </h2>
            <WorkspaceForm
              closeModal={() => {
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {deletingWorkspace && (
        <DeleteWorkspaceModal
          workspace={deletingWorkspace}
          closeModal={() => {
            setDeletingWorkspace(null);
          }}
        />
      )}
    </div>
  );
}
