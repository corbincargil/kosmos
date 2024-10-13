import { useState } from "react";

interface WorkspaceFormProps {
  initialName?: string;
  initialColor?: string;
  onSubmit: (name: string, color: string) => Promise<void>;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await onSubmit(name.trim(), color);
      setName("");
      setColor("#000000");
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
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {initialName ? "Update Workspace" : "Add Workspace"}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-black px-4 py-2 rounded w-full mt-2"
        >
          Cancel
        </button>
      )}
    </form>
  );
}
