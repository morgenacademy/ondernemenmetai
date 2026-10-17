import { expect, it } from 'vitest';
import { STATE_LABEL } from './labels';

it('een afgerond level heet "Afgerond", niet "Af"', () => {
  expect(STATE_LABEL).toEqual({ done: 'Afgerond', active: 'Nu bezig', locked: 'Op slot' });
});
