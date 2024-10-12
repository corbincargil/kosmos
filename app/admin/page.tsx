"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Workspace } from "@/types/workspaces";
import WorkspaceList from "./components/workspace-list";
import AddWorkspaceForm from "./components/workspace-form";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [dbUserId, setDbUserId] = useState<number | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      const storedDbUserId = user.publicMetadata.dbUserId as number;
      setDbUserId(storedDbUserId);
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
    if (!dbUserId) return;
    const response = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: dbUserId, name }),
    });
    if (response.ok) {
      fetchWorkspaces(dbUserId);
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Workspaces</h2>
        <WorkspaceList workspaces={workspaces} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Add New Workspace</h2>
        <AddWorkspaceForm onAddWorkspace={handleAddWorkspace} />
      </div>
    </div>
  );
}
