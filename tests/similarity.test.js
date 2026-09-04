import { dotProduct, magnitude, cosineSimilarity } from '../src/core/similarity.js';

test('dotProduct calculates correctly for known vectors', () => {
  const result = dotProduct([1, 2, 3], [4, 5, 6]);
  expect(result).toBe(32);
});

test('magnitude calculates correctly for a known vector', () => {
  const result = magnitude([3, 4]);
  expect(result).toBe(5);
});

test('cosineSimilarity returns close to 1 for identical vectors', () => {
  const result = cosineSimilarity([1, 2, 3], [1, 2, 3]);
  expect(result).toBeCloseTo(1);
});

test('cosineSimilarity returns 0 for orthogonal vectors', () => {
  const result = cosineSimilarity([1, 0], [0, 1]);
  expect(result).toBeCloseTo(0);
});

test('dotProduct throws an error when vectors have different lengths', () => {
  expect(() => dotProduct([1, 2, 3], [1, 2])).toThrow();
});