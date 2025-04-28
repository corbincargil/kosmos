import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import "./styles.css";
import { GripVerticalIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { handleContentChange, normalizeHtml } from "./helpers";

interface RichTextEditorProps {
  content: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  onCompareContent?: (hasChanges: boolean) => void;
  lastSavedContent?: string;
  className?: string;
}

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
    },
    orderedList: {
      keepMarks: true,
    },
  }),
  TaskList,
  TaskItem,
];

const RichTextEditor = ({
  content,
  onChange,
  readOnly = false,
  onCompareContent,
  lastSavedContent,
  className,
}: RichTextEditorProps) => {
  const initialContentRef = useRef(normalizeHtml(content));

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const currentContent = normalizeHtml(editor.getHTML());
      onChange?.(currentContent);

      if (onCompareContent) {
        onCompareContent(
          currentContent !==
            normalizeHtml(lastSavedContent || initialContentRef.current)
        );
      }
    },
  });

  useEffect(() => {
    if (editor) {
      handleContentChange({
        editor,
        content,
        lastSavedContent: lastSavedContent || "",
        initialContentRef,
        onCompareContent,
      });
    }
  }, [content, editor, onCompareContent, lastSavedContent]);

  if (!editor) {
    return null;
  }

  //todo: add floating menu and/or bubble menu
  return (
    <>
      {!readOnly && (
        <DragHandle editor={editor}>
          <GripVerticalIcon className="w-4 h-4 text-gray-500" />
        </DragHandle>
      )}
      <EditorContent editor={editor} className={className} />
    </>
  );
};

export default RichTextEditor;
