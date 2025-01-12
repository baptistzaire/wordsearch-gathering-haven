import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WordGridProps {
  grid: string[][];
  words: string[];
  foundWords: Set<string>;
  onWordFound: (word: string) => void;
  hintPosition?: { row: number; col: number } | null;
}

export const WordGrid: React.FC<WordGridProps> = ({ 
  grid, 
  words, 
  foundWords,
  onWordFound, 
  hintPosition 
}) => {
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
    <motion.div 
      className="game-grid grid bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl"
      style={{ 
        gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` 
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onMouseLeave={() => {
        setIsSelecting(false);
        setSelectedCells([]);
      }}
    >
      {grid.map((row, rowIndex) => (
        row.map((letter, colIndex) => (
          <motion.div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "letter-cell",
              "hover:shadow-md hover:scale-105 transition-all duration-200",
              isCellSelected(rowIndex, colIndex) && "selected bg-primary/20 scale-110",
              isCellFound(rowIndex, colIndex) && "found bg-primary/40",
              isHintCell(rowIndex, colIndex) && "animate-letter-highlight"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
            onMouseUp={handleMouseUp}
          >
            {letter}
          </motion.div>
        ))
      ))}
    </motion.div>
  );
};