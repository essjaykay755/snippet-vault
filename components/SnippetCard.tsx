"use client";

import React, { useState, useEffect } from "react";
import { Highlight, themes, Language } from "prism-react-renderer";
import { motion } from "framer-motion";
import { Copy, Check, Link as LinkIcon, Star } from "lucide-react";
import SnippetModal from "./SnippetModal";
import { useRouter } from "next/navigation";
import { Snippet } from "../types/snippet";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface SnippetCardProps {
  snippet: Snippet;
  onUpdate: () => void;
  onDelete: () => void;
  onToggleFavorite: (snippetId: string, favorite: boolean) => void;
}

const languageColors: { [key: string]: string } = {
  javascript: "bg-yellow-100 dark:bg-yellow-900/30",
  python: "bg-blue-100 dark:bg-blue-900/30",
  css: "bg-pink-100 dark:bg-pink-900/30",
  html: "bg-orange-100 dark:bg-orange-900/30",
  typescript: "bg-blue-100 dark:bg-blue-900/30",
  java: "bg-red-100 dark:bg-red-900/30",
  csharp: "bg-purple-100 dark:bg-purple-900/30",
  php: "bg-indigo-100 dark:bg-indigo-900/30",
  ruby: "bg-red-100 dark:bg-red-900/30",
  go: "bg-cyan-100 dark:bg-cyan-900/30",
  rust: "bg-orange-100 dark:bg-orange-900/30",
  swift: "bg-orange-100 dark:bg-orange-900/30",
  kotlin: "bg-purple-100 dark:bg-purple-900/30",
  plaintext: "bg-gray-100 dark:bg-gray-800/30",
} as const;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `Created on ${date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;
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
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setFormattedDate(formatDate(snippet.date));
  }, [snippet.date]);

  if (!mounted) {
    return null;
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.content);
    setIsCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `${window.location.origin}/snippet/${snippet.id}`;
    navigator.clipboard.writeText(link);
    setIsLinkCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const handleOpenFullView = () => {
    router.push(`/snippet/${snippet.id}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(snippet.id, !snippet.favorite);
  };

  const handleEdit = () => {
    onUpdate();
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div
        className={`rounded-lg shadow-md overflow-hidden cursor-pointer relative h-[300px] ${
          languageColors[snippet.language] || "bg-gray-100 dark:bg-gray-800/30"
        }`}
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {snippet.title}
            </h2>
            <button
              onClick={handleToggleFavorite}
              className="p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
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
              theme={theme === "dark" ? themes.nightOwl : themes.github}
              code={snippet.content}
              language={snippet.language as Language}
            >
              {({ style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className="text-sm overflow-hidden"
                  style={{
                    ...style,
                    backgroundColor: "transparent",
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
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                  {tokens.length > 5 && (
                    <div className="text-gray-500 dark:text-gray-400">...</div>
                  )}
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
                className="p-2 bg-white/50 dark:bg-gray-700/50 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
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
                className="p-2 bg-white/50 dark:bg-gray-700/50 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
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
          onEdit={handleEdit}
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
