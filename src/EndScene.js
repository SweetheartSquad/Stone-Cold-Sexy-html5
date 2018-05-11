import { getInput, setScene, resources } from './main';
import { Container, Sprite } from 'pixi.js/lib/core';
import MenuScene from './MenuScene';

export default class EndScene extends Container {
	constructor(score) {
		super();
		this.ready = false;

		let pic;
		if (score > 300) {
			pic = '5';
		} else if (score > 200) {
			pic = '4';
		} else if (score > 125) {
			pic = '3';
		} else if (score > 50) {
			pic = '2';
		} else {
			pic = '1';
		}
		this.addChild(new Sprite(resources[`end${pic}`].texture));

		setTimeout(() => {
			this.addChild(new Sprite(resources.click.texture));
			this.ready = true;
		}, 500);
	}
	update() {
		if (this.ready && getInput().justDown) {
			this.destroy();
			setScene(new MenuScene());
		}
	}
}
