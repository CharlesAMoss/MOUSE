import { tokenize } from './tokenize';
import { detectSentences, groupBySentence } from './sentenceBoundary';

describe('Sentence boundary detection', () => {
  it('should detect sentence boundaries on period', () => {
    const text = 'Hello world. This is a test.';
    const tokens = tokenize(text);
    const tokensWithSentences = detectSentences(tokens);
    const sentences = groupBySentence(tokensWithSentences);
    
    expect(sentences.length).toBe(2);
    expect(sentences[0].text).toContain('Hello world.');
    expect(sentences[1].text).toContain('This is a test.');
  });

  it('should detect sentence boundaries on exclamation and question marks', () => {
    const text = 'Hello! Are you there?';
    const tokens = tokenize(text);
    const tokensWithSentences = detectSentences(tokens);
    const sentences = groupBySentence(tokensWithSentences);
    
    expect(sentences.length).toBe(2);
  });

  it('should handle single sentence', () => {
    const text = 'Just one sentence';
    const tokens = tokenize(text);
    const tokensWithSentences = detectSentences(tokens);
    const sentences = groupBySentence(tokensWithSentences);
    
    expect(sentences.length).toBe(1);
  });
});
