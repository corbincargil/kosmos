export async function addWorkspace(
  dbUserId: number,
  name: string,
  color: string
) {
  const response = await fetch("/api/workspaces", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: dbUserId, name, color }),
  });

  if (!response.ok) {
    console.error("Failed to add workspace");
    return false;
  }

  return true;
}

export async function editWorkspace(id: number, name: string, color: string) {
  const response = await fetch(`/api/workspaces/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name, color }),
  });

  if (!response.ok) {
    console.error("Failed to edit workspace");
    return false;
  }

  return true;
}
