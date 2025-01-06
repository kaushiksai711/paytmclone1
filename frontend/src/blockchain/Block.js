// export class Block {
//   constructor(timestamp, transactions, previousHash = '') {
//     this.timestamp = timestamp;
//     this.transactions = transactions;
//     this.previousHash = previousHash;
//     this.hash = this.calculateHash();
//     this.nonce = 0;
//   }

//   calculateHash() {
//     let str = this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce;
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//       const char = str.charCodeAt(i);
//       hash = ((hash << 5) - hash) + char;
//       hash = hash & hash;
//     }
//     return hash.toString(16);
//   }

//   async mineBlock(difficulty) {
//     const target = Array(difficulty).join('0');
    
//     return new Promise((resolve) => {
//       const worker = new Worker(
//         URL.createObjectURL(
//           new Blob([`
//             onmessage = function(e) {
//               const { hash, nonce, difficulty } = e.data;
//               let currentHash = hash;
//               let currentNonce = nonce;
              
//               while (currentHash.substring(0, difficulty) !== '${target}') {
//                 currentNonce++;
//                 // Simple hash calculation
//                 let str = currentHash + currentNonce;
//                 let newHash = 0;
//                 for (let i = 0; i < str.length; i++) {
//                   const char = str.charCodeAt(i);
//                   newHash = ((newHash << 5) - newHash) + char;
//                   newHash = newHash & newHash;
//                 }
//                 currentHash = newHash.toString(16);
//               }
              
//               postMessage({ hash: currentHash, nonce: currentNonce });
//             }
//           `], { type: 'application/javascript' })
//         )
//       );

//       worker.onmessage = (e) => {
//         const { hash, nonce } = e.data;
//         this.hash = hash;
//         this.nonce = nonce;
//         worker.terminate();
//         resolve();
//       };

//       worker.postMessage({ 
//         hash: this.hash, 
//         nonce: this.nonce, 
//         difficulty 
//       });
//     });
//   }
// }

export class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  // Simplified hash function that's less CPU intensive
  calculateHash() {
    const data = this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce;
    let hash = 0;
    
    // Simple and fast hashing algorithm
    for (let i = 0; i < data.length; i++) {
      hash = (hash << 5) - hash + data.charCodeAt(i);
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(16);
  }

  // Simplified mining that's less resource-intensive
  mineBlock(difficulty) {
    const target = '0'.repeat(difficulty);
    
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      if (this.nonce > 500) break; // Prevent excessive mining
      this.hash = this.calculateHash();
    }
  }
}
