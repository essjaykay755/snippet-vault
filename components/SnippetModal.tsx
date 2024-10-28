"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Highlight, themes, Language } from "prism-react-renderer";
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

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = async () => {
    try {
      const snippetRef = doc(db, "snippets", snippet.id);
      await updateDoc(snippetRef, {
        title: editedSnippet.title,
        content: editedSnippet.content,
        language: editedSnippet.language,
        tags: editedSnippet.tags,
      });
      onEdit();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating snippet:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "snippets", snippet.id));
      onDelete();
      onClose();
    } catch (error) {
      console.error("Error deleting snippet:", error);
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
      tags: value.split(",").map((tag) => tag.trim()),
    }));
  };

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
        {/* ... (rest of the modal content remains the same) */}

        <div className="p-6 flex-shrink-0 border-t flex justify-between items-center">
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
