"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import WorkspaceList from "./components/workspace-list";
import WorkspaceForm from "./components/workspace-form";
import { useWorkspace } from "@/contexts/workspace-context";
import { Workspace } from "@/types/workspaces";
import { addWorkspace, editWorkspace } from "./helpers/workspace-helpers";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const { workspaces, refreshWorkspaces } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(
    null
  );

  const handleAddWorkspace = async (name: string, color: string) => {
    if (!user) return false;
    const dbUserId = user.publicMetadata.dbUserId as number;
    const success = await addWorkspace(dbUserId, name, color);
    if (success) {
      refreshWorkspaces();
      setIsModalOpen(false);
      return true;
    }
    return false;
  };

  const handleEditWorkspace = async (
    id: number,
    name: string,
    color: string
  ) => {
    const success = await editWorkspace(id, name, color);
    if (success) {
      refreshWorkspaces();
      setEditingWorkspace(null);
      return true;
    }
    return false;
  };

  const openEditModal = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Access denied. Please log in.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Workspaces</h2>
        <WorkspaceList
          workspaces={workspaces}
          onEditWorkspace={openEditModal}
        />
      </div>
      <div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
        >
          Add Workspace
        </button>
      </div>

      {(isModalOpen || editingWorkspace) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingWorkspace ? "Edit Workspace" : "Add New Workspace"}
            </h2>
            <WorkspaceForm
              initialName={editingWorkspace?.name}
              initialColor={editingWorkspace?.color}
              onSubmit={
                editingWorkspace
                  ? (name, color) =>
                      handleEditWorkspace(editingWorkspace.id, name, color)
                  : handleAddWorkspace
              }
              onCancel={() => {
                setIsModalOpen(false);
                setEditingWorkspace(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
