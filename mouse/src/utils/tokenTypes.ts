export type TokenType = 'word' | 'number' | 'punctuation' | 'whitespace' | 'special';

export interface Token {
  value: string;
  type: TokenType;
}
