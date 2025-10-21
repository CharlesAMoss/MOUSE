import type { Token, TokenType } from './tokenTypes';

// Advanced tokenization utility: returns array of tokens with type
export function tokenize(text: string): Token[] {
  const regex = /([a-zA-Z']+|[0-9]+|[.,!?;:"()\[\]{}]|\s+|[^\w\s.,!?;:"()\[\]{}]+)/g;
  const matches = text.match(regex) || [];
  return matches.map((value) => {
    let type: TokenType;
    if (/^[a-zA-Z']+$/.test(value)) type = 'word';
    else if (/^[0-9]+$/.test(value)) type = 'number';
    else if (/^\s+$/.test(value)) type = 'whitespace';
    else if (/^[.,!?;:"()\[\]{}]$/.test(value)) type = 'punctuation';
    else type = 'special';
    return { value, type };
  });
}
