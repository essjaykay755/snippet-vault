import React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function AddSnippetCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      className="rounded-lg border border-dashed border-border hover:border-primary/50 bg-background/50 cursor-pointer h-[300px] flex items-center justify-center"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-center space-y-2 p-4">
        <div className="mx-auto rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">Add New Snippet</h3>
        <p className="text-sm text-muted-foreground">
          Click to add a new code snippet
        </p>
      </div>
    </motion.div>
  );
}
