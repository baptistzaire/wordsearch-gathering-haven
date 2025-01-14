# Solana Word Search Game 🎮

A decentralized word search puzzle game built on the Solana blockchain, combining classic word search gameplay with Play-to-Earn mechanics.

![Game Preview](public/og-image.png)

## 🎯 Features

### Core Gameplay
- **Interactive Word Search**: Click-and-drag word selection with visual feedback
- **Multiple Difficulty Levels**: 
  - Easy (8x8 grid, 180s, 1x rewards)
  - Medium (10x10 grid, 240s, 1.5x rewards)
  - Hard (12x12 grid, 300s, 2x rewards)
- **Game Modes**:
  - Classic: Find words at your own pace
  - Blitz: Grid regenerates every 2 seconds
  - Semantic Shift: Words change meaning as you find them

### Blockchain Integration
- **Solana Wallet Integration**: Secure wallet connection for token transactions
- **Play-to-Earn**: Earn tokens by completing puzzles
- **Token Rewards**: Bonus rewards for:
  - Completing puzzles without hints
  - Finding secret words
  - Achieving high scores

### User Features
- **Google Authentication**: Secure sign-in with Google
- **High Score Tracking**: Global leaderboard system
- **Social Sharing**: Share achievements on social media
- **Progress Tracking**: Track your gaming statistics
- **Token Withdrawal**: Transfer earned tokens to your Solana wallet

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm installed
- A modern web browser
- A Solana wallet (e.g., Phantom)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
```

2. Install dependencies:
```bash
cd solana-word-search
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser

## 🛠 Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - shadcn/ui
  - Lucide Icons

- **Blockchain**:
  - Solana Web3.js
  - Wallet Adapter

- **Backend**:
  - Supabase
  - Google Authentication

- **State Management**:
  - TanStack Query (React Query)

## 🎮 How to Play

1. **Sign In**: Use Google authentication to create an account
2. **Connect Wallet**: Link your Solana wallet to receive rewards
3. **Choose Mode**: Select from Classic, Blitz, or Semantic Shift
4. **Select Difficulty**: Pick Easy, Medium, or Hard
5. **Find Words**: 
   - Click and drag to select words
   - Use hints if needed (affects rewards)
   - Complete the puzzle before time runs out
6. **Earn Rewards**: 
   - Tokens awarded based on:
     - Difficulty level
     - Time remaining
     - Hints used
     - Secret words found

## 🏆 Scoring System

- Base points per word: 100
- Difficulty multipliers:
  - Easy: 1x
  - Medium: 1.5x
  - Hard: 2x
- Time bonus: Up to 50% bonus for quick completion
- Hint penalty: -25 points per hint used

## 🔒 Security Features

- Secure wallet integration
- Google OAuth authentication
- Protected API endpoints
- Rate limiting on token withdrawals
- Smart contract security measures

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Solana](https://solana.com/) - Blockchain platform
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Supabase](https://supabase.com/) - Backend services
- [Vite](https://vitejs.dev/) - Frontend tooling

## 📞 Support

For support, please join our [Discord community](https://discord.gg/your-discord) or open an issue in the repository.

## 🚧 Roadmap

- [ ] Mobile responsive design
- [ ] Multiplayer mode
- [ ] Additional language support
- [ ] Advanced difficulty levels
- [ ] NFT integration
- [ ] Tournament system

## ⚠️ Known Issues

Please check the [Issues](https://github.com/your-username/your-repo/issues) page for current known issues and their status.