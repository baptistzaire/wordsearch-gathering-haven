import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { Difficulty } from '@/types/game';
import { SocialShare } from './SocialShare';
import { RewardDetails } from './RewardDetails';

interface WinModalProps {
  onClose: () => void;
  onNewGame: () => void;
  hintsUsed: number;
  isWalletConnected: boolean;
  tokensEarned: number;
  difficulty: Difficulty;
  wordsFound: number;
  totalWords: number;
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
}) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md"
        aria-describedby="win-modal-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-2xl font-bold">
            <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
            Congratulations!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4" id="win-modal-description">
          <p className="text-lg">You found all the words!</p>
          
          <RewardDetails
            isWalletConnected={isWalletConnected}
            tokensEarned={tokensEarned}
            difficulty={difficulty}
            wordsFound={wordsFound}
            totalWords={totalWords}
            hintsUsed={hintsUsed}
          />

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