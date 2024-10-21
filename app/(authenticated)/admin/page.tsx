"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import WorkspaceList from "./components/workspace-list";
import WorkspaceForm from "./components/workspace-form";
import { useWorkspace } from "@/contexts/workspace-context";
import { Workspace } from "@/types/workspace";
import {
  addWorkspace,
  editWorkspace,
  deleteWorkspace,
} from "./helpers/workspace-helpers";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function AdminPage() {
  const { user } = useUser();
  const { workspaces, refreshWorkspaces } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(
    null
  );
  const [deletingWorkspace, setDeletingWorkspace] = useState<Workspace | null>(
    null
  );
  const { toast } = useToast();

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

  const handleDeleteWorkspace = async (id: number) => {
    const success = await deleteWorkspace(id);
    if (success) {
      refreshWorkspaces();
      setDeletingWorkspace(null);
      toast({
        title: "Success",
        description: "Workspace deleted successfully",
      });
      return true;
    }
    toast({
      title: "Error",
      description: "Failed to delete workspace",
      variant: "destructive",
    });
    return false;
  };

  const openEditModal = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
  };

  const openDeleteModal = (workspace: Workspace) => {
    setDeletingWorkspace(workspace);
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Workspaces</h2>
        <WorkspaceList
          workspaces={workspaces}
          onEditWorkspace={openEditModal}
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

      {deletingWorkspace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Confirm Deletion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                Are you sure you want to delete the workspace{" "}
                <span className="font-bold">{deletingWorkspace.name}</span>?
              </p>
              <p className="text-sm">
                This will delete all the data associated with this workspace.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-2 py-1 rounded"
                onClick={() => setDeletingWorkspace(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDeleteWorkspace(deletingWorkspace.id)}
              >
                Delete
              </button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
