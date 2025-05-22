import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { DialogTitle } from "@/components/ui/dialog";
import { Settings, Tags, ListTodo } from "lucide-react";

export type Section = "general" | "tags" | "task-types";

export interface NavigationProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
} 

export function TabsNav({ activeSection, setActiveSection }: NavigationProps) {
  return (
    <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as Section)} className="w-full">
      <TabsList className="w-full justify-start h-12 bg-transparent p-0 gap-1 border-b">
        <TabsTrigger value="general" className="rounded-none px-4 h-12 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary hover:bg-muted/50">
          <Settings className="w-4 h-4 mr-2" />
          General
        </TabsTrigger>
        <TabsTrigger value="tags" className="rounded-none px-4 h-12 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary hover:bg-muted/50">
          <Tags className="w-4 h-4 mr-2" />
          Tags
        </TabsTrigger>
        <TabsTrigger value="task-types" className="rounded-none px-4 h-12 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary hover:bg-muted/50">
          <ListTodo className="w-4 h-4 mr-2" />
          Task Types
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
} 

export function SidebarNav({ activeSection, setActiveSection }: NavigationProps) {
  return (
    <SidebarProvider className="w-[260px]">
      <Sidebar className="border-r p-2 h-full" collapsible="icon">
        <SidebarHeader className="p-2 h-12">
          <DialogTitle className="text-lg font-semibold">Workspace Settings</DialogTitle>
        </SidebarHeader>
        <SidebarSeparator className="my-2" />
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeSection === "general"}
                onClick={() => setActiveSection("general")}
                tooltip="General Settings"
                className="h-10 data-[active=true]:bg-primary/10 data-[active=true]:text-primary hover:bg-muted/50"
              >
                <Settings className="mr-2" />
                <span>General</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeSection === "tags"}
                onClick={() => setActiveSection("tags")}
                tooltip="Tags"
                className="h-10 data-[active=true]:bg-primary/10 data-[active=true]:text-primary hover:bg-muted/50"
              >
                <Tags className="mr-2" />
                <span>Tags</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeSection === "task-types"}
                onClick={() => setActiveSection("task-types")}
                tooltip="Task Types"
                className="h-10 data-[active=true]:bg-primary/10 data-[active=true]:text-primary hover:bg-muted/50"
              >
                <ListTodo className="mr-2" />
                <span>Task Types</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
} 