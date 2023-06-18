import { CircleElement } from '../models/cartesianElements/CircleElement';
import { SquareElement } from '../models/cartesianElements/SquareElement';
import { Square } from '../utils/cartesianClasses/Square';
import { RGB } from '../utils/RGB';
import { Line } from '../utils/cartesianClasses/Line';
import { Point2D } from '../utils/cartesianClasses/Point2D';
import { Entity } from './Entity';
import { GUIButton } from './GUI/GUIButton';
import { GUIText } from './GUI/GUIText';

const DEBUG_MODE = false;
const width = Math.min(screen.width - 200, screen.height - 200);

export class Player extends Entity {
  /**
   * @param {KaboomCtx} context
   * @param {string} sprite
   */
  constructor(k, level = null) {
    super({
      k,
      x: width / 5 - 16,
      y: width / 5 - 16,
      acceleration: 300,
      friction: 0.1,
      speed: 150,
    });
    this.context = k;
    this._keyPressed = [];
    this.canShoot = true;
    this.curTween = null;
    this.level = level;

    this.setKeyboardDetection();

    this.renderPlayer(k);
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

  /**
   *
   * @returns {GameObj<RectComp>}
   */
  component() {
    return this.screenComponent.component;
  }

  renderPlayer(k) {
    super.assignScreenComponent(
      new SquareElement(k, this.position.x, this.position.y, 32, '#333333'),
    );

    const dimentions = this.screenComponent.getDimensions();
    this.screenComponent.render(
      add([
        rect(dimentions.x, dimentions.y),
        pos(this.screenComponent.x, this.screenComponent.y),
        color(
          this.screenComponent.color.r,
          this.screenComponent.color.g,
          this.screenComponent.color.b,
        ),
        area(),
        body(),
        'player',
      ]),
    );
    // this.cursor = new CircleElement(k, 120, 80, 1, 'red');
    // this.cursor.render();

    this.setUpPauseMenu();

    this.component().onUpdate(() => {
      // Set the viewport center to player.pos
      camPos(this.component().worldPos());
    });

    this.component().onCollide('enemyBullet', (bullet) => {
      destroy(bullet);
      this.die();
      addKaboom(bullet.pos);
    });

    this.component().onCollide('mowler', (bullet) => {
      destroy(bullet);
      this.die();
      addKaboom(bullet.pos);
    });

    // this.component().onCollide('coin', (bullet) => {
    //   destroy(bullet);
    //   // this.die();
    //   addKaboom(bullet.pos);
    // });

    onClick(() => {
      if (!this.canShoot) return;
      if (!this.exists() || this.context.paused) return;
      this.canShoot = false;
      const playerCenter = this.screenComponent.getCenter();
      const dir = toWorld(mousePos().sub(16)).sub(this.component().pos);

      const bullet = this.context.add([
        pos(playerCenter.x, playerCenter.y),
        move(dir, 2000),
        rect(60, 4),
        area(),
        offscreen({ destroy: true }),
        anchor('center'),
        rotate(0),
        color(rgb(255, 0, 0)),
        'bullet',
      ]);
      bullet.angle = dir.angle();
      bullet.onCollide('wall', () => {
        const ghost = this.context.add([
          pos(bullet.pos),
          rect(60, 4),
          offscreen({ hide: true }),
          anchor('center'),
          rotate(bullet.angle),
          color(rgb(255, 0, 0)),
          'ghostBullet',
        ]);
        bullet.destroy();

        wait(3, () => {
          destroy(ghost);
        });
      });
      this.context.wait(1, () => (this.canShoot = true));
    });

    onDraw(() => {
      if (this.exists()) {
        if (this.context.paused) return;
        this.update();
      } else {
        go('gameOver');
      }
    });
  }

  setUpPauseMenu() {
    this.pauseMenu = add([
      rect(300, 400),
      color(rgb(RGB.create('#755A43').getRGB())),
      outline(4),
      anchor('center'),
      fixed(),
      pos(center().add(0, 1000)),
    ]);

    new GUIText(this.pauseMenu, 0, -160, 0, 100, 'JOGO PAUSADO', 'black')
      .setFontColor(RGB.create('white'))
      .setFontSize(30)
      .setAlign('center')
      .render();

    new GUIButton(this.pauseMenu, -100, -60, 200, 30, 'Continuar', 'black')
      .setFontColor(RGB.create('white'))
      .setFontSize(20)
      .setAlign('center')
      .setOnClick(() => {
        this.pause(false);
      })
      .render();

    new GUIButton(this.pauseMenu, -100, 0, 200, 30, 'Recomeçar', 'black')
      .setFontColor(RGB.create('white'))
      .setFontSize(20)
      .setAlign('center')
      .setOnClick(() => {
        go('restart');
      })
      .render();

    new GUIButton(this.pauseMenu, -100, 60, 200, 30, 'Voltar ao menu', 'black')
      .setFontColor(RGB.create('white'))
      .setFontSize(20)
      .setAlign('center')
      .setOnClick(() => {
        go('menu');
      })
      .render();

    this.pauseMenu.hidden = true;
    this.pauseMenu.paused = true;

    onKeyPress('escape', () => {
      this.pause(!this.context.paused);
    });
  }

  pause(isPaused) {
    this.context.paused = isPaused;
    if (this.curTween) this.curTween.cancel();
    this.curTween = tween(
      this.pauseMenu.pos,
      this.context.paused ? center() : center().add(0, 1000),
      0.1,
      (p) => (this.pauseMenu.pos = p),
      easings.easeOutQuad,
    );
    if (this.context.paused) {
      this.pauseMenu.hidden = false;
      this.pauseMenu.paused = false;
    } else {
      this.curTween.onEnd(() => {
        this.pauseMenu.hidden = true;
        this.pauseMenu.paused = true;
      });
    }
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

  movePlayer() {
    const player = this.screenComponent.getElement();
    const speed = this.getSpeedXY();
    player.move(speed.x, speed.y);
  }
}
