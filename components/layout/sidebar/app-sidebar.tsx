import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useWorkspace } from "@/contexts/workspace-context";
import { Croissant, Home, List, FileText, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const dashboardLink = {
  href: "/dashboard",
  label: "Dashboard",
  icon: Home,
};

const generalLinks = [
  { href: "/tasks", label: "Tasks", icon: List },
  { href: "/notes", label: "Notes", icon: FileText },
];

const workspaceLinks = [{ href: "/admin", label: "Settings", icon: Settings }];

export function AppSidebar() {
  const { workspaces, selectedWorkspace, setSelectedWorkspace } =
    useWorkspace();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Sidebar className="z-100" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center space-x-4 px-4">
            <Croissant size={36} className="text-workspace-darker" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenuButton
              asChild
              className={
                pathname === dashboardLink.href
                  ? "border-b border-b-white text-white"
                  : ""
              }
            >
              <Link href={dashboardLink.href} className="rounded-none">
                <dashboardLink.icon size={20} />
                <span>{dashboardLink.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>General</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {generalLinks.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={
                        pathname === item.href
                          ? "border-b border-b-workspace-lighter text-workspace-darker hover:text-workspace-darker"
                          : ""
                      }
                    >
                      <Link href={item.href} className="rounded-none">
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </Link>
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
                {workspaceLinks.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={
                        pathname === item.href
                          ? "border-b border-b-workspace-lighter text-workspace-darker hover:text-workspace-darker"
                          : ""
                      }
                    >
                      <Link href={item.href} className="rounded-none">
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="z-100" collapsible="icon">
      <SidebarHeader>
        <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
          <SelectTrigger className="font-bold text-workspace-darker border-none overflow-hidden break-all">
            <SelectValue>
              <div className="flex items-center space-x-4">
                <Croissant size={36} className="text-workspace-darker" />
                <span className="text-lg md:text-2xl whitespace-nowrap">
                  {selectedWorkspace === "all"
                    ? "All"
                    : workspaces.find(
                        (workspace) =>
                          workspace.id.toString() === selectedWorkspace
                      )?.name}
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {workspaces.map((workspace) => (
              <SelectItem
                key={workspace.id}
                value={workspace.id.toString()}
                className="text-workspace-darker"
                style={{ color: workspace.color }}
              >
                {workspace.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuButton
            asChild
            className={
              pathname === dashboardLink.href
                ? "border-b border-b-white text-white"
                : ""
            }
          >
            <Link href={dashboardLink.href} className="rounded-none">
              <dashboardLink.icon size={20} />
              <span>{dashboardLink.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalLinks.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={
                      pathname === item.href
                        ? "border-b border-b-workspace-lighter text-workspace-darker hover:text-workspace-darker"
                        : ""
                    }
                  >
                    <Link href={item.href} className="rounded-none">
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
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
              {workspaceLinks.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={
                      pathname === item.href
                        ? "border-b border-b-workspace-lighter text-workspace-darker hover:text-workspace-darker"
                        : ""
                    }
                  >
                    <Link href={item.href} className="rounded-none">
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
