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
import { Search, X } from "lucide-react";
import { toast } from "sonner";

interface SnippetGridProps {
  snippets: Snippet[];
  onSnippetsChange: () => Promise<void>;
  isAddSnippetModalOpen: boolean;
  setIsAddSnippetModalOpen: (isOpen: boolean) => void;
}

export default function SnippetGrid({
  snippets,
  onSnippetsChange,
  isAddSnippetModalOpen,
  setIsAddSnippetModalOpen,
}: SnippetGridProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleUpdate = async () => {
    await onSnippetsChange();
    toast.success("Snippet updated successfully");
  };

  const handleDelete = async (snippetId: string) => {
    try {
      await deleteDoc(doc(db, "snippets", snippetId));
      await onSnippetsChange();
      toast.success("Snippet deleted successfully");
    } catch (error) {
      console.error("Error deleting snippet:", error);
      toast.error("Failed to delete snippet");
    }
  };

  const handleToggleFavorite = async (snippetId: string, favorite: boolean) => {
    try {
      const snippetRef = doc(db, "snippets", snippetId);
      await updateDoc(snippetRef, { favorite });
      await onSnippetsChange();
      toast.success(favorite ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Failed to update favorite status");
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
      <div className="flex justify-end w-full">
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search snippets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={clearSearch}
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>

      {searchTerm && (
        <p className="text-sm text-muted-foreground">
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
          onSave={async () => {
            setIsAddSnippetModalOpen(false);
            await onSnippetsChange();
            toast.success("New snippet added successfully");
          }}
          onClose={() => setIsAddSnippetModalOpen(false)}
        />
      )}
    </div>
  );
}
