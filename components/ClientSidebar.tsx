"use client";

import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Snippet } from "../types/snippet";
import { X } from "lucide-react";

interface ClientSidebarProps {
  onFilterChange: (languages: string[], tags: string[]) => void;
}

const languageColors: { [key: string]: string } = {
  javascript: "bg-yellow-400",
  python: "bg-blue-500",
  css: "bg-pink-500",
  html: "bg-orange-500",
  typescript: "bg-blue-600",
};

const ClientSidebar: React.FC<ClientSidebarProps> = ({ onFilterChange }) => {
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
    <div className="w-64 bg-white p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Languages</h3>
        {languages.map((language) => (
          <div key={language} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`language-${language}`}
              checked={selectedLanguages.includes(language)}
              onChange={() => handleLanguageChange(language)}
              className="mr-2"
            />
            <label
              htmlFor={`language-${language}`}
              className="flex items-center"
            >
              <span
                className={`w-3 h-3 rounded-full mr-2 ${
                  languageColors[language] || "bg-gray-400"
                }`}
              ></span>
              {language}
            </label>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Tags</h3>
        {tags.map((tag) => (
          <div key={tag} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`tag-${tag}`}
              checked={selectedTags.includes(tag)}
              onChange={() => handleTagChange(tag)}
              className="mr-2"
            />
            <label htmlFor={`tag-${tag}`}>{tag}</label>
          </div>
        ))}
      </div>
      {(selectedLanguages.length > 0 || selectedTags.length > 0) && (
        <button
          onClick={clearFilters}
          className="flex items-center justify-center w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          <X size={16} className="mr-2" />
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default ClientSidebar;
