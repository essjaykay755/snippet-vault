"use client";

import React, { useState, useEffect } from "react";
import ClientSidebar from "../components/ClientSidebar";
import SnippetGrid from "../components/SnippetGrid";
import AddSnippetForm from "../components/AddSnippetForm";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Snippet } from "../types/snippet";

export default function Home() {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddSnippetModalOpen, setIsAddSnippetModalOpen] = useState(false);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const snippetsRef = collection(db, "snippets");
    const q = query(snippetsRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedSnippets = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Snippet)
      );
      setSnippets(fetchedSnippets);
    });

    return () => unsubscribe();
  }, [user]);

  const handleFilterChange = (languages: string[], tags: string[]) => {
    setSelectedLanguages(languages);
    setSelectedTags(tags);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ClientSidebar
        onFilterChange={handleFilterChange}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        onAddSnippet={() => setIsAddSnippetModalOpen(true)}
        snippets={snippets}
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Snippets</h1>
        </div>
        <SnippetGrid
          selectedLanguages={selectedLanguages}
          selectedTags={selectedTags}
        />
      </main>
      {isAddSnippetModalOpen && (
        <AddSnippetForm
          onSave={() => setIsAddSnippetModalOpen(false)}
          onClose={() => setIsAddSnippetModalOpen(false)}
        />
      )}
    </div>
  );
}
