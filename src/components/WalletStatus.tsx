import React from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wallet } from 'lucide-react';

export const WalletStatus: React.FC = () => {
  const { connected, connecting, wallet } = useWallet();
  const { toast } = useToast();

  React.useEffect(() => {
    if (connected) {
      toast({
        title: "Wallet Connected",
        description: `Connected to ${wallet?.adapter.name}`,
      });
    }
  }, [connected, wallet?.adapter.name]);

  return (
    <div className="flex justify-end">
      <WalletMultiButton 
        className={`flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors ${
          connecting ? 'opacity-70' : ''
        }`}
      >
        {connecting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        {connecting ? 'Connecting...' : connected ? 'Connected' : 'Connect Wallet'}
      </WalletMultiButton>
    </div>
  );
};