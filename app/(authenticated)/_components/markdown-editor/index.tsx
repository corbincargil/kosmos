import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { Image as ImageType } from "@/types/image";
import Image from "next/image";

interface MarkdownEditorProps {
  content: string;
  images?: ImageType[];
  onChange?: (value: string) => void;
  readOnly?: boolean;
  onCompareContent?: (hasChanges: boolean) => void;
  lastSavedContent?: string;
  className?: string;
}

const MarkdownEditor = ({
  content,
  images,
  onChange,
  readOnly = false,
  onCompareContent,
  lastSavedContent,
  className,
}: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "images">(
    "edit"
  );
  const initialContentRef = useRef(content);
  console.log(images);

  useEffect(() => {
    if (onCompareContent) {
      onCompareContent(
        content !== (lastSavedContent || initialContentRef.current)
      );
    }
  }, [content, lastSavedContent, onCompareContent]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) =>
        setActiveTab(value as "edit" | "preview" | "images")
      }
      className="flex-1 flex flex-col h-full"
    >
      <TabsList className="grid w-full grid-cols-3 md:w-[300px] flex-shrink-0">
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        {images && <TabsTrigger value="images">Images</TabsTrigger>}
      </TabsList>
      <TabsContent value="edit" className="flex-1 min-h-0 mt-2">
        <Textarea
          value={content}
          onChange={handleContentChange}
          readOnly={readOnly}
          className="h-full resize-none font-mono border-none"
          placeholder="Write your markdown here..."
        />
      </TabsContent>
      <TabsContent
        value="preview"
        className="flex-1 min-h-0 mt-2 overflow-auto p-4 prose dark:prose-invert max-w-none"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content || "Nothing to preview"}
        </ReactMarkdown>
      </TabsContent>
      {images && (
        <TabsContent
          value="images"
          className="flex-1 min-h-0 mt-2 overflow-auto"
        >
          <div className="flex flex-col gap-2 h-full">
            {images.map((image) => (
              <Image
                key={image.id}
                src={image.s3Key}
                alt={image.originalName}
                className="rounded-sm w-[80%] object-cover"
                width={600}
                height={600}
              />
            ))}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default MarkdownEditor;
