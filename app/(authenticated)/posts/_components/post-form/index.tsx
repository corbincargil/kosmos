"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import {
  CreatePostSchema,
  type Post,
  type CreatePostInput,
} from "@/types/post";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import MarkdownEditor from "../../../_components/markdown-editor";
import { PostStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getReadingTime, slugify } from "./helpers";

interface PostFormProps {
  workspaceId: string;
  post?: Post;
  cancelButtonText?: string;
}

export default function PostForm({
  workspaceId,
  post,
  cancelButtonText = "Close",
}: PostFormProps) {
  const { toast } = useToast();
  const utils = api.useUtils();
  const router = useRouter();

  const [hasContentChanges, setHasContentChanges] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState(post?.content || "");
  const [lastSavedTitle, setLastSavedTitle] = useState(post?.title || "");

  const { data: authors } = api.authors.getCurrentUserAuthors.useQuery();

  const form = useForm<CreatePostInput>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      image: post?.image ?? "",
      readTime: post?.readTime || 5,
      status: post?.status || PostStatus.DRAFT,
      publishedAt: post?.publishedAt || null,
      authorId: post?.authorId || undefined,
      workspaceId,
    },
  });

  function handleError(error: string) {
    toast({
      title: "Error",
      description: `Failed to ${post ? "update" : "create"} post: ${error}`,
      variant: "destructive",
    });
  }

  //* create post mutation
  const { mutate: createPost, isPending: isCreating } =
    api.posts.createPost.useMutation({
      onSuccess: () => {
        utils.posts.getCurrentWorkspacePosts.invalidate({ workspaceId });
        form.reset();
        toast({
          title: "Success",
          variant: "success",
          description: "Post created successfully",
        });
        router.back();
      },
      onError: (error) => handleError(error.message),
    });

  //* update post mutation
  const { mutate: updatePost, isPending: isUpdating } =
    api.posts.updatePost.useMutation({
      onSuccess: () => {
        utils.posts.getCurrentWorkspacePosts.invalidate({ workspaceId });
        utils.posts.getPostByCuid.invalidate(post?.cuid || "");
        setLastSavedContent(form.getValues("content"));
        setLastSavedTitle(form.getValues("title"));
        setHasContentChanges(false);
      },
      onError: (error) => handleError(error.message),
    });

  const hasChanges =
    post && (hasContentChanges || form.watch("title") !== lastSavedTitle);
  const isSaving = isCreating || isUpdating;

  //* auto-generate slug when title changes
  useEffect(() => {
    const title = form.watch("title");
    if (title && !post) {
      const generatedSlug = slugify(title);
      form.setValue("slug", generatedSlug);
    }
  }, [form.watch("title"), post, form]);

  const onSubmit = useCallback(
    (data: CreatePostInput) => {
      const readingTime = getReadingTime(data.content);
      data.readTime = readingTime;
      if (post) {
        updatePost({ id: post.autoId, data });
      } else {
        createPost(data);
      }
    },
    [post, createPost, updatePost]
  );

  useEffect(() => {
    if (!post || !hasChanges || isSaving) return;

    const timer = setTimeout(() => {
      form.handleSubmit(onSubmit)();
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasChanges, post, form, isSaving, onSubmit]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="flex-shrink-0 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Post title"
                    className="text-2xl font-bold h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Slug</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Post slug"
                    className="text-2xl h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={PostStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={PostStatus.PUBLISHED}>Published</SelectItem>
                    <SelectItem value={PostStatus.ARCHIVED}>Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {authors?.length ? authors.map((author) => (
                      <SelectItem key={author.autoId} value={author.autoId.toString()}>
                        {author.firstName} {author.lastName}
                      </SelectItem>
                    )) : <SelectItem value="No authors found">No authors found</SelectItem>}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="https://example.com/image.jpg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex-shrink-0 pl-4 text-sm text-muted-foreground min-h-[20px] mb-4">
          {hasChanges && "Unsaved changes"}
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1 min-h-0">
              <FormControl>
                <div className="h-full">
                  <MarkdownEditor
                    content={field.value}
                    onChange={(value) => form.setValue("content", value)}
                    onCompareContent={setHasContentChanges}
                    lastSavedContent={lastSavedContent}
                    className="h-full"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex-shrink-0 flex justify-end gap-2 mt-6 mb-4">
          <Button type="button" onClick={() => router.back()} variant="glow">
            {cancelButtonText}
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : post ? "Save" : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 