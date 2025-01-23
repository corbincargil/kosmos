import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function NoteFormLoading() {
  const router = useRouter();

  return (
    <div className="flex flex-col space-y-4 h-full w-full">
      <Button
        className="mb-4 max-w-fit"
        variant="glow"
        onClick={() => router.back()}
      >
        Back
      </Button>
      <div>
        <Skeleton className="h-10 w-full bg-gray-200 dark:bg-muted/60" />
      </div>

      <div className="flex items-center justify-between">
        <div className="h-4 w-40"></div>
        <Skeleton className="h-8 w-20 bg-gray-200 dark:bg-muted/60" />
      </div>

      <div className="relative min-h-[300px] border rounded-md">
        <Skeleton className="absolute inset-0 bg-gray-200 dark:bg-muted/60" />
      </div>

      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-24 bg-gray-200 dark:bg-muted/60" />
      </div>
    </div>
  );
}
