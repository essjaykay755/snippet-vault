import React from 'react'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        At SnippetVault, we take your privacy seriously. This privacy policy describes how we collect, use, and protect 
        your personal information when you use our service.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Information Collection and Use</h2>
      <p className="mb-4">
        We collect information that you provide directly to us, such as when you create an account or save a code snippet. 
        This may include your email address and the content of your snippets.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Data Protection</h2>
      <p className="mb-4">
        We implement a variety of security measures to maintain the safety of your personal information. Your snippets 
        are stored securely and are only accessible to you.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        Back to Home
      </Link>
    </div>
  )
}