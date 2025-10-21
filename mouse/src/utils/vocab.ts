import type { Token } from './tokenTypes';

// Simple in-repo vocabulary encoder
export class Vocab {
  private tokenToId: Map<string, number>;
  private idToToken: Map<number, string>;
  private nextId: number;
  private unkId: number = 0;

  constructor(initial?: Record<string, number>) {
    this.tokenToId = new Map();
    this.idToToken = new Map();
    // reserve 0 for <UNK>
    this.nextId = 1;
    if (initial) {
      const entries = Object.entries(initial).sort((a, b) => a[1] - b[1]);
      // populate maps and set nextId to max+1
      for (const [token, id] of entries) {
        this.tokenToId.set(token, id);
        this.idToToken.set(id, token);
        if (id >= this.nextId) this.nextId = id + 1;
      }
    }
  }

  getId(token: string): number {
    const id = this.tokenToId.get(token);
    if (id !== undefined) return id;
    return this.unkId;
  }

  has(token: string): boolean {
    return this.tokenToId.has(token);
  }

  add(token: string): number {
    if (this.tokenToId.has(token)) return this.tokenToId.get(token)!;
    const id = this.nextId++;
    this.tokenToId.set(token, id);
    this.idToToken.set(id, token);
    return id;
  }

  encodeTokens(tokens: Array<Token | string>): number[] {
    return tokens.map((t) => {
      const value = typeof t === 'string' ? t : (t as Token).value;
      const id = this.tokenToId.get(value);
      if (id !== undefined) return id;
      // new token -> add it dynamically and return its id
      return this.add(value);
    });
  }

  decodeIds(ids: number[]): string[] {
    return ids.map((id) => this.idToToken.get(id) || '<UNK>');
  }

  toObject(): Record<string, number> {
    const obj: Record<string, number> = {};
    for (const [k, v] of this.tokenToId.entries()) obj[k] = v;
    return obj;
  }
}

export default Vocab;
