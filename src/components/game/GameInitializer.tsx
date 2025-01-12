import React from 'react';
import { Button } from '../ui/button';
import { PlayCircle } from 'lucide-react';
import { GameModeSelector } from '../GameModeSelector';
import { DifficultySelector } from '../DifficultySelector';
import { GameMode } from '@/types/gameMode';
import { Difficulty } from '@/types/game';
import { useToast } from "@/hooks/use-toast";

interface GameInitializerProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  startNewGame: () => void;
  connected: boolean;
}

export const GameInitializer: React.FC<GameInitializerProps> = ({
  gameMode,
  setGameMode,
  difficulty,
  setDifficulty,
  startNewGame,
  connected,
}) => {
  const { toast } = useToast();

  const handleStartGame = () => {
    if (!connected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to start the game.",
        variant: "destructive",
      });
      return;
    }
    startNewGame();
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      <h2 className="text-2xl font-semibold text-purple-800">
        Welcome to Word Search Game
      </h2>
      <p className="text-gray-600 text-center max-w-md">
        Connect your wallet and select difficulty to start playing.
        Find all the words to earn tokens!
      </p>
      <div className="flex flex-col gap-4 items-center">
        <GameModeSelector
          currentMode={gameMode}
          onSelect={setGameMode}
        />
        <DifficultySelector
          currentDifficulty={difficulty}
          onSelect={setDifficulty}
        />
        <Button
          onClick={handleStartGame}
          disabled={!connected}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          <PlayCircle className="w-5 h-5 mr-2" />
          Start Game
        </Button>
      </div>
    </div>
  );
};