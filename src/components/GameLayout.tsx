import React from 'react';
import { Sun, Settings } from 'lucide-react';
import { DifficultySelector } from './DifficultySelector';
import { WalletStatus } from './WalletStatus';
import { HighScores } from './HighScores';
import { GameBoard } from './GameBoard';

interface GameLayoutProps {
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50/50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="game-header">
          <button 
            onClick={startNewGame}
            className="text-lg font-semibold hover:text-primary transition-colors"
          >
            New game
          </button>
          
          <DifficultySelector 
            currentDifficulty={difficulty} 
            onSelect={setDifficulty} 
          />
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white rounded-full transition-colors">
              <Sun className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <WalletStatus />
        
        {highScores && <HighScores scores={highScores} />}
        
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};