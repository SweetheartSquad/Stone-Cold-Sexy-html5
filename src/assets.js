import * as textures from './assets/textures/textures';
import * as audio from './assets/audio/audio';
import font from './assets/font/font.xml';
import fontImg from './assets/font/font.png'; // using the image directly, but need to make sure it's imported for the xml to reference

import frag from './assets/RenderSurface_1.frag';
import vert from './assets/RenderSurface_1.vert';

export default {
	...textures,
	...audio,
	font,
	frag,
	vert,
};
