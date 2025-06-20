import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { GeneralContent } from "./content/general";
import { TagsContent } from "./content/tags/tags";
import { TaskTypesContent } from "./content/task-types";
import { SidebarNav, Section, TabsNav } from "./navigation";
import { Workspace } from "@/types/workspace";
import { Settings } from "lucide-react";

export default function WorkspaceDialog({ workspace }: { workspace: Workspace }) {
  const [activeSection, setActiveSection] = useState<Section>("general");
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return <GeneralContent workspace={workspace} />;
      case "tags":
        return <TagsContent workspaceId={workspace.id} workspaceUuid={workspace.uuid} />;
      case "task-types":
        return <TaskTypesContent  workspaceId={workspace.id} workspaceUuid={workspace.uuid} />;
      default:
        return <GeneralContent workspace={workspace} />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[85vh] p-0 gap-0">
        <div className="flex h-full">
          {isMobile ? (
            <div className="flex flex-col w-full">
              <TabsNav 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
              />
              <div className="flex-1 overflow-y-auto p-6">
                {renderContent()}
              </div>
            </div>
          ) : (
            <>
              <SidebarNav 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
              />
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="h-12 flex items-center justify-between">
                  <h1 className="text-2xl font-bold">{workspace.name}</h1>
                </div>
                {renderContent()}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}