import { tokenize } from './tokenize';
import Vocab from './vocab';

describe('Vocab integration (encode/decode)', () => {
  it('should map tokens to ids and back (round-trip)', () => {
    const text = 'Hello, world! 42';
    const tokens = tokenize(text);
    const v = new Vocab({});
    const ids = v.encodeTokens(tokens);
    const decoded = v.decodeIds(ids);
    // strip <UNK> placeholders and compare joined strings of values
    const joinedOriginal = tokens.map(t => t.value).join('');
    const joinedDecoded = decoded.join('');
    expect(joinedDecoded).toBe(joinedOriginal);
  });

  it('should handle OOV tokens with dynamic addition', () => {
    const v = new Vocab({ foo: 1 });
    const ids1 = v.encodeTokens(['foo']);
    const ids2 = v.encodeTokens(['bar']);
    expect(ids1[0]).toBe(1);
    expect(ids2[0]).toBeGreaterThan(1);
  });
});
