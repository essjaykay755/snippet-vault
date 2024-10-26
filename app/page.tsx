"use client";

import React, { useState } from "react";
import ClientSidebar from "../components/ClientSidebar";
import SnippetGrid from "../components/SnippetGrid";
import AddSnippetButton from "../components/AddSnippetButton";
import AddSnippetForm from "../components/AddSnippetForm";

export default function Home() {
  const [isAddSnippetModalOpen, setIsAddSnippetModalOpen] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleFilterChange = (languages: string[], tags: string[]) => {
    setSelectedLanguages(languages);
    setSelectedTags(tags);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ClientSidebar
        onFilterChange={handleFilterChange}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Your Snippets</h1>
          <AddSnippetButton onClick={() => setIsAddSnippetModalOpen(true)} />
        </div>
        <SnippetGrid
          selectedLanguages={selectedLanguages}
          selectedTags={selectedTags}
        />
        {isAddSnippetModalOpen && (
          <AddSnippetForm
            onSave={() => setIsAddSnippetModalOpen(false)}
            onClose={() => setIsAddSnippetModalOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
