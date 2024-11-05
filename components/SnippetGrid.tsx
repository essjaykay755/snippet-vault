"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Snippet } from "../types/snippet";
import SnippetCard from "./SnippetCard";
import AddSnippetCard from "./AddSnippetCard";
import { useAuth } from "../contexts/AuthContext";
import AddSnippetForm from "./AddSnippetForm";

interface SnippetGridProps {
  selectedLanguages: string[];
  selectedTags: string[];
  showFavorites: boolean;
}

const SnippetGrid: React.FC<SnippetGridProps> = ({
  selectedLanguages,
  selectedTags,
  showFavorites,
}) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddSnippetModalOpen, setIsAddSnippetModalOpen] = useState(false);
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

      if (showFavorites) {
        fetchedSnippets = fetchedSnippets.filter((snippet) => snippet.favorite);
      }

      setSnippets(fetchedSnippets);
    } catch (err) {
      console.error("Error fetching snippets:", err);
      setError("Failed to load snippets. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user, selectedLanguages, selectedTags, showFavorites]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const handleUpdate = () => {
    fetchSnippets();
  };

  const handleDelete = () => {
    fetchSnippets();
  };

  const handleToggleFavorite = async (snippetId: string, favorite: boolean) => {
    try {
      const snippetRef = doc(db, "snippets", snippetId);
      await updateDoc(snippetRef, { favorite });
      setSnippets((prevSnippets) =>
        prevSnippets.map((snippet) =>
          snippet.id === snippetId ? { ...snippet, favorite } : snippet
        )
      );
      if (showFavorites) {
        fetchSnippets();
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading snippets...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AddSnippetCard onClick={() => setIsAddSnippetModalOpen(true)} />
        {snippets.map((snippet) => (
          <SnippetCard
            key={snippet.id}
            snippet={snippet}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
      {isAddSnippetModalOpen && (
        <AddSnippetForm
          onSave={() => {
            setIsAddSnippetModalOpen(false);
            fetchSnippets();
          }}
          onClose={() => setIsAddSnippetModalOpen(false)}
        />
      )}
    </>
  );
};

export default SnippetGrid;
