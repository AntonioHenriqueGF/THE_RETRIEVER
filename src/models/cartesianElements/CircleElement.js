import { RGB } from '../../utils/RGB';
import { Circle } from '../../utils/cartesianClasses/Circle';

export class CircleElement extends Circle {
  /**
   * Cria um novo objeto CircleElement
   * @param {KaboomCtx} context
   * @param {number} x Coordenada x do centro do círculo
   * @param {number} y Coordenada y do centro do círculo
   * @param {number} radius Raio do círculo
   * @param {string | [number, number, number]} color Cor do círculo
   */
  constructor(context, x, y, radius, color) {
    super(x, y, radius);
    this.context = context;
    this.color = RGB.create(color);
  }

  render() {
    this.component = this.context.add([
      circle(this.radius),
      pos(this.x + this.radius, this.y),
      color(this.color.r, this.color.g, this.color.b),
      area(),
      anchor('center'),
    ]);
  }

  destroy() {
    destroy(this.component);
  }

  getId() {
    return this.id;
  }

  getElement() {
    return this.component;
  }

  getPosition() {
    return this.component.pos;
  }

  setPosition(x, y) {
    this.component.pos.x = x + this.radius;
    this.component.pos.y = y;
  }

  move(x, y) {
    this.component.move(x, y);
  }

  moveTo(x, y) {
    this.component.moveTo(x, y);
    this.x = this.component.pos.x;
    this.y = this.component.pos.y;
  }
}
