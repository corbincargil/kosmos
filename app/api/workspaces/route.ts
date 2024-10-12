import { NextRequest } from "next/server";
import { WorkspaceController } from "../../../controllers/workspace-controller";

export async function POST(req: NextRequest) {
  return WorkspaceController.createWorkspace(req);
}

export async function GET(req: NextRequest) {
  return WorkspaceController.getWorkspaces(req);
}
