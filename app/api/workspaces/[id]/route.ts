import { NextRequest } from "next/server";
import { WorkspaceController } from "../../../../controllers/workspace-controller";

export async function PUT(req: NextRequest) {
  return WorkspaceController.editWorkspace(req);
}

export async function DELETE(req: NextRequest) {
  return WorkspaceController.deleteWorkspace(req);
}
