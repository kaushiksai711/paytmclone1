
import { Block } from './Block';

export class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 1; // Reduced difficulty
    this.pendingTransactions = [];
    this.miningReward = 100;
    this.maxTransactionsPerBlock = 5; // Limit transactions per block
  }

  createGenesisBlock() {
    return new Block(Date.now(), [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Memory-efficient mining process
  minePendingTransactions(miningRewardAddress) {
    // Take only a limited number of transactions
    const transactionsToProcess = this.pendingTransactions.slice(0, this.maxTransactionsPerBlock);
    
    const block = new Block(
      Date.now(),
      transactionsToProcess,
      this.getLatestBlock().hash
    );

    block.mineBlock(this.difficulty);
    this.chain.push(block);

    // Keep remaining transactions for next block
    this.pendingTransactions = this.pendingTransactions.slice(this.maxTransactionsPerBlock);
    this.pendingTransactions.push({
      senderUpiId: null,
      receiverUpiId: miningRewardAddress,
      amount: this.miningReward,
    });

    // Maintain chain size
    if (this.chain.length > 1000) {
      this.chain = this.chain.slice(-1000);
    }

    return block;
  }

  addTransaction(transaction) {
    if (!transaction.senderUpiId || !transaction.receiverUpiId) {
      throw new Error('Transaction must include sender and receiver address');
    }
    this.pendingTransactions.push(transaction);

    // Clean up old pending transactions
    if (this.pendingTransactions.length > 100) {
      this.pendingTransactions = this.pendingTransactions.slice(-100);
    }
  }

  // Simplified chain validation
  isChainValid() {
    // Only check last 10 blocks for performance
    const recentBlocks = this.chain.slice(-10);
    
    for (let i = 1; i < recentBlocks.length; i++) {
      const currentBlock = recentBlocks[i];
      const previousBlock = recentBlocks[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}