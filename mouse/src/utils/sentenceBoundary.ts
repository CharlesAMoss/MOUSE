import type { Token } from './tokenTypes';

export interface TokenWithSentence extends Token {
  sentenceId?: number;
}

export interface Sentence {
  id: number;
  tokens: Token[];
  text: string;
}

// Detect sentence boundaries based on punctuation followed by whitespace/capitalization
export function detectSentences(tokens: Token[]): TokenWithSentence[] {
  const tokensWithSentences: TokenWithSentence[] = [];
  let currentSentenceId = 0;
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Assign current sentence ID to this token
    tokensWithSentences.push({ ...token, sentenceId: currentSentenceId });
    
    // Check if this is a sentence-ending punctuation (., !, ?)
    const isSentenceEnd = 
      token.type === 'punctuation' && 
      (token.value === '.' || token.value === '!' || token.value === '?');
    
    // Check if next token starts a new sentence (skip whitespace, check for capital or end)
    if (isSentenceEnd) {
      // Look ahead past whitespace to see if next word starts with capital or if we're at the end
      let j = i + 1;
      let whitespaceTokens = 0;
      while (j < tokens.length && tokens[j].type === 'whitespace') {
        whitespaceTokens++;
        j++;
      }
      
      // If there's a next word token and it starts with capital, or we're at the end, increment sentence
      if (j >= tokens.length || (tokens[j].type === 'word' && /^[A-Z]/.test(tokens[j].value))) {
        currentSentenceId++;
      }
    }
  }
  
  return tokensWithSentences;
}

// Group tokens into sentences
export function groupBySentence(tokensWithSentences: TokenWithSentence[]): Sentence[] {
  const sentences: Sentence[] = [];
  let currentSentence: Token[] = [];
  let currentId = 0;
  
  for (const token of tokensWithSentences) {
    if (token.sentenceId !== currentId) {
      // Save previous sentence
      if (currentSentence.length > 0) {
        sentences.push({
          id: currentId,
          tokens: currentSentence,
          text: currentSentence.map(t => t.value).join(''),
        });
      }
      currentSentence = [];
      currentId = token.sentenceId ?? currentId + 1;
    }
    currentSentence.push(token);
  }
  
  // Save last sentence
  if (currentSentence.length > 0) {
    sentences.push({
      id: currentId,
      tokens: currentSentence,
      text: currentSentence.map(t => t.value).join(''),
    });
  }
  
  return sentences;
}
