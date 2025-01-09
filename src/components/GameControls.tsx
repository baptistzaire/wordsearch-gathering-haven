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