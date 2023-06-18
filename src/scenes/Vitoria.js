import { GUIButton } from '../components/GUI/GUIButton';
import { GUIText } from '../components/GUI/GUIText';
import { RGB } from '../utils/RGB';

export class VictoryScene {
  constructor(k, level, levels) {
    this.context = k;
    this.level = level;
    this.levels = levels;
    this.setUpScene();
  }

  getCurrentLevel() {
    return this.levels[this.level];
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

      backToMenu.render();

      const next = new GUIButton(
        this.context,
        180,
        600,
        width() - 360,
        100,
        this.levels[this.level + 1]
          ? 'Próxima missão >'
          : 'Voltar à primeira missão',
        '#4F0700',
      )
        .setFontColor(RGB.create('white'))
        .setFontSize(40)
        .setAlign('center')
        .setOnClick(() => {
          go('next');
        });

      next.render();
    });
  }

  start() {
    this.context.go('youWin');
  }
}
