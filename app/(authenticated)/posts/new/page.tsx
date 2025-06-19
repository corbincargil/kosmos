import PostForm from "../_components/post-form";
import { notFound } from "next/navigation";

interface NewPostPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function NewPostPage({ searchParams }: NewPostPageProps) {
  const workspaceId = searchParams.workspace;

  if (!workspaceId || Array.isArray(workspaceId)) {
    notFound();
  }

  return (
    <div className="container pt-4 mx-auto flex flex-col h-full justify-between">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <PostForm workspaceId={workspaceId} />
    </div>
  );
} 