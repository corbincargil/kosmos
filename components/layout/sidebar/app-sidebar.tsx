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
  useSidebar,
} from "@/components/ui/sidebar";
import { useWorkspace } from "@/contexts/workspace-context";
import {
  LucideIcon,
  Croissant,
  Home,
  List,
  FileText,
  Settings,
  Coffee,
  Pizza,
  Cookie,
  Cake,
  Cross,
  Users,
  BicepsFlexed,
  BriefcaseBusiness,
  Anchor,
  House,
  Binary,
  DollarSign,
} from "lucide-react";
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

const ICON_MAP: Record<string, LucideIcon> = {
  Croissant,
  Coffee,
  Pizza,
  Cookie,
  Cake,
  Cross,
  Users,
  BicepsFlexed,
  BriefcaseBusiness,
  Anchor,
  House,
  Binary,
  DollarSign,
};

export function AppSidebar() {
  const [mounted, setMounted] = useState(false);

  const { workspaces, selectedWorkspace, setSelectedWorkspace } =
    useWorkspace();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      setOpenMobile(false);
    }
  };

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
              onClick={handleNavigation}
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
                      onClick={handleNavigation}
                    >
                      <Link
                        href={`${item.href}?workspace=${selectedWorkspace}`}
                        className="rounded-none"
                      >
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
                      onClick={handleNavigation}
                    >
                      <Link
                        href={`${item.href}?workspace=${selectedWorkspace}`}
                        className="rounded-none"
                      >
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
          <SelectTrigger className="flex items-center w-full font-bold text-workspace-darker focus:ring-1 focus:border-none focus:ring-workspace-lighter px-0">
            {selectedWorkspace === "all" ? (
              <Croissant
                size={28}
                className="text-workspace-darker shrink-0 mr-2"
                data-sidebar-component="icon"
              />
            ) : (
              (() => {
                const workspace = workspaces.find(
                  (w) => w.id.toString() === selectedWorkspace
                );
                const IconComponent = workspace?.icon
                  ? ICON_MAP[workspace.icon]
                  : Croissant;
                return (
                  <IconComponent
                    size={28}
                    className="text-workspace-darker shrink-0 mr-2"
                    data-sidebar-component="icon"
                    style={{ color: workspace?.color }}
                  />
                );
              })()
            )}
            <SelectValue className="pl-4">
              <span
                className="text-lg md:text-2xl whitespace-nowrap"
                data-sidebar-component="content"
              >
                {selectedWorkspace === "all"
                  ? "All"
                  : workspaces.find(
                      (workspace) =>
                        workspace.id.toString() === selectedWorkspace
                    )?.name}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center">
                <Croissant
                  size={20}
                  className="text-black dark:text-white mr-2"
                />
                All
              </div>
            </SelectItem>
            {workspaces.map((workspace) => {
              const IconComponent = workspace.icon
                ? ICON_MAP[workspace.icon]
                : Croissant;
              return (
                <SelectItem
                  key={workspace.id}
                  value={workspace.id.toString()}
                  className="text-workspace-darker"
                  style={{ color: workspace.color }}
                >
                  <div className="flex items-center">
                    <IconComponent
                      size={20}
                      className="mr-2"
                      style={{ color: workspace.color }}
                    />
                    {workspace.name}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuButton
            asChild
            className={
              pathname.includes(dashboardLink.href)
                ? "border-b border-b-workspace-lighter text-workspace-darker hover:text-workspace-darker"
                : ""
            }
            onClick={handleNavigation}
          >
            <Link
              href={`${dashboardLink.href}?workspace=${selectedWorkspace}`}
              className="rounded-none"
            >
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
                      pathname.includes(item.href)
                        ? "border-b border-b-workspace-lighter text-workspace-darker hover:text-workspace-darker"
                        : ""
                    }
                    onClick={handleNavigation}
                  >
                    <Link
                      href={`${item.href}?workspace=${selectedWorkspace}`}
                      className="rounded-none"
                    >
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
                      pathname.includes(item.href)
                        ? "border-b border-b-workspace-lighter text-workspace-darker hover:text-workspace-darker"
                        : ""
                    }
                    onClick={handleNavigation}
                  >
                    <Link
                      href={`${item.href}?workspace=${selectedWorkspace}`}
                      className="rounded-none"
                    >
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
