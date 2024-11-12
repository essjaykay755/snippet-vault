"use client";

import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center h-14 border-b px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="mr-4 md:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Your Snippets</h1>
      </div>
    );
  }

  return (
    <div className="flex items-center h-14 border-b px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="mr-4 md:hidden"
        onClick={onToggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>
      <h1 className="text-2xl font-bold">Your Snippets</h1>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
      </div>
    </div>
  );
}
