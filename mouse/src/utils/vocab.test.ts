import Vocab from './vocab';

describe('Vocab encoder', () => {
  it('should encode with initial mapping', () => {
    const initial = { Hello: 1, ',': 2, ' ': 3, world: 4 };
    const v = new Vocab(initial);
    const input = ['Hello', ',', ' ', 'world'];
    expect(v.encodeTokens(input)).toEqual([1, 2, 3, 4]);
  });

  it('should add new tokens dynamically', () => {
    const v = new Vocab({});
    const ids1 = v.encodeTokens(['a', 'b']);
    const ids2 = v.encodeTokens(['b', 'c']);
    expect(ids1.length).toBe(2);
    expect(ids2.length).toBe(2);
    // b should keep same id when encoded again
    expect(ids2[0]).toBe(ids1[1]);
  });

  it('should decode ids', () => {
    const initial = { x: 5, y: 6 };
    const v = new Vocab(initial);
    expect(v.decodeIds([5, 6])).toEqual(['x', 'y']);
  });
});
