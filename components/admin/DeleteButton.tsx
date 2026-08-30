'use client';
import { Trash2 } from 'lucide-react';
export default function DeleteButton({ title }: { title: string }) {
  return (
    <button
      type="submit"
      className="text-red-500 hover:text-red-700 transition-colors"
      title="Delete"
      onClick={(e) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) e.preventDefault();
      }}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
