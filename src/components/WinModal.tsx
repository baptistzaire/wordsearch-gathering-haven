import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  foundWords: number;
  totalWords: number;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  onClose,
  onNewGame,
  foundWords,
  totalWords,
}) => {
  const handleNewGame = () => {
    onNewGame();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Congratulations!
          </DialogTitle>
          <DialogDescription className="text-center pt-4">
            You found all {foundWords} words!
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button onClick={handleNewGame} className="min-w-[120px]">
            New Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};