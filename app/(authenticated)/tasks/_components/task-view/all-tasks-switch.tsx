import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter, useSearchParams } from "next/navigation";

export default function AllTasksSwitch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showAll = searchParams.get("show-all") === "true";

  const handleToggle = (value: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("show-all", value.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <Label className="text-sm font-medium">All Tasks:</Label>
      <Switch
        checked={showAll}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-workspace"
      >
        <Button variant="default" className={!showAll ? "bg-background" : ""}>
          Primary
        </Button>
        <Button variant="ghost" className={showAll ? "bg-background" : ""}>
          All
        </Button>
      </Switch>
    </>
  );
}
