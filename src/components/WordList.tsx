import React from 'react';
import { cn } from '@/lib/utils';

interface WordListProps {
  words: string[];
  foundWords: Set<string>;
}

export const WordList: React.FC<WordListProps> = ({ words, foundWords }) => {
  return (
    <div className="p-4 bg-card rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Words to Find</h2>
      <div className="flex flex-wrap gap-2">
        {words.map((word) => (
          <div
            key={word}
            className={cn(
              "word-item",
              foundWords.has(word) && "found"
            )}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
};