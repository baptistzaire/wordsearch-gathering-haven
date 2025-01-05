import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface GameHeaderProps {
  isWalletConnected: boolean;
  onConnectWallet: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  isWalletConnected, 
  onConnectWallet 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-purple-800">
        Solana Word Search Game
      </h1>
      {!isWalletConnected ? (
        <Button 
          onClick={onConnectWallet}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Wallet Connected</span>
        </div>
      )}
    </div>
  );
};