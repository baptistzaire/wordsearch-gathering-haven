import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface WordGridProps {
  grid: string[][];
  words: string[];
  onWordFound: (word: string) => void;
  hintPosition: { row: number; col: number } | null;
}

export const WordGrid: React.FC<WordGridProps> = ({ grid, words, onWordFound, hintPosition }) => {
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [foundPaths, setFoundPaths] = useState<Set<string>>(new Set());

  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([[row, col]]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting) return;

    const lastCell = selectedCells[selectedCells.length - 1];
    if (isAdjacent(lastCell[0], lastCell[1], row, col)) {
      setSelectedCells([...selectedCells, [row, col]]);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    checkSelection();
  };

  const isAdjacent = (row1: number, col1: number, row2: number, col2: number) => {
    return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
  };

  const checkSelection = () => {
    const selectedWord = selectedCells
      .map(([row, col]) => grid[row][col])
      .join('');
    
    const reversedWord = selectedWord.split('').reverse().join('');
    
    if (words.includes(selectedWord) && !foundPaths.has(selectedWord)) {
      onWordFound(selectedWord);
      setFoundPaths(new Set([...foundPaths, selectedWord]));
    } else if (words.includes(reversedWord) && !foundPaths.has(reversedWord)) {
      onWordFound(reversedWord);
      setFoundPaths(new Set([...foundPaths, reversedWord]));
    }
    
    setSelectedCells([]);
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  const isCellFound = (row: number, col: number) => {
    return Array.from(foundPaths).some(word => {
      const path = word.split('').map((letter, index) => {
        const foundCell = selectedCells.find(([r, c]) => 
          grid[r][c] === letter && 
          !selectedCells.slice(0, index).some(([pr, pc]) => pr === r && pc === c)
        );
        return foundCell ? foundCell.join(',') : null;
      });
      return path.includes(`${row},${col}`);
    });
  };

  const isHintCell = (row: number, col: number) => {
    return hintPosition?.row === row && hintPosition?.col === col;
  };

  return (
    <div 
      className="grid gap-1 p-4 bg-card rounded-lg shadow-sm"
      style={{ 
        gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` 
      }}
      onMouseLeave={() => {
        setIsSelecting(false);
        setSelectedCells([]);
      }}
    >
      {grid.map((row, rowIndex) => (
        row.map((letter, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "letter-cell",
              isCellSelected(rowIndex, colIndex) && "selected",
              isCellFound(rowIndex, colIndex) && "found",
              isHintCell(rowIndex, colIndex) && "bg-primary/30"
            )}
            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
            onMouseUp={handleMouseUp}
          >
            {letter}
          </div>
        ))
      ))}
    </div>
  );
};