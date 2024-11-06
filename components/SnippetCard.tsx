"use client";

import React, { useState, useEffect } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { motion } from "framer-motion";
import { Copy, Check, Link as LinkIcon, Star } from "lucide-react";
import SnippetModal from "./SnippetModal";
import { useRouter } from "next/navigation";
import { Snippet } from "../types/snippet";

interface SnippetCardProps {
  snippet: Snippet;
  onUpdate: () => void;
  onDelete: () => void;
  onToggleFavorite: (snippetId: string, favorite: boolean) => void;
}

const languageColors: { [key: string]: string } = {
  javascript: "bg-yellow-100 dark:bg-yellow-900/50",
  python: "bg-blue-100 dark:bg-blue-900/50",
  css: "bg-pink-100 dark:bg-pink-900/50",
  html: "bg-orange-100 dark:bg-orange-900/50",
  typescript: "bg-blue-100 dark:bg-blue-900/50",
};

const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  onUpdate,
  onDelete,
  onToggleFavorite,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setFormattedDate(formatDate(snippet.date));
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, [snippet.date]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `${window.location.origin}/snippet/${snippet.id}`;
    navigator.clipboard.writeText(link);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const handleOpenFullView = () => {
    router.push(`/snippet/${snippet.id}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(snippet.id, !snippet.favorite);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Created on ${date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`;
  };

  return (
    <>
      <motion.div
        className={`rounded-lg shadow-md overflow-hidden cursor-pointer relative h-[300px] ${
          languageColors[snippet.language] || "bg-gray-50 dark:bg-gray-800/50"
        }`}
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {snippet.title}
            </h2>
            <button
              onClick={handleToggleFavorite}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={
                snippet.favorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Star
                size={20}
                className={
                  snippet.favorite
                    ? "text-yellow-500 fill-current"
                    : "text-gray-400 dark:text-gray-500"
                }
              />
            </button>
          </div>
          <div className="flex-grow overflow-hidden">
            <Highlight
              theme={isDarkMode ? themes.nightOwl : themes.github}
              code={snippet.content}
              language={snippet.language as any}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`${className} text-sm`}
                  style={{
                    ...style,
                    background: "transparent",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {tokens.slice(0, 5).map((line, i) => (
                    <div
                      key={i}
                      {...getLineProps({ line })}
                      className="text-gray-800 dark:text-gray-200"
                    >
                      {line.map((token, key) => (
                        <span
                          key={key}
                          {...getTokenProps({ token })}
                          className="text-inherit"
                        />
                      ))}
                    </div>
                  ))}
                  {tokens.length > 5 && <div>...</div>}
                </pre>
              )}
            </Highlight>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formattedDate}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleCopyLink}
                className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                title="Copy link"
              >
                {isLinkCopied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <LinkIcon
                    size={16}
                    className="text-gray-900 dark:text-gray-200"
                  />
                )}
              </button>
              <button
                onClick={handleCopy}
                className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                title="Copy snippet"
              >
                {isCopied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy
                    size={16}
                    className="text-gray-900 dark:text-gray-200"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {isModalOpen && (
        <SnippetModal
          snippet={snippet}
          onClose={() => setIsModalOpen(false)}
          onEdit={onUpdate}
          onDelete={() => {
            onDelete();
            setIsModalOpen(false);
          }}
          onFullScreen={handleOpenFullView}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </>
  );
};

export default SnippetCard;
