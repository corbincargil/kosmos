import * as React from "react";
import { api } from "@/trpc/react";
import { Check, ChevronsUpDown, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

type TagSelectProps = {
    value: number[];
    onChange: (tagIds: number[]) => void;
    workspaceUuid: string;
};

export const TagSelect = ({ value, onChange, workspaceUuid }: TagSelectProps) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);
    
    const { data: tags, isLoading: isLoadingTags } = api.tags.getTagsByWorkspaceId.useQuery({
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

    const selectedTags = tags?.filter(tag => value.includes(tag.autoId)) || [];
    const filteredTags = tags?.filter(tag => 
        tag.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const handleSelect = (tagId: number) => {
        const newValue = value.includes(tagId)
            ? value.filter(id => id !== tagId)
            : [...value, tagId];
        onChange(newValue);
    };

    const handleRemove = (tagId: number) => {
        onChange(value.filter(id => id !== tagId));
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
                        <div className="flex gap-1 flex-wrap">
                            {selectedTags.length > 0 ? (
                                selectedTags.map((tag) => (
                                    <div
                                        key={tag.autoId}
                                        className="flex items-center gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                            style={{ backgroundColor: tag.color }}
                                        >
                                            {tag.name}
                                            <button
                                                type="button"
                                                className="h-3 w-3 cursor-pointer hover:text-destructive focus:outline-none"
                                                onClick={() => handleRemove(tag.autoId)}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <span className="text-muted-foreground">Select tags...</span>
                            )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
            </Popover>
            {open && (
                <div className="absolute top-full left-0 w-full mt-1 z-[100]">
                    <Command>
                        <CommandInput 
                            placeholder="Search tags..." 
                            value={search}
                            onValueChange={setSearch}
                        />
                        <CommandList>
                            {isLoadingTags ? (
                                <CommandEmpty>Loading tags...</CommandEmpty>
                            ) : (
                                <>
                                    <CommandEmpty>No tags found.</CommandEmpty>
                                    <CommandGroup>
                                        {filteredTags.map((tag) => (
                                            <CommandItem
                                                key={tag.autoId}
                                                value={tag.name}
                                                onSelect={() => {
                                                    handleSelect(tag.autoId);
                                                    // Don't close the popover after selection
                                                    setOpen(true);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value.includes(tag.autoId) ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <div
                                                    className="w-3 h-3 rounded-full mr-2"
                                                    style={{ backgroundColor: tag.color }}
                                                />
                                                {tag.name}
                                            </CommandItem>
                                        ))}
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
