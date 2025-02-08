import StarterKit from "@tiptap/starter-kit";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Editor } from "@tiptap/react";
import { MutableRefObject, RefObject } from "react";

export const normalizeHtml = (html: string = "") => {
  return html
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .replace(/\s+>/g, ">")
    .replace(/<\s+/g, "<")
    .replace(/\s+\/>/g, "/>")
    .replace(/(<p>)\s+/g, "$1")
    .replace(/\s+(<\/p>)/g, "$1")
    .replace(/(<h\d>)\s+/g, "$1")
    .replace(/\s+(<\/h\d>)/g, "$1")
    .trim();
};

export const editorExtensions = [
  StarterKit.configure({
    bulletList: { keepMarks: true },
    orderedList: { keepMarks: true },
  }),
  Paragraph,
  Text,
  TaskList,
  TaskItem,
];

interface HandleContentChangeProps {
  editor: Editor;
  content: string;
  lastSavedContent: string;
  initialContentRef: MutableRefObject<string>;
  onCompareContent?: (hasChanges: boolean) => void;
}

export const handleContentChange = ({
  editor,
  content,
  lastSavedContent,
  initialContentRef,
  onCompareContent,
}: HandleContentChangeProps) => {
  const normalizedContent = normalizeHtml(content);
  const normalizedEditor = normalizeHtml(editor.getHTML());

  if (normalizedContent !== normalizedEditor) {
    editor.commands.setContent(content || "");
    initialContentRef.current = normalizeHtml(lastSavedContent || content);
    onCompareContent?.(false);
  }
};
