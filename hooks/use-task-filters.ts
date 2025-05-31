import { useSearchParams, useRouter } from "next/navigation";
import { FilterParams, ParsedFilters } from "@/server/api/filters/types";

export function useTaskFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const getFilters = (): FilterParams => {
    const filters: FilterParams = {};
    const status = searchParams.get('status');
    const tags = searchParams.get('tags');
    const taskTypes = searchParams.get('taskTypes');
    
    if (status) {
      filters.status = status.split(',') as any[];
    }
    
    if (tags) {
      filters.tags = tags.split(',').map(Number);
    }
    
    if (taskTypes) {
      filters.taskTypes = taskTypes.split(',').map(Number);
    }
    
    return filters;
  };
  
  const setFilter = (key: keyof FilterParams, value: any) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value.length > 0) {
      params.set(key, Array.isArray(value) ? value.join(',') : value);
    } else {
      params.delete(key);
    }
    
    router.push(`?${params.toString()}`);
  };
  
  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('status');
    params.delete('tags');
    params.delete('taskTypes');
    router.push(`?${params.toString()}`);
  };
  
  return {
    filters: getFilters(),
    setFilter,
    clearFilters,
    filterString: searchParams.toString()
  };
} 