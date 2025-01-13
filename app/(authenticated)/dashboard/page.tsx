"use client";

import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useWorkspace } from "@/contexts/workspace-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { TaskPreview } from "@/app/(authenticated)/dashboard/_components/task-preview";
import { NotePreview } from "@/app/(authenticated)/dashboard/_components/note-preview";
import { api } from "@/trpc/react";

export default function Dashboard() {
  const { user } = useUser();
  const { selectedWorkspace, workspaces } = useWorkspace();

  const { data: tasks, refetch: refetchTasks } = api.tasks.getTasks.useQuery({
    workspaceId: selectedWorkspace,
  });

  const notesQuery = api.notes.getCurrentWorkspaceNotes.useQuery(
    { workspaceId: selectedWorkspace },
    { enabled: selectedWorkspace !== "all" && !!selectedWorkspace }
  );

  const userNotesQuery = api.notes.getCurrentUserNotes.useQuery(undefined, {
    enabled: selectedWorkspace === "all",
  });

  const notes =
    selectedWorkspace === "all"
      ? userNotesQuery.data ?? []
      : notesQuery.data ?? [];

  const Greeting =
    '"I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing." - John 15:5';

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
              {tasks?.length ? (
                <TaskPreview
                  tasks={tasks.slice(0, 5)}
                  workspaces={workspaces}
                  onTasksChanged={async () => {
                    refetchTasks();
                  }}
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
                <NotePreview notes={notes.slice(0, 5)} />
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
