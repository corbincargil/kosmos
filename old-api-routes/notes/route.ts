import { NextRequest } from "next/server";
import { NoteController } from "../../../controllers/note-controller";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");

  if (workspaceId) {
    return NoteController.getNotesByWorkspaceId(req);
  } else {
    return NoteController.getNotesByUser(req);
  }
}

export async function POST(req: NextRequest) {
  return NoteController.createNote(req);
}
