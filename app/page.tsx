"use client";

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import SignIn from "../components/SignIn";
import ClientSidebar from "../components/ClientSidebar";
import SnippetGrid from "../components/SnippetGrid";

export default function Home() {
  const { user, loading } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <SignIn />;
  }

  return (
    <div className="flex h-screen">
      <ClientSidebar
        onLanguageSelect={setSelectedLanguage}
        onTagSelect={setSelectedTag}
      />
      <main className="flex-1 overflow-auto">
        <SnippetGrid
          selectedLanguage={selectedLanguage}
          selectedTag={selectedTag}
        />
      </main>
    </div>
  );
}
