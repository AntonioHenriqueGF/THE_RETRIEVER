import { Line } from './Line';
import { Point2D } from './Point2D';

export class Triangle {
  /**
     * Cria um triângulo a partir de três pontos
     * @param {Point2D | null} p1
     * @param {Point2D | null} p2
     * @param {Point2D | null} p3
     */
  constructor (p1 = null, p2 = null, p3 = null) {
    this.defineTriangle(p1, p2, p3);
  }

  /**
   * Calcula a área de um triângulo a partir de três pontos
   * @param {Point2D} p1
   * @param {Point2D} p2
   * @param {Point2D} p3
   * @returns {number} Área do triângulo
   * @throws {Error} Se algum dos pontos não for uma instância de Point2D
   */
  static area (p1, p2, p3) {
    Point2D.validate(p1, 'Triangle.area');
    Point2D.validate(p2, 'Triangle.area');
    Point2D.validate(p3, 'Triangle.area');
    const a = p1.distanceTo(p2);
    const b = p2.distanceTo(p3);
    const c = p3.distanceTo(p1);
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }

  /**
   * Calcula o perímetro de um triângulo a partir de três pontos
   * @param {Point2D} p1
   * @param {Point2D} p2
   * @param {Point2D} p3
   * @returns {number} Perímetro do triângulo
   */
  static perimeter (p1, p2, p3) {
    Point2D.validate(p1, 'Triangle.perimeter');
    Point2D.validate(p2, 'Triangle.perimeter');
    Point2D.validate(p3, 'Triangle.perimeter');
    return Line.distance(new Line(p1, p2)) + Line.distance(new Line(p2, p3)) + Line.distance(new Line(p3, p1));
  }

  /**
     * Define um triângulo a partir de três pontos
     * @param {Point2D | null} p1
     * @param {Point2D | null} p2
     * @param {Point2D | null} p3
     * @returns {void}
     * @throws {Error} Se algum dos pontos não for uma instância de Point2D
     */
  defineTriangle (p1, p2, p3) {
    Point2D.validate(p1, 'Triangle.defineTriangle');
    Point2D.validate(p2, 'Triangle.defineTriangle');
    Point2D.validate(p3, 'Triangle.defineTriangle');
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    if (p1 && p2 && p3) this.defineLines(p1, p2, p3);
  }

  /**
   * Define as linhas do triaângulo a partir de três pontos
   * @param {Point2D} p1
   * @param {Point2D} p2
   * @param {Point2D} p3
   * @returns {void}
   */
  defineLines (p1, p2, p3) {
    this.l1 = new Line(p1, p2);
    this.l2 = new Line(p2, p3);
    this.l3 = new Line(p3, p4);
  }

  /**
     * Calcula a área do triângulo
     * @returns {number}
     */
  getArea () {
    return Triangle.area(this.p1, this.p2, this.p3);
  }

  /**
     * Calcula o perímetro do triângulo
     * @returns {number}
     */
  getPerimeter () {
    return Line.distance(this.l1) + Line.distance(this.l2) + Line.distance(this.l3);
  }

  /**
     * Verifica se um ponto está dentro do triângulo
     * @param {Point2D} point
     * @returns {boolean}
     */
  isPointInside (point) {
    Point2D.validate(point, 'Triangle.isPointInside');
    const a = Triangle.area(this.p1, this.p2, this.p3);
    const a1 = Triangle.area(point, this.p2, this.p3);
    const a2 = Triangle.area(this.p1, point, this.p3);
    const a3 = Triangle.area(this.p1, this.p2, point);
    return a === a1 + a2 + a3;
  }

  getDimensions () {
    Point2D.validate(this.p1, 'Triangle.getDimensions');
    Point2D.validate(this.p2, 'Triangle.getDimensions');
    Point2D.validate(this.p3, 'Triangle.getDimensions');

    const points = [
      this.p1,
      this.p2,
      this.p3,
    ];

    const xs = points.map(point => point.x);
    const ys = points.map(point => point.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: maxX - minX,
      y: maxY - minY,
    };
  }
}
