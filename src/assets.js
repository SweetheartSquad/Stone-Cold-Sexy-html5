import * as textures from './assets/textures/textures';
import * as audio from './assets/audio/audio';

import fontImg from './assets/font/font.fnt.png'; // not using the image directly, but need to make sure it's imported for the xml to reference
import font from './assets/font/font.fnt.xml';

import frag from './assets/RenderSurface_1.frag';

export default {
	...textures,
	...audio,
	font,
	frag,
};
