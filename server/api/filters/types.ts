import { TaskStatus } from "@prisma/client";

export interface FilterConfig {
  parse: (value: string) => any;
  validate: (value: any) => boolean;
  transform: (value: any) => any;
}

export interface FilterParams {
  tags?: number[];
  status?: TaskStatus[];
  taskTypes?: number[];
  workspaceId?: string;
}

export interface ParsedFilters {
  [key: string]: any;
}

export function parseFilterString(filterString: string | null): ParsedFilters {
  if (!filterString) return {};
  
  const filters: ParsedFilters = {};
  const pairs = filterString.split('&');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value) {
      filters[key] = value;
    }
  }
  
  return filters;
}

export function encodeFilterString(filters: ParsedFilters): string {
  return Object.entries(filters)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
} 