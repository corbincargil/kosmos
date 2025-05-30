import { TaskStatus } from "@prisma/client";
import { FilterConfig, FilterParams, ParsedFilters } from "./types";

export function parseFilterString(filterString: string | null): ParsedFilters {
  if (!filterString) return {};
  
  const filters: ParsedFilters = {};
  const pairs = filterString.split('&');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value) {
      filters[key] = decodeURIComponent(value);
    }
  }
  
  return filters;
}

export const filterMiddleware: Record<keyof FilterParams, FilterConfig> = {
  tags: {
    parse: (value: string) => value.split(',').map(Number),
    validate: (value: number[]) => value.every(Number.isInteger),
    transform: (value: number[]) => ({
      tags: { some: { tagId: { in: value } } }
    })
  },
  status: {
    parse: (value: string) => value.split(','),
    validate: (value: string[]) => value.every(v => Object.values(TaskStatus).includes(v as TaskStatus)),
    transform: (value: string[]) => ({ status: { in: value } })
  },
  taskTypes: {
    parse: (value: string) => value.split(',').map(Number),
    validate: (value: number[]) => value.every(Number.isInteger),
    transform: (value: number[]) => ({ taskTypeId: { in: value } })
  },
  workspaceId: {
    parse: (value: string) => value,
    validate: (value: string) => typeof value === 'string',
    transform: (value: string) => ({ workspaceUuid: value })
  }
};

export function buildWhereClause(filters: FilterParams) {
  const whereClause: any = {};
  
  for (const [key, value] of Object.entries(filters)) {
    if (value && filterMiddleware[key as keyof FilterParams]) {
      const config = filterMiddleware[key as keyof FilterParams];
      const parsedValue = config.parse(value as string);
      
      if (config.validate(parsedValue)) {
        Object.assign(whereClause, config.transform(parsedValue));
      }
    }
  }
  
  return whereClause;
} 