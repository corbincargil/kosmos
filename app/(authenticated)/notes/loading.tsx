import { CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ControlsLoading from "./_components/loading/controls-loading";
import GridLoading from "./_components/loading/grid-loading";

export default function NotesLoading() {
  return (
    <>
      <CardHeader className="p-2">
        <div className="flex justify-between items-center">
          <CardTitle>Notes</CardTitle>
          <Skeleton className="h-9 w-[100px]" /> 
        </div>
      </CardHeader>

      <div className="p-4">
        <ControlsLoading />
        <GridLoading />
      </div>
    </>
  );
}