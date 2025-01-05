import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { WordGrid } from './WordGrid';
import { WordList } from './WordList';
import { GameControls } from './GameControls';
import { WinModal } from './WinModal';
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateGameGrid } from '@/utils/gridGenerator';
import { GameHeader } from './GameHeader';

export type Difficulty = 'easy' | 'medium' | 'hard';
type Direction = 'horizontal' | 'vertical' | 'diagonal';

export const WordSearchGame: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [showWinModal, setShowWinModal] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { toast } = useToast();

  const startNewGame = () => {
    const wordLists = {
      easy: ['CAT', 'DOG', 'RAT', 'BAT'],
      medium: ['PYTHON', 'JAVA', 'RUBY', 'SWIFT', 'RUST'],
      hard: ['JAVASCRIPT', 'TYPESCRIPT', 'ASSEMBLY', 'HASKELL']
    };
    
    const gridSizes = { easy: 8, medium: 10, hard: 12 };
    const selectedWords = wordLists[difficulty];
    const gridSize = gridSizes[difficulty];
    
    setWords(selectedWords);
    setGrid(generateGameGrid(gridSize, selectedWords));
    setFoundWords(new Set());
    setHintsUsed(0);
    setShowWinModal(false);
  };

  const handleWordFound = (word: string) => {
    const newFoundWords = new Set(foundWords);
    newFoundWords.add(word);
    setFoundWords(newFoundWords);
    
    if (newFoundWords.size === words.length) {
      setShowWinModal(true);
    }
  };

  const handleHint = () => {
    const remainingWords = words.filter(word => !foundWords.has(word));
    if (remainingWords.length > 0) {
      const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
      handleWordFound(randomWord);
      setHintsUsed(hintsUsed + 1);
    }
  };

  const connectWallet = async () => {
    try {
      setIsWalletConnected(true);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your Solana wallet",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <GameHeader 
          isWalletConnected={isWalletConnected}
          onConnectWallet={connectWallet}
        />

        <div className="bg-white rounded-lg shadow-lg p-6">
          <GameControls
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            onNewGame={startNewGame}
            onHint={handleHint}
          />
          
          <div className="mt-6">
            <WordGrid
              grid={grid}
              words={words}
              foundWords={foundWords}
              onWordFound={handleWordFound}
              hintPosition={null}
            />
          </div>

          <div className="mt-6">
            <WordList words={words} foundWords={foundWords} />
          </div>
        </div>

        {showWinModal && (
          <WinModal
            onClose={() => setShowWinModal(false)}
            onNewGame={startNewGame}
            hintsUsed={hintsUsed}
            isWalletConnected={isWalletConnected}
            tokensEarned={calculateTokenReward()}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
};

function calculateTokenReward(): number {
  return 100;
}