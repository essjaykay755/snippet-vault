"use client";

import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Snippet } from "../types/snippet";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";
import { Highlight, themes, Language } from "prism-react-renderer";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";

interface AddSnippetFormProps {
  onSave: () => void;
  onClose: () => void;
}

export default function AddSnippetForm({
  onSave,
  onClose,
}: AddSnippetFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState<Snippet["language"]>("javascript");
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { theme: appTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    if (!user) {
      setError("You must be logged in to add snippets.");
      return;
    }

    try {
      setError(null);

      const tagsArray = tags.filter((tag: string) => tag.trim() !== "");

      const newSnippet: Omit<Snippet, "id"> = {
        title: title.trim(),
        content: content.trim(),
        language: language as Snippet["language"],
        description: description.trim(),
        tags: tagsArray,
        date: new Date().toISOString(),
        userId: user.uid,
        favorite: false,
      };

      await addDoc(collection(db, "snippets"), newSnippet);
      toast.success("Snippet added successfully");
      onSave();
    } catch (error) {
      console.error("Error adding snippet:", error);
      setError("Failed to add snippet. Please try again.");
      toast.error("Failed to add snippet");
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);

    if (value.endsWith(',')) {
      const tag = value.slice(0, -1).trim();
      if (tag && !tags.includes(tag)) {
        setTags(prevTags => [...prevTags, tag]);
      }
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim();
      if (!tags.includes(tag)) {
        setTags(prevTags => [...prevTags, tag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(prevTags => prevTags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background rounded-lg border shadow-lg p-6 w-full max-w-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add New Snippet</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter snippet title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter snippet description (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your code snippet"
              rows={10}
              className="font-mono"
            />
          </div>

          {content && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="rounded-lg border">
                <Highlight
                  theme={appTheme === "dark" ? themes.nightOwl : themes.github}
                  code={content}
                  language={language as Language}
                >
                  {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }) => (
                    <pre
                      className={`${className} p-4 rounded-lg overflow-auto max-h-[300px]`}
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
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={language}
              onValueChange={(value) =>
                setLanguage(value as Snippet["language"])
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
              placeholder="Type and press Enter or add comma to create tags"
              value={tagInput}
              onChange={handleTagsChange}
              onKeyDown={handleTagKeyDown}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
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
                    onClick={() => removeTag(index)}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
