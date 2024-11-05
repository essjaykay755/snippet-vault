"use client";

import { AuthProvider } from "../contexts/AuthContext";
import AuthWrapper from "../components/AuthWrapper";
import { useState, useEffect } from "react";
import "@/styles/globals.css";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    setIsDarkMode(savedMode === "true");
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <html lang="en" className={isDarkMode ? "dark" : ""}>
      <body
        className={`${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <AuthProvider>
          <AuthWrapper>
            <button
              onClick={toggleDarkMode}
              className={`fixed top-4 right-4 p-2 rounded-full ${
                isDarkMode
                  ? "bg-gray-700 text-yellow-300"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            {React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(child as React.ReactElement<any>, {
                    isDarkMode,
                  })
                : child
            )}
          </AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
