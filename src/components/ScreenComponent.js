import { RGB } from '../utils/RGB';

export class ScreenComponent {
  constructor(k, x, y, width, height, color) {
    this.id = Math.random().toString(36).substring(7);
    this.context = k;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = RGB.create(color);
  }

  render() {
    this.entity = this.context.add([
      rect(this.width, this.height),
      pos(this.x, this.y),
      color(this.color.r, this.color.g, this.color.b),
      anchor('center'),
      agent({ speed: 200, allowDiagonals: true }),
      { tag: this.id },
    ]);
  }

  destroy() {
    this.entity.destroy();
  }

  getId() {
    return this.id;
  }

  getElement() {
    return this.entity;
  }

  /**
   *
   * @returns {Point2D}
   */
  getPosition() {
    return this.entity.pos;
  }

  setPosition(x, y) {
    this.entity.pos.x = x;
    this.entity.pos.y = y;
  }

  move(x, y) {
    this.entity.move(x, y);
  }
}
