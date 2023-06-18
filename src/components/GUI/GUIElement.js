import { RGB } from '../../utils/RGB';

export class GUIElement {
  /**
   *
   * @param {KaboomCtx} k
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} color
   */
  constructor(k, x, y, width, height, color) {
    this.id = Math.random().toString(36).substring(7);
    this.context = k;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    /**
     * @type {RGB}
     */
    this.color = RGB.create(color);
  }

  render() {
    this.entity = this.context.add([
      rect(this.width, this.height),
      pos(this.x, this.y),
      color(this.color.r, this.color.g, this.color.b),
      { tag: this.id },
    ]);
  }

  get() {
    return [
      rect(this.width, this.height),
      pos(this.x, this.y),
      color(this.color.r, this.color.g, this.color.b),
      { tag: this.id },
    ];
  }

  destroy() {
    this.entity.destroy();
  }
}
