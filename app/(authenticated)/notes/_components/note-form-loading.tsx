import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function NoteFormLoading() {
  const router = useRouter();

  return (
    <div className="flex flex-col space-y-4 h-full w-full">
      <div>
        <Skeleton className="text-3xl font-extrabold h-10 w-full bg-gray-200 dark:bg-muted/60" />
      </div>

      <div className="flex-1">
        <div className="relative h-[60%] min-h-[300px] border rounded-md">
          <Skeleton className="absolute inset-0 bg-gray-200 dark:bg-muted/60" />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-24 bg-gray-200 dark:bg-muted/60" />
        <Skeleton className="h-10 w-24 bg-gray-200 dark:bg-muted/60" />
      </div>
    </div>
  );
}
