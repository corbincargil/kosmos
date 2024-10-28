"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Task } from "@/types/task";
import { useWorkspace } from "@/contexts/workspace-context";
import Link from "next/link";
import { sortTasks } from "@/components/tasks/task-list/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Note } from "@/types/note";
import { TaskPreview } from "@/app/(authenticated)/dashboard/_components/task-preview";
import { NotePreview } from "@/app/(authenticated)/dashboard/_components/note-preview";

export default function Dashboard() {
  const { user } = useUser();
  const { selectedWorkspace, workspaces } = useWorkspace();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const Greeting =
    '"I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing." - John 15:5';

  const fetchTasks = useCallback(async () => {
    if (user) {
      const userId = user.publicMetadata.dbUserId as number;
      const queryParam =
        selectedWorkspace === "all"
          ? `userId=${userId}`
          : `workspaceId=${selectedWorkspace}`;

      const response = await fetch(`/api/tasks?${queryParam}&limit=5`);
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(sortTasks(tasksData));
      }
    }
  }, [user, selectedWorkspace]);

  const fetchNotes = useCallback(async () => {
    if (user) {
      const userId = user.publicMetadata.dbUserId as number;
      const queryParam =
        selectedWorkspace === "all"
          ? `userId=${userId}`
          : `workspaceId=${selectedWorkspace}`;

      const response = await fetch(`/api/notes?${queryParam}&limit=5`);
      if (response.ok) {
        const notesData = await response.json();
        setNotes(notesData);
      }
    }
  }, [user, selectedWorkspace]);

  useEffect(() => {
    fetchTasks();
    fetchNotes();
  }, [user, selectedWorkspace, fetchTasks, fetchNotes]);

  return (
    <div className="space-y-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Welcome, {user?.firstName || user?.username}!</CardTitle>
          <CardDescription>{Greeting}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Tasks</CardTitle>
              <Link href="/tasks">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {tasks.length ? (
                <TaskPreview
                  tasks={tasks}
                  workspaces={workspaces}
                  onTasksChanged={fetchTasks}
                />
              ) : (
                <p className="text-muted-foreground">You have no tasks yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Notes</CardTitle>
              <Link href="/notes">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {notes.length ? (
                <NotePreview notes={notes} />
              ) : (
                <p className="text-muted-foreground">You have no notes yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
