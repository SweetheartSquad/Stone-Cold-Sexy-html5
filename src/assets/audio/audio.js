import BGM1url from './song1.wav';
import BGM2url from './song2.wav';

export const song1 = {
	url: BGM1url,
	metadata: {
		autoplay: true,
		loop: true,
		volume: 0
	}
};
export const song2 = {
	url: BGM2url,
	metadata: {
		autoplay: true,
		loop: true,
		volume: 0
	}
};
export { default as flash } from './flash.wav';
export { default as flash_wrong } from './flash-wrong.wav';
export { default as in } from './in.wav';
export { default as out } from './out.wav';
