import React from 'react';
import { GameBoard } from '../GameBoard';

interface GameplayAreaProps {
  grid: string[][];
  words: string[];
  foundWords: Set<string>;
  onWordFound: (word: string) => void;
  hintPosition: { row: number; col: number } | null;
}

export const GameplayArea: React.FC<GameplayAreaProps> = ({
  grid,
  words,
  foundWords,
  onWordFound,
  hintPosition,
}) => {
  return (
    <GameBoard
      grid={grid}
      words={words}
      foundWords={foundWords}
      onWordFound={onWordFound}
      hintPosition={hintPosition}
    />
  );
};