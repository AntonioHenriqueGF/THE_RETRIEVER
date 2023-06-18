import { RGB } from '../../utils/RGB';
import { Line } from '../../utils/cartesianClasses/Line';
import { Point2D } from '../../utils/cartesianClasses/Point2D';

export class LineElement extends Line {
  /**
   * Cria um novo objeto LineElement
   * @param {KaboomCtx} context
   * @param {number} x1 Coordenada x do primeiro ponto da linha
   * @param {number} y1 Coordenada y do primeiro ponto da linha
   * @param {number} x2 Coordenada x do segundo ponto da linha
   * @param {number} y2 Coordenada y do segundo ponto da linha
   * @param {string | [number, number, number]} color Cor da linha
   */
  constructor(context, x1, y1, x2, y2, color) {
    super(new Point2D(x1, y1), new Point2D(x2, y2));
    this.context = context;
    this.color = RGB.create(color);
  }

  render() {
    // this.component = this.context.add([
    //   this.context.line(this.p1, this.p2),
    //   this.context.color(this.color.r, this.color.g, this.color.b),
    // ]);
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

  getPosition() {
    return this.component.pos;
  }

  setPosition(x, y) {
    this.setP1(x, y);
    this.component.pos.x = p1.x;
    this.component.pos.y = p1.y;
  }

  setDestination(x, y) {
    this.setP2(x, y);
    this.component.pos.x = p2.x;
    this.component.pos.y = p2.y;
  }

  setPoint1(p1) {
    Point2D.validate(p1, 'LineElement.setP1');
    this.setP1(x, y);
  }

  setPoint2(p2) {
    Point2D.validate(p2, 'LineElement.setP2');
    this.setP2(x, y);
  }

  update() {
    this.component.p1 = vec2(this.x1, this.y1);
    this.component.p2 = vec2(this.x2, this.y2);
  }

  move(x, y) {
    this.component.move(x, y);
  }
}
