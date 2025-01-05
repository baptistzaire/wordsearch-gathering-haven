import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { WordGrid } from './WordGrid';
import { WordList } from './WordList';
import { GameControls } from './GameControls';
import { WinModal } from './WinModal';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LightbulbIcon } from "lucide-react";

type Difficulty = 'easy' | 'medium' | 'hard';
type Direction = 'horizontal' | 'vertical' | 'diagonal';

export const WordSearchGame: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [showWinModal, setShowWinModal] = useState(false);
  const [hintPosition, setHintPosition] = useState<{ row: number; col: number } | null>(null);
  const { toast } = useToast();

  const placeWord = (grid: string[][], word: string, size: number): boolean => {
    const directions: Direction[] = ['horizontal', 'vertical', 'diagonal'];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    
    // Try 100 times to place the word
    for (let attempts = 0; attempts < 100; attempts++) {
      let row = Math.floor(Math.random() * size);
      let col = Math.floor(Math.random() * size);
      
      // Check if word fits in chosen direction
      if (canPlaceWord(grid, word, row, col, direction, size)) {
        placeWordInGrid(grid, word, row, col, direction);
        return true;
      }
    }
    return false;
  };

  const canPlaceWord = (
    grid: string[][],
    word: string,
    startRow: number,
    startCol: number,
    direction: Direction,
    size: number
  ): boolean => {
    const directionVectors = {
      horizontal: { dx: 1, dy: 0 },
      vertical: { dx: 0, dy: 1 },
      diagonal: { dx: 1, dy: 1 }
    };
    
    const { dx, dy } = directionVectors[direction];
    
    // Check if word fits within grid bounds
    if (
      startRow + word.length * dy > size ||
      startCol + word.length * dx > size
    ) {
      return false;
    }
    
    // Check if path is clear or matches existing letters
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * dy;
      const col = startCol + i * dx;
      const currentCell = grid[row][col];
      
      if (currentCell !== '' && currentCell !== word[i]) {
        return false;
      }
    }
    
    return true;
  };

  const placeWordInGrid = (
    grid: string[][],
    word: string,
    startRow: number,
    startCol: number,
    direction: Direction
  ) => {
    const directionVectors = {
      horizontal: { dx: 1, dy: 0 },
      vertical: { dx: 0, dy: 1 },
      diagonal: { dx: 1, dy: 1 }
    };
    
    const { dx, dy } = directionVectors[direction];
    
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * dy;
      const col = startCol + i * dx;
      grid[row][col] = word[i];
    }
  };

  const generateGrid = (difficulty: Difficulty) => {
    const sizes = { easy: 8, medium: 12, hard: 16 };
    const size = sizes[difficulty];
    const wordList = generateWordList(difficulty);
    
    // Initialize empty grid
    const newGrid = Array(size).fill(null).map(() => 
      Array(size).fill('')
    );
    
    // Place each word
    const placedWords = wordList.filter(word => placeWord(newGrid, word, size));
    
    // Fill remaining empty cells with random letters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
    
    setGrid(newGrid);
    setWords(placedWords);
    setFoundWords(new Set());
    setHintPosition(null);
  };

  const generateWordList = (difficulty: Difficulty): string[] => {
    const wordsByDifficulty = {
      easy: ['CAT', 'DOG', 'RAT', 'BAT'],
      medium: ['MOUSE', 'HORSE', 'TIGER', 'SNAKE', 'EAGLE'],
      hard: ['ELEPHANT', 'GIRAFFE', 'PENGUIN', 'DOLPHIN', 'OCTOPUS', 'KANGAROO']
    };
    return wordsByDifficulty[difficulty];
  };

  const handleWordFound = (word: string) => {
    const newFoundWords = new Set(foundWords);
    newFoundWords.add(word);
    setFoundWords(newFoundWords);
    setHintPosition(null);
    
    toast({
      title: "Word Found!",
      description: `You found "${word}"!`,
      duration: 2000,
    });

    if (newFoundWords.size === words.length) {
      setShowWinModal(true);
    }
  };

  const handleNewGame = () => {
    generateGrid(difficulty);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    generateGrid(newDifficulty);
  };

  const getHint = () => {
    // Find a word that hasn't been found yet
    const remainingWords = words.filter(word => !foundWords.has(word));
    if (remainingWords.length === 0) return;

    // Select a random word from remaining words
    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    
    // Select a random letter position from the word
    const letterPosition = Math.floor(Math.random() * randomWord.length);
    const targetLetter = randomWord[letterPosition];

    // Find this letter in the grid
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === targetLetter) {
          setHintPosition({ row: i, col: j });
          toast({
            title: "Hint",
            description: `Look for the letter "${targetLetter}"!`,
            duration: 3000,
          });
          return;
        }
      }
    }
  };

  useEffect(() => {
    generateGrid(difficulty);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold tracking-tight">Word Search</h1>
      
      <div className="flex flex-wrap items-center justify-center gap-4">
        <GameControls 
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onNewGame={handleNewGame}
        />
        <Button
          variant="outline"
          onClick={getHint}
          className="flex items-center gap-2"
        >
          <LightbulbIcon className="w-4 h-4" />
          Hint
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <WordGrid 
          grid={grid}
          words={words}
          onWordFound={handleWordFound}
          hintPosition={hintPosition}
        />
        
        <WordList 
          words={words}
          foundWords={foundWords}
        />
      </div>

      <WinModal 
        isOpen={showWinModal}
        onClose={() => setShowWinModal(false)}
        onNewGame={handleNewGame}
        foundWords={foundWords.size}
        totalWords={words.length}
      />
    </div>
  );
};
