"use client";

import React, { useState, useEffect, useCallback } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Snippet } from "../types/snippet";
import {
  RefreshCw,
  Menu,
  X,
  LogOut,
  Plus,
  Info,
  Shield,
  FileText,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

interface ClientSidebarProps {
  onFilterChange: (languages: string[], tags: string[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  onAddSnippet: () => void;
}

const languageColors: { [key: string]: string } = {
  javascript: "bg-yellow-100 dark:bg-yellow-900",
  python: "bg-blue-100 dark:bg-blue-900",
  css: "bg-pink-100 dark:bg-pink-900",
  html: "bg-orange-100 dark:bg-orange-900",
  typescript: "bg-blue-200 dark:bg-blue-800",
};

const ClientSidebar: React.FC<ClientSidebarProps> = ({
  onFilterChange,
  isOpen,
  onToggle,
  onAddSnippet,
}) => {
  const [languages, setLanguages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(systemPrefersDark);

      if (systemPrefersDark) {
        document.documentElement.classList.add("dark");
      }

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    if (!user) return;

    const snippetsRef = collection(db, "snippets");
    const q = query(snippetsRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const snippets: Snippet[] = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Snippet)
      );

      const uniqueLanguages = Array.from(
        new Set(snippets.map((snippet) => snippet.language))
      );
      const uniqueTags = Array.from(
        new Set(snippets.flatMap((snippet) => snippet.tags || []))
      ).filter((tag) => tag.trim() !== "");

      setLanguages(uniqueLanguages);
      setTags(uniqueTags);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLanguageChange = (language: string) => {
    const updatedLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter((l) => l !== language)
      : [...selectedLanguages, language];
    setSelectedLanguages(updatedLanguages);
    onFilterChange(updatedLanguages, selectedTags);
  };

  const handleTagChange = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    onFilterChange(selectedLanguages, updatedTags);
  };

  const clearFilters = () => {
    setSelectedLanguages([]);
    setSelectedTags([]);
    onFilterChange([], []);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-40 bg-white dark:bg-gray-800 dark:text-white w-64 p-4 border-r dark:border-gray-700 overflow-y-auto flex flex-col`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">SnippetVault</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
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
                onClick={clearFilters}
                className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
              >
                <RefreshCw size={14} className="mr-1" />
                Clear
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
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
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
                  onClick={clearFilters}
                  className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
                >
                  <RefreshCw size={14} className="mr-1" />
                  Clear
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
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-auto">
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center mb-4"
          >
            <LogOut size={18} className="mr-2" />
            Sign Out
          </button>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-4">
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
    </>
  );
};

export default ClientSidebar;
