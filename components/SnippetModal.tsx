"use client";

import React, { useState, useCallback, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { AlertDescription } from "@/components/ui/alert";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";

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
  const { theme: appTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderHighlightedCode = useCallback(
    (code: string, language: string, theme: string | undefined) => (
      <Highlight
        theme={theme === "dark" ? themes.nightOwl : themes.github}
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

  if (!mounted) return null;

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
    const value = e.target.value;
    
    if (value.endsWith(',')) {
      const newTags = value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      setEditedTags(Array.from(new Set(newTags)));
      e.target.value = '';
    } else {
      setEditedTags(value.split(',').map(tag => tag.trim()));
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteStatus = !editedSnippet.favorite;
    setEditedSnippet((prev) => ({ ...prev, favorite: newFavoriteStatus }));
    onToggleFavorite(snippet.id, newFavoriteStatus);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative bg-background w-full max-w-4xl m-4 rounded-lg border shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={editedTitle}
                  onChange={handleInputChange}
                  placeholder="Title"
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={editedCode}
                  onChange={handleInputChange}
                  rows={10}
                  placeholder="Content"
                  className="font-mono"
                />
              </div>

              {editedCode && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="rounded-lg border">
                    {renderHighlightedCode(
                      editedCode,
                      editedLanguage,
                      appTheme
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={editedLanguage}
                  onValueChange={(value) =>
                    setEditedLanguage(value as Snippet["language"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="ruby">Ruby</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="swift">Swift</SelectItem>
                    <SelectItem value="kotlin">Kotlin</SelectItem>
                    <SelectItem value="plaintext">Plain Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  type="text"
                  placeholder="Add tags separated by commas"
                  onChange={handleTagsChange}
                  value={editedTags.join(', ')}
                />
                {editedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editedTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => setEditedTags(editedTags.filter((_, i) => i !== index))}
                        >
                          <X size={12} />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
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
                {renderHighlightedCode(
                  snippet.content,
                  snippet.language,
                  appTheme
                )}
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
        </div>
      </div>
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
    </div>
  );
};

export default SnippetModal;
