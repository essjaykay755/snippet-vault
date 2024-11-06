import React from "react";
import { Plus } from "lucide-react";

interface AddSnippetCardProps {
  onClick: () => void;
}

const AddSnippetCard: React.FC<AddSnippetCardProps> = ({ onClick }) => {
  return (
    <div
      className="rounded-lg shadow-md overflow-hidden cursor-pointer relative h-[300px] bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center"
      onClick={onClick}
    >
      <div className="text-center">
        <Plus
          className="mx-auto mb-2 text-gray-400 dark:text-gray-500"
          size={48}
        />
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
          Add New Snippet
        </p>
      </div>
    </div>
  );
};

export default AddSnippetCard;
