import { getInput, setScene } from './main';
import game, { resources } from './Game';
import { Container, Sprite, Graphics } from 'pixi.js/lib/core';
import { BitmapText } from 'pixi.js/lib/extras';
import EndScene from './EndScene';
import Peep from './Peep';
import CustomFilter from './CustomFilter';

export default class PoseScene extends Container {
	constructor() {
		super();
		this.screenFilter = new CustomFilter(resources.frag.data);
		this.screenFilter.uniforms.redout = 0;
		this.screenFilter.uniforms.whiteout = 0;
		this.screenFilter.padding = 0;

		this.filters = [this.screenFilter];

		this.timeouts = {};
		this.confidence = 100;
		this.score = 0;
		this.whiteout = 0;
		this.redout = 0;
		this.ready = false;
		this.posing = false;

		this.clouds = [];
		this.peeps = [];

		this.bg = new Container();
		for (let i = 1; i <= 3; ++i) {
			const cloud = new Container();
			cloud.addChild(new Sprite(resources[`cloud_${i}`].texture));
			cloud.children[0].x = 64;
			cloud.addChild(new Sprite(resources[`cloud_${i}`].texture));
			this.bg.addChild(cloud);
			this.clouds.push(cloud);
		}
		this.bg.addChild(new Sprite(resources.bg.texture));

		this.poser = new Sprite(resources.poser.texture);
		this.poseUi = new Sprite(resources.uiPose_1.texture);
		this.poseUi.alpha = 0;

		this.confidenceSlider = new Container();
		this.confidenceSlider.x = 2;
		this.confidenceSlider.y = 2;
		this.confidenceSlider.bg = new Graphics();
		this.confidenceSlider.bg.beginFill(0x783645, 1);
		this.confidenceSlider.bg.drawRect(0, 0, 2, 60);
		this.confidenceSlider.bg.drawRect(0, 0, 2, 60);
		this.confidenceSlider.fill = new Graphics();
		this.confidenceSlider.addChild(this.confidenceSlider.bg);
		this.confidenceSlider.addChild(this.confidenceSlider.fill);

		this.scoreText = new BitmapText('0', {
			font: 'font',
			align: 'left',
		});
		this.scoreText.tint = 0xc85a73;
		this.scoreText.x = 4;
		this.scoreText.y = 1;

		this.peepsLayer = new Container();

		this.addChild(this.bg);
		this.addChild(this.poser);
		this.addChild(this.peepsLayer);
		this.addChild(this.poseUi);
		this.addChild(this.confidenceSlider);
		this.addChild(this.scoreText);

		this.peepTimeout();
		this.addPeep();
	}
	destroy() {
		Container.prototype.destroy.call(this);
		Object.values(this.timeouts).map(timeout => {
			clearTimeout(timeout);
		});
	}

	poseTimeout() {
		this.timeouts.poseTimeout = setTimeout(() => {
			this.poseUi.alpha = 0;
		}, 500);
		this.poseUi.alpha = 1;
		this.poseUi.texture = resources[`uiPose_${Math.floor(Math.random()*13+1)}`].texture;
		for (let i = 60; i < 500; i += 60) {
			const t = i;
			this.timeouts[`scoreTimeout${i}`] = setTimeout(() => {
				this.poseUi.alpha = 1 - Math.pow(t / 500, 2);
			}, t);
		}
	}

	peepTimeout() {
		this.timeouts.peepTimeout = setTimeout(() => {
			this.peepTimeout();
			this.addPeep();
		}, 5000);
	}

	addPeep() {
		const peep = new Peep();
		this.peeps.push(peep);
		peep.x = -64;
		peep.y = Math.random() * 4;
		this.peepsLayer.addChild(peep);
	}

	update() {
		if (getInput().justDown) {
			this.posing = true;
			resources.in.data.play();
			this.redout = 1;
			this.poser.texture = resources[`posing_${Math.floor(Math.random()*3)+1}`].texture;
		}
		if (getInput().justUp) {
			this.posing = false;
			this.poser.texture = resources.poser.texture;
			this.redout = -1;
			resources.out.data.play();
		}
		if (this.posing) {
			this.confidence -= 0.1 + (this.score / 5000);
		} else {
			this.confidence -= 0.01 + (this.score / 5000);
		}
		this.clouds.forEach((cloud, idx) => {
			cloud.x -= 1 / (30 + idx * 5);
			if (cloud.x < -64) {
				cloud.x += 64;
			}
		});

		this.peeps.forEach(peep => {
			if (peep.walk) {
				peep.x += 1;
				peep.y = Math.random() * 4;
				peep.walk = false;
			}

			if (peep.wantsTakePicture) {
				peep.takePicture();
				this.whiteout = 1;
				if (this.posing) {
					// picture taken while posing :)
					this.confidence += 10;
					this.score += 10;
					peep.scoreTimeout();
					this.poseTimeout();
					resources.flash.data.play();
				} else {
					// picture taken without posing :(
					resources.flash_wrong.data.play();
				}
			}

			if (peep.x > 64) {
				peep.dead = true;
				peep.destroy();
			}
		});
		this.peeps = this.peeps.filter(peep => !peep.dead);

		this.confidenceSlider.fill.clear();
		this.confidenceSlider.fill.beginFill(0xc85a73, 1);
		const confidencePx = this.confidence / 100 * 60;
		this.confidenceSlider.fill.drawRect(0, 60 - confidencePx, 2, confidencePx);

		this.scoreText.text = this.score.toString();

		this.confidence = Math.min(this.confidence, 100);
		this.whiteout += -this.whiteout * 0.25;
		this.redout += -this.redout * 0.25;
		if (Math.abs(this.whiteout) < 0.1) {
			this.whiteout = 0;
		}
		if (Math.abs(this.redout) < 0.1) {
			this.redout = 0;
		}

		this.screenFilter.uniforms.whiteout = this.whiteout;
		this.screenFilter.uniforms.redout = this.redout;
		
		const g = resources.song2.data.volume() + (this.posing ? 0.05 : -0.05);
		resources.song2.data.volume(Math.max(.25, Math.min(1, g)));

		if (this.confidence < 0) {
			this.destroy();
			setScene(new EndScene(this.score));
		}
	}
}
