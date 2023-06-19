// import { Entity } from './components/Entity';
import kaboom from 'kaboom';
import { MenuScene } from './scenes/Menu';
import { LevelOneScene } from './scenes/Level1';
import { GameOverScene } from './scenes/GameOver';
import { VictoryScene } from './scenes/Vitoria';
import { LevelTwoScene } from './scenes/Level2';

// const width = Math.min(screen.width - 200, screen.height - 200);
const width = 880;

const k = kaboom({
  width,
  height: width,
  font: 'sans-serif',
  canvas: document.querySelector('#mycanvas'),
});

const menuScene = new MenuScene(k);
const level1Scene = new LevelOneScene(k);
const level2Scene = new LevelTwoScene(k);

let level = 0;
const levels = [level1Scene, level2Scene];
const gameOverScene = new GameOverScene(k, level, levels);
const victoryScene = new VictoryScene(k, level, levels);

k.scene('next', ({ newLevel }) => {
  level = newLevel;
  gameOverScene.level = level;
  victoryScene.level = level;
  k.go('restart');
});

k.scene('restart', () => {
  if (level >= levels.length) {
    level = 0;
  }
  k.go(levels[level]?.sceneName ?? levels[0].sceneName);
});

menuScene.start();
