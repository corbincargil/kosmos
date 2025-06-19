import PostForm from "../../_components/post-form";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

interface EditPostPageProps {
  params: {
    cuid: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function EditPostPage({ params, searchParams }: EditPostPageProps) {
  const workspaceId = searchParams.workspace;

  if (!workspaceId || Array.isArray(workspaceId)) {
    notFound();
  }

  const post = await api.posts.getPostByCuid(params.cuid);

  if (!post) {
    notFound();
  }

  return (
    <div className="container pt-4 mx-auto flex flex-col md:h-full justify-between">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <PostForm post={post} workspaceId={workspaceId} />
    </div>
  );
} 