import * as CryptoJS from "crypto-js";

class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(0, "121314342", "", "hello", 123456);

let blockchain: Block[] = [genesisBlock];

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): void => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimestamp: number = getNewTimeStamp();
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimestamp,
    data
  );
  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    data,
    newTimestamp
  );
  if (isValidBlock(newBlock, previousBlock)) {
    blockchain.push(newBlock);
  }
};

const isValidBlock = (candiateBlock: Block, previousBlock: Block): boolean => {
  if (candiateBlock.index - 1 !== getLatestBlock().index) {
    return false;
  } else if (candiateBlock.previousHash !== getLatestBlock().hash) {
    return false;
  } else if (
    candiateBlock.hash !==
    Block.calculateBlockHash(
      candiateBlock.index,
      getLatestBlock().hash,
      candiateBlock.timestamp,
      candiateBlock.data
    )
  ) {
    return false;
  } else {
    return true;
  }
};

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");
console.log(blockchain);
