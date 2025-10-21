import { tokenize } from './tokenize';
import type { Token } from './tokenTypes';

describe('tokenize (advanced)', () => {
  it('should identify words, numbers, punctuation, whitespace, and special characters', () => {
    const input = "Hello, world! 123\t$";
    const expected: Token[] = [
      { value: 'Hello', type: 'word' },
      { value: ',', type: 'punctuation' },
      { value: ' ', type: 'whitespace' },
      { value: 'world', type: 'word' },
      { value: '!', type: 'punctuation' },
      { value: ' ', type: 'whitespace' },
      { value: '123', type: 'number' },
      { value: '\t', type: 'whitespace' },
      { value: '$', type: 'special' },
    ];
    expect(tokenize(input)).toEqual(expected);
  });

  it('should return empty array for empty string', () => {
    expect(tokenize('')).toEqual([]);
  });

  it('should handle only numbers', () => {
    const expected: Token[] = [{ value: '42', type: 'number' }];
    expect(tokenize('42')).toEqual(expected);
  });

  it('should handle only whitespace', () => {
    const expected: Token[] = [{ value: '   ', type: 'whitespace' }];
    expect(tokenize('   ')).toEqual(expected);
  });

  it('should handle only punctuation', () => {
    const expected: Token[] = [{ value: '!', type: 'punctuation' }];
    expect(tokenize('!')).toEqual(expected);
  });
});
