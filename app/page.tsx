"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Menu } from "lucide-react";
import SnippetGrid from "../components/SnippetGrid";
import ClientSidebar from "../components/ClientSidebar";
import { Snippet } from "../types/snippet";

export default function Home() {
  const { user, signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [isAddSnippetModalOpen, setIsAddSnippetModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSnippets = useCallback(async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "snippets"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const snippetsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Snippet[];
      setSnippets(snippetsData);
      setFilteredSnippets(snippetsData);
    } catch (error) {
      console.error("Error fetching snippets:", error);
      setError("Failed to fetch snippets. Please try again.");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSnippets();
    }
  }, [user, fetchSnippets]);

  const handleFilterChange = (
    languages: string[],
    tags: string[],
    showFavorites: boolean
  ) => {
    let filtered = [...snippets];

    if (languages.length > 0) {
      filtered = filtered.filter((snippet) =>
        languages.includes(snippet.language)
      );
    }

    if (tags.length > 0) {
      filtered = filtered.filter((snippet) =>
        tags.every((tag) => snippet.tags?.includes(tag))
      );
    }

    if (showFavorites) {
      filtered = filtered.filter((snippet) => snippet.favorite);
    }

    setFilteredSnippets(filtered);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md mb-8">
          <CardContent className="pt-6">
            <h1 className="text-4xl font-bold text-center mb-2">
              SnippetVault
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              Your personal code snippet manager
            </p>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FcGoogle className="mr-2 h-5 w-5" />
              )}
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Features</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>✨ Organize your code snippets</li>
            <li>🔍 Easy search and retrieval</li>
            <li>🏷️ Tag and categorize snippets</li>
            <li>⭐ Mark favorites for quick access</li>
            <li>🌓 Dark mode support</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <ClientSidebar
        onFilterChange={handleFilterChange}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onAddSnippet={() => setIsAddSnippetModalOpen(true)}
        snippets={snippets}
        onSnippetsChange={fetchSnippets}
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="md:hidden mb-4">
          <Button
            variant="ghost"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2"
          >
            <Menu size={24} />
          </Button>
        </div>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <SnippetGrid
          snippets={filteredSnippets}
          onSnippetsChange={fetchSnippets}
          isAddSnippetModalOpen={isAddSnippetModalOpen}
          setIsAddSnippetModalOpen={setIsAddSnippetModalOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </main>
    </div>
  );
}
