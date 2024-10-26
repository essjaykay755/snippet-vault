"use client";

import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Snippet } from "../types/snippet";
import { RefreshCw, Menu, X } from "lucide-react";
import Link from "next/link";

interface ClientSidebarProps {
  onFilterChange: (languages: string[], tags: string[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const languageColors: { [key: string]: string } = {
  javascript: "bg-yellow-400",
  python: "bg-blue-500",
  css: "bg-pink-500",
  html: "bg-orange-500",
  typescript: "bg-blue-600",
};

const ClientSidebar: React.FC<ClientSidebarProps> = ({
  onFilterChange,
  isOpen,
  onToggle,
}) => {
  const [languages, setLanguages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fetchLanguagesAndTags = useCallback(async () => {
    const snippetsRef = collection(db, "snippets");
    const snippetDocs = await getDocs(snippetsRef);
    const snippets: Snippet[] = snippetDocs.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Snippet)
    );

    const uniqueLanguages = Array.from(
      new Set(snippets.map((snippet) => snippet.language))
    );
    const uniqueTags = Array.from(
      new Set(snippets.flatMap((snippet) => snippet.tags))
    );

    setLanguages(uniqueLanguages);
    setTags(uniqueTags);
  }, []);

  useEffect(() => {
    fetchLanguagesAndTags();
  }, [fetchLanguagesAndTags]);

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

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-full shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-40 bg-white w-64 p-4 border-r overflow-y-auto`}
      >
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium">Languages</h3>
            {selectedLanguages.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
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
                    ? "bg-gray-200 text-gray-800"
                    : "hover:bg-gray-100"
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full mr-2 ${
                    languageColors[language] || "bg-gray-400"
                  }`}
                ></span>
                {language}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium">Tags</h3>
            {selectedTags.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
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
                    ? "bg-gray-200 text-gray-800"
                    : "hover:bg-gray-100"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-4 text-center text-sm text-gray-500 border-t">
          Made with ❤️ and ☕️ by{" "}
          <Link
            href="https://github.com/essjaykay755"
            className="text-blue-500 hover:underline"
          >
            Subhojit Karmakar
          </Link>
        </div>
      </div>
    </>
  );
};

export default ClientSidebar;
