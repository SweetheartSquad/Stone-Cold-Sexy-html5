import {Howl} from 'Howler';

export default function HowlerMiddleware(resource, next) {
	if (resource && ["wav", "ogg", "mp3"].includes(resource.extension)) {
		resource._setFlag(PIXI.loaders.Resource.STATUS_FLAGS.LOADING, true);
		const options = JSON.parse(JSON.stringify(resource.metadata));
		options.src = [resource.url];
		options.onload = function () {
			resource.complete();
			next();
		};
		options.onloaderror = function (id, message) {
			console.error(resource);
			resource.abort(message);
			next();
		}
		resource.data = new Howl(options);
	} else {
		next();
	}
}
