import React from 'react';
import { cn } from '@/lib/utils';
import { getRandomSynonym, isOriginalWord } from '@/utils/synonyms';
import { useToast } from "@/hooks/use-toast";

interface WordListProps {
  words: string[];
  foundWords: Set<string>;
  tokens: number;
  onTokensChange: (newTokens: number) => void;
  onWordSwap: (originalWord: string, newWord: string) => void;
}

export const WordList: React.FC<WordListProps> = ({ 
  words, 
  foundWords, 
  tokens,
  onTokensChange,
  onWordSwap
}) => {
  const { toast } = useToast();
  const REVEAL_COST = 10;

  const handleWordClick = (word: string) => {
    if (foundWords.has(word)) return;
    
    if (!isOriginalWord(word)) {
      // This is a synonym, try to reveal original
      if (tokens >= REVEAL_COST) {
        onTokensChange(tokens - REVEAL_COST);
        const originalWord = Object.keys(wordSynonyms).find(
          key => wordSynonyms[key].includes(word)
        );
        if (originalWord) {
          onWordSwap(word, originalWord);
          toast({
            title: "Original Word Revealed!",
            description: `Spent ${REVEAL_COST} tokens to reveal: ${originalWord}`,
          });
        }
      } else {
        toast({
          title: "Not enough tokens",
          description: `You need ${REVEAL_COST} tokens to reveal the original word`,
          variant: "destructive",
        });
      }
    } else {
      // This is an original word, swap with synonym
      const synonym = getRandomSynonym(word);
      if (synonym !== word) {
        onWordSwap(word, synonym);
        toast({
          title: "Word Shifted",
          description: `${word} transformed into ${synonym}`,
        });
      }
    }
  };

  return (
    <div className="word-list">
      <div className="mb-4 text-sm text-purple-600 font-medium">
        Available Tokens: {tokens}
      </div>
      {words.map((word) => (
        <div
          key={word}
          onClick={() => handleWordClick(word)}
          className={cn(
            "word-item",
            foundWords.has(word) && "found",
            "cursor-pointer hover:bg-purple-50 rounded-md"
          )}
        >
          {word}
        </div>
      ))}
    </div>
  );
};