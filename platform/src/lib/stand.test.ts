import { describe, expect, it } from 'vitest';
import { kiesStand } from './stand';

describe('kiesStand', () => {
  it('kiest de demo op /demo, /demo/ en alles daaronder', () => {
    expect(kiesStand('/demo', undefined)).toBe('demo');
    expect(kiesStand('/demo/', undefined)).toBe('demo');
    expect(kiesStand('/demo/level-1', undefined)).toBe('demo');
  });

  it('kiest de demo op / als VITE_STAND=demo (deploy preview)', () => {
    expect(kiesStand('/', 'demo')).toBe('demo');
  });

  it('kiest de echte stand op / zonder variabele', () => {
    expect(kiesStand('/', undefined)).toBe('echt');
  });

  it('kiest de echte stand voor een pad dat alleen op /demo lijkt', () => {
    expect(kiesStand('/demonstratie', undefined)).toBe('echt');
  });
});
