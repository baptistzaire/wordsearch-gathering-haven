import React from 'react';
import { WordGrid } from './WordGrid';
import { WordList } from './WordList';

interface GameBoardProps {
  grid: string[][];
  words: string[];
  foundWords: Set<string>;
  onWordFound: (word: string) => void;
  hintPosition: { row: number; col: number; } | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  words,
  foundWords,
  onWordFound,
  hintPosition
}) => {
  return (
    <div className="space-y-6">
      <WordGrid
        grid={grid}
        words={words}
        foundWords={foundWords}
        onWordFound={onWordFound}
        hintPosition={hintPosition}
      />
      <WordList words={words} foundWords={foundWords} />
    </div>
  );
};