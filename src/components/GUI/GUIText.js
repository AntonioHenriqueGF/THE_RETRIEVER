import { RGB } from '../../utils/RGB';
import { GUIElement } from './GUIElement';

export class GUIText extends GUIElement {
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
    super(k, x, y, width, height, color);

    /**
     * @type {string}
     */
    this.text = text;

    /**
     * @type {number}
     */
    this.fontSize = 12;

    /**
     * @type {"center" | "left" | "right"}
     */
    this.align = 'left';

    /**
     * @type {RGB}
     */
    this.fontColor = RGB.create('black');
  }

  /**
   *
   * @param {number} fontSize
   * @returns
   */
  setText(text = '') {
    this.text = text;
    return this;
  }

  /**
   *
   * @param {"center" | "left" | "right"} align
   * @returns
   */
  setAlign(align) {
    this.align = align;
    return this;
  }

  /**
   *
   * @param {RGB} color
   * @returns
   */
  setFontColor(color) {
    this.fontColor = color;
    return this;
  }

  /**
   *
   * @param {number} fontSize
   * @returns
   */
  setFontSize(fontSize) {
    this.fontSize = fontSize;
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
    const alignedTextPos = this.getTextPosition();
    this.entity = this.context.add([
      rect(this.width, this.height),
      pos(this.x, this.y),
      fixed(),
      color(this.color.r, this.color.g, this.color.b),
      { tag: this.id },
    ]);
    this.textEntity = this.entity.add([
      text(this.text, {
        size: this.fontSize,
        width: this.width,
        align: this.align,
      }),
      anchor(this.align),
      fixed(),
      pos(alignedTextPos.x, alignedTextPos.y),
      color(this.fontColor.r, this.fontColor.g, this.fontColor.b),
      { tag: this.id + '_text' },
    ]);
  }
}
