"use client";

import React, { useState } from "react";
import { Highlight, themes, Language } from "prism-react-renderer";
import { X, Edit, Trash, Maximize, Copy, Check } from "lucide-react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Snippet } from "../types/snippet";

interface SnippetModalProps {
  snippet: Snippet;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onFullScreen: () => void;
  children?: React.ReactNode;
}

const SnippetModal: React.FC<SnippetModalProps> = ({
  snippet,
  onClose,
  onEdit,
  onDelete,
  onFullScreen,
  children,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(snippet.title);
  const [editedContent, setEditedContent] = useState(snippet.content);
  const [editedLanguage, setEditedLanguage] = useState(snippet.language);
  const [editedTags, setEditedTags] = useState(snippet.tags?.join(", ") || "");
  const [isCopied, setIsCopied] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editedTitle.trim() || !editedContent.trim()) {
      setError("Title and content are required.");
      return;
    }

    setError(null);
    const snippetRef = doc(db, "snippets", snippet.id);
    await updateDoc(snippetRef, {
      title: editedTitle,
      content: editedContent,
      language: editedLanguage,
      tags: editedTags.split(",").map((tag) => tag.trim()),
    });
    setIsEditing(false);
    onEdit();
  };

  const handleDelete = async () => {
    const snippetRef = doc(db, "snippets", snippet.id);
    await deleteDoc(snippetRef);
    onDelete();
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 w-full max-w-4xl rounded-lg shadow-xl flex flex-col max-h-[85vh]">
        <div className="p-4 border-b dark:border-gray-700">
          {isEditing ? (
            <div className="pr-12">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Edit Snippet
              </h2>
            </div>
          ) : (
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {snippet.title}
            </h2>
          )}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                placeholder="Title"
              />
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                rows={8}
                placeholder="Content"
              />
              <input
                type="text"
                value={editedLanguage}
                onChange={(e) => setEditedLanguage(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                placeholder="Language"
              />
              <input
                type="text"
                value={editedTags}
                onChange={(e) => setEditedTags(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                placeholder="Tags (comma-separated)"
              />
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  Preview
                </h3>
                <div className="relative rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Highlight
                      theme={themes.nightOwl}
                      code={editedContent || "// Your code here"}
                      language={editedLanguage as Language}
                    >
                      {({
                        className,
                        style,
                        tokens,
                        getLineProps,
                        getTokenProps,
                      }) => (
                        <pre
                          className={`${className} p-4`}
                          style={{ ...style, minWidth: "fit-content" }}
                        >
                          {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                              {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                              ))}
                            </div>
                          ))}
                        </pre>
                      )}
                    </Highlight>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="relative rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Highlight
                    theme={themes.nightOwl}
                    code={snippet.content}
                    language={snippet.language as Language}
                  >
                    {({
                      className,
                      style,
                      tokens,
                      getLineProps,
                      getTokenProps,
                    }) => (
                      <pre
                        className={`${className} p-4`}
                        style={{ ...style, minWidth: "fit-content" }}
                      >
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Language:{" "}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {snippet.language}
              </span>
              {snippet.tags && snippet.tags.length > 0 && (
                <span className="ml-4">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tags:{" "}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {snippet.tags.join(", ")}
                  </span>
                </span>
              )}
            </div>
            {isEditing ? (
              <div className="flex space-x-2">
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
            ) : (
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
                  <Trash size={20} />
                </button>
                <button
                  onClick={onFullScreen}
                  className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Maximize size={20} />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {isCopied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            )}
          </div>
        </div>
        {children}
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Confirm Deletion
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this snippet? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnippetModal;
