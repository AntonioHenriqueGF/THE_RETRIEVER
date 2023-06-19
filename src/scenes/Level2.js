import { LVL_TWO_MAP } from '../utils/Maps';
import { Scene } from './Scene';

export class LevelTwoScene extends Scene {
  constructor(k) {
    super(k, 'level2', LVL_TWO_MAP);
  }
}
