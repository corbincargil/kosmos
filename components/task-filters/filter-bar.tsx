import { TaskStatus } from "@prisma/client";
import { FilterDropdown } from "./filter-dropdown";
import { Button } from "@/components/ui/button";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { getTaskLabel, PrimaryTaskStatuses } from "@/types/task";
import { api } from "@/trpc/react";

export function FilterBar({workspaceUuid}: {workspaceUuid: string}) {
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
  
  return (
    <div className="flex flex-wrap gap-2 items-start">
      <div className="flex flex-wrap gap-2">
        <FilterDropdown
          label="Status"
          options={statusOptions}
          selected={filters.status?.map(String) || PrimaryTaskStatuses}
          onChange={(values) => setFilter('status', values)}
        />
        
        <FilterDropdown
          label="Tags"
          options={tagOptions}
          selected={filters.tags?.map(String) || []}
          onChange={(values) => setFilter('tags', values.map(Number))}
        />
        
        <FilterDropdown
          label="Task Types"
          options={taskTypeOptions}
          selected={filters.taskTypes?.map(String) || []}
          onChange={(values) => setFilter('taskTypes', values.map(Number))}
        />
      </div>
      
      <Button
        variant="outline"
        onClick={clearFilters}
        className="self-end"
      >
        Clear Filters
      </Button>
    </div>
  );
} 