import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export const TaskViewToggle: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewMode = searchParams.get("view") || "board";

  const setBoardView = () => {
    const params = new URLSearchParams(searchParams);
    params.set("view", "board");
    router.push(`?${params.toString()}`);
  };

  const setListView = () => {
    const params = new URLSearchParams(searchParams);
    params.set("view", "list");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-input p-1 rounded-md flex justify-end">
      <div className="flex gap-2">
        <Button
          variant={viewMode === "board" ? "default" : "outline"}
          size="sm"
          onClick={setBoardView}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={setListView}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
