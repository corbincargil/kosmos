import { Sun, Moon } from "lucide-react";
import { Theme } from "./theme-manager";
import { useTheme } from "./theme-manager";

interface ThemeIconProps {
  theme: Theme;
  size?: number;
  className?: string;
}

export function ThemeIcon({ theme, size = 20, className }: ThemeIconProps) {
  const { systemTheme } = useTheme();

  switch (theme) {
    case "light":
      return <Sun size={size} className={className} />;
    case "dark":
      return <Moon size={size} className={className} />;
    case "auto":
      return systemTheme === "dark" ? (
        <Moon size={size} className={className} />
      ) : (
        <Sun size={size} className={className} />
      );
    default:
      return <Sun size={size} className={className} />;
  }
} 