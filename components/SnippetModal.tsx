"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Highlight, themes, Language } from "prism-react-renderer";
import { Maximize2, Edit, Trash2, Copy, Check, X, Star } from "lucide-react";
import { Snippet } from "../types/snippet";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface SnippetModalProps {
  snippet: Snippet;
  onClose: () => void;
  onEdit: (updatedSnippet: Snippet) => void;
  onDelete: (snippetId: string) => void;
  onFullScreen: () => void;
  onToggleFavorite: (snippetId: string, favorite: boolean) => void;
  children?: React.ReactNode;
}

const SnippetModal: React.FC<SnippetModalProps> = ({
  snippet,
  onClose,
  onEdit,
  onDelete,
  onFullScreen,
  onToggleFavorite,
  children,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSnippet, setEditedSnippet] = useState<Snippet>(snippet);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editedTitle, setEditedTitle] = useState(snippet.title);
  const [editedCode, setEditedCode] = useState(snippet.content);
  const [editedLanguage, setEditedLanguage] = useState(snippet.language);
  const [editedDescription, setEditedDescription] = useState(
    snippet.description || ""
  );
  const [editedTags, setEditedTags] = useState(snippet.tags || []);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = async () => {
    try {
      setError(null);
      const updatedSnippet: Snippet = {
        ...snippet,
        title: editedTitle,
        content: editedCode,
        language: editedLanguage,
        description: editedDescription,
        tags: editedTags,
      };

      const snippetRef = doc(db, "snippets", snippet.id);
      await updateDoc(snippetRef, {
        title: editedTitle,
        content: editedCode,
        language: editedLanguage,
        description: editedDescription,
        tags: editedTags,
      });

      setIsEditing(false);
      onEdit(updatedSnippet);
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Error updating snippet:", error);
      setError("Failed to update snippet. Please try again.");
      toast.error("Failed to save changes");
    }
  };

  const handleDelete = async () => {
    try {
      setError(null);
      await deleteDoc(doc(db, "snippets", snippet.id));
      onDelete(snippet.id);
      onClose();
    } catch (error) {
      console.error("Error deleting snippet:", error);
      setError("Failed to delete snippet. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "title":
        setEditedTitle(value);
        break;
      case "content":
        setEditedCode(value);
        break;
      case "language":
        setEditedLanguage(value as Snippet["language"]);
        break;
      case "description":
        setEditedDescription(value);
        break;
      default:
        break;
    }
    setEditedSnippet((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    setEditedTags(tags);
    setEditedSnippet((prev) => ({ ...prev, tags }));
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteStatus = !editedSnippet.favorite;
    setEditedSnippet((prev) => ({ ...prev, favorite: newFavoriteStatus }));
    onToggleFavorite(snippet.id, newFavoriteStatus);
  };

  const renderHighlightedCode = useCallback(
    (code: string, language: string) => (
      <Highlight
        theme={themes.nightOwl}
        code={code}
        language={language as Language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} p-4 rounded-lg overflow-auto`}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="mr-4 opacity-50">{i + 1}</span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    ),
    []
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-white dark:bg-gray-800 w-full max-w-4xl m-4 p-6 rounded-lg shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        {error && (
          <div className="p-4 mb-4 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200">
            <p>{error}</p>
          </div>
        )}
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={editedSnippet.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                placeholder="Title"
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={editedSnippet.content}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                rows={10}
                placeholder="Content"
              />
            </div>
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Language
              </label>
              <select
                id="language"
                name="language"
                value={editedSnippet.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="typescript">TypeScript</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                name="tags"
                value={editedSnippet.tags.join(", ")}
                onChange={handleTagsChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                placeholder="Tags (comma-separated)"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Preview
              </h3>
              {renderHighlightedCode(
                editedSnippet.content,
                editedSnippet.language
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 pr-8">
                {snippet.title}
              </h2>
              <button
                onClick={handleToggleFavorite}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                title={
                  snippet.favorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <Star
                  size={24}
                  className={
                    snippet.favorite
                      ? "text-yellow-500 fill-current"
                      : "text-gray-400"
                  }
                />
              </button>
            </div>
            <div className="mb-4">
              {renderHighlightedCode(snippet.content, snippet.language)}
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Language:{" "}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {snippet.language}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={onFullScreen}
                  className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Maximize2 size={20} />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {isCopied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>
          </>
        )}
        {children}
      </motion.div>
      <AlertDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this snippet?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              snippet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default SnippetModal;
