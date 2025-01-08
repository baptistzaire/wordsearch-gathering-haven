import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Coins, Clock, AlertTriangle } from "lucide-react";
import { Difficulty } from '@/types/game';
import { SocialShare } from './SocialShare';

interface WinModalProps {
  onClose: () => void;
  onNewGame: () => void;
  hintsUsed: number;
  isWalletConnected: boolean;
  tokensEarned: number;
  difficulty: Difficulty;
  wordsFound: number;
  totalWords: number;
  timeLeft: number;
}

export const WinModal: React.FC<WinModalProps> = ({
  onClose,
  onNewGame,
  hintsUsed,
  isWalletConnected,
  tokensEarned,
  difficulty,
  wordsFound,
  totalWords,
  timeLeft,
}) => {
  const difficultyMultipliers = {
    easy: '1x',
    medium: '1.5x',
    hard: '2x'
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md"
        aria-describedby="win-modal-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-2xl font-bold">
            <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
            {wordsFound === totalWords ? 'Congratulations!' : 'Time\'s Up!'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4" id="win-modal-description">
          <p className="text-lg">
            {wordsFound === totalWords 
              ? 'You found all the words!' 
              : `You found ${wordsFound} out of ${totalWords} words`}
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Time Remaining: {formatTime(timeLeft)}</span>
          </div>
          
          {isWalletConnected ? (
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-center text-purple-800 mb-4">
                  <Coins className="w-6 h-6 mr-2" />
                  <span className="text-xl font-bold">{tokensEarned} Tokens Earned!</span>
                </div>
                
                <div className="space-y-2 text-sm text-purple-700">
                  <div className="flex items-center justify-between">
                    <span>Difficulty Bonus:</span>
                    <span className="font-medium">{difficultyMultipliers[difficulty]}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Words Found:</span>
                    <span className="font-medium">{wordsFound}/{totalWords}</span>
                  </div>
                  
                  {hintsUsed > 0 && (
                    <div className="flex items-center justify-between text-amber-600">
                      <span>Hint Penalty:</span>
                      <span className="font-medium">-{hintsUsed * 10}%</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Transaction fees will apply when claiming rewards</span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Connect your wallet to earn tokens for completing puzzles!
              </p>
            </div>
          )}

          <SocialShare
            difficulty={difficulty}
            wordsFound={wordsFound}
            totalWords={totalWords}
            tokensEarned={tokensEarned}
          />
        </div>
        
        <DialogFooter className="sm:justify-center gap-2">
          <Button
            onClick={() => {
              onClose();
              onNewGame();
            }}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Play Again
          </Button>
          {isWalletConnected && (
            <Button
              variant="outline"
              onClick={onClose}
              className="border-purple-200 hover:bg-purple-50"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};