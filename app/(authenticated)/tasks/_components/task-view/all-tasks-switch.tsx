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
      <Switch checked={showAll} onCheckedChange={handleToggle}>
        <Button variant="ghost" className={!showAll ? "bg-secondary" : ""}>
          Primary
        </Button>
        <Button variant="ghost" className={showAll ? "bg-secondary" : ""}>
          All
        </Button>
      </Switch>
    </>
  );
}
