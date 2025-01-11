import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletStatus } from "./WalletStatus";
import { useToast } from "@/hooks/use-toast";
import { Coins } from "lucide-react";

interface TokenWithdrawalProps {
  tokens: number;
  onWithdraw: () => void;
}

export const TokenWithdrawal: React.FC<TokenWithdrawalProps> = ({
  tokens,
  onWithdraw
}) => {
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const { toast } = useToast();

  const handleWithdrawClick = () => {
    if (tokens <= 0) {
      toast({
        title: "No tokens to withdraw",
        description: "Play games to earn tokens first!",
        variant: "destructive",
      });
      return;
    }
    setShowWalletConnect(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-purple-600" />
          <span className="text-lg font-medium">{tokens} Tokens Available</span>
        </div>
        <Button
          onClick={handleWithdrawClick}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Withdraw Tokens
        </Button>
      </div>
      
      {showWalletConnect && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-4">
            Connect your wallet to withdraw your tokens
          </p>
          <WalletStatus />
        </div>
      )}
    </div>
  );
};