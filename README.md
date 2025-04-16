# BaseDrop

> Launch airdrops, rewards, or tokens — straight to wallets on Base.

BaseDrop helps creators and builders distribute value to their communities. Whether you're rewarding loyalty or launching a new token — BaseDrop makes it simple, gas-efficient, and beautiful.

## Features
- Upload CSV of wallet addresses
- Send ERC20 tokens or ERC721 NFTs
- Add a custom message stored on IPFS
- Deploys to Base Mainnet
- Built with gas-efficiency and UX in mind

## Tech Stack
- **Frontend**: React (Next.js) + Tailwind CSS + Wagmi
- **Smart Contracts**: Solidity + OpenZeppelin
- **Blockchain**: Base Mainnet / Testnet
- **Storage**: IPFS via Web3.Storage

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MetaMask or other web3 wallet

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/basedrop.git
cd basedrop
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your private keys and API keys (see `.env.example`)

4. Compile smart contracts
```bash
npm run contract:compile
```

5. Deploy smart contracts to Base
```bash
npm run contract:deploy
```

6. Start the development server
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use BaseDrop

1. **Connect Wallet**: Connect your wallet to the app
2. **Upload CSV**: Upload a CSV file with recipient wallet addresses (one per line)
3. **Select Token**: Choose between ERC20 or ERC721 and enter the token details
4. **Add Message**: Write a message that will be stored on IPFS and linked to your airdrop
5. **Approve & Drop**: Approve the token spending and execute the airdrop

## Smart Contracts

The main contract is `BaseDropAirdrop.sol` which provides three core functions:
- `airdropERC20`: Sends the same amount of ERC20 tokens to multiple recipients
- `airdropERC721`: Sends specific NFTs to multiple recipients
- `batchAirdropERC20`: Sends different amounts of ERC20 tokens to multiple recipients

## License
MIT
