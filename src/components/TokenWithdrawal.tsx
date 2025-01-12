import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletStatus } from "./WalletStatus";
import { useToast } from "@/hooks/use-toast";
import { Coins, AlertTriangle } from "lucide-react";

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
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Coins className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold">{tokens} Tokens</p>
          </div>
        </div>
        <Button
          onClick={handleWithdrawClick}
          className="bg-primary hover:bg-primary/90"
          size="lg"
        >
          Withdraw Tokens
        </Button>
      </div>
      
      {showWalletConnect && (
        <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20">
          <div className="flex items-center gap-2 mb-4 text-amber-600">
            <AlertTriangle className="w-4 h-4" />
            <p className="text-sm">Connect your wallet to withdraw your tokens</p>
          </div>
          <WalletStatus />
        </div>
      )}
    </div>
  );
};