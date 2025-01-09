import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GameMode, gameModeParams } from '@/types/gameMode';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onSelect: (mode: GameMode) => void;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  currentMode,
  onSelect
}) => {
  return (
    <Select value={currentMode} onValueChange={onSelect as (value: string) => void}>
      <SelectTrigger className="w-[180px] bg-white/50 backdrop-blur-sm">
        <SelectValue placeholder="Select game mode" />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(gameModeParams) as GameMode[]).map((mode) => (
          <SelectItem key={mode} value={mode}>
            <div className="space-y-1">
              <div className="font-medium">
                {gameModeParams[mode].name}
              </div>
              <div className="text-xs text-muted-foreground">
                {gameModeParams[mode].description}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};