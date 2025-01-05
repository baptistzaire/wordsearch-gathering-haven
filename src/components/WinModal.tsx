import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Coins } from "lucide-react";

interface WinModalProps {
  onClose: () => void;
  onNewGame: () => void;
  hintsUsed: number;
  isWalletConnected: boolean;
  tokensEarned: number;
}

export const WinModal: React.FC<WinModalProps> = ({
  onClose,
  onNewGame,
  hintsUsed,
  isWalletConnected,
  tokensEarned,
}) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-2xl font-bold">
            <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
            Congratulations!
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p className="text-lg">You found all the words!</p>
          <p className="text-sm text-gray-600">Hints used: {hintsUsed}</p>
          
          {isWalletConnected ? (
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-center text-purple-800">
                <Coins className="w-6 h-6 mr-2" />
                <span className="text-xl font-bold">{tokensEarned} Tokens Earned!</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Connect your wallet to earn tokens for completing puzzles!
            </p>
          )}
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            onClick={() => {
              onClose();
              onNewGame();
            }}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};