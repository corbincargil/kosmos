import { notFound } from "next/navigation";

export default function CatchAllNotFound() {
  notFound();

  // This part won't be reached, but we keep it for TypeScript
  return null;
}
