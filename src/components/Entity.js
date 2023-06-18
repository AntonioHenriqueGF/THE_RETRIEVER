// eslint-disable-next-line no-unused-vars
import { SquareElement } from '../models/cartesianElements/SquareElement';
import { Line } from '../utils/cartesianClasses/Line';
import { Point2D } from '../utils/cartesianClasses/Point2D';
import { Square } from '../utils/cartesianClasses/Square';
import { Player } from './Player';

const DEBUG_MODE = false;

export class Entity {
  constructor({ k, x, y, speed = 0, acceleration = 10, friction = 0.1 }) {
    this.context = k;
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.direction = { x: 0, y: 0 };
    this.speed = speed;
    this.acceleration = acceleration;
    this.friction = friction;
    this.targetAquired = false;
    this.input = [];

    /**
     * @type {Square[]}
     */
    this.walls = [];

    if (DEBUG_MODE) {
      this.debugText = this.context.add([
        text(`${this.position.x} | ${this.position.y}`),
        pos(this.position.x, this.position.y - 20),
        'debug-player-position',
      ]);
    }
  }

  /**
   * @param {SquareElement} screenComponent
   */
  assignScreenComponent(screenComponent) {
    this.screenComponent = screenComponent;
  }

  bulletColideBehavior(bullet) {
    destroy(bullet);
    destroy(this.screenComponent.component);
    addKaboom(bullet.pos);
  }

  update() {
    const speed = this.getSpeedXY();
    this.move(speed.x, speed.y);
    if (!DEBUG_MODE) return;
    this.position = this.screenComponent.getVec2Position();
    this.debugText.text = `${speed.x.toFixed(1)} | ${speed.y.toFixed(1)}`;
    this.debugText.moveTo(this.position.x, this.position.y - 60);
  }

  die() {
    destroy(this.screenComponent.component);
    delete this;
  }

  /**
   * @param {{ x: number, y: number }} direction - Direção de movimento
   * @returns {{ x: number, y: number }}
   */
  calculateMovement(direction, deltaTime) {
    // Aplica a inércia
    if (direction.x === 0 && direction.y === 0) {
      this.velocity.x *= this.friction ** deltaTime;
      this.velocity.y *= this.friction ** deltaTime;
    }

    // Calcula a nova velocidade
    const speed = this.getDirection(direction);
    this.velocity.x += speed.x * this.acceleration * deltaTime;
    this.velocity.y += speed.y * this.acceleration * deltaTime;

    // Aplica o coeficiente de atrito
    this.velocity.x *= this.friction ** deltaTime;
    this.velocity.y *= this.friction ** deltaTime;

    // Retorna o movimento final
    return {
      x: this.velocity.x * deltaTime,
      y: this.velocity.y * deltaTime,
    };
  }

  /**
   * Creates a line from the entity to the target and check for walls collisions
   * @param {Player} target
   * @returns {boolean}
   */
  canSee(target) {
    const line = new Line(
      new Point2D(this.component().pos.x, this.component().pos.y),
      new Point2D(target.component().pos.x, target.component().pos.y),
    );
    let sees = true;
    this.walls?.forEach((wall) => {
      const intersection = wall.intersectsLine(line);
      if (intersection) {
        sees = false;
        return;
      }
      if (!!intersection) sees = false;
    });
    return sees;
  }

  /**
   *
   * @param {{ x: number, y: number}} direction
   * @returns {{ x: number, y: number}}
   */
  getDirection(direction) {
    // verifica se a entidade está se movendo na diagonal
    if (direction.x !== 0 && direction.y !== 0) {
      const factor = Math.sqrt(2) / 2; // fator de ajuste
      direction.x *= factor;
      direction.y *= factor;
    }
    this.movement = direction;
    return direction;
  }

  /**
   * @param {{ x: number, y: number}} movement - Direção de movimento
   * @returns {{ x: number, y: number}}
   */
  getSpeedXY(movement = this.movement) {
    const direction = this.getDirection(movement);
    return this.calculateMovement(direction, dt());
  }

  move(x, y) {
    this.screenComponent.move(x, y);
  }

  moveTo(x, y) {
    this.screenComponent.moveTo(x, y);
  }

  placeAt(x, y) {
    this.screenComponent.setPosition(x, y);
  }
}
