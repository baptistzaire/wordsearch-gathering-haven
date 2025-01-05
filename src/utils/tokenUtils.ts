import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from "@solana/spl-token";

// Initialize connection to devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Game token details
export const GAME_TOKEN_DECIMALS = 6;

// Create a new token mint
export const createGameToken = async () => {
  try {
    // Generate a new wallet keypair for the mint authority
    const mintAuthority = Keypair.generate();

    // Request an airdrop of SOL to pay for the transaction
    const airdropSignature = await connection.requestAirdrop(
      mintAuthority.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);

    // Create the token mint
    const mint = await createMint(
      connection,
      mintAuthority,
      mintAuthority.publicKey,
      mintAuthority.publicKey,
      GAME_TOKEN_DECIMALS
    );

    console.log("Token mint created:", mint.toBase58());
    return { mint, mintAuthority };
  } catch (error) {
    console.error("Error creating game token:", error);
    throw error;
  }
};

// Send tokens to a winner
export const sendTokensToWinner = async (
  recipientPublicKey: PublicKey,
  amount: number,
  mint: PublicKey,
  mintAuthority: Keypair
) => {
  try {
    // Get or create the recipient's token account
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintAuthority,
      mint,
      recipientPublicKey
    );

    // Mint tokens to the recipient
    const mintTx = await mintTo(
      connection,
      mintAuthority,
      mint,
      recipientTokenAccount.address,
      mintAuthority,
      amount * Math.pow(10, GAME_TOKEN_DECIMALS)
    );

    console.log("Tokens sent to winner:", mintTx);
    return mintTx;
  } catch (error) {
    console.error("Error sending tokens to winner:", error);
    throw error;
  }
};