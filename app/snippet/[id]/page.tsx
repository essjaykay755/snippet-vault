'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { Highlight, themes } from 'prism-react-renderer'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { Snippet } from '../../../types/snippet'

const SnippetPage = () => {
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchSnippet = async () => {
      if (typeof params.id !== 'string') return
      const snippetRef = doc(db, 'snippets', params.id)
      const snippetDoc = await getDoc(snippetRef)
      if (snippetDoc.exists()) {
        setSnippet({ id: snippetDoc.id, ...snippetDoc.data() } as Snippet)
      } else {
        console.log('No such document!')
      }
    }

    fetchSnippet()
  }, [params.id])

  const handleCopy = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  if (!snippet) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center text-blue-500 hover:text-blue-600"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Snippets
      </button>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{snippet.title}</h1>
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-sm text-gray-500">Language: </span>
              <span className="text-sm font-medium">{snippet.language}</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              {isCopied ? (
                <>
                  <Check size={16} className="mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-2" />
                  Copy
                </>
              )}
            </button>
          </div>
          <Highlight theme={themes.dracula} code={snippet.content} language={snippet.language as any}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={`${className} p-4 rounded-md`} style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Tags: </span>
            {snippet.tags.map((tag, index) => (
              <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SnippetPage