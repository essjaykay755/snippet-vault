'use client'

import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import SnippetCard from './SnippetCard'
import AddSnippetButton from './AddSnippetButton'
import AddSnippetForm from './AddSnippetForm'
import { Snippet } from '../types/snippet'

interface SnippetGridProps {
  selectedLanguage: string | null
  selectedTag: string | null
}

const SnippetGrid: React.FC<SnippetGridProps> = ({ selectedLanguage, selectedTag }) => {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [isAddingSnippet, setIsAddingSnippet] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchSnippets()
    }
  }, [user, selectedLanguage, selectedTag])

  const fetchSnippets = async () => {
    if (!user) return

    const snippetsRef = collection(db, 'snippets')
    let q = query(snippetsRef, where('userId', '==', user.uid))

    if (selectedLanguage) {
      q = query(q, where('language', '==', selectedLanguage))
    }

    if (selectedTag) {
      q = query(q, where('tags', 'array-contains', selectedTag))
    }

    const querySnapshot = await getDocs(q)
    const fetchedSnippets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Snippet))
    setSnippets(fetchedSnippets)
  }

  const handleAddSnippet = (newSnippet: Omit<Snippet, 'id' | 'userId'>) => {
    // Implementation for adding a new snippet
    console.log('Adding new snippet:', newSnippet)
    setIsAddingSnippet(false)
    fetchSnippets() // Refresh the snippets after adding
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Snippets</h1>
        <AddSnippetButton onClick={() => setIsAddingSnippet(true)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {snippets.map(snippet => (
          <SnippetCard
            key={snippet.id}
            snippet={snippet}
            onUpdate={() => fetchSnippets()}
            onDelete={() => fetchSnippets()}
          />
        ))}
      </div>
      {isAddingSnippet && (
        <AddSnippetForm onSave={handleAddSnippet} onClose={() => setIsAddingSnippet(false)} />
      )}
    </div>
  )
}

export default SnippetGrid