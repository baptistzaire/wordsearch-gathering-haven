import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Difficulty } from '@/types/game';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

const difficultyParams = {
  easy: { gridSize: 8, timeLimit: 180, rewardMultiplier: 1 },
  medium: { gridSize: 10, timeLimit: 240, rewardMultiplier: 1.5 },
  hard: { gridSize: 12, timeLimit: 300, rewardMultiplier: 2 },
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelect
}) => {
  return (
    <Select value={currentDifficulty} onValueChange={onSelect as (value: string) => void}>
      <SelectTrigger className="w-[180px] bg-white/50 backdrop-blur-sm">
        <SelectValue placeholder="Select difficulty" />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(difficultyParams) as Difficulty[]).map((difficulty) => (
          <SelectItem key={difficulty} value={difficulty}>
            <div className="space-y-1">
              <div className="font-medium capitalize">
                {difficulty}
              </div>
              <div className="text-xs text-muted-foreground">
                {difficultyParams[difficulty].gridSize}x{difficultyParams[difficulty].gridSize} grid
                • {difficultyParams[difficulty].timeLimit}s
                • {difficultyParams[difficulty].rewardMultiplier}x rewards
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};