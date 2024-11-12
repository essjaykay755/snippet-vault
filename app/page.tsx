"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import SnippetGrid from "../components/SnippetGrid";
import ClientSidebar from "../components/ClientSidebar";
import { Snippet } from "../types/snippet";
import { Header } from "@/components/Header";
import Link from "next/link";
import { FileCode2, Search, Tags, Share2, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Home() {
  const { user, signInWithGoogle } = useAuth();
  const { theme, setTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [isAddSnippetModalOpen, setIsAddSnippetModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // After mounting, we can show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleFilterChange = useCallback(
    (languages: string[], tags: string[], showFavorites: boolean) => {
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
    },
    [snippets]
  );

  // Use onAuthStateChanged from Firebase Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="text-2xl font-bold">SnippetVault</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your Code Snippets,{" "}
              <span className="text-primary">Organized</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Store, manage, and share your code snippets with ease. Built for
              developers, by developers.
            </p>
            <div className="space-y-4">
              <Button
                size="lg"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <FcGoogle className="mr-2 h-5 w-5" />
                )}
                Sign in with Google
              </Button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4 max-w-lg">
            <Card className="p-4 space-y-2">
              <FileCode2 className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Code Organization</h3>
              <p className="text-sm text-muted-foreground">
                Keep your snippets organized and easily accessible
              </p>
            </Card>
            <Card className="p-4 space-y-2">
              <Search className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Quick Search</h3>
              <p className="text-sm text-muted-foreground">
                Find your snippets instantly with powerful search
              </p>
            </Card>
            <Card className="p-4 space-y-2">
              <Tags className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Smart Tagging</h3>
              <p className="text-sm text-muted-foreground">
                Organize with tags and categories
              </p>
            </Card>
            <Card className="p-4 space-y-2">
              <Share2 className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Easy Sharing</h3>
              <p className="text-sm text-muted-foreground">
                Share snippets with your team
              </p>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                © 2024 SnippetVault. All rights reserved.
              </div>
              <nav className="flex items-center gap-4">
                <Link href="/about" className="text-sm hover:text-primary">
                  About
                </Link>
                <Link href="/privacy" className="text-sm hover:text-primary">
                  Privacy
                </Link>
                <Link href="/terms" className="text-sm hover:text-primary">
                  Terms
                </Link>
                <Link href="/contact" className="text-sm hover:text-primary">
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <ClientSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(false)}
        onFilterChange={handleFilterChange}
        onAddSnippet={() => setIsAddSnippetModalOpen(true)}
        snippets={snippets}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4">
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
          />
        </main>
      </div>
    </div>
  );
}
