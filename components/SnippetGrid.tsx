"use client";

import React, { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Snippet } from "../types/snippet";
import SnippetCard from "./SnippetCard";
import AddSnippetCard from "./AddSnippetCard";
import AddSnippetForm from "./AddSnippetForm";

interface SnippetGridProps {
  snippets: Snippet[];
}

const SnippetGrid: React.FC<SnippetGridProps> = ({ snippets }) => {
  const [isAddSnippetModalOpen, setIsAddSnippetModalOpen] = useState(false);

  const handleUpdate = () => {
    // Implement update logic if needed
  };

  const handleDelete = () => {
    // Implement delete logic if needed
  };

  const handleToggleFavorite = async (snippetId: string, favorite: boolean) => {
    try {
      const snippetRef = doc(db, "snippets", snippetId);
      await updateDoc(snippetRef, { favorite });
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
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
      {isAddSnippetModalOpen && (
        <AddSnippetForm
          onSave={() => {
            setIsAddSnippetModalOpen(false);
            // Implement logic to refresh snippets if needed
          }}
          onClose={() => setIsAddSnippetModalOpen(false)}
        />
      )}
    </>
  );
};

export default SnippetGrid;
