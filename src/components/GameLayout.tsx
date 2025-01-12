import React from 'react';
import { Sun, Settings, Trophy, HelpCircle } from 'lucide-react';
import { DifficultySelector } from './DifficultySelector';
import { WalletStatus } from './WalletStatus';
import { HighScores } from './HighScores';
import { GameBoard } from './GameBoard';
import { Difficulty } from '@/types/game';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50/30 to-pink-50/20 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <header className="game-header backdrop-blur-md bg-white/30 border border-white/50 shadow-lg">
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
                    <Sun className="w-5 h-5 text-purple-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Game settings</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How to play</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center gap-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-purple-800">High Score: {highScores?.[0]?.score || 0}</span>
          </div>
        </header>

        <WalletStatus />
        
        {highScores && <HighScores scores={highScores} />}
        
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};