import { Sprite } from "pixi.js/lib/core";
import { resources } from './Game';

export default class Peep extends Sprite {
	constructor() {
		super(resources.peep.texture);
		this.timeouts = {};
		this.wantsTakePicture = false;
		this.walk = true;

		this.picTimeout1();

		this.walkTimeoutSpeed = Math.random(150) + 100
		this.walkTimeout();

		this.speedTimeout();

		this.plusOne = new Sprite(resources.plus.texture);
		this.addChild(this.plusOne);
		this.plusOne.alpha = 0;
	}
	destroy() {
		Sprite.prototype.destroy.call(this);
		Object.values(this.timeouts).map(timeout => {
			clearTimeout(timeout);
		});
	}
	picTexTimeout() {
		this.timeouts.picTexTimeout = setTimeout(() => {
			this.texture = resources.peep.texture;
		}, 500);
	}
	picTimeout1() {
		this.timeouts.picTimeout1 = setTimeout(() => {
			if (this.x > -32 && this.x < 32) {
				this.texture = resources.peep_ready.texture;
				this.picTimeout2();
			} else {
				this.picTimeout1();
			}
		}, Math.random() * 6500 + 3500);
	}
	picTimeout2() {
		this.timeouts.picTimeout2 = setTimeout(() => {
			this.texture = resources.peep_flash.texture;
			this.wantsTakePicture = true;
			this.picTimeout1();
			this.picTexTimeout();
		}, 450);
	}
	walkTimeout() {
		this.timeouts.walkTimeout = setTimeout(() => {
			this.walk = true;
			this.walkTimeout();
		}, this.walkTimeoutSpeed);
	}
	speedTimeout() {
		this.timeouts.speedTimeout = setTimeout(() => {
			this.walk = true;
			this.speedTimeout();
			this.walkTimeoutSpeed = Math.random(150) + 100;
		}, Math.random(2000) + 500);
	}
	scoreTimeout() {
		this.timeouts.scoreTimeout = setTimeout(() => {
			this.plusOne.alpha = 0;
		}, 750);
		for (let i = 60; i < 750; i += 60) {
			const t = i;
			this.timeouts[`scoreTimeout${i}`] = setTimeout(() => {
				this.plusOne.alpha = 1 - Math.pow(t / 750, 2);
				this.plusOne.y = -t / 750 * 64 / 10;
			}, t);
		}
	}

	takePicture() {
		this.wantsTakePicture = false;
	}
}
