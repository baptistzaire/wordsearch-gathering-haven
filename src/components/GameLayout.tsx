import React from 'react';
import { Sun, Settings } from 'lucide-react';
import { DifficultySelector } from './DifficultySelector';
import { WalletStatus } from './WalletStatus';
import { HighScores } from './HighScores';
import { GameBoard } from './GameBoard';
import { Difficulty } from '@/types/game';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GameLayoutProps {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  startNewGame: () => void;
  highScores?: any[];
  children: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  difficulty,
  setDifficulty,
  startNewGame,
  highScores,
  children
}) => {
  return (
    <div className="min-h-screen bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-blue-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="game-header">
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-white rounded-full transition-colors">
                    <Sun className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-white rounded-full transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Game settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <WalletStatus />
        
        {highScores && <HighScores scores={highScores} />}
        
        <div className="space-y-6 animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
};