import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { Workspace } from "@/types/workspace";

interface DeleteWorkspaceModalProps {
  workspace: Workspace;
  closeModal: () => void;
}

export default function DeleteWorkspaceModal({
  workspace,
  closeModal,
}: DeleteWorkspaceModalProps) {
  const { toast } = useToast();
  const utils = api.useUtils();

  const { mutate: deleteWorkspaceMutation } =
    api.workspaces.deleteWorkspace.useMutation({
      onSuccess: () => {
        utils.workspaces.getUserWorkspaces.invalidate();
        closeModal();
        toast({
          title: "Success",
          description: "Workspace deleted successfully",
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete workspace",
          variant: "destructive",
        });
      },
    });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Confirm Deletion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            Are you sure you want to delete the workspace{" "}
            <span className="font-bold">{workspace.name}</span>?
          </p>
          <p className="text-sm">
            This will delete all the data associated with this workspace.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <button
            className="bg-gray-500 text-white px-2 py-1 rounded"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => deleteWorkspaceMutation(workspace.id)}
          >
            Delete
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
