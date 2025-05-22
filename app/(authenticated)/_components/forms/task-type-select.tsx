import * as React from "react";
import { api } from "@/trpc/react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ICON_MAP } from "@/app/(authenticated)/_components/layout/sidebar/constants";

type TaskTypeSelectProps = {
  value: number | null;
  onChange: (taskTypeId: number | null) => void;
  workspaceUuid: string;
};

export const TaskTypeSelect = ({ value, onChange, workspaceUuid }: TaskTypeSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const { data: taskTypes, isLoading: isLoadingTaskTypes } = api.taskTypes.getTaskTypesByWorkspaceId.useQuery({
    workspaceUuid: workspaceUuid,
  });

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedTaskType = taskTypes?.find(taskType => taskType.autoId === value);
  const filteredTaskTypes = taskTypes?.filter(taskType => 
    taskType.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleSelect = (taskTypeId: number) => {
    onChange(taskTypeId);
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-[42px]"
          >
            {selectedTaskType ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedTaskType.color }}
                />
                {selectedTaskType.name}
              </div>
            ) : (
              <span className="text-muted-foreground">Select task type...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </Popover>
      {open && (
        <div className="absolute top-full left-0 w-full mt-1 z-[100]">
          <Command>
            <CommandInput 
              placeholder="Search task types..." 
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {isLoadingTaskTypes ? (
                <CommandEmpty>Loading task types...</CommandEmpty>
              ) : (
                <>
                  <CommandEmpty>No task types found.</CommandEmpty>
                  <CommandGroup>
                    {filteredTaskTypes.map((taskType) => {
                      const IconComponent = ICON_MAP[taskType.icon];
                      return (
                        <CommandItem
                          key={taskType.autoId}
                          value={taskType.name}
                          onSelect={() => handleSelect(taskType.autoId)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === taskType.autoId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: taskType.color }}
                          />
                          {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                          {taskType.name}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}; 