"use client";

import { useState } from "react";
import WorkspaceList from "./_components/workspace-list";
import WorkspaceForm from "./_components/workspace-form";
import { useWorkspace } from "@/contexts/workspace-context";
import { Workspace } from "@/types/workspace";
import DeleteWorkspaceModal from "./_components/delete-workspace-modal";

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
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Workspaces</h2>
        <WorkspaceList
          workspaces={workspaces}
          onDeleteWorkspace={openDeleteModal}
        />
      </div>
      <div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
        >
          Add Workspace
        </button>
        <div className="mt-10 p-2 text-xs text-muted-foreground/70 border-t border-border">
          <span className="mr-2">v: 0.1.0</span>
          <span>
            ({process.env.NEXT_PUBLIC_BUILD_TIME || "Build Time Unavailable"})
          </span>
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
