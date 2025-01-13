import { NextRequest, NextResponse } from "next/server";
import { WorkspaceService } from "../services/workspace-service";

export const WorkspaceController = {
  createWorkspace: async (req: NextRequest) => {
    try {
      const { userId, name, color } = await req.json();
      const workspace = await WorkspaceService.createWorkspace(
        userId,
        name,
        color
      );
      return NextResponse.json(workspace, { status: 201 });
    } catch (error) {
      console.error("Error creating workspace:", error);
      return NextResponse.json(
        { error: "Failed to create workspace" },
        { status: 500 }
      );
    }
  },

  getWorkspaces: async (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");

      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }

      const workspaces = await WorkspaceService.getWorkspacesByUserId(
        Number(userId)
      );
      return NextResponse.json(workspaces);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      return NextResponse.json(
        { error: "Failed to fetch workspaces" },
        { status: 500 }
      );
    }
  },

  editWorkspace: async (req: NextRequest) => {
    try {
      const { id, name, color } = await req.json();
      const workspace = await WorkspaceService.editWorkspace(id, name, color);
      return NextResponse.json(workspace);
    } catch (error) {
      console.error("Error editing workspace:", error);
      return NextResponse.json(
        { error: "Failed to edit workspace" },
        { status: 500 }
      );
    }
  },

  deleteWorkspace: async (req: NextRequest) => {
    try {
      const id = Number(req.url.split("/").pop());
      if (isNaN(id)) {
        return NextResponse.json(
          { error: "Invalid workspace ID" },
          { status: 400 }
        );
      }
      await WorkspaceService.deleteWorkspace(id);
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("Error deleting workspace:", error);
      return NextResponse.json(
        { error: "Failed to delete workspace" },
        { status: 500 }
      );
    }
  },
};
