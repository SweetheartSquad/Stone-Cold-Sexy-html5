import Resizer from './Resizer';

import './assets/style.css';

// try to auto-focus and make sure the game can be focused with a click if run from an iframe
window.focus();
document.body.addEventListener('mousedown', function() {
	window.focus();
});


const size = Object.freeze({
	x: 64,
	y: 64
});

const resizer = new Resizer(size.x, size.y, Resizer.SCALE_MODES.MULTIPLES);
document.body.appendChild(resizer.element);

const playEl = document.createElement('button');
playEl.textContent = "Play";
resizer.appendChild(playEl);

playEl.onclick = play;

const progressEl = document.createElement('p');

function play() {
	playEl.remove();

	resizer.appendChild(progressEl);

	// start the preload
	preload();

	Promise.all([
			import ('./Game'),
			import ('./main')
		])
		.then(([{
			default: Game
		}, {
			init
		}]) => {
			preloaded = true;
			try {
				// start the actual load
				loadProgressHandler({
					progress: 0
				}, {});

				window.game = new Game(size);
				window.game.load({
					onLoad: loadProgressHandler,
					onComplete: () => {
						loadCompleteHandler();
						init();
					},
					onError: error => {
						fail({
							message: error.message,
							error
						});
					}
				});
			} catch (error) {
				fail({
					message: 'Unsupported browser',
					error
				});
			}
		}, error => {
			preloaded = true;
			fail({
				message: 'Unsupported browser',
				error
			});
		});
}



let preloaded = false;
const loadingAnimation = [
	'...',
	'&nbsp;..',
	'.&nbsp;.',
	'..&nbsp;'
];

function renderPreload() {
	progressEl.innerHTML = `Loading: ${loadingAnimation[
		Math.floor(Date.now() / 100 % loadingAnimation.length)
	]}`;
}

function preload() {
	if (preloaded) {
		return;
	}
	renderPreload();
	requestAnimationFrame(preload);
}

function fail({
	message,
	error
}) {
	progressEl.textContent = `${message} - Sorry :(`;
	throw error;
}



function loadProgressHandler(loader, resource) {
	// called during loading
	if (process.env.NODE_ENV) {
		console.log(`loading: ${resource.url}`);
		console.log(`progress: ${loader.progress}%`);
	}
	progressEl.textContent = `Loading: ${Math.floor(loader.progress)}%`;
}

function loadCompleteHandler() {
	progressEl.remove();
	resizer.appendChild(window.game.app.view);
}

// create render texture
//renderTexture = PIXI.RenderTexture.create(size.x,size.y,PIXI.SCALE_MODES.NEAREST,1);

// create a sprite that uses the render texture
//renderSprite = new PIXI.Sprite(renderTexture, new PIXI.Rectangle(0,0,size.x,size.y));

// hacky fullscreen toggle
// const toggleFullscreen = function () {
// 	if (game.view.toggleFullscreen) {
// 		if (getFullscreenElement()) {
// 			exitFullscreen();
// 		} else {
// 			requestFullscreen(display);
// 		}
// 		game.view.toggleFullscreen = false;
// 	}
// };
// document.body.addEventListener('mouseup', toggleFullscreen);
// document.body.addEventListener('keyup', toggleFullscreen);

// document.exitFullscreen =
// document.exitFullscreen ||
// document.oExitFullScreen ||
// document.msExitFullScreen ||
// document.mozCancelFullScreen ||
// document.webkitExitFullscreen;
