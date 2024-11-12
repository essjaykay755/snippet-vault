"use client";

import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function LegalLayout({ children, title }: LegalLayoutProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:opacity-80">
            SnippetVault
          </Link>
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
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        <div className="prose dark:prose-invert max-w-none">{children}</div>
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
