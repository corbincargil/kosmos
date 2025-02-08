import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import "./styles.css";
import { GripVerticalIcon } from "lucide-react";
import { useEffect } from "react";

interface RichTextEditorProps {
  content: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
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
  Paragraph,
  Text,
  TaskList,
  TaskItem,
];

const RichTextEditor = ({
  content,
  onChange,
  readOnly = false,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions,
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

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
      <EditorContent editor={editor} className="h-full" />
    </>
  );
};

export default RichTextEditor;
