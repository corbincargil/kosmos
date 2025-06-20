"use client";

import { PostCard } from "./_components/post-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { FetchPost } from "@/types/post";
import { notFound } from "next/navigation";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import PostsLoading from "./loading";

export default function PostsPage() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace");

  if (!workspaceId) {
    notFound();
  }

  const { data: posts, isLoading } = api.posts.publicGetCurrentWorkspacePosts.useQuery({ 
    workspaceId 
  });

  if (isLoading) {
    return <PostsLoading />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link href={`/posts/new?workspace=${workspaceId}`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.map((post: FetchPost) => (
          <PostCard key={post.cuid} post={post} />
        ))}
      </div>

      {(!posts || posts.length === 0) && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first post to get started
          </p>
          <Link href={`/posts/new?workspace=${workspaceId}`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
} 