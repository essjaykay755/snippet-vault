"use client";

import React, { useState } from "react";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Snippet } from "../types/snippet";
import SnippetCard from "./SnippetCard";
import AddSnippetCard from "./AddSnippetCard";
import AddSnippetForm from "./AddSnippetForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Menu } from "lucide-react";

interface SnippetGridProps {
  snippets: Snippet[];
  onSnippetsChange: () => Promise<void>;
  isAddSnippetModalOpen: boolean;
  setIsAddSnippetModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onToggleSidebar: () => void;
}

const SnippetGrid: React.FC<SnippetGridProps> = ({
  snippets,
  onSnippetsChange,
  isAddSnippetModalOpen,
  setIsAddSnippetModalOpen,
  onToggleSidebar,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredSnippets = snippets.filter((snippet) =>
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
          <Button
            variant="ghost"
            className="mr-2 sm:hidden"
            onClick={onToggleSidebar}
          >
            <Menu size={24} />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Your Snippets
          </h1>
        </div>
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search snippets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 text-gray-900 dark:text-gray-100"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={clearSearch}
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>
      {searchTerm && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Search results for "{searchTerm}"
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AddSnippetCard onClick={() => setIsAddSnippetModalOpen(true)} />
        {filteredSnippets.map((snippet) => (
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
    </div>
  );
};

export default SnippetGrid;
