import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";

interface WorkspaceFormProps {
  closeModal: () => void;
  workspaceId?: number;
  initialName?: string;
  initialColor?: string;
}

export default function WorkspaceForm({
  workspaceId,
  initialName = "",
  initialColor = "#000000",
  closeModal,
}: WorkspaceFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!workspaceId;

  const { toast } = useToast();
  const utils = api.useUtils();

  const { mutate: addWorkspaceMutation } =
    api.workspaces.addWorkspace.useMutation({
      onSuccess: () => {
        utils.workspaces.getUserWorkspaces.invalidate();
        closeModal();
        toast({
          title: "Success",
          description: "Workspace added successfully",
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to add workspace",
          variant: "destructive",
        });
      },
    });

  const { mutate: editWorkspaceMutation } =
    api.workspaces.editWorkspace.useMutation({
      onSuccess: () => {
        utils.workspaces.getUserWorkspaces.invalidate();
        closeModal();
        toast({
          title: "Success",
          description: "Workspace updated successfully",
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update workspace",
          variant: "destructive",
        });
      },
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (isEditing) {
      editWorkspaceMutation({ id: workspaceId, name, color });
    } else {
      addWorkspaceMutation({ name, color });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace name"
          className="border p-2 rounded w-full"
          maxLength={50}
          required
          disabled={isSubmitting}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Submitting..."
          : initialName
          ? "Update Workspace"
          : "Add Workspace"}
      </button>
      <button
        type="button"
        onClick={closeModal}
        className="bg-gray-300 text-black px-4 py-2 rounded w-full mt-2"
        disabled={isSubmitting}
      >
        Cancel
      </button>
    </form>
  );
}
