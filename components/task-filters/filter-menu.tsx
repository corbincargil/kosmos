import { TaskStatus } from "@prisma/client";
import { FilterDropdown } from "./filter-dropdown";
import { Button } from "@/components/ui/button";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { getTaskLabel, PrimaryTaskStatuses } from "@/types/task";
import { api } from "@/trpc/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";

export function FilterMenu({workspaceUuid}: {workspaceUuid: string}) {
  const { filters, setFilter, clearFilters } = useTaskFilters();
  
  const { data: tags } = api.tags.getTagsByWorkspaceId.useQuery({
    workspaceUuid: workspaceUuid
  });
  
  const { data: taskTypes } = api.taskTypes.getTaskTypesByWorkspaceId.useQuery({
    workspaceUuid: workspaceUuid
  });
  
  const statusOptions = Object.values(TaskStatus).map(status => ({
    value: status,
    label: getTaskLabel(status)
  }));
  
  const tagOptions = tags?.map(tag => ({
    value: tag.autoId.toString(),
    label: tag.name
  })) || [];
  
  const taskTypeOptions = taskTypes?.map(type => ({
    value: type.autoId.toString(),
    label: type.name
  })) || [];

  const activeFilterCount = [
    filters.status?.length || 0,
    filters.tags?.length || 0,
    filters.taskTypes?.length || 0
  ].reduce((a, b) => a + b, 0);
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="glow" className="w-full">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-[50vh]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4 relative z-50">
          <FilterDropdown
            label="Status"
            options={statusOptions}
            selected={filters.status?.map(String) || PrimaryTaskStatuses}
            onChange={(values) => setFilter('status', values)}
            portal={true}
          />
          
          <FilterDropdown
            label="Tags"
            options={tagOptions}
            selected={filters.tags?.map(String) || []}
            onChange={(values) => setFilter('tags', values.map(Number))}
            portal={true}
          />
          
          <FilterDropdown
            label="Task Types"
            options={taskTypeOptions}
            selected={filters.taskTypes?.map(String) || []}
            onChange={(values) => setFilter('taskTypes', values.map(Number))}
            portal={true}
          />
          
          <Button
            variant="outline"
            onClick={clearFilters}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
} 