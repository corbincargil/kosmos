import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarSkeleton() {
  return (
    <Sidebar className="z-100" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center w-full px-0">
          <Skeleton className="h-8 w-8 rounded-md mr-2 bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-10 flex-1 bg-gray-300 dark:bg-gray-700" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuButton>
            <Skeleton className="h-6 w-6 rounded-md bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-6 w-24 ml-2 bg-gray-300 dark:bg-gray-700" />
          </SidebarMenuButton>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[1, 2].map((i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton>
                    <Skeleton className="h-6 w-6 rounded-md bg-gray-300 dark:bg-gray-700" />
                    <Skeleton className="h-6 w-24 ml-2 bg-gray-300 dark:bg-gray-700" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Skeleton className="h-6 w-6 rounded-md bg-gray-300 dark:bg-gray-700" />
                  <Skeleton className="h-6 w-24 ml-2 bg-gray-300 dark:bg-gray-700" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
