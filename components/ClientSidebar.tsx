'use client'

import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

interface ClientSidebarProps {
  onLanguageSelect: (language: string | null) => void
  onTagSelect: (tag: string | null) => void
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({ onLanguageSelect, onTagSelect }) => {
  const [languages, setLanguages] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchLanguagesAndTags()
    }
  }, [user])

  const fetchLanguagesAndTags = async () => {
    if (!user) return

    const snippetsRef = collection(db, 'snippets')
    const userSnippetsQuery = query(snippetsRef, where('userId', '==', user.uid))
    const querySnapshot = await getDocs(userSnippetsQuery)

    const languagesSet = new Set<string>()
    const tagsSet = new Set<string>()

    querySnapshot.forEach((doc) => {
      const snippet = doc.data()
      if (snippet.language) {
        languagesSet.add(snippet.language)
      }
      if (snippet.tags && Array.isArray(snippet.tags)) {
        snippet.tags.forEach((tag: string) => tagsSet.add(tag))
      }
    })

    setLanguages(Array.from(languagesSet))
    setTags(Array.from(tagsSet))
  }

  const handleLanguageSelect = (language: string) => {
    if (selectedLanguage === language) {
      setSelectedLanguage(null)
      onLanguageSelect(null)
    } else {
      setSelectedLanguage(language)
      onLanguageSelect(language)
    }
    setSelectedTag(null)
    onTagSelect(null)
  }

  const handleTagSelect = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null)
      onTagSelect(null)
    } else {
      setSelectedTag(tag)
      onTagSelect(tag)
    }
    setSelectedLanguage(null)
    onLanguageSelect(null)
  }

  return (
    <div className="w-64 bg-white shadow-md h-screen p-4 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">SnippetVault</h2>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Languages</h3>
        <ul className="space-y-2">
          {languages.map((language) => (
            <li key={language}>
              <button
                onClick={() => handleLanguageSelect(language)}
                className={`w-full text-left px-2 py-1 rounded ${
                  selectedLanguage === language ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {language}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Tags</h3>
        <ul className="space-y-2">
          {tags.map((tag) => (
            <li key={tag}>
              <button
                onClick={() => handleTagSelect(tag)}
                className={`w-full text-left px-2 py-1 rounded ${
                  selectedTag === tag ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ClientSidebar