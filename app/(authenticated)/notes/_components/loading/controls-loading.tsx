import { Skeleton } from "@/components/ui/skeleton";

export default function ControlsLoading() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 py-2 md:py-4">
    <div className="flex flex-col h-12 sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
      <div className="flex flex-row gap-2 w-full sm:w-auto">
        <Skeleton className="h-10 w-[140px]" /> 
        <Skeleton className="h-10 w-[140px]" /> 
      </div>
    </div>
    <div className="flex flex-row gap-2 w-full sm:w-auto justify-between">
      <Skeleton className="h-10 w-[200px] sm:w-[300px]" /> 
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8" /> 
        <Skeleton className="h-8 w-8" /> 
      </div>
    </div>
  </div>
  );
}