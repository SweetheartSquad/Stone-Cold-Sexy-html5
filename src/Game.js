import 'pixi.js';
import HowlerMiddleware from './HowlerMiddleware';
import assets from './assets.js';

// PIXI configuration stuff
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.zero = Object.freeze(new PIXI.Point(0, 0));

export default class Game {
	constructor(size) {
		const canvas = document.createElement('canvas');
		this.app = new PIXI.Application({
			view: canvas,
			width: size.x,
			height: size.y,
			antialias: false,
			forceFXAA: false,
			transparent: false,
			resolution: 1,
			roundPixels: true,
			clearBeforeRender: true,
			autoResize: false,
			backgroundColor: 0xFF0000
		});
		this.startTime = Date.now();

		this.setupLoader();
	}

	setupLoader() {
		this.app.loader.pre(HowlerMiddleware);
		Object.entries(assets).forEach(([name, asset]) => {
			let a;
			if (typeof asset === "string") {
				a = {
					name,
					url: asset,
				};
			} else {
				a = {
					name,
					...asset,
				};
			}
			this.app.loader.add(a);
		});

	}

	load({
		onLoad,
		onComplete,
		onError
	}) {
		this.app.loader.onLoad.add(onLoad);
		this.app.loader.onComplete.add(onComplete);
		this.app.loader.onError.add(onError);
		this.app.loader.load();
	}
}
