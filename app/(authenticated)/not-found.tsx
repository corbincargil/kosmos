import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-4xl font-bold text-workspace-darker mb-4">
        404 - Page Not Found
      </h2>
      <p className="text-xl text-muted-foreground mb-8">
        This page does not exist.
      </p>
      <Button asChild>
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
