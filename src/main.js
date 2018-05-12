import gamepads from './input-gamepads';
import Mouse from './input-mouse';
import keys from './input-keys';
import { Sprite } from 'pixi.js/lib/core';
import MenuScene from './MenuScene';
import game, { resources } from './Game';

let mouse;
let activeScene;

export function setScene(scene) {
	activeScene = scene;
	game.app.stage.addChild(activeScene);
}

export function getInput() {
	return {
		justDown: mouse.isJustDown() || keys.isJustDown(keys.SPACE) || gamepads.isJustDown(gamepads.A),
		justUp: mouse.isJustUp() || keys.isJustUp(keys.SPACE) || gamepads.isJustUp(gamepads.A),
	};
}

export function init() {
	// initialize input managers
	gamepads.init();
	keys.init({
		capture: [keys.LEFT, keys.RIGHT, keys.UP, keys.DOWN, keys.SPACE, keys.ENTER, keys.BACKSPACE, keys.ESCAPE, keys.W, keys.A, keys.S, keys.D, keys.P, keys.M]
	});
	mouse = new Mouse(game.app.view, false);

	setScene(new MenuScene());

	// start main loop
	game.app.ticker.add(update);
	game.app.ticker.update();
}

function update() {
	// update
	activeScene.update();

	let g = resources.song1.data.volume() + 0.01;
	if (g < 1) {
		resources.song1.data.volume(Math.min(1, g));
	}
	g = resources.song2.data.volume() + 0.01;
	if (g < 0.25) {
		resources.song2.data.volume(Math.min(.25, g));
	}

	// update input managers
	gamepads.update();
	keys.update();
	mouse.update();
}
