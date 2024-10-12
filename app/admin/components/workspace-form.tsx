import { useState } from "react";

interface AddWorkspaceFormProps {
  onAddWorkspace: (name: string) => Promise<void>;
}

export default function AddWorkspaceForm({
  onAddWorkspace,
}: AddWorkspaceFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await onAddWorkspace(name.trim());
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Workspace name"
        className="border p-2 rounded w-full"
        maxLength={50}
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Workspace
      </button>
    </form>
  );
}
