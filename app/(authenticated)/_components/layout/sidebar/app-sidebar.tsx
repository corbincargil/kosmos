import Link from "next/link";
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
import { usePathname, useSearchParams } from "next/navigation";
import SidebarSkeleton from "./loading";
import WorkspaceSelect from "./workspace-select";
import { dashboardLink, generalLinks, workspaceLinks } from "./constants";
import { GalleryHorizontalEnd } from "lucide-react";

export function AppSidebar() {
  const {
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    workspacesLoading,
  } = useWorkspace();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { setOpenMobile } = useSidebar();

  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      setOpenMobile(false);
    }
  };

  if (workspacesLoading) return <SidebarSkeleton />;

  const currentWorkspaceType =
    selectedWorkspace === "all"
      ? "DEFAULT"
      : workspaces.find((w) => w.uuid === selectedWorkspace)?.type || "DEFAULT";

  const constructUrl = (baseHref: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("workspace", selectedWorkspace);
    return `${baseHref}?${params.toString()}`;
  };

  return (
    <Sidebar className="z-100" collapsible="icon">
      <SidebarHeader>
        <WorkspaceSelect
          selectedWorkspace={selectedWorkspace}
          setSelectedWorkspace={setSelectedWorkspace}
          workspaces={workspaces}
        />
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarMenuButton
            asChild
            className={
              pathname === dashboardLink.href
                ? "border-b border-b-workspace-lighter text-workspace-darker hover:text-workspace-darker"
                : ""
            }
            onClick={handleNavigation}
          >
            <Link
              href={constructUrl(dashboardLink.href)}
              className="rounded-none"
            >
              <dashboardLink.icon size={20} />
              <span>{dashboardLink.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            General
          </SidebarGroupLabel>
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
                      href={constructUrl(item.href)}
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
        {workspaceLinks[currentWorkspaceType].length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {currentWorkspaceType}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {workspaceLinks[currentWorkspaceType].map((item) => (
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
                        href={constructUrl(item.href)}
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
        )}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={"settings"}>
                <SidebarMenuButton
                  asChild
                  className={
                    pathname === "/workspaces"
                      ? "border-b border-b-workspace-lighter text-workspace-darker hover:text-workspace-darker"
                      : ""
                  }
                  onClick={handleNavigation}
                >
                  <Link
                    href={constructUrl("/workspaces")}
                    className="rounded-none"
                  >
                    <GalleryHorizontalEnd size={20} />
                    <span>Manage Workspaces</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
