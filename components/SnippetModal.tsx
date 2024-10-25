"use client";

import React, { useState } from "react";
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
        <div className="p-6 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editedSnippet.title}
                onChange={handleInputChange}
                className="text-2xl font-semibold w-full px-2 py-1 border border-gray-300 rounded-md"
              />
            ) : (
              <h2 className="text-2xl font-semibold text-gray-800">
                {snippet.title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={editedSnippet.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                  <option value="typescript">TypeScript</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <div className="relative">
                  <Highlight
                    theme={themes.github}
                    code={editedSnippet.content}
                    language={editedSnippet.language as any}
                  >
                    {({
                      className,
                      style,
                      tokens,
                      getLineProps,
                      getTokenProps,
                    }) => (
                      <pre
                        className={`${className} p-4 rounded-md overflow-auto`}
                        style={style}
                      >
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                              <span
                                key={key}
                                {...getTokenProps({ token, key })}
                              />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                  <textarea
                    id="content"
                    name="content"
                    value={editedSnippet.content}
                    onChange={handleInputChange}
                    rows={10}
                    className="absolute inset-0 w-full h-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-transparent resize-none"
                    style={{
                      color: "transparent",
                      caretColor: "black",
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={editedSnippet.tags.join(", ")}
                  onChange={handleTagsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ) : (
            <Highlight
              theme={themes.github}
              code={snippet.content}
              language={snippet.language as any}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`${className} p-4 rounded-md overflow-auto h-full`}
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
          )}
        </div>
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
                  onClick={handleDelete}
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
    </motion.div>
  );
};

export default SnippetModal;
