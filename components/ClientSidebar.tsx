"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Plus,
  Star,
  ChevronDown,
  Info,
  Shield,
  FileText,
  X,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { Snippet } from "../types/snippet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ClientSidebarProps {
  onFilterChange: (
    languages: string[],
    tags: string[],
    showFavorites: boolean
  ) => void;
  isOpen: boolean;
  onToggle: () => void;
  onAddSnippet: () => void;
  snippets: Snippet[];
}

const languageColors: { [key: string]: string } = {
  javascript: "bg-yellow-200 dark:bg-yellow-900",
  python: "bg-blue-200 dark:bg-blue-900",
  css: "bg-pink-200 dark:bg-pink-900",
  html: "bg-orange-200 dark:bg-orange-900",
  typescript: "bg-blue-300 dark:bg-blue-800",
} as const;

const ClientSidebar: React.FC<ClientSidebarProps> = ({
  onFilterChange,
  isOpen,
  onToggle,
  onAddSnippet,
  snippets,
}) => {
  const [languages, setLanguages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const uniqueLanguages = Array.from(
      new Set(snippets.map((snippet) => snippet.language))
    );
    const uniqueTags = Array.from(
      new Set(snippets.flatMap((snippet) => snippet.tags || []))
    ).filter((tag) => tag.trim() !== "");

    setLanguages(uniqueLanguages);
    setTags(uniqueTags);
  }, [snippets]);

  const handleLanguageChange = (language: string) => {
    const updatedLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter((l) => l !== language)
      : [...selectedLanguages, language];
    setSelectedLanguages(updatedLanguages);
    onFilterChange(updatedLanguages, selectedTags, showFavorites);
  };

  const handleTagChange = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    onFilterChange(selectedLanguages, updatedTags, showFavorites);
  };

  const handleFavoritesChange = () => {
    const newShowFavorites = !showFavorites;
    setShowFavorites(newShowFavorites);
    onFilterChange(selectedLanguages, selectedTags, newShowFavorites);
  };

  const clearLanguages = () => {
    setSelectedLanguages([]);
    onFilterChange([], selectedTags, showFavorites);
  };

  const clearTags = () => {
    setSelectedTags([]);
    onFilterChange(selectedLanguages, [], showFavorites);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Sidebar 
      className={cn(
        "fixed md:static top-0 left-0 h-full z-40 bg-background transition-all duration-300 border-r",
        isOpen ? "w-[240px] translate-x-0" : "w-[240px] -translate-x-full md:translate-x-0"
      )}
    >
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between py-2 px-4">
          <h1 className="text-xl font-semibold leading-none">SnippetVault</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 md:hidden absolute right-2 top-3"
          >
            <X size={16} />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col flex-grow">
        <div className="px-4 py-2">
          <Button onClick={onAddSnippet} className="w-full" size="sm">
            <Plus size={16} className="mr-2" />
            Add New Snippet
          </Button>
        </div>

        <div className="space-y-4">
          <div className="px-4">
            <h2 className="mb-2 text-sm font-semibold">Filters</h2>
            <Button
              variant="ghost"
              onClick={handleFavoritesChange}
              className={cn(
                "w-full justify-start",
                showFavorites && "bg-accent"
              )}
            >
              <Star size={16} className="mr-2" />
              Favorites
            </Button>
          </div>

          <div className="px-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">Languages</h2>
              {selectedLanguages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearLanguages}
                  className="h-6 px-2"
                >
                  <RefreshCw size={12} className="mr-1" />
                  Clear
                </Button>
              )}
            </div>
            <div className="space-y-1">
              {languages.map((language) => (
                <Button
                  key={language}
                  variant="ghost"
                  onClick={() => handleLanguageChange(language)}
                  className={cn(
                    "w-full justify-start",
                    selectedLanguages.includes(language) && "bg-accent"
                  )}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      languageColors[language] || "bg-gray-400"
                    }`}
                  />
                  {language}
                </Button>
              ))}
            </div>
          </div>

          {tags.length > 0 && (
            <div className="px-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold">Tags</h2>
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearTags}
                    className="h-6 px-2"
                  >
                    <RefreshCw size={12} className="mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <div className="space-y-1">
                {tags.map((tag) => (
                  <Button
                    key={tag}
                    variant="ghost"
                    onClick={() => handleTagChange(tag)}
                    className={cn(
                      "w-full justify-start",
                      selectedTags.includes(tag) && "bg-accent"
                    )}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex h-[52px] items-center justify-between w-full p-4 cursor-pointer hover:bg-accent">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.displayName || user?.email?.split('@')[0] || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[240px]">
            <DropdownMenuItem asChild>
              <Link
                href="/about"
                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
              >
                <Info size={16} />
                <span>About</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/privacy"
                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
              >
                <Shield size={16} />
                <span>Privacy</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/terms"
                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
              >
                <FileText size={16} />
                <span>Terms</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-3 py-2 text-xs text-center text-muted-foreground">
              Made with ❤️ and ☕️ by{" "}
              <Link
                href="https://github.com/essjaykay755"
                className="hover:underline"
              >
                Subhojit Karmakar
              </Link>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ClientSidebar;
