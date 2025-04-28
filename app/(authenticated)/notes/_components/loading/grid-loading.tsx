import { Skeleton } from "@/components/ui/skeleton";

export default function GridLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div
              key={i}
              className="border rounded-lg p-4 hover:shadow-sm transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-3/4" /> 
                  <Skeleton className="h-4 w-20" /> 
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" /> 
                  <Skeleton className="h-8 w-5/6" /> 
                  <Skeleton className="h-8 w-4/6" /> 
                </div>
              </div>
            </div>
          ))}
        </div>
  );
}   