import { Line } from './Line.js';
import { Point2D } from './Point2D.js';
import { Triangle } from './Triangle.js';

export class Square {
  /**
   * Cria um quadrado a partir de quatro pontos
   * @param {Point2D | null} p1
   * @param {Point2D | null} p2
   * @param {Point2D | null} p3
   * @param {Point2D | null} p4
   */
  constructor(p1 = null, p2 = null, p3 = null, p4 = null) {
    if (p1 && p2 && p3 && p4) {
      this.defineSquare(p1, p2, p3, p4);
    }
  }

  /**
   * Define um quadrado a partir de quatro pontos
   * @param {Point2D | null} p1
   * @param {Point2D | null} p2
   * @param {Point2D | null} p3
   * @param {Point2D | null} p4
   * @returns {void}
   * @throws {Error} Se algum dos pontos não for uma instância de Point2D
   */
  defineSquare(p1, p2, p3, p4) {
    Point2D.validate(p1, 'Square.defineSquare');
    Point2D.validate(p2, 'Square.defineSquare');
    Point2D.validate(p3, 'Square.defineSquare');
    Point2D.validate(p4, 'Square.defineSquare');
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
    if (p1 && p2 && p3 && p4) this.defineLines(p1, p2, p3, p4);
  }

  /**
   * Define um quadrado a partir de um ponto de origem e de um tamanho
   * @param {Point2D} origin - Ponto de origem do quadrado
   * @param {number} width - Largura do quadrado
   * @param {number} height - Altura do quadrado
   * @returns {void}
   * @throws {Error} Se o ponto de origem não for uma instância de Point2D
   */
  defineFromOrigin(origin, width = 100, height = 100) {
    Point2D.validate(origin, 'Square.defineFromOrigin');
    const p1 = origin;
    const p2 = new Point2D(origin.x + width, origin.y);
    const p3 = new Point2D(origin.x + width, origin.y + height);
    const p4 = new Point2D(origin.x, origin.y + height);
    this.defineSquare(p1, p2, p3, p4);
  }

  /**
   * Define as linhas do quadrado
   * @param {Point2D} p1
   * @param {Point2D} p2
   * @param {Point2D} p3
   * @param {Point2D} p4
   * @returns {void}
   */
  defineLines(p1, p2, p3, p4) {
    this.l1 = new Line(p1, p2);
    this.l2 = new Line(p2, p3);
    this.l3 = new Line(p3, p4);
    this.l4 = new Line(p4, p1);
  }

  /**
   * Verifica se um ponto está dentro do quadrado
   * @param {Point2D} p - Ponto a ser verificado
   * @returns {boolean} True se o ponto está dentro do quadrado, false caso contrário
   */
  isPointInside(p) {
    const t1 = Triangle.area(p, this.p1, this.p2);
    const t2 = Triangle.area(p, this.p2, this.p3);
    const t3 = Triangle.area(p, this.p3, this.p4);
    const t4 = Triangle.area(p, this.p4, this.p1);
    return (
      (t1 >= 0 && t2 >= 0 && t3 >= 0 && t4 >= 0) ||
      (t1 <= 0 && t2 <= 0 && t3 <= 0 && t4 <= 0)
    );
  }

  /**
   * Conta quantas linhas do quadrado interceptam a linha dada
   * @param {Line} line - Linha a ser verificada
   * @returns {number} Número de linhas do quadrado que interceptam a linha dada
   */
  countIntersectingLines(line) {
    let count = 0;
    if (this.l1.intersects(line)) count++;
    if (this.l2.intersects(line)) count++;
    if (this.l3.intersects(line)) count++;
    if (this.l4.intersects(line)) count++;
    return count;
  }

  /**
   * Verifica se o quadrado intercepta a linha dada
   * @param {Line} line - Linha a ser verificada
   * @returns {Point2D | null} Ponto de intersecção, ou null caso não haja intersecção
   */
  intersectsLine(line) {
    Line.validate(line, 'Square.intersectsLine');
    return (
      this.l1.intersects(line) ??
      this.l2.intersects(line) ??
      this.l3.intersects(line) ??
      this.l4.intersects(line) ??
      null
    );
  }

  /**
   * Verifica se o quadrado intercede com outro quadrado dado
   * @param {Square} other - Outro quadrado
   * @returns {boolean} True se os dois quadrados se intersectam, false caso contrário
   */
  intersects(other) {
    return (
      this.countIntersectingLines(other.l1) +
        this.countIntersectingLines(other.l2) +
        this.countIntersectingLines(other.l3) +
        this.countIntersectingLines(other.l4) >
      0
    );
  }

  getDimensions() {
    Point2D.validate(this.p1, 'Square.getDimensions');
    Point2D.validate(this.p2, 'Square.getDimensions');
    Point2D.validate(this.p3, 'Square.getDimensions');
    Point2D.validate(this.p4, 'Square.getDimensions');

    const points = [this.p1, this.p2, this.p3, this.p4];

    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: maxX - minX,
      y: maxY - minY,
    };
  }

  /**
   * @returns {Point2D}
   */
  getCenter() {
    Point2D.validate(this.p1, 'Square.getCenter');
    Point2D.validate(this.p2, 'Square.getCenter');
    Point2D.validate(this.p3, 'Square.getCenter');
    Point2D.validate(this.p4, 'Square.getCenter');

    const points = [this.p1, this.p2, this.p3, this.p4];

    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return new Point2D((maxX + minX) / 2, (maxY + minY) / 2);
  }

  /**
   * @param {Point2D} origin
   * @returns {void}
   */
  move(origin) {
    const difference = this.p1.subtract(origin);
    this.p1 = this.p1.subtract(difference);
    this.p2 = this.p2.subtract(difference);
    this.p3 = this.p3.subtract(difference);
    this.p4 = this.p4.subtract(difference);
  }
}
