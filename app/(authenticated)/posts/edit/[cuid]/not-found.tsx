import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PostNotFound() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The post you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <Link href="/posts">
          <Button>Back to Posts</Button>
        </Link>
      </div>
    </div>
  );
} 