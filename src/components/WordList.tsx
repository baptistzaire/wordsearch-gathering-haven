import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { getRandomSynonym } from '@/utils/wordSynonyms';
import { useToast } from '@/hooks/use-toast';
import { Coins } from 'lucide-react';
import { Button } from './ui/button';

interface WordListProps {
  words: string[];
  foundWords: Set<string>;
  onWordFound?: (word: string) => void;
}

interface ShiftedWord {
  original: string;
  shifted: string;
  revealed: boolean;
}

export const WordList: React.FC<WordListProps> = ({ 
  words, 
  foundWords,
  onWordFound 
}) => {
  const { toast } = useToast();
  const [shiftedWords, setShiftedWords] = useState<Map<string, ShiftedWord>>(new Map());
  const [tokens, setTokens] = useState<number>(100); // Starting tokens amount

  const handleWordClick = (word: string) => {
    if (foundWords.has(word)) return;

    if (!shiftedWords.has(word)) {
      const shiftedWord = getRandomSynonym(word);
      setShiftedWords(new Map(shiftedWords.set(word, {
        original: word,
        shifted: shiftedWord,
        revealed: false
      })));

      toast({
        title: "Word Shifted!",
        description: "Use tokens to reveal the original word",
      });
    }
  };

  const revealOriginalWord = (word: string) => {
    const shiftedWord = shiftedWords.get(word);
    if (!shiftedWord || shiftedWord.revealed) return;

    if (tokens >= 10) {
      setTokens(tokens - 10);
      setShiftedWords(new Map(shiftedWords.set(word, {
        ...shiftedWord,
        revealed: true
      })));

      toast({
        title: "Word Revealed!",
        description: `Original word was: ${shiftedWord.original}`,
      });
    } else {
      toast({
        title: "Not enough tokens",
        description: "You need 10 tokens to reveal a word",
        variant: "destructive"
      });
    }
  };

  const getDisplayWord = (word: string) => {
    const shiftedWord = shiftedWords.get(word);
    if (!shiftedWord) return word;
    return shiftedWord.revealed ? shiftedWord.original : shiftedWord.shifted;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-2 bg-purple-100 rounded-lg">
        <Coins className="w-5 h-5 text-purple-600" />
        <span className="font-medium text-purple-700">{tokens} Tokens</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {words.map((word) => (
          <div
            key={word}
            className={cn(
              "relative group p-2 rounded-lg border transition-all cursor-pointer",
              foundWords.has(word) 
                ? "bg-green-100 border-green-300" 
                : "hover:bg-purple-50 border-gray-200"
            )}
            onClick={() => handleWordClick(word)}
          >
            <div className="flex items-center justify-between">
              <span className={cn(
                "font-medium",
                foundWords.has(word) && "line-through text-green-700"
              )}>
                {getDisplayWord(word)}
              </span>
              
              {shiftedWords.has(word) && !shiftedWords.get(word)?.revealed && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    revealOriginalWord(word);
                  }}
                >
                  Reveal (10 🪙)
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};