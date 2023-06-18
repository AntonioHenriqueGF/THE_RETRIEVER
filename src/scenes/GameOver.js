import { GUIButton } from '../components/GUI/GUIButton';
import { GUIText } from '../components/GUI/GUIText';
import { RGB } from '../utils/RGB';

export class GameOverScene {
  constructor(k, level, levels) {
    this.context = k;
    this.level = level;
    this.levels = levels;
    this.setUpScene();
  }

  setUpScene() {
    this.context.scene('gameOver', () => {
      setBackground(RGB.fromHex('#580A00').getRGB());
      const title = new GUIText(
        this.context,
        0,
        100,
        width(),
        100,
        'Você morreu!',
        'black',
      )
        .setFontColor(RGB.create('white'))
        .setFontSize(60)
        .setAlign('center')
        .render();

      const start = new GUIButton(
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
          go('menu');
        });

      wait(0.7, () => {
        start.render();
        backToMenu.render();
      });
    });
  }

  start() {
    this.context.go('gameOver');
  }
}
