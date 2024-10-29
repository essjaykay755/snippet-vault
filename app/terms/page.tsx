import React from 'react'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">
        By using SnippetVault, you agree to the following terms of service:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>You will not use the service for any illegal purposes.</li>
        <li>You are responsible for maintaining the confidentiality of your account and password.</li>
        <li>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without express written permission by us.</li>
        <li>We reserve the right to terminate your access to the Service at any time, without cause or notice.</li>
      </ul>
      <p className="mb-4">
        We reserve the right to modify these terms at any time. Your continued use of the Service after any such changes 
        constitute your acceptance of the new Terms of Service.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        Back to Home
      </Link>
    </div>
  )
}