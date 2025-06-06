import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sun, Moon, Monitor } from "lucide-react";
import { Theme, useTheme } from "./theme-manager";
import { ThemeIcon } from "./theme-icons";

export default function ThemeSelect() {
  const { theme, setTheme, isLoaded } = useTheme();

  if (!isLoaded) {
    return (
      <div className="w-[40px] h-[40px] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-workspace border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Select value={theme} onValueChange={(value: Theme) => setTheme(value)}>
      <SelectTrigger
        className="w-[58px] h-[32px] p-0 px-2 text-workspace hover:text-workspace-darker hover:bg-gray-100 dark:text-workspace-lighter dark:hover:text-workspace-lighter2 dark:hover:bg-gray-700"
      >
        <SelectValue>
          <ThemeIcon theme={theme} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </div>
        </SelectItem>
        <SelectItem value="auto">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}