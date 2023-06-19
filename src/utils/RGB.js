const colors = {
  default: 'blue',
  red: [255, 0, 0],
  green: [0, 255, 0],
  blue: [0, 0, 255],
  yellow: [255, 255, 0],
  cyan: [0, 255, 255],
  magenta: [255, 0, 255],
  black: [0, 0, 0],
  white: [255, 255, 255],
  orange: [255, 165, 0],
  pink: [255, 55, 88],
};

export class RGB {
  constructor(r, g, b) {
    this.setR(r);
    this.setG(g);
    this.setB(b);
  }

  static fromArray(array) {
    if (!Array.isArray(array))
      throw new Error(
        `Invalid parameter for RGB.fromArray: array must be an array (received ${typeof array})`,
      );
    if (array.length !== 3)
      throw new Error(
        `Invalid parameter for RGB.fromArray: array must have 3 elements (received ${array.length})`,
      );
    if (array.some((value) => typeof value !== 'number'))
      throw new Error(
        `Invalid parameter for RGB.fromArray: array must have only numbers (received ${array})`,
      );
    return new RGB(array[0], array[1], array[2]);
  }

  static fromName(code) {
    if (typeof code !== 'string')
      throw new Error(
        `Invalid parameter for RGB: code must be a string (received ${typeof code})`,
      );
    if (!colors[code]) {
      console.warn(
        `Invalid parameter for RGB: code must be a valid color code (received ${code}). Using default color instead`,
      );
      return RGB.fromName('default');
    }
    return RGB.fromArray(colors[code]);
  }

  static fromHex(hex) {
    if (typeof hex !== 'string')
      throw new Error(
        `Invalid parameter for RGB: hex must be a string (received ${typeof hex})`,
      );
    hex = hex.replace('#', '');
    if (!hex.match('^#?[0-9a-fA-F]{6}$'))
      throw new Error(
        `Invalid parameter for RGB: hex must be a valid hex color (received ${hex})`,
      );
    return new RGB(
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16),
    );
  }

  /**
   *
   * @param {number[] | string} color Array of RGB values, color name or hexadecimal code
   * @returns {RGB} RGB instance
   */
  static create(color) {
    if (Array.isArray(color)) {
      return RGB.fromArray(color);
    } else if (typeof color === 'string') {
      if (color.match('^#?[0-9a-fA-F]{6}$')) {
        return RGB.fromHex(color);
      } else {
        return RGB.fromName(color);
      }
    } else {
      throw new Error(
        `Invalid parameter for createRGB: color must be an array, a suported color name or a hexadecimal code (received '${typeof color}' instead)`,
      );
    }
  }

  /**
   * Returns an array of RGB values from a color
   * @param {number[] | string} color Array of RGB values, color name or hexadecimal code
   * @returns {number[]} Array of RGB values
   */
  static getRGBFrom(color) {
    return RGB.create(color).getRGB();
  }

  static validate(rgb, functionName = 'RGB') {
    if (!(rgb instanceof RGB))
      throw new Error(
        `Invalid parameter for ${
          functionName ?? 'RGB'
        }: value must be an instance of RGB`,
      );
  }

  getR() {
    return this.r ?? 0;
  }

  getG() {
    return this.g ?? 0;
  }

  getB() {
    return this.b ?? 0;
  }

  setR(r) {
    if (typeof r !== 'number')
      throw new Error(
        `Invalid parameter for RGB: r must be a number (received ${typeof r})`,
      );
    if (r < 0 || r > 255)
      throw new Error(
        `Invalid parameter for RGB: r must be between 0 and 255 (received ${r})`,
      );
    this.r = r;
  }

  setG(g) {
    if (typeof g !== 'number')
      throw new Error(
        `Invalid parameter for RGB: g must be a number (received ${typeof g})`,
      );
    if (g < 0 || g > 255)
      throw new Error(
        `Invalid parameter for RGB: g must be between 0 and 255 (received ${g})`,
      );
    this.g = g;
  }

  setB(b) {
    if (typeof b !== 'number')
      throw new Error(
        `Invalid parameter for RGB: b must be a number (received ${typeof b})`,
      );
    if (b < 0 || b > 255)
      throw new Error(
        `Invalid parameter for RGB: b must be between 0 and 255 (received ${b})`,
      );
    this.b = b;
  }

  setRGB(r, g, b) {
    this.setR(r);
    this.setG(g);
    this.setB(b);
  }

  getRGB() {
    return [this.getR(), this.getG(), this.getB()];
  }
}
