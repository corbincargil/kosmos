import { NextRequest, NextResponse } from "next/server";
import { NoteService } from "../services/note-service";
import { WorkspaceService } from "../services/workspace-service";

export const NoteController = {
  getNotesByWorkspaceId: async (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const workspaceId = searchParams.get("workspaceId");

      if (!workspaceId) {
        return NextResponse.json(
          { error: "Workspace ID is required" },
          { status: 400 }
        );
      }

      const notes = await NoteService.getNotesByWorkspaceId(
        Number(workspaceId)
      );
      return NextResponse.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      return NextResponse.json(
        { error: "Failed to fetch notes" },
        { status: 500 }
      );
    }
  },

  getNotesByUser: async (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");

      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }

      const notes = await NoteService.getNotesByUserId(Number(userId));
      return NextResponse.json(notes);
    } catch (error) {
      console.error("Error fetching notes for user:", error);
      return NextResponse.json(
        { error: "Failed to fetch notes for user" },
        { status: 500 }
      );
    }
  },

  getNoteByIdentifier: async (identifier: string) => {
    try {
      console.log("identifier", identifier);
      let note;
      // Check if the identifier is a UUID
      if (identifier.includes("-")) {
        note = await NoteService.getNoteByUuid(identifier);
      } else {
        // Try to parse as numeric ID
        const id = parseInt(identifier, 10);
        if (isNaN(id)) {
          return NextResponse.json(
            { error: "Invalid note identifier" },
            { status: 400 }
          );
        }
        note = await NoteService.getNoteById(id);
      }

      if (!note) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }

      return NextResponse.json(note);
    } catch (error) {
      console.error("Error fetching note:", error);
      return NextResponse.json(
        { error: "Failed to fetch note" },
        { status: 500 }
      );
    }
  },

  createNote: async (req: NextRequest) => {
    try {
      const body = await req.json();

      const workspaces = await WorkspaceService.getWorkspacesByUserId(
        body.userId
      );
      const isValidWorkspace = workspaces.some(
        (ws) => ws.id === Number(body.workspaceId)
      );

      if (!isValidWorkspace) {
        return NextResponse.json(
          { error: "Invalid workspace" },
          { status: 403 }
        );
      }

      const note = await NoteService.createNote({
        title: body.title,
        content: body.content,
        workspaceId: Number(body.workspaceId),
        userId: body.userId,
      });

      return NextResponse.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      return NextResponse.json(
        { error: "Failed to create note" },
        { status: 500 }
      );
    }
  },

  updateNote: async (req: NextRequest, id: number) => {
    try {
      const body = await req.json();

      const note = await NoteService.updateNote(id, {
        title: body.title,
        content: body.content,
      });

      return NextResponse.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      return NextResponse.json(
        { error: "Failed to update note" },
        { status: 500 }
      );
    }
  },
};
