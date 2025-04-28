import { Skeleton } from "@/components/ui/skeleton";

export default function TaskViewControlsLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" /> 
          <Skeleton className="h-8 w-[120px] rounded-full" /> 
        </div>

        <div className="bg-input p-1 rounded-md">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" /> 
            <Skeleton className="h-8 w-8" /> 
          </div>
        </div>
      </div>
    </div>
  );
} 