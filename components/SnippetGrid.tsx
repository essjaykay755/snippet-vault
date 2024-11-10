"use client";

import React from "react";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Snippet } from "../types/snippet";
import SnippetCard from "./SnippetCard";
import AddSnippetCard from "./AddSnippetCard";
import AddSnippetForm from "./AddSnippetForm";

interface SnippetGridProps {
  snippets: Snippet[];
  onSnippetsChange: () => Promise<void>;
  isAddSnippetModalOpen: boolean;
  setIsAddSnippetModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SnippetGrid: React.FC<SnippetGridProps> = ({
  snippets,
  onSnippetsChange,
  isAddSnippetModalOpen,
  setIsAddSnippetModalOpen,
}) => {
  const handleUpdate = () => {
    onSnippetsChange();
  };

  const handleDelete = async (snippetId: string) => {
    try {
      await deleteDoc(doc(db, "snippets", snippetId));
      onSnippetsChange();
    } catch (error) {
      console.error("Error deleting snippet:", error);
    }
  };

  const handleToggleFavorite = async (snippetId: string, favorite: boolean) => {
    try {
      const snippetRef = doc(db, "snippets", snippetId);
      await updateDoc(snippetRef, { favorite });
      onSnippetsChange();
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AddSnippetCard onClick={() => setIsAddSnippetModalOpen(true)} />
        {snippets.map((snippet) => (
          <SnippetCard
            key={snippet.id}
            snippet={snippet}
            onUpdate={handleUpdate}
            onDelete={() => handleDelete(snippet.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
      {isAddSnippetModalOpen && (
        <AddSnippetForm
          onSave={() => {
            setIsAddSnippetModalOpen(false);
            onSnippetsChange();
          }}
          onClose={() => setIsAddSnippetModalOpen(false)}
        />
      )}
    </>
  );
};

export default SnippetGrid;
