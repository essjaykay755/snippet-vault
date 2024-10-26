"use client";

import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Snippet } from "../types/snippet";
import SnippetCard from "./SnippetCard";
import { useAuth } from "../contexts/AuthContext";

interface SnippetGridProps {
  selectedLanguages: string[];
  selectedTags: string[];
}

const SnippetGrid: React.FC<SnippetGridProps> = ({
  selectedLanguages,
  selectedTags,
}) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSnippets = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const snippetsRef = collection(db, "snippets");
      let q = query(snippetsRef, where("userId", "==", user.uid));

      if (selectedLanguages.length > 0) {
        q = query(q, where("language", "in", selectedLanguages));
      }

      const querySnapshot = await getDocs(q);
      let fetchedSnippets = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Snippet)
      );

      if (selectedTags.length > 0) {
        fetchedSnippets = fetchedSnippets.filter((snippet) =>
          snippet.tags.some((tag) => selectedTags.includes(tag))
        );
      }

      setSnippets(fetchedSnippets);
    } catch (err) {
      console.error("Error fetching snippets:", err);
      setError("Failed to load snippets. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user, selectedLanguages, selectedTags]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const handleUpdate = () => {
    fetchSnippets();
  };

  const handleDelete = () => {
    fetchSnippets();
  };

  if (loading) {
    return <div className="text-center py-8">Loading snippets...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (snippets.length === 0) {
    return (
      <div className="text-center py-8">
        No snippets found. Try adding some!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default SnippetGrid;
