import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WorkspaceFormProps {
  initialName?: string;
  initialColor?: string;
  onSubmit: (name: string, color: string) => Promise<boolean>;
  onCancel?: () => void;
}

export default function WorkspaceForm({
  initialName = "",
  initialColor = "#000000",
  onSubmit,
  onCancel,
}: WorkspaceFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsSubmitting(true);
      try {
        const success = await onSubmit(name.trim(), color);
        if (success) {
          toast({
            title: "Success",
            description: initialName
              ? "Workspace updated successfully"
              : "Workspace added successfully",
          });
          setName("");
          setColor("#000000");
        } else {
          toast({
            title: "Error",
            description: "Failed to save workspace",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("error", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
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
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-black px-4 py-2 rounded w-full mt-2"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
