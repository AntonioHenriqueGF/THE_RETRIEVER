import { GUIText } from './GUIText';

export class GUIButton extends GUIText {
  /**
   *
   * @param {KaboomCtx} k
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} text
   * @param {string} color
   */
  constructor(k, x, y, width, height, text = '', color = 'white') {
    super(k, x, y, width, height, text, color);

    /**
     * @type {() => void}
     */
    this.onClick = () => {
      debug.log('clicked');
    };
  }

  /**
   *
   * @param {() => void} callback
   * @returns
   */
  setOnClick(callback) {
    this.onClick = callback;
    return this;
  }

  getTextPosition() {
    const alignedTextPos = { x: 0, y: this.height / 2 };
    switch (this.align) {
      case 'left':
        alignedTextPos.x = 0;
        break;
      case 'center':
        alignedTextPos.x = this.width / 2;
        break;
      case 'right':
        alignedTextPos.x = this.width;
        break;
      default:
        alignedTextPos.x = 0;
        break;
    }
    return alignedTextPos;
  }

  render() {
    this.entity = this.context.add([
      rect(this.width, this.height),
      pos(this.x + this.width / 2, this.y + this.height / 2),
      color(this.color.r, this.color.g, this.color.b),
      anchor('center'),
      fixed(),
      area(),
      scale(1),
      outline(4),
    ]);

    const textPosition = this.getTextPosition();

    // add a child object that displays the text
    this.entity.add([
      text(this.text, {
        size: this.fontSize,
        width: this.width,
        align: this.align,
      }),
      anchor(this.align),
      color(this.fontColor.r, this.fontColor.g, this.fontColor.b),
      fixed(),
      pos(0, 0),
    ]);

    this.entity.onHoverUpdate(() => {
      this.entity.scale = vec2(1.04);
    });

    this.entity.onHoverEnd(() => {
      this.entity.scale = vec2(1);
    });

    this.entity.onClick(this.onClick);
  }
}
