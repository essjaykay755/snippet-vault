"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Highlight, themes, Language } from "prism-react-renderer";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Snippet } from "../../../types/snippet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";

const SnippetPage = () => {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchSnippet = async () => {
      if (typeof params.id !== "string") return;
      const snippetRef = doc(db, "snippets", params.id);
      const snippetDoc = await getDoc(snippetRef);
      if (snippetDoc.exists()) {
        setSnippet({ id: snippetDoc.id, ...snippetDoc.data() } as Snippet);
      } else {
        console.log("No such document!");
      }
    };

    fetchSnippet();
  }, [params.id]);

  const handleCopy = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!snippet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Snippets
      </Button>

      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{snippet.title}</h1>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              {snippet.language}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8"
            >
              {isCopied ? (
                <>
                  <Check size={14} className="mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} className="mr-2" />
                  Copy code
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <Highlight
            theme={theme === 'dark' ? themes.dracula : themes.github}
            code={snippet.content}
            language={snippet.language as Language}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre 
                className={`${className} p-4 overflow-x-auto`} 
                style={{ ...style, backgroundColor: 'transparent' }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line, key: i })}>
                    <span className="text-muted-foreground mr-4 select-none">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>

        {snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {snippet.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SnippetPage;
