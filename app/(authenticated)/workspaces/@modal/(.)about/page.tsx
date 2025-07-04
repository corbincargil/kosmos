"use client";

import WorkspaceAbout from "../../_components/about";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function WorkspaceAboutPage() {
  const router = useRouter();
  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="max-w-5xl w-[96vw] h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle hidden>Workspace About</DialogTitle>
          <DialogDescription hidden>Workspace about</DialogDescription>
        </DialogHeader>
        <WorkspaceAbout />
      </DialogContent>
    </Dialog>
  );
}
