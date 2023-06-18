import { Line } from './Line';
import { Point2D } from './Point2D';

/**
 * Classe que representa um círculo
 * @extends Point2D
 */
export class Circle extends Point2D {
  /**
     * Cria um novo objeto Circle
     * @param {number} x Coordenada x do centro do círculo
     * @param {number} y Coordenada y do centro do círculo
     * @param {number} radius Raio do círculo
     */
  constructor (x, y, radius) {
    super(x, y);
    this.radius = radius;
  }

  /**
     * Retorna a área do círculo
     * @param {number} radius Raio do círculo
     * @returns {number} Área do círculo
     */
  static area (radius) {
    return Math.PI * radius ** 2;
  }

  /**
     * Retorna a área do círculo
     * @returns {number} Área do círculo
     */
  getArea () {
    return Circle.area(this.radius);
  }

  intersects (line) {
    Line.validate(line, 'Circle.intersects');
    const closestPoint = line.closestPointTo(this);
    return closestPoint.distanceTo(this) <= this.radius;
  }

  contains (point) {
    Point2D.validate(point, 'Circle.contains');
    return point.distanceTo(this) <= this.radius;
  }

  getDimensions () {
    return {
      x: this.radius * 2,
      y: this.radius * 2,
    };
  }
}
