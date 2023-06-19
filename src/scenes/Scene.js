import { Player } from '../components/Player';
import { Enemy } from '../components/Enemy';
import { RGB } from '../utils/RGB';
import { Mowler } from '../components/Mowler';
import { GUIText } from '../components/GUI/GUIText';
import { Point2D } from '../utils/cartesianClasses/Point2D';
import { Square } from '../utils/cartesianClasses/Square';

export class Scene {
  context;

  sceneName;

  charMap;

  tileSize;

  tileSizeY;

  coinsCollected;

  totCoins;

  /**
   * @type {Square[]}
   */
  walls;
  /**
   * Creates an instance of a scene.
   * @param {import('kaboom').KaboomCtx} k Context for de scene to be created at
   * @param {string} sceneName Name of the scene
   * @param {string[][]} charMap Map of the scene
   * @param {number} [tileSize = 60] Size of the tiles in pixels, defaults to 60
   */
  constructor(k, sceneName, charMap, tileSize = 60) {
    this.context = k;
    this.sceneName = sceneName;
    this.charMap = charMap;
    this.tileSize = tileSize;
    this.tileSizeY = this.tileSize;
    this.coinsCollected = 0;
    this.totCoins = 0;

    /**
     * @type {Square[]}
     */
    this.walls = [];

    this.setUpScene();
  }

  updateCoinsCollected() {
    this.coinsCollected += 1;
    this.coinsCollectedText.textEntity.text = `Cargas coletadas: ${this.coinsCollected}/${this.totCoins}`;
    if (this.coinsCollected >= this.totCoins) {
      this.coinsCollectedText.textEntity.text = 'Cargas recuperadas!';
      new GUIText(
        this.context,
        0,
        90,
        400,
        40,
        'Retorne ao ponto de recuo',
        'black',
      )
        .setFontColor(RGB.create('white'))
        .setFontSize(30)
        .setAlign('left')
        .render();
    }
  }

  /**
   *
   * @param {number} height
   * @param {number} width
   */
  createWall(height, width = height) {
    return [
      rect(height, width),
      color(rgb(RGB.fromHex('#916F41').getRGB())),
      area(),
      offscreen({ hide: true, distance: Math.sqrt(height ** 2 + width ** 2) }),
      body({ isStatic: true, isObstacle: true }),
      'wall',
    ];
  }

  setUpScene() {
    scene(this.sceneName, () => {
      setBackground(RGB.fromHex('#C7B295').getRGB());

      const enemies = [];
      const coins = [];
      const mowlers = [];
      this.coinsCollected = 8;

      const addEnemy = (elem) => {
        enemies.push(elem);
        return elem;
      };

      const addCoin = (elem) => {
        coins.push(elem);
        return elem;
      };

      const addMowler = (elem) => {
        mowlers.push(elem);
        return elem;
      };

      this.map = addLevel(this.charMap, {
        tileWidth: this.tileSize,
        tileHeight: this.tileSizeY,
        tiles: {
          x: () => this.createWall(this.tileSize),
          A: () => this.createWall(this.tileSize * 12, this.tileSize * 1),
          B: () => this.createWall(this.tileSize * 2, this.tileSize * 1),
          C: () => this.createWall(this.tileSize * 1, this.tileSize * 2),
          D: () => this.createWall(this.tileSize * 4, this.tileSize * 1),
          E: () => this.createWall(this.tileSize * 2, this.tileSize * 2),
          F: () => this.createWall(this.tileSize * 4, this.tileSize * 4),
          G: () => this.createWall(this.tileSize * 1, this.tileSize * 4),
          H: () => this.createWall(this.tileSize * 3, this.tileSize * 1),
          $: () =>
            addCoin([
              rect(this.tileSize, this.tileSizeY),
              color(rgb(RGB.fromHex('#C78601').getRGB())),
              area(),
              offscreen({
                hide: true,
                distance: Math.sqrt(this.tileSize ** 2 * 2),
              }),
              'coin',
            ]),
          '¢': () =>
            addCoin([
              rect(this.tileSize * 2, this.tileSizeY),
              color(rgb(RGB.fromHex('#C78601').getRGB())),
              area(),
              offscreen({
                hide: true,
                distance: Math.sqrt(
                  (this.tileSize * 2) ** 2 + this.tileSize ** 2,
                ),
              }),
              'coin',
            ]),
          g: () => [
            rect(this.tileSize * 3, this.tileSizeY),
            color(rgb(RGB.fromHex('#C2000D').getRGB())),
            area(),
            offscreen({ hide: true, distance: this.tileSize * 3 }),
            body({ isStatic: true, isObstacle: true }),
            'gate',
          ],
          '@': () => [
            rect(this.tileSize, this.tileSizeY),
            area(),
            anchor('center'),
            'playerDummy',
          ],
          e: () => addEnemy([rect(30, 30), 'enemyDummy']),
          m: () => addMowler([rect(30, 30), 'mowlerDummy']),
        },
      });

      this.totCoins = coins.length;

      const game = add([timer()]);
      const k = game;

      const player = new Player(k, this);

      this.map.get('wall').forEach((element) => {
        const wall = new Square();
        wall.defineFromOrigin(
          new Point2D(element.pos.x, element.pos.y),
          element.width,
          element.height,
        );
        this.walls.push(wall);
      });

      player.walls = this.walls;

      this.map.get('playerDummy').forEach((foo) => {
        const { x, y } = foo.pos.sub(
          vec2(-this.tileSize / 4, -this.tileSize / 4),
        );
        player.moveTo(x, y);
        foo.destroy();
      });

      this.map.get('enemyDummy').forEach((foo) => foo.destroy());
      enemies.forEach((foo, i) => {
        const enemy = new Enemy(k, player);
        const { x, y } = foo[foo.length - 2].pos;
        enemy.moveTo(x, y);
        enemy.walls = this.walls;
        enemy.enableBehavior();
        delete enemies[i];
      });

      this.map.get('mowlerDummy').forEach((foo) => foo.destroy());
      mowlers.forEach((foo, i) => {
        const enemy = new Mowler(k, player);
        const { x, y } = foo[foo.length - 2].pos;
        enemy.moveTo(x, y);
        enemy.walls = this.walls;
        enemy.enableBehavior();
        delete mowlers[i];
      });

      this.map.get('coin').forEach((coin) => {
        coin.onCollide('player', () => {
          this.updateCoinsCollected();
          coin.destroy();
        });
      });

      this.setUpGate(this.map);

      this.coinsCollectedText = new GUIText(
        this.context,
        0,
        50,
        400,
        40,
        'Cargas coletadas: ' + this.coinsCollected + '/' + this.totCoins,
        'black',
      )
        .setFontColor(RGB.create('white'))
        .setFontSize(30)
        .setAlign('left');

      this.coinsCollectedText.render();
    });
  }

  setUpGate(ctx) {
    ctx.get('gate').forEach((coin) => {
      coin.onCollide('player', () => {
        if (this.coinsCollected >= this.totCoins) {
          this.coinsCollected = 0;
          go('youWin');
        } else {
          const text = new GUIText(
            this.context,
            200,
            120,
            width() - 400,
            80,
            'Colete todas as cargas antes de deixar a região',
            'black',
          )
            .setFontColor(RGB.create('white'))
            .setFontSize(30)
            .setAlign('center');

          text.render();

          wait(2, () => {
            text.destroy();
          });
        }
      });
    });
  }

  start() {
    this.context.go(this.sceneName);
  }
}
