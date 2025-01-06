import React from 'react';
import { cn } from '@/lib/utils';

interface WordListProps {
  words: string[];
  foundWords: Set<string>;
}

export const WordList: React.FC<WordListProps> = ({ words, foundWords }) => {
  return (
    <div className="word-list">
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
  );
};