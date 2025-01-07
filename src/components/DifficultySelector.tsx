import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelect
}) => {
  return (
    <Select value={currentDifficulty} onValueChange={onSelect}>
      <SelectTrigger className="w-[180px] bg-white/50 backdrop-blur-sm">
        <SelectValue placeholder="Select difficulty" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="easy">Easy (8x8)</SelectItem>
        <SelectItem value="medium">Medium (10x10)</SelectItem>
        <SelectItem value="hard">Hard (12x12)</SelectItem>
      </SelectContent>
    </Select>
  );
};