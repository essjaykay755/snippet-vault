"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import SnippetGrid from "../components/SnippetGrid";
import ClientSidebar from "../components/ClientSidebar";
import { Snippet } from "../types/snippet";

export default function Home() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [isAddSnippetModalOpen, setIsAddSnippetModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const fetchSnippets = useCallback(async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "snippets"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const snippetsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Snippet[];
      setSnippets(snippetsData);
      setFilteredSnippets(snippetsData);
    } catch (error) {
      console.error("Error fetching snippets:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const handleFilterChange = (
    languages: string[],
    tags: string[],
    showFavorites: boolean
  ) => {
    let filtered = [...snippets];

    if (languages.length > 0) {
      filtered = filtered.filter((snippet) =>
        languages.includes(snippet.language)
      );
    }

    if (tags.length > 0) {
      filtered = filtered.filter((snippet) =>
        tags.every((tag) => snippet.tags?.includes(tag))
      );
    }

    if (showFavorites) {
      filtered = filtered.filter((snippet) => snippet.favorite);
    }

    setFilteredSnippets(filtered);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Please sign in to view your snippets
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <ClientSidebar
        onFilterChange={handleFilterChange}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onAddSnippet={() => setIsAddSnippetModalOpen(true)}
        snippets={snippets}
        onSnippetsChange={fetchSnippets}
      />
      <main className="flex-1 p-8">
        <SnippetGrid
          snippets={filteredSnippets}
          onSnippetsChange={fetchSnippets}
          isAddSnippetModalOpen={isAddSnippetModalOpen}
          setIsAddSnippetModalOpen={setIsAddSnippetModalOpen}
        />
      </main>
    </div>
  );
}
