import { SquareElement } from '../models/cartesianElements/SquareElement';
import { Line } from '../utils/cartesianClasses/Line';
import { Entity } from './Entity';

const DEBUG_MODE = false;
const width = Math.min(screen.width - 200, screen.height - 200);

export class Enemy extends Entity {
  /**
   * @param {KaboomCtx} context
   * @param {Player} target
   * @param {import('kaboom').GameObj | undefined} component
   */
  constructor(k, target, component = undefined) {
    super({
      k,
      x: width,
      y: width,
      acceleration: 400,
      friction: 0.1,
      speed: 150,
    });
    this.target = target;
    this.context = k;
    this.minDistanceFromTarget = 140;
    this.maxDistanceFromTarget = 150;
    this.range = 500;
    this._keyPressed = [];

    this.setKeyboardDetection();

    this.renderEnemy(k, component);
  }

  setKeyboardDetection() {
    window.document.addEventListener('keydown', (event) => {
      this._keyPressed[event.code] = 1;
      if (DEBUG_MODE) console.log(this._keyPressed);
    });

    window.document.addEventListener('keyup', (event) => {
      this._keyPressed[event.code] = 0;
      if (DEBUG_MODE) console.log(this._keyPressed);
    });
  }

  exists() {
    return this.screenComponent.component.exists();
  }

  die() {
    destroy(this.screenComponent.component);
  }

  /**
   *
   * @returns {GameObj<RectComp>}
   */
  component() {
    return this.screenComponent.component;
  }

  /**
   * Updates the screen entity position based on the component position
   */
  update() {
    this.screenComponent.setPosition(
      this.screenComponent.component.pos.x,
      this.screenComponent.component.pos.y,
    );
  }

  getDistanceFromTarget() {
    return Line.vec2Distance(this.target.component().pos, this.component().pos);
  }

  renderEnemy(k, component) {
    const enemyRect = new SquareElement(
      k,
      this.position.x,
      this.position.y,
      30,
      'red',
    );

    super.assignScreenComponent(enemyRect);

    const dimentions = this.screenComponent.getDimensions();
    this.screenComponent.render(
      component ??
        this.context.add([
          rect(dimentions.x, dimentions.y),
          pos(this.screenComponent.x, this.screenComponent.y),
          color(
            this.screenComponent.color.r,
            this.screenComponent.color.g,
            this.screenComponent.color.b,
          ),
          offscreen({
            hide: true,
            distance: Math.sqrt(dimentions.x ** 2 + dimentions.y ** 2),
          }),
          area(),
          body(),
          state('move', ['attack', 'move']),
        ]),
    );

    onDraw(() => {
      if (this.exists()) {
        if (this.context.paused) return;
        this.update();
      }
    });
  }

  moveBehavior() {
    if (!this.target) return;

    const dist = this.getDistanceFromTarget();

    if (dist > this.range) return;

    if (!this.targetAquired) {
      if (this.canSee(this.target)) {
        this.targetAquired = true;
      }
    }

    if (this.targetAquired) {
      const dir = this.target
        .component()
        .pos.sub(this.screenComponent.component.pos)
        .unit();

      if (dist > this.maxDistanceFromTarget)
        this.screenComponent.component.move(dir.scale(this.speed));
      if (dist < this.minDistanceFromTarget)
        this.screenComponent.component.move(dir.scale(-this.speed));
    }
  }

  async attackBehavior() {
    if (!this.screenComponent.component.exists()) return;
    if (this.context.paused) return;

    const dist = this.getDistanceFromTarget();

    if (dist <= this.range) {
      if (this.target.exists()) {
        if (this.canSee(this.target)) {
          const dir = this.target
            .component()
            .pos.sub(this.screenComponent.component.pos)
            .unit();

          if (dist > this.maxDistanceFromTarget)
            this.screenComponent.component.move(dir.scale(this.speed));
          if (dist < this.minDistanceFromTarget)
            this.screenComponent.component.move(dir.scale(-this.speed));

          const bullet = this.context.add([
            pos(this.screenComponent.component.pos.add(15)),
            move(dir, 350),
            rect(20, 20),
            area(),
            offscreen({ destroy: true }),
            anchor('center'),
            color(GREEN),
            'enemyBullet',
          ]);
          bullet.onCollide('wall', () => {
            destroy(bullet);
          });
        }
      }
    }

    this.screenComponent.component.enterState('move');
  }

  async moveBehaviorEnter() {
    await wait(2);

    this.screenComponent.component.enterState('attack');
  }

  enableBehavior() {
    if (!this.screenComponent.component.exists()) return;
    this.screenComponent.component.onStateUpdate(
      'move',
      this.moveBehavior.bind(this),
    );
    this.screenComponent.component.onStateEnter(
      'attack',
      this.attackBehavior.bind(this),
    );
    this.screenComponent.component.onStateEnter(
      'move',
      this.moveBehaviorEnter.bind(this),
    );
    this.screenComponent.component.onCollide(
      'bullet',
      this.bulletColideBehavior.bind(this),
    );
  }

  getSpeed() {
    if (this._keyPressed.ShiftLeft === 1) {
      return this.speed * 2;
    }
    return this.speed;
  }

  /**
   * @returns {{ x: number, y: number}} speed
   */
  getSpeedXY() {
    const movement = {
      x: 0,
      y: 0,
    };

    if (this._keyPressed.KeyD) movement.x += this.getSpeed();
    if (this._keyPressed.KeyA) movement.x -= this.getSpeed();
    if (this._keyPressed.KeyW) movement.y -= this.getSpeed();
    if (this._keyPressed.KeyS) movement.y += this.getSpeed();

    const speed = super.getSpeedXY(movement);

    return speed;
  }

  moveEnemy() {
    const enemy = this.screenComponent.getElement();
    const speed = this.getSpeedXY();
    enemy.move(speed.x, speed.y);
  }
}
