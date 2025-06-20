import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  content: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  onCompareContent?: (hasChanges: boolean) => void;
  lastSavedContent?: string;
  className?: string;
}

const MarkdownEditor = ({
  content,
  onChange,
  readOnly = false,
  onCompareContent,
  lastSavedContent,
  className,
}: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const initialContentRef = useRef(content);

  useEffect(() => {
    if (onCompareContent) {
      onCompareContent(content !== (lastSavedContent || initialContentRef.current));
    }
  }, [content, lastSavedContent, onCompareContent]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={cn("flex flex-col h-full min-h-[400px] md:min-h-0", className)}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")} className="flex-1 flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[200px] flex-shrink-0">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="flex-1 min-h-0 mt-2">
          <Textarea
            value={content}
            onChange={handleContentChange}
            readOnly={readOnly}
            className="h-full resize-none font-mono"
            placeholder="Write your markdown here..."
          />
        </TabsContent>
        <TabsContent value="preview" className="flex-1 min-h-0 mt-2 overflow-auto p-4 prose dark:prose-invert max-w-none h-full">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || "Nothing to preview"}
            </ReactMarkdown>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarkdownEditor; 