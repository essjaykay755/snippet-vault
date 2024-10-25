import React from 'react'
import { Plus } from 'lucide-react'

interface AddSnippetButtonProps {
  onClick: () => void
}

const AddSnippetButton: React.FC<AddSnippetButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
    >
      <Plus size={20} className="mr-2" />
      <span>Add Snippet</span>
    </button>
  )
}

export default AddSnippetButton