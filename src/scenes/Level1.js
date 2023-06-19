import { LVL_ONE_MAP } from '../utils/Maps';
import { Scene } from './Scene';

export class LevelOneScene extends Scene {
  constructor(k) {
    super(k, 'level1', LVL_ONE_MAP);
  }
}
