import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { Tag } from "@/types/tag";
import { TagCard } from "./tag-card";
import { TagForm } from "./tag-form";
import { DeleteTagModal } from "./delete-tag-modal";

interface TagsContentProps {
  workspaceId: number;
  workspaceUuid: string;
}

export function TagsContent({ workspaceUuid, workspaceId }: TagsContentProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);
  const [deleteError, setDeleteError] = useState<string>();

  const { toast } = useToast();
  const utils = api.useUtils();

  const { data: tags } = api.tags.getTagsByWorkspaceId.useQuery({
    workspaceUuid: workspaceUuid,
  });

  const { mutate: createTag } = api.tags.createTag.useMutation({
    onSuccess: () => {
      utils.tags.getTagsByWorkspaceId.invalidate();
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Tag created successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: updateTag } = api.tags.updateTag.useMutation({
    onSuccess: () => {
      utils.tags.getTagsByWorkspaceId.invalidate();
      setEditingTag(null);
      toast({
        title: "Success",
        description: "Tag updated successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteTag } = api.tags.deleteTag.useMutation({
    onSuccess: () => {
      utils.tags.getTagsByWorkspaceId.invalidate();
      setDeletingTag(null);
      setDeleteError(undefined);
      toast({
        title: "Success",
        description: "Tag deleted successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      setDeleteError(error.message);
    },
  });

  const handleCreateTag = (data: { name: string; color: string }) => {
    createTag({
      ...data,
      workspaceId,
    });
  };

  const handleUpdateTag = (data: { name: string; color: string }) => {
    if (!editingTag) return;
    updateTag({
      ...editingTag,
      ...data,
    });
  };

  const handleDeleteTag = () => {
    if (!deletingTag) return;
    deleteTag({ autoId: deletingTag.autoId });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tags</CardTitle>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tag
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCreating && (
          <div className="p-4 border rounded-lg">
            <TagForm
              onSubmit={handleCreateTag}
              onCancel={() => setIsCreating(false)}
            />
          </div>
        )}
        {editingTag && (
          <div className="p-4 border rounded-lg">
            <TagForm
              tag={editingTag}
              onSubmit={handleUpdateTag}
              onCancel={() => setEditingTag(null)}
            />
          </div>
        )}
        <div className="grid gap-2">
          {tags?.map((tag) => (
            <TagCard
              key={tag.autoId}
              tag={tag}
              onEdit={setEditingTag}
              onDelete={setDeletingTag}
            />
          ))}
        </div>
      </CardContent>
      {deletingTag && (
        <DeleteTagModal
          tag={deletingTag}
          onConfirm={handleDeleteTag}
          onCancel={() => {
            setDeletingTag(null);
            setDeleteError(undefined);
          }}
          error={deleteError}
        />
      )}
    </Card>
  );
}