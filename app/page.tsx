"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import ClientSidebar from "../components/ClientSidebar";
import SnippetGrid from "../components/SnippetGrid";
import SignIn from "../components/SignIn";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Snippet } from "../types/snippet";
import { Menu } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      if (user) {
        const snippetsRef = collection(db, "snippets");
        const q = query(snippetsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedSnippets = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Snippet)
        );
        setSnippets(fetchedSnippets);
      }
    };

    fetchSnippets();
  }, [user]);

  const handleFilterChange = (
    languages: string[],
    tags: string[],
    favorites: boolean
  ) => {
    setSelectedLanguages(languages);
    setSelectedTags(tags);
    setShowFavorites(favorites);
  };

  if (!user) {
    return <SignIn />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ClientSidebar
        onFilterChange={handleFilterChange}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onAddSnippet={() => {}}
        snippets={snippets}
      />
      <main className="flex-1 p-4 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Snippets</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md"
          >
            <Menu size={24} />
          </button>
        </div>
        <SnippetGrid
          selectedLanguages={selectedLanguages}
          selectedTags={selectedTags}
          showFavorites={showFavorites}
        />
      </main>
    </div>
  );
}
