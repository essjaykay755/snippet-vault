import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About SnippetVault</h1>
      <p className="mb-4">
        SnippetVault is a powerful tool designed to help developers organize and manage their code snippets efficiently. 
        With features like syntax highlighting, tagging, and easy searching, SnippetVault makes it simple to store and 
        retrieve your most useful code fragments.
      </p>
      <p className="mb-4">
        Whether you're a seasoned developer or just starting out, SnippetVault can help you boost your productivity 
        by keeping your code snippets organized and easily accessible.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        Back to Home
      </Link>
    </div>
  )
}