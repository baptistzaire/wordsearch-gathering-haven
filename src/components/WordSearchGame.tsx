import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { WordGrid } from './WordGrid';
import { WordList } from './WordList';
import { GameControls } from './GameControls';
import { WinModal } from './WinModal';
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Difficulty = 'easy' | 'medium' | 'hard';
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

  const generateGrid = (size: number, wordsToPlace: string[]): string[][] => {
    const grid = Array(size).fill(null).map(() => Array(size).fill(''));
    const directions: Direction[] = ['horizontal', 'vertical', 'diagonal'];
    
    wordsToPlace.forEach(word => {
      let placed = false;
      while (!placed) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const [x, y] = getRandomPosition(size, word.length, direction);
        if (canPlaceWord(grid, word, x, y, direction)) {
          placeWord(grid, word, x, y, direction);
          placed = true;
        }
      }
    });

    // Fill empty spaces with random letters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === '') {
          grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    return grid;
  };

  const getRandomPosition = (size: number, wordLength: number, direction: Direction): [number, number] => {
    let x, y;
    if (direction === 'horizontal') {
      x = Math.floor(Math.random() * (size - wordLength));
      y = Math.floor(Math.random() * size);
    } else if (direction === 'vertical') {
      x = Math.floor(Math.random() * size);
      y = Math.floor(Math.random() * (size - wordLength));
    } else {
      x = Math.floor(Math.random() * (size - wordLength));
      y = Math.floor(Math.random() * (size - wordLength));
    }
    return [x, y];
  };

  const canPlaceWord = (grid: string[][], word: string, x: number, y: number, direction: Direction): boolean => {
    for (let i = 0; i < word.length; i++) {
      let checkX = x;
      let checkY = y;
      
      if (direction === 'horizontal') checkX += i;
      else if (direction === 'vertical') checkY += i;
      else {
        checkX += i;
        checkY += i;
      }

      if (grid[checkY][checkX] !== '' && grid[checkY][checkX] !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (grid: string[][], word: string, x: number, y: number, direction: Direction) => {
    for (let i = 0; i < word.length; i++) {
      if (direction === 'horizontal') {
        grid[y][x + i] = word[i];
      } else if (direction === 'vertical') {
        grid[y + i][x] = word[i];
      } else {
        grid[y + i][x + i] = word[i];
      }
    }
  };

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
    setGrid(generateGrid(gridSize, selectedWords));
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
      // This is a placeholder for actual Solana wallet connection
      // We'll implement the real connection later
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-800">Solana Word Search Game</h1>
          {!isWalletConnected ? (
            <Button 
              onClick={connectWallet}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Wallet Connected</span>
            </div>
          )}
        </div>

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
  // Placeholder function for token reward calculation
  // This will be implemented with actual Solana token logic later
  return 100;
}