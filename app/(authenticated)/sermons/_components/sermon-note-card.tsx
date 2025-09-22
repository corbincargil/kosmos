"use client";

import { SermonNoteWithImages } from "@/types/sermon-note";
import { SermonNoteStatus } from "@prisma/client";
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
import { Badge } from "@/components/ui/badge";
import { Clock, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

dayjs.extend(relativeTime);

interface SermonNoteCardProps {
  sermonNote: SermonNoteWithImages;
  className?: string;
}

const getStatusColor = (status: SermonNoteStatus) => {
  switch (status) {
    case "UPLOADED":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "PROCESSING":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "COMPLETED":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "FAILED":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
};

const getStatusIcon = (status: SermonNoteStatus) => {
  switch (status) {
    case "UPLOADED":
      return "📤";
    case "PROCESSING":
      return "🔄";
    case "COMPLETED":
      return "✅";
    case "FAILED":
      return "❌";
    default:
      return "📄";
  }
};

export function SermonNoteCard({ sermonNote, className }: SermonNoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Use markdown if available, otherwise show OCR text
  const content =
    sermonNote.markdown || sermonNote.ocrText || "No content processed yet";
  const hasContent = !!(sermonNote.markdown || sermonNote.ocrText);

  return (
    <Card
      className={cn(
        "hover:shadow-sm hover:shadow-workspace-lighter hover:scale-[1.01] transition-all relative cursor-pointer overflow-hidden",
        !isExpanded && "max-h-[400px]",
        className
      )}
    >
      <CardHeader className="p-2 md:p-4 lg:p-6">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md lg:text-lg">
            {sermonNote.title}
          </CardTitle>
          <Badge className={getStatusColor(sermonNote.status)}>
            <span className="mr-1">{getStatusIcon(sermonNote.status)}</span>
            {sermonNote.status}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-4">
          <span>Last updated {dayjs(sermonNote.updatedAt).fromNow()}</span>
          {sermonNote.images.map((image) => (
            <span key={image.id} className="flex items-center gap-1">
              <img src={image.s3Key} alt="Sermon Note" width={16} height={16} />
            </span>
          ))}
          {sermonNote.markdown && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {Math.ceil(sermonNote.markdown.length / 250)} min read
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="max-h-[600px] overflow-y-auto">
        {hasContent ? (
          <div className="prose dark:prose-invert max-w-none text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            {sermonNote.status === "PROCESSING" ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                Processing sermon notes...
              </div>
            ) : sermonNote.status === "FAILED" ? (
              "Processing failed. Please try uploading again."
            ) : (
              "Waiting for processing to begin..."
            )}
          </div>
        )}
      </CardContent>

      {hasContent && (
        <>
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
        </>
      )}
    </Card>
  );
}
