import React from 'react'
import { Plus } from 'lucide-react'

interface AddSnippetCardProps {
  onClick: () => void
}

const AddSnippetCard: React.FC<AddSnippetCardProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer relative h-[300px] flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
    >
      <div className="text-center">
        <Plus size={48} className="mx-auto mb-2 text-gray-400" />
        <span className="text-lg font-medium text-gray-600">Add New Snippet</span>
      </div>
    </div>
  )
}

export default AddSnippetCard