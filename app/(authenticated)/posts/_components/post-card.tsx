"use client";

import { FetchPost } from "@/types/post";
import { PostStatus } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

dayjs.extend(relativeTime);

interface PostCardProps {
  post: FetchPost;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchParams = useSearchParams();

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case "DRAFT":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "PUBLISHED":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "ARCHIVED":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    }
  };

  return (
    <Card
      className={cn(
        "hover:shadow-sm hover:shadow-workspace-lighter hover:scale-[1.01] transition-all relative cursor-pointer overflow-hidden",
        !isExpanded && "max-h-[400px]"
      )}
    >
      <Link
        href={`/posts/edit/${post.cuid}?${searchParams.toString()}`}
        className={className}
      >
        <CardHeader className="p-2 md:p-4 lg:p-6">
          <div className="flex justify-between items-start">
            <CardTitle className="text-md lg:text-lg">{post.title}</CardTitle>
            <Badge className={getStatusColor(post.status as PostStatus)}>
              {post.status}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-4">
            <span>Last updated {dayjs(post.updatedAt as Date).fromNow()}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.views} views
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="max-h-[600px] overflow-y-auto">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Link>
      {isExpanded ? (
        <Button
          onClick={handleButtonClick}
          variant="glow"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-950"
        >
          Hide
        </Button>
      ) : (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none shadow-lg" />
          <Button
            onClick={handleButtonClick}
            variant="outline"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-950"
          >
            View more
          </Button>
        </>
      )}
    </Card>
  );
} 