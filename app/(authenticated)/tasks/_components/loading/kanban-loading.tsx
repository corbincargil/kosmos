import { Skeleton } from "@/components/ui/skeleton";
import { TaskStatus } from "@prisma/client";
import { getTaskLabel } from "@/types/task";

export default function KanbanLoading() {
  const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS","BLOCKED", "COMPLETED"];

  return (
    <div className="bg-background p-2 rounded-lg h-full flex flex-row gap-4 overflow-x-auto snap-x snap-mandatory sm:snap-none">
      {statuses.map((status) => (
        <div
          key={status}
          className="flex-1 min-w-[80vw] md:min-w-[320px] max-w-[500px] flex flex-col h-full snap-center"
        >
          <h3 className="text-lg font-semibold p-1">{getTaskLabel(status)}</h3>
          <div className="flex-1 bg-secondary px-2 pt-2 rounded-lg overflow-y-auto">
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-grow">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 my-4">
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}