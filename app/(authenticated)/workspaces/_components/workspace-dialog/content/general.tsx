import WorkspaceForm from "../../workspace-form";
import { Workspace } from "@/types/workspace";

export function GeneralContent({workspace}: {workspace: Workspace}) {
  const { id, name, color, type, icon } = workspace;
    return (
        <WorkspaceForm
          workspaceId={id}
          initialName={name}
          initialColor={color}
          initialType={type}
          initialIcon={icon}
          closeModal={() => {}}
        />
    );
  }