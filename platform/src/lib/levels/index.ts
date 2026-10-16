import { level0 } from './level0';
import { level1 } from './level1';
import { level2 } from './level2';
import { level3, level4, level5, level6 } from './lockedLevels';
import type { LevelDef } from './types';

export const LEVELS: LevelDef[] = [level0, level1, level2, level3, level4, level5, level6];
