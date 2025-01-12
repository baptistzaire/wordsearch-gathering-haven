import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletStatus } from "./WalletStatus";
import { useToast } from "@/hooks/use-toast";
import { Coins, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-full">
            <Coins className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-purple-600 font-medium">Available Balance</p>
            <p className="text-2xl font-bold text-purple-800">{tokens} Tokens</p>
          </div>
        </div>
        <Button
          onClick={handleWithdrawClick}
          className="bg-purple-600 hover:bg-purple-700 gap-2"
          size="lg"
        >
          Withdraw
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      
      {showWalletConnect && (
        <motion.div 
          className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-sm text-gray-600 mb-4">
            Connect your wallet to withdraw your tokens
          </p>
          <WalletStatus />
        </motion.div>
      )}
    </motion.div>
  );
};