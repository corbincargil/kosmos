"use client";

import { Button } from "@/components/ui/button";
import { Upload, X, FileImage } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { useWorkspace } from "@/contexts/workspace-context";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function UploadSermon() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { selectedWorkspace } = useWorkspace();
  const { user } = useUser();
  const { toast } = useToast();

  const [createdSermonNoteId, setCreatedSermonNoteId] = useState<number | null>(
    null
  );
  const [isPolling, setIsPolling] = useState(false);

  const { data: sermonNote } = api.sermons.getSermonNote.useQuery(
    { id: createdSermonNoteId! },
    {
      enabled: !!createdSermonNoteId,
      refetchInterval: isPolling ? 2000 : false,
      refetchIntervalInBackground: false,
    }
  );

  // Handle polling logic
  useEffect(() => {
    if (sermonNote) {
      if (sermonNote.status === "PROCESSING") {
        setIsPolling(true);
      } else {
        setIsPolling(false);
        // Processing complete, show appropriate message
        if (sermonNote.status === "COMPLETED") {
          toast({
            title: "Processing Complete",
            description: "Your sermon notes are ready!",
            variant: "default",
          });
        } else if (sermonNote.status === "FAILED") {
          toast({
            title: "Processing Failed",
            description: "There was an error processing your sermon image.",
            variant: "destructive",
          });
        }
      }
    }
  }, [sermonNote?.status, toast]);

  const { mutate: createSermonNote } = api.sermons.createSermonNote.useMutation(
    {
      onSuccess: (sermonNote) => {
        toast({
          title: "Success",
          description: "Sermon note created successfully. Processing image...",
          variant: "default",
        });
        setSelectedFiles([]);
        setIsCreating(false);
        setCreatedSermonNoteId(sermonNote.id);
        setIsPolling(true);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to create sermon note: ${error.message}`,
          variant: "destructive",
        });
        setIsCreating(false);
      },
    }
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const files = event.dataTransfer.files;
    if (files) {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      setSelectedFiles((prev) => [...prev, ...imageFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      toast({
        title: "Error",
        description: "Please select at least one file",
        variant: "destructive",
      });
      return;
    }

    if (!user?.publicMetadata?.dbUserId) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
      return;
    }

    if (!selectedWorkspace || selectedWorkspace === "all") {
      toast({
        title: "Error",
        description: "Please select a specific workspace",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Create FormData for upload
      const formData = new FormData();
      formData.append("userId", user.publicMetadata.dbUserId.toString());

      // Append all files
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      // Call upload API
      const response = await fetch("/api/v1/sermons/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const uploadResult = await response.json();
      setIsUploading(false);
      setIsCreating(true);

      // Create SermonNote with upload result
      createSermonNote({
        title: title.trim(),
        workspaceId: selectedWorkspace,
        s3Key: uploadResult.s3Key,
      });
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Upload failed",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Upload Sermon
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Upload sermon images to generate notes.
        </DialogDescription>
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm sm:text-base">Title (optional)</Label>
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="relative">
            <div
              className={`
                border-2 border-dashed rounded-lg p-4 sm:p-8 text-center cursor-pointer transition-colors
                border-muted-foreground/25 hover:border-muted-foreground/50
              `}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm sm:text-base font-medium">
                    Select files or drop them here
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Upload multiple image files (JPG, PNG, etc.)
                  </p>
                </div>
              </div>
            </div>
            <Input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm sm:text-base">
                Selected Files ({selectedFiles.length})
              </h4>
              <div className="border rounded-lg p-2 sm:p-3 max-h-40 sm:max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between p-2 sm:p-3 bg-muted rounded-md gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileImage className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-sm font-medium truncate"
                            title={file.name}
                          >
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive flex-shrink-0 touch-manipulation"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {sermonNote && (
            <div className="p-3 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">Status:</div>
                <div
                  className={`text-sm ${
                    sermonNote.status === "COMPLETED"
                      ? "text-green-600"
                      : sermonNote.status === "PROCESSING"
                      ? "text-blue-600"
                      : sermonNote.status === "FAILED"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {sermonNote.status === "PROCESSING" && "🔄 Processing..."}
                  {sermonNote.status === "COMPLETED" && "✅ Complete"}
                  {sermonNote.status === "FAILED" && "❌ Failed"}
                  {sermonNote.status === "UPLOADED" && "📤 Uploaded"}
                </div>
              </div>
              {sermonNote.status === "COMPLETED" && sermonNote.markdown && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Generated {sermonNote.markdown.length} characters of markdown
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading || isCreating}
              className="flex-1 touch-manipulation"
            >
              {isUploading
                ? "Uploading..."
                : isCreating
                ? "Creating Sermon Note..."
                : `Upload ${
                    selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""
                  }`}
            </Button>
            {selectedFiles.length > 0 && !isUploading && !isCreating && (
              <Button
                variant="outline"
                onClick={() => setSelectedFiles([])}
                className="touch-manipulation"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
