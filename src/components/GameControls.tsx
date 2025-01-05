import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Difficulty = 'easy' | 'medium' | 'hard';

interface GameControlsProps {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  onHint: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  setDifficulty,
  onNewGame,
  onHint,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      <Select
        value={difficulty}
        onValueChange={(value: Difficulty) => setDifficulty(value)}
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

      <Button
        variant="outline"
        onClick={onHint}
        className="min-w-[120px]"
      >
        Hint
      </Button>
    </div>
  );
};