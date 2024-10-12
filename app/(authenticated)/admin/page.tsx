"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Workspace } from "@/types/workspaces";
import WorkspaceList from "./components/workspace-list";
import AddWorkspaceForm from "./components/workspace-form";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      const storedDbUserId = user.publicMetadata.dbUserId as number;
      if (storedDbUserId) {
        fetchWorkspaces(storedDbUserId);
      }
    }
  }, [isLoaded, user]);

  const fetchWorkspaces = async (userId: number) => {
    const response = await fetch(`/api/workspaces?userId=${userId}`);
    if (response.ok) {
      const data = await response.json();
      setWorkspaces(data);
    } else {
      console.error("Failed to fetch workspaces");
    }
  };

  const handleAddWorkspace = async (name: string) => {
    if (!user) return;
    const dbUserId = user.publicMetadata.dbUserId as number;
    const response = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: dbUserId, name }),
    });
    if (response.ok) {
      fetchWorkspaces(dbUserId);
      setIsModalOpen(false);
    } else {
      console.error("Failed to add workspace");
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Access denied. Please log in.</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Workspaces</h2>
        <WorkspaceList workspaces={workspaces} />
      </div>
      <div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
        >
          Add Workspace
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Workspace</h2>
            <AddWorkspaceForm onAddWorkspace={handleAddWorkspace} />
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
