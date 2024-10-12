import { NextRequest, NextResponse } from "next/server";
import { WorkspaceService } from "../services/workspace-service";

export const WorkspaceController = {
  createWorkspace: async (req: NextRequest) => {
    try {
      const { userId, name } = await req.json();
      const workspace = await WorkspaceService.createWorkspace(userId, name);
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
};
