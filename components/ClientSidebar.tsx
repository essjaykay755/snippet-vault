"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  LogOut,
  Plus,
  Info,
  Shield,
  FileText,
  Sun,
  Moon,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { Snippet } from "../types/snippet";

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
  onSnippetsChange: () => Promise<void>;
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
  onSnippetsChange,
}) => {
  const [languages, setLanguages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { signOut } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    }
  }, []);

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

  const toggleDarkMode = async () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    await onSnippetsChange();
  };

  const handleLanguageChange = async (language: string) => {
    const updatedLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter((l) => l !== language)
      : [...selectedLanguages, language];
    setSelectedLanguages(updatedLanguages);
    onFilterChange(updatedLanguages, selectedTags, showFavorites);
    await onSnippetsChange();
  };

  const handleTagChange = async (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    onFilterChange(selectedLanguages, updatedTags, showFavorites);
    await onSnippetsChange();
  };

  const handleFavoritesChange = async () => {
    const newShowFavorites = !showFavorites;
    setShowFavorites(newShowFavorites);
    onFilterChange(selectedLanguages, selectedTags, newShowFavorites);
    await onSnippetsChange();
  };

  const clearLanguages = async () => {
    setSelectedLanguages([]);
    onFilterChange([], selectedTags, showFavorites);
    await onSnippetsChange();
  };

  const clearTags = async () => {
    setSelectedTags([]);
    onFilterChange(selectedLanguages, [], showFavorites);
    await onSnippetsChange();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 transition duration-200 ease-in-out z-40 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-72 p-4 border-r dark:border-gray-800 overflow-y-auto flex flex-col`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SnippetVault</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={onToggle}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <button
        onClick={onAddSnippet}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
      >
        <Plus size={20} className="mr-2" />
        Add New Snippet
      </button>
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <div className="mb-6 flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium">Languages</h3>
          {selectedLanguages.length > 0 && (
            <button
              onClick={clearLanguages}
              className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
            >
              <RefreshCw size={14} className="mr-1" />
              Clear Languages
            </button>
          )}
        </div>
        <div className="space-y-2">
          {languages.map((language) => (
            <button
              key={language}
              onClick={() => handleLanguageChange(language)}
              className={`flex items-center w-full px-2 py-1 rounded-md transition-colors text-left ${
                selectedLanguages.includes(language)
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full mr-2 ${
                  languageColors[language] || "bg-gray-400 dark:bg-gray-600"
                }`}
              ></span>
              {language}
            </button>
          ))}
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mb-6 flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium">Tags</h3>
            {selectedTags.length > 0 && (
              <button
                onClick={clearTags}
                className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
              >
                <RefreshCw size={14} className="mr-1" />
                Clear Tags
              </button>
            )}
          </div>
          <div className="space-y-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`w-full px-2 py-1 rounded-md transition-colors text-left ${
                  selectedTags.includes(tag)
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={handleFavoritesChange}
          className={`flex items-center w-full px-2 py-1 rounded-md transition-colors text-left ${
            showFavorites
              ? "bg-gray-200 dark:bg-gray-700"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <Star
            size={16}
            className={`mr-2 ${
              showFavorites ? "text-yellow-500 fill-current" : "text-gray-400"
            }`}
          />
          Favorites
        </button>
      </div>

      <div className="mt-auto">
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center mb-4"
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </button>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-800 pt-4">
          <div className="flex justify-center space-x-4 mb-2">
            <Link
              href="/about"
              className="text-blue-500 dark:text-blue-400 hover:underline flex items-center"
            >
              <Info size={14} className="mr-1" />
              About
            </Link>
            <Link
              href="/privacy"
              className="text-blue-500 dark:text-blue-400 hover:underline flex items-center"
            >
              <Shield size={14} className="mr-1" />
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-blue-500 dark:text-blue-400 hover:underline flex items-center"
            >
              <FileText size={14} className="mr-1" />
              Terms
            </Link>
          </div>
          <div>
            Made with ❤️ and ☕️ by{" "}
            <Link
              href="https://github.com/essjaykay755"
              className="text-blue-500 dark:text-blue-400 hover:underline"
            >
              Subhojit Karmakar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSidebar;
