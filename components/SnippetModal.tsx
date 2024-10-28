"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import { Maximize2, Edit, Trash2, Copy, Check, X, Save } from "lucide-react";
import { Snippet } from "../types/snippet";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface SnippetModalProps {
  snippet: Snippet;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onFullScreen: () => void;
}

const SnippetModal: React.FC<SnippetModalProps> = ({
  snippet,
  onClose,
  onEdit,
  onDelete,
  onFullScreen,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSnippet, setEditedSnippet] = useState<Snippet>(snippet);
  const [isCopied, setIsCopied] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = async () => {
    try {
      setError(null);
      const snippetRef = doc(db, "snippets", snippet.id);
      await updateDoc(snippetRef, {
        title: editedSnippet.title,
        content: editedSnippet.content,
        language: editedSnippet.language,
        tags: editedSnippet.tags.filter((tag) => tag.trim() !== ""),
      });
      onEdit();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating snippet:", error);
      setError("Failed to update snippet. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      setError(null);
      await deleteDoc(doc(db, "snippets", snippet.id));
      onDelete();
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
    setEditedSnippet((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEditedSnippet((prev) => ({
      ...prev,
      tags: value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    }));
  };

  const renderHighlightedCode = useCallback(
    () => (
      <Highlight
        theme={themes.github}
        code={snippet.content}
        language={snippet.language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} p-4 rounded-md h-full overflow-auto`}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    ),
    [snippet.content, snippet.language]
  );

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edit Snippet" : snippet.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}
        <div className="flex-grow overflow-y-auto p-6">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={editedSnippet.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Snippet Title"
              />
              <textarea
                name="content"
                value={editedSnippet.content}
                onChange={handleInputChange}
                className="w-full h-64 px-3 py-2 border rounded-md font-mono"
                placeholder="Snippet Content"
              />
              <select
                name="language"
                value={editedSnippet.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="typescript">TypeScript</option>
              </select>
              <input
                type="text"
                name="tags"
                value={editedSnippet.tags.join(", ")}
                onChange={handleTagsChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Tags (comma-separated)"
              />
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex-grow">{renderHighlightedCode()}</div>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <strong>Language:</strong> {snippet.language}
                </div>
                {snippet.tags && snippet.tags.length > 0 && (
                  <div>
                    <strong>Tags:</strong> {snippet.tags.join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                >
                  <Save size={20} className="mr-2" />
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors flex items-center"
                >
                  <X size={20} className="mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                >
                  <Edit size={20} className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
                >
                  <Trash2 size={20} className="mr-2" />
                  Delete
                </button>
              </>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center"
            >
              {isCopied ? (
                <>
                  <Check size={20} className="mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={20} className="mr-2" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={onFullScreen}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center"
            >
              <Maximize2 size={20} className="mr-2" />
              Full Screen
            </button>
          </div>
        </div>
      </motion.div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete this snippet? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SnippetModal;
