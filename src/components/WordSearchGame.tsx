import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WordGrid } from './WordGrid';
import { WordList } from './WordList';
import { GameControls } from './GameControls';
import { WinModal } from './WinModal';
import { useToast } from "@/hooks/use-toast";
import { generateGameGrid } from '@/utils/gridGenerator';
import { GameHeader } from './GameHeader';
import { Sun, Settings } from 'lucide-react';

export type Difficulty = 'easy' | 'medium' | 'hard';

export const WordSearchGame: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [showWinModal, setShowWinModal] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [hintsUsed, setHintsUsed] = useState(0);
  const { connected, publicKey, wallet } = useWallet();
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

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  useEffect(() => {
    if (connected) {
      toast({
        title: "Wallet Connected",
        description: `Connected to ${wallet?.adapter.name}`,
      });
    }
  }, [connected, wallet?.adapter.name]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50/50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="game-header">
          <button 
            onClick={startNewGame}
            className="text-lg font-semibold hover:text-primary transition-colors"
          >
            New game
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium">Normal</span>
            <button className="p-2 hover:bg-white rounded-full transition-colors">
              <Sun className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <WalletMultiButton className="bg-primary hover:bg-primary/90" />
        </div>

        <div className="space-y-6">
          <WordGrid
            grid={grid}
            words={words}
            foundWords={foundWords}
            onWordFound={handleWordFound}
            hintPosition={null}
          />

          <WordList words={words} foundWords={foundWords} />
        </div>

        {showWinModal && (
          <WinModal
            onClose={() => setShowWinModal(false)}
            onNewGame={startNewGame}
            hintsUsed={hintsUsed}
            isWalletConnected={connected}
            tokensEarned={calculateTokenReward()}
          />
        )}
      </div>
    </div>
  );
};

function calculateTokenReward(): number {
  return 100;
}