import { GUIButton } from '../components/GUI/GUIButton';
import { GUIText } from '../components/GUI/GUIText';
import { RGB } from '../utils/RGB';

export class MenuScene {
  constructor(k) {
    this.context = k;
    this.setUpScene();
  }

  setUpScene() {
    this.context.scene('menu', () => {
      setBackground(RGB.fromHex('#755A43').getRGB());
      const title = new GUIText(
        this.context,
        0,
        100,
        width(),
        100,
        'The Retriever',
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
        'Começar missão',
        'black',
      )
        .setFontColor(RGB.create('white'))
        .setFontSize(30)
        .setAlign('center')
        .setOnClick(() => {
          go('level1');
        });

      start.render();
    });
  }

  start() {
    go('menu');
  }
}
