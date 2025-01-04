import React, { useState, useEffect } from 'react';
import { WordGrid } from './WordGrid';
import { WordList } from './WordList';
import { GameControls } from './GameControls';
import { WinModal } from './WinModal';
import { useToast } from "@/hooks/use-toast";

type Difficulty = 'easy' | 'medium' | 'hard';

export const WordSearchGame = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [showWinModal, setShowWinModal] = useState(false);
  const { toast } = useToast();

  const generateGrid = (difficulty: Difficulty) => {
    const sizes = { easy: 8, medium: 12, hard: 16 };
    const size = sizes[difficulty];
    const wordList = generateWordList(difficulty);
    const newGrid = Array(size).fill(null).map(() => 
      Array(size).fill('').map(() => 
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      )
    );
    setGrid(newGrid);
    setWords(wordList);
    setFoundWords(new Set());
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

  useEffect(() => {
    generateGrid(difficulty);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold tracking-tight">Word Search</h1>
      
      <GameControls 
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        onNewGame={handleNewGame}
      />
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <WordGrid 
          grid={grid}
          words={words}
          onWordFound={handleWordFound}
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