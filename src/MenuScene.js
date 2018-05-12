import { getInput, setScene } from './main';
import { resources } from './Game';
import { Container, Sprite } from 'pixi.js/lib/core';
import PoseScene from './PoseScene';

export default class MenuScene extends Container {
	constructor() {
		super();
		this.ready = false;
		this.addChild(new Sprite(resources.bg.texture));
		this.addChild(new Sprite(resources.menu.texture));

		setTimeout(() => {
			this.ready = true;
			this.addChild(new Sprite(resources.click.texture));
		}, 500);
	}
	update() {
		if (this.ready && getInput().justDown) {
			this.destroy();
			setScene(new PoseScene());
		}
	}
}
