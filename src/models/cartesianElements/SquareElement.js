import { RGB } from '../../utils/RGB';
import { Point2D } from '../../utils/cartesianClasses/Point2D';
import { Square } from '../../utils/cartesianClasses/Square';

export class SquareElement extends Square {
  /**
   * Cria um novo objeto SquareElement
   * @param {KaboomCtx} context
   * @param {number} x Coordenada x da origem do quadrado
   * @param {number} y Coordenada y da origem do quadrado
   * @param {number} side Tamanho do lado do quadrado
   * @param {string} color Cor do quadrado
   */
  constructor(context, x, y, side, color) {
    super();
    this.defineFromOrigin(new Point2D(x, y), side, side);
    this.x = x;
    this.y = y;
    this.context = context;
    this.color = RGB.create(color);
  }

  /**
   * @param {import('kaboom').GameObj | undefined} gameObj
   */
  render(gameObj = undefined) {
    const dimentions = this.getDimensions();
    this.component =
      gameObj ??
      this.context.add([
        rect(dimentions.x, dimentions.y),
        pos(this.x, this.y),
        color(this.color.r, this.color.g, this.color.b),
        area(),
        body(),
        state('move', ['attack', 'move']),
      ]);
  }

  destroy() {
    this.component.destroy();
  }

  getId() {
    return this.id;
  }

  getElement() {
    return this.component;
  }

  /**
   * @returns {Vec2}
   */
  getVec2Position() {
    return this.component.pos;
  }

  // getCenter () {
  //   const dimentions = this.getDimensions();
  //   return new Point2D(this.x + dimentions.x / 2, this.y + dimentions.y / 2);
  // }

  setPosition(x, y) {
    this.component.pos.x = x;
    this.component.pos.y = y;
  }

  move(x, y) {
    this.component.move(x, y);
    this.x = this.component.pos.x;
    this.y = this.component.pos.y;
    super.move(new Point2D(this.x, this.y));
  }

  moveTo(x, y) {
    this.component.moveTo(x, y);
    this.x = this.component.pos.x;
    this.y = this.component.pos.y;
  }
}
