import { Point2D } from './Point2D.js';

export class Line {
  /**
   * @param {Point2D | null} p1 Ponto de origem da linha
   * @param {Point2D | null} p2 Ponto de destino da linha
   */
  constructor(p1 = null, p2 = null) {
    if (p1 && p2) this.connectPoints(p1, p2);
  }

  getP1() {
    return this.p1;
  }

  getP2() {
    return this.p2;
  }

  setP1(p1) {
    Point2D.validate(p1, 'Line.setP1');
    this.p1 = p1;
  }

  setP2(p2) {
    Point2D.validate(p2, 'Line.setP2');
    this.p2 = p2;
  }

  /**
   * Valida se o parâmetro é uma instância de Line
   * @param {Line} line
   * @param {string} className
   */
  static validate(line, className = 'Line') {
    if (!(line instanceof Line))
      throw new Error(
        `Invalid parameter for ${
          className ?? 'Line'
        }: line must be an instance of Line.`,
      );
  }

  /**
   * Calcula a distância entre dois pontos
   * @param {Point2D} p1
   * @param {Point2D} p2
   * @returns {number} Distância entre os dois pontos
   */
  static distance(p1, p2) {
    Point2D.validate(p1, 'Line.distance');
    Point2D.validate(p2, 'Line.distance');
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calcula a distância entre dois pontos em Vec2
   * @param {Vec2} p1
   * @param {Vec2} p2
   * @returns {number} Distância entre os dois pontos
   */
  static vec2Distance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Define uma linha a partir do X e Y de dois pontos
   * @param {number} x1 Ponto de origem X da linha
   * @param {number} y1 Ponto de origem Y da linha
   * @param {number | undefined} x2 Ponto de destino X da linha
   * @param {number | undefined} y2 Ponto de destino Y da linha
   */
  defineLine(x1, y1, x2 = x1, y2 = y1) {
    this.connectPoints(new Point2D(x1, y1), new Point2D(x2, y2));
  }

  /**
   * Cria uma linha a partir de dois pontos
   * @param {Point2D} p1 Ponto de origem da linha
   * @param {Point2D} p2 Ponto de destino da linha
   */
  connectPoints(p1, p2) {
    Point2D.validate(p1, 'Line.connectPoints');
    Point2D.validate(p2, 'Line.connectPoints');
    /**
     * @type {Point2D}
     */
    this.p1 = p1;

    /**
     * @type {Point2D}
     */
    this.p2 = p2;
  }

  /**
   * Calcula a interseção entre duas linhas e retorna o ponto de interseção ou false
   * @param {Line} line1 Primeira linha a ser comparada
   * @param {Line} line2 Segunda linha a ser comparada
   * @returns {Point2D | false} Ponto de interseção ou false
   */
  static intersection(line1, line2) {
    Line.validate(line1);
    Line.validate(line2);

    const x1 = line1.p1.x;
    const y1 = line1.p1.y;
    const x2 = line1.p2.x;
    const y2 = line1.p2.y;

    const x3 = line2.p1.x;
    const y3 = line2.p1.y;
    const x4 = line2.p2.x;
    const y4 = line2.p2.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den === 0) {
      return false;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return new Point2D(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
    } else {
      return false;
    }
  }

  /**
   * Calcula a interseção entre duas linhas e retorna o ponto de interseção ou false
   * @param {Line} line Linha a ser comparada
   * @returns {Point2D | false} Ponto de interseção ou false
   */
  intersects(line) {
    return Line.intersection(this, line);
  }

  /**
   * Retorna o ponto mais próximo entre o ponto passado e a linha representada pela instância da classe `Line`.
   * @param {Point2D} point Ponto a ser comparado
   * @returns {Point2D} Ponto mais próximo entre o ponto passado e a linha representada pela instância da classe `Line`.
   */
  closestPointTo(point) {
    // Calcula o vetor que representa a linha
    const lineVector = this.p2.subtract(this.p1);

    // Calcula o vetor que representa a linha do ponto ao primeiro ponto da linha
    const pointVector = point.subtract(this.p1);

    // Calcula a projeção do vetor do ponto na linha
    const projection = pointVector.dot(lineVector) / lineVector.dot(lineVector);

    // Se a projeção for menor que zero, o ponto mais próximo é o primeiro ponto da linha
    if (projection < 0) {
      return this.p1;
    }

    // Se a projeção for maior que um, o ponto mais próximo é o segundo ponto da linha
    if (projection > 1) {
      return this.p2;
    }

    // Calcula o ponto mais próximo na linha
    return this.p1.add(lineVector.multiply(projection));
  }

  /**
   * Define o ponto de origem da linha
   * @param {number} x Posição X do ponto de origem
   * @param {number} y Posição Y do ponto de origem
   * @returns {this}
   */
  setOrigin(x, y) {
    this.p1 = new Point2D(x, y);
    return this;
  }

  /**
   * Define o ponto de destino da linha
   * @param {number} x Posição X do ponto de destino
   * @param {number} y Posição Y do ponto de destino
   * @returns {this}
   */
  setDestination(x, y) {
    this.p2 = new Point2D(x, y);
    return this;
  }

  /**
   * Retorna o ponto central da linha
   * @returns {Point2D}
   */
  getCenter() {
    const x = (this.p1.x + this.p2.x) / 2;
    const y = (this.p1.y + this.p2.y) / 2;
    return new Point2D(x, y);
  }
}
