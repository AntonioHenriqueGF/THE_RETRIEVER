export class Point2D {
  /**
     * Cria um ponto 2D
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */
  constructor (x, y) {
    if (typeof x !== 'number' || typeof y !== 'number') throw new Error('Invalid parameters for Point2D: x and y must be numbers.');
    this.x = x;
    this.y = y;
  }

  /**
   * Valida se o ponto é uma instância de Point2D
   * @param {Point2D} point Ponto a ser validado
   * @param {string | undefined} className Nome da classe que está validando o ponto. Usado para exibir mensagem de erro. (default: 'Point2D')
   * @returns {void}
   * @throws {Error} Se o ponto não for uma instância de Point2D
   */
  static validate (point, className = 'Point2D') {
    if (!(point instanceof Point2D)) throw new Error(`Invalid parameter for ${className ?? 'Point2D'}: point must be an instance of Point2D.`);
  }

  /**
   * Retorna um novo ponto com a soma das coordenadas desse ponto com outro ponto
   * @param {Point2D} point Ponto a ser somado
   * @returns {Point2D} Novo ponto com as coordenadas somadas
   */
  add (point) {
    Point2D.validate(point, 'add');
    return new Point2D(this.x + point.x, this.y + point.y);
  }

  /**
   * Retorna um novo ponto com a subtração das coordenadas desse ponto com outro ponto
   * @param {Point2D} point Ponto a ser subtraído
   * @returns {Point2D} Novo ponto com as coordenadas subtraídas
   */
  subtract (point) {
    Point2D.validate(point, 'subtract');
    return new Point2D(this.x - point.x, this.y - point.y);
  }

  /**
   * Retorna o produto escalar deste ponto com outro ponto
   * @param {Point2D} point Ponto a ser calculado o produto escalar
   * @returns {number} Produto escalar entre os pontos
   */
  dot (point) {
    Point2D.validate(point, 'dot');
    return this.x * point.x + this.y * point.y;
  }

  /**
   * Retorna um novo ponto com as coordenadas multiplicadas por um escalar
   * @param {number} scalar Escalar a ser multiplicado
   * @returns {Point2D} Novo ponto com as coordenadas multiplicadas pelo escalar
   */
  multiply (scalar) {
    if (typeof scalar !== 'number') {
      throw new Error(
        'Invalid parameter for multiply: scalar must be a number.',
      );
    }
    return new Point2D(this.x * scalar, this.y * scalar);
  }
}
