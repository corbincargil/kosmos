import { NextRequest, NextResponse } from "next/server";
import { createCaller } from "@/server/api/index";
import { createTRPCContext } from "@/server/api/trpc";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspace-id");

    
    // Validate workspace-id parameter
    if (!workspaceId || typeof workspaceId !== "string" || workspaceId.trim() === "") {
        return NextResponse.json(
            { error: "workspace-id parameter is required and must be a non-empty string" },
            { status: 400 }
        );
    }

    // Create tRPC context without user authentication for API routes
    const context = await createTRPCContext({ headers: request.headers });
    const caller = createCaller(context);

    // Call the existing tRPC procedure
    const posts = await caller.posts.publicGetCurrentWorkspacePosts({
      workspaceId: workspaceId.trim()
    });

    return NextResponse.json(posts);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
} catch (error: any) {
    console.error("Error fetching posts:", error);

    // Handle specific tRPC errors
    if (error.message === "Workspace not found") {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
