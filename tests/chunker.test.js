import { hashContent, chunkLines } from '../src/core/chunker.js';

test('hashContent produces the same hash for identical input', () => {
    const hash1 = hashContent('hello world');
    const hash2 = hashContent('hello world');
    expect(hash1).toBe(hash2);
});

test('hashContent produces different hash for different input', () => {
    const hash1 = hashContent('hello world');
    const hash2 = hashContent('Iam Ironman');
    expect(hash1).not.toBe(hash2);
});

test('chunkLines produces a single chunk when no function boundaries exist', () => {
  const lines = ['const x = 1;', 'const y = 2;'];
  const chunks = chunkLines(lines);
  expect(chunks.length).toBe(1);
  expect(chunks[0].lines).toEqual(lines);
});