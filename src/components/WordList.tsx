import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WordListProps {
  words: string[];
  foundWords: Set<string>;
}

export const WordList: React.FC<WordListProps> = ({ words, foundWords }) => {
  return (
    <motion.div 
      className="word-list bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {words.map((word, index) => (
        <motion.div
          key={word}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "word-item",
            "transition-all duration-300 hover:bg-primary/5 rounded-lg",
            foundWords.has(word) && "found text-primary font-bold bg-primary/10"
          )}
        >
          {word}
        </motion.div>
      ))}
    </motion.div>
  );
};