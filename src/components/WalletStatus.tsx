import React from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";

export const WalletStatus: React.FC = () => {
  const { connected, wallet } = useWallet();
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
      <WalletMultiButton className="bg-primary hover:bg-primary/90" />
    </div>
  );
};