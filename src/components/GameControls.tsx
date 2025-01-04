import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GameControlsProps {
  difficulty: string;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onNewGame: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  onDifficultyChange,
  onNewGame,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      <Select
        value={difficulty}
        onValueChange={(value: 'easy' | 'medium' | 'hard') => onDifficultyChange(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={onNewGame}
        className="min-w-[120px]"
      >
        New Game
      </Button>
    </div>
  );
};