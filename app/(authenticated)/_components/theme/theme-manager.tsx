"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Theme = "light" | "dark" | "auto";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  const getSystemTheme = (): "light" | "dark" => {
    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch (error) {
      console.error("Error detecting system theme:", error);
      return "light";
    }
  };

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") as Theme;
      const currentSystemTheme = getSystemTheme();
      setSystemTheme(currentSystemTheme);

      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme("auto");
      }
    } catch (error) {
      console.error("Error initializing theme:", error);
      setTheme("light");
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        setSystemTheme(e.matches ? "dark" : "light");
      } catch (error) {
        console.error("Error handling system theme change:", error);
      }
    };

    try {
      mediaQuery.addEventListener("change", handleChange);
    } catch (error) {
      console.error("Error setting up theme listener:", error);
    }

    return () => {
      try {
        mediaQuery.removeEventListener("change", handleChange);
      } catch (error) {
        console.error("Error cleaning up theme listener:", error);
      }
    };
  }, []);

  // Update theme in localStorage and apply to document
  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.error("Error saving theme to localStorage:", error);
    }

    const effectiveTheme = theme === "auto" ? systemTheme : theme;
    
    if (effectiveTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, systemTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
