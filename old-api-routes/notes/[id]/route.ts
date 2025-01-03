import { NextRequest } from "next/server";
import { NoteController } from "../../../controllers/note-controller";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return NoteController.getNoteByIdentifier(params.id);
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return NoteController.updateNote(req, parseInt(params.id, 10));
}
