import { NextRequest } from "next/server";
import { NoteController } from "../../../../controllers/note-controller";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return NoteController.getNoteByIdentifier(params.id);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return NoteController.updateNote(req, parseInt(params.id, 10));
}
