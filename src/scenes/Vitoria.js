import { GUIButton } from '../components/GUI/GUIButton';
import { GUIText } from '../components/GUI/GUIText';
import { RGB } from '../utils/RGB';
import { Scene } from './Scene';

export class VictoryScene {
  /**
   * @param {KaboomCtx} k
   * @param {number} level
   * @param {Scene[]} levelList
   */
  constructor(k, level, levelList) {
    this.context = k;

    this.level = level;
    this.levelList = levelList;
    this.setUpScene();
  }

  getCurrentLevel() {
    return this.levelList[this.level];
  }

  getNextLevel() {
    return this.levelList[this.level + 1];
  }

  setUpScene() {
    const scene = this.context.scene('youWin', () => {
      setBackground(RGB.fromHex('#8F6E51').getRGB());
      const title = new GUIText(
        this.context,
        0,
        100,
        width(),
        100,
        'Você coletou todas as cargas!',
        'black',
      )
        .setFontColor(RGB.create('white'))
        .setFontSize(50)
        .setAlign('center')
        .render();

      const restart = new GUIButton(
        this.context,
        200,
        300,
        width() - 400,
        60,
        'Tentar novamente',
        'black',
      )
        .setFontColor(RGB.create('white'))
        .setFontSize(30)
        .setAlign('center')
        .setOnClick(() => {
          go('restart');
        });

      restart.render();

      const backToMenu = new GUIButton(
        this.context,
        200,
        400,
        width() - 400,
        60,
        'Voltar ao menu',
        'black',
      )
        .setFontColor(RGB.create('white'))
        .setFontSize(30)
        .setAlign('center')
        .setOnClick(() => {
          this.level = 0;
          go('menu');
        });

      const next = new GUIButton(
        this.context,
        180,
        600,
        width() - 360,
        100,
        'Próxima missão >',
        '#4F0700',
      )
        .setFontColor(RGB.create('white'))
        .setFontSize(40)
        .setAlign('center')
        .setOnClick(() => {
          this.level++;
          go('next', { newLevel: this.level });
        });

      if (this.getNextLevel()) {
        backToMenu.render();

        next.render();
      } else {
        backToMenu
          .setColor('#4F0700')
          .setX(180)
          .setWidth(width() - 360)
          .setHeight(100)
          .setFontSize(40)
          .render();
      }
    });
  }

  start() {
    this.context.go('youWin');
  }
}
