import gamepads from './input-gamepads';
import Mouse from './input-mouse';
import keys from './input-keys';
import { Sprite } from 'pixi.js/lib/core';
import MenuScene from './MenuScene';
import CustomFilter from './CustomFilter';

let mouse;
let activeScene;
export let screenFilter;
export let resources;

export function setScene(scene) {
	activeScene = scene;
	window.game.app.stage.addChild(activeScene);
}

export function getInput() {
	return {
		justDown: mouse.isJustDown() || keys.isJustDown(keys.SPACE) || gamepads.isJustDown(gamepads.A),
		justUp: mouse.isJustUp() || keys.isJustUp(keys.SPACE) || gamepads.isJustUp(gamepads.A),
	};
}

export function init() {
	resources = window.game.app.loader.resources;
	// initialize input managers
	gamepads.init();
	keys.init({
		capture: [keys.LEFT, keys.RIGHT, keys.UP, keys.DOWN, keys.SPACE, keys.ENTER, keys.BACKSPACE, keys.ESCAPE, keys.W, keys.A, keys.S, keys.D, keys.P, keys.M]
	});
	mouse = new Mouse(window.game.app.view, false);

	setScene(new MenuScene());

	// setup screen filter
	screenFilter = new CustomFilter(resources.frag.data);

	// screenFilter.uniforms.uPaletteSampler = game.loader.resources.palette.texture;
	// screenFilter.uniforms.uBrightness = -1;
	// screenFilter.targetBrightness = 0;
	screenFilter.uniforms.redout = 0;
	screenFilter.uniforms.whiteout = 0;
	screenFilter.padding = 0;
	window.game.app.stage.filters = [screenFilter];

	// start main loop
	window.game.app.ticker.add(update);
	window.game.app.ticker.update();
}

function update() {
	// update
	activeScene.update();

	let g = resources.song1.data.volume() + 0.01;
	if (g < 1) {
		resources.song1.data.volume(Math.min(1, g));
	}
	g = resources.song2.data.volume() + 0.01;
	if (g < 0.25) {
		resources.song2.data.volume(Math.min(.25, g));
	}

	// update input managers
	gamepads.update();
	keys.update();
	mouse.update();
}

// function init(){
// 	// initialize input managers
// gamepads.init();
// 	keys.init({
// 		capture: [keys.LEFT,keys.RIGHT,keys.UP,keys.DOWN,keys.SPACE,keys.ENTER,keys.BACKSPACE,keys.ESCAPE,keys.W,keys.A,keys.S,keys.D,keys.P,keys.M]
// 	});
// 	mouse.init("canvas", false);

// 	// setup screen filter
// 	screen_filter = new CustomFilter(game.loader.resources.screen_shader.data);

// 	screen_filter.uniforms.uPaletteSampler = game.loader.resources.palette.texture;
// 	screen_filter.uniforms.uBrightness = -1;
// 	screen_filter.targetBrightness = 0;
// 	screen_filter.padding = 0;
// 	game.stage.filters = [screen_filter];

// 	// setup main loop
// 	var main = function(){
// 	    // update time
// 	    this.accumulator += game.ticker.elapsedMS;

// 	    // call render if needed
// 	    if (this.accumulator > this.timestep) {
// 	    	update();
// 	        this.accumulator -= this.timestep;
// 	    }
// 	}
// 	main.accumulator = 0;
// 	main.timestep = 1000/60; // target ms/frame
// 	game.ticker.add(main.bind(main));

// 	// start music
// 	sounds["music_menu"].play();
// 	sounds["music_menu"].fade(0,1,1000);

// 	// screen background
// 	(function(){
// 		g = new PIXI.Graphics();
// 		g.beginFill(0x333333,1);
// 		g.drawRect(0,0,size.x,size.y);
// 		g.endFill();
// 		t = g.generateTexture();
// 		bg = new PIXI.Sprite(t);
// 		g.destroy();
// 		game.stage.addChild(bg);
// 	}());

// 	scene = new PIXI.Container();
// 	game.stage.addChild(scene);

// 	palettes=[
// 		"good ol' green (gameboy)",
// 		"\"web\"-\"safe\"",
// 		"grayscale",
// 		"not so good ol' green",
// 		"diffused liquids",
// 		"1-bit",
// 		"gameboy (default)",
// 		"hallowe'en",
// 		"cmyk (zx spectrum)",
// 		"blue (commodore 64)",
// 		"crimson (pico-8)",
// 		"aqua (cga)",
// 		"pastel (gbc)",
// 		"taiga (master system)",
// 		"flat and dirty (db16)"
// 	];
// 	currentPalette = -1;
// 	swapPalette();

// 	menu = {};

// 	menu.options=[
// 		new PIXI.extras.BitmapText("option slot", fontStyle),
// 		new PIXI.extras.BitmapText("option slot", fontStyle),
// 		new PIXI.extras.BitmapText("option slot", fontStyle)
// 	];

// 	menu.descriptionTxt = new PIXI.extras.BitmapText("description slot", fontStyle);
// 	menu.descriptionTxt.position.x=32+20;
// 	menu.descriptionTxt.position.y=4;
// 	menu.descriptionTxt.tint=0xCCCCCC;
// 	menu.descriptionTxt.maxWidth=100;

// 	menu.selectionText = new PIXI.extras.BitmapText("[           ]", fontStyle);
//  	menu.selectionText.position.x = 4;
// 	menu.selectionText.maxLineHeight=1;
// 	menu.selectionText.maxWidth=size.x;
// 	menu.selectionText.tint=0x333333;

// 	menu.selectionBg = new PIXI.Graphics();
// 	menu.selectionBg.position.x = 4;
// 	menu.selectionBg.position.y = 4;
// 	menu.selectionBg.beginFill(0xCCCCCC);
// 	menu.selectionBg.drawRect(1,1,38,5);
// 	menu.selectionBg.endFill();

// 	for(var i=0; i < menu.options.length; ++i){
// 		menu.options[i].position=new PIXI.Point(4,4+8*i);
// 		menu.options[i].maxLineHeight=1;
// 		menu.options[i].maxWidth=size.x;
// 		menu.options[i].disable=function(){
// 			this.disabled=true;
// 			this.tint=0x666666;
// 		};menu.options[i].enable=function(){
// 			this.disabled=false;
// 			this.tint=0xCCCCCC;
// 		};

// 		menu.options[i].enable();
// 	}

// 	menu.selected=0;
// 	menu.nav=function(_by){
// 		// unhighlight current selection
// 		menu.options[menu.selected].text = menu.options[menu.selected].text.trim();
// 		menu.options[menu.selected].tint = menu.options[menu.selected].disabled ? 0x666666 : 0xCCCCCC;

// 		// update selection
// 		// wrap-around menu and skip over disabled options
// 		menu.selected+=_by;
// 		while(menu.selected  < 0|| menu.selected >= menu.options.length || menu.options[menu.selected].disabled){
// 			if(menu.selected < 0){
// 				menu.selected+=menu.options.length;
// 			}if(menu.selected >= menu.options.length){
// 				menu.selected-=menu.options.length;
// 			}if(menu.options[menu.selected].disabled){
// 				var s = Math.sign(_by);
// 				menu.selected += Math.abs(s) > 0 ? s : 1;
// 			}
// 		}

// 		// highlight new selection
// 		menu.options[menu.selected].text = " " + menu.options[menu.selected].text + " ";
// 		menu.options[menu.selected].tint = 0x333333;
// 		menu.selectionBg.position.y = 4+8*menu.selected;
// 		menu.selectionText.position.y = 4+8*menu.selected;

// 		menu.states[menu.states.current].nav();

// 		sounds["sfx_move"].play();
// 	};
// 	menu.navReset=function(){
// 		for(var i = 0; i < menu.options.length; ++i){
// 			menu.options[i].text=menu.options[i].text.trim();
// 			menu.options[i].tint = menu.options[i].disabled ? 0x666666 : 0xCCCCCC;
// 		}
// 		menu.selected=0;
// 		menu.nav(0);
// 	};
// 	menu.next=function(){
// 		menu.nav(1);
// 	};
// 	menu.prev=function(){
// 		menu.nav(-1);
// 	};
// 	menu.select=function(){
// 		if(!menu.validOptions){
// 			sounds["sfx_cancel"].play();
// 			return;
// 		}
// 		menu.states[menu.states.current].select();
// 		sounds["sfx_select"].play();
// 	};
// 	menu.cancel=function(){
// 		menu.states[menu.states.current].cancel();
// 		sounds["sfx_cancel"].play();
// 	};
// 	menu.update=function(){
// 		menu.states[menu.states.current].update();

// 		var inputs={
// 			up:
// 				keys.isJustDown(keys.UP) ||
// 				keys.isJustDown(keys.W) ||
// 				gamepads.isJustDown(gamepads.DPAD_UP) ||
// 				gamepads.axisJustPast(gamepads.LSTICK_V,-0.5) ||

// 				keys.isJustDown(keys.LEFT) ||
// 				keys.isJustDown(keys.A) ||
// 				gamepads.isJustDown(gamepads.DPAD_LEFT) ||
// 				gamepads.axisJustPast(gamepads.LSTICK_H,-0.5),

// 			down:
// 				keys.isJustDown(keys.DOWN) ||
// 				keys.isJustDown(keys.S) ||
// 				gamepads.isJustDown(gamepads.DPAD_DOWN) ||
// 				gamepads.axisJustPast(gamepads.LSTICK_V,0.5) ||

// 				keys.isJustDown(keys.RIGHT) ||
// 				keys.isJustDown(keys.D) ||
// 				gamepads.isJustDown(gamepads.DPAD_RIGHT) ||
// 				gamepads.axisJustPast(gamepads.LSTICK_H,0.5),

// 			select:
// 				keys.isJustDown(keys.Z) ||
// 				keys.isJustDown(keys.ENTER) ||
// 				keys.isJustDown(keys.SPACE) ||
// 				gamepads.isJustDown(gamepads.A) ||
// 				gamepads.isJustDown(gamepads.Y),

// 			cancel:
// 				keys.isJustDown(keys.X) ||
// 				keys.isJustDown(keys.BACKSPACE) ||
// 				keys.isJustDown(keys.ESCAPE) ||
// 				gamepads.isJustDown(gamepads.B) ||
// 				gamepads.isJustDown(gamepads.X)
// 		};

// 		var dir=[0,0];
// 		if(inputs.up){
// 			dir[1]-=1;
// 		}if(inputs.down){
// 			dir[1]+=1;
// 		}

// 		if(dir[1] > 0){
// 			menu.next();
// 		}else if(dir[1] < 0){
// 			menu.prev();
// 		}


// 		if(inputs.select){
// 			menu.select();
// 		}
// 		if(inputs.cancel){
// 			menu.cancel();
// 		}
// 	}

// 	menu.states={
// 		"main_menu":{
// 			init:function(){
// 				menu.options[0].text="start";
// 				menu.options[1].text="options";
// 				menu.options[2].text="about";

// 				for(var i = 0; i < menu.options.length; ++i){
// 					menu.options[i].enable();
// 				}

// 				// if(!menu.pocket_sprite){
// 				// 	menu.pocket_sprite=new PIXI.Sprite(PIXI.Texture.fromFrame("pocket_edition.png"));
// 				// 	menu.pocket_sprite.position.x=size.x-menu.pocket_sprite.width-4;
// 				// 	menu.pocket_sprite.position.y=size.y-menu.pocket_sprite.height-36;
// 				// 	menu.addChild(menu.pocket_sprite);
// 				// }

// 				// if(!menu.title_sprite){
// 				// 	menu.title_sprite=new PIXI.Sprite(PIXI.Texture.fromFrame("title.png"));
// 				// 	menu.title_sprite.position.x=size.x/2;
// 				// 	menu.title_sprite.anchor.x=0.5;
// 				// 	menu.title_sprite.anchor.y=0.5;
// 				// 	menu.addChild(menu.title_sprite);
// 				// }
// 			},
// 			update:function(){
// 				//menu.title_sprite.position.y=size.y*0.3+Math.sin(curTime/1000)*3;
// 			},
// 			nav:function(){
// 				var s="";
// 				switch(menu.selected){
// 					case 0:
// 						s="start a new game";
// 						break;
// 					case 1:
// 						s="change sound, palette, and scale settings";
// 						break;
// 					case 2:
// 						s="made by @seansleblanc for #gbjam 5\nwith pixi . js";
// 						break;
// 				}
// 				menu.descriptionTxt.text=s;
// 			},
// 			select:function(){
// 				var s="";
// 				switch(menu.selected){
// 					case 0:
// 						s="select_party_member";
// 						menu.pocket_sprite.destroy();
// 						menu.pocket_sprite=null;
// 						menu.title_sprite.destroy();
// 						menu.title_sprite=null;

// 						startGame();
// 						break;
// 					case 1:
// 						s="options_menu";
// 						break;
// 					case 2:
// 						return;
// 						break;
// 				}


// 				menu.states.set(s);
// 			},
// 			cancel:function(){
// 				// nowhere to quit to
// 			}
// 		},
// 		"options_menu":{
// 			init:function(){
// 				menu.options[0].text="sound";
// 				menu.options[1].text="palette";
// 				menu.options[2].text="scale";

// 				for(var i = 0; i < menu.options.length; ++i){
// 					menu.options[i].enable();
// 				}
// 			},
// 			update:function(){
// 				//menu.title_sprite.position.y=size.y*0.3+Math.sin(curTime/1000)*3;
// 			},
// 			nav:function(){
// 				var s="";
// 				switch(menu.selected){
// 					case 0:
// 						s="select to "+(Howler._muted ? "unmute" : "mute") + " audio";
// 						break;
// 					case 1:
// 						s="select to change palette\ncurrent: " + palettes[currentPalette];
// 						break;
// 					case 2:
// 						s=["pixel-perfect (largest multiple of 160x144)","scale to fit","pixel-perfect (1 : 1)"];
// 						s=s[scaleMode];
// 						break;
// 				}
// 				menu.descriptionTxt.text=s;
// 			},
// 			select:function(){
// 				var s=menu.descriptionTxt.text;
// 				switch(menu.selected){
// 					case 0:
// 					toggleMute();
// 						s="select to "+(Howler._muted ? "unmute" : "mute") + " audio";
// 						break;
// 					case 1:
// 						swapPalette();
// 						s="select to change palette\ncurrent: " + palettes[currentPalette];
// 						break;
// 					case 2:
// 						scaleMode+=1;
// 						scaleMode%=3;
// 						s=["pixel-perfect (largest multiple of 160x144)","scale to fit","pixel-perfect (1 : 1)"];
// 						s=s[scaleMode];
// 						onResize();
// 						break;
// 				}
// 				menu.descriptionTxt.text=s;
// 			},
// 			cancel:function(){
// 				menu.states.set("main_menu");
// 			}
// 		},

// 		current:null,

// 		set: function(state){
// 			// switch state
// 			menu.states.current = state;

// 			// initialize the new state
// 			menu.states[menu.states.current].init();

// 			// make sure there's at least one enabled option
// 			menu.validOptions=false;
// 			for(var i = 0; i < menu.options.length; ++i){
// 				if(!menu.options[i].disabled){
// 					menu.validOptions = true;
// 					break;
// 				}
// 			}
// 			menu.selectionBg.visible=menu.validOptions;
// 			menu.selectionText.visible=menu.validOptions;
// 			if(!menu.validOptions){
// 				return;
// 			}

// 			// select the first menu item in the new state
// 			menu.navReset();
// 		}
// 	};

// 	menu.states.set("main_menu");



//     menu.container = new PIXI.Container();
//     menu.container.position.y = size.y-32;

//     // pointer
// 	pointer=new PIXI.Container();
// 	pointer.actualSprite=new PIXI.Sprite(PIXI.Texture.fromFrame("pointer.png"));
// 	pointer.actualSprite.anchor.x=1/8;
// 	pointer.actualSprite.anchor.y=1/8;
// 	pointer.addChild(pointer.actualSprite);
// 	pointer.position.x=10;
// 	pointer.position.y=10;


//     menu.container.addChild(menu.selectionBg);
//     menu.container.addChild(menu.selectionText);
// 	for(var i=0; i < menu.options.length; ++i){
//     	menu.container.addChild(menu.options[i]);
// 	}
// 	menu.container.addChild(menu.descriptionTxt);


// 	grid = [];
// 	for(var y = 0; y < 100; ++y){
// 		grid[y]=[];
// 	for(var x = 0; x < 100; ++x){
// 		grid[y][x]=Math.round(1-Math.random()*Math.random());
// 	}
// 	}
// 	grid[0][0]=1;
// 	grid.containers = {
// 		layout: new PIXI.Container(),
// 		connections: new PIXI.Container(),
// 		overlay: new PIXI.Container()
// 	};
// 	grid.container = new PIXI.Container();
// 	for(var i in grid.containers){
// 		if(grid.containers.hasOwnProperty(i)){
// 			grid.container.addChild(grid.containers[i]);
// 		}
// 	}
// 	(function(){
// 		var g = new PIXI.Graphics();
// 		g.beginFill(0xFFFFFF,1);
// 		g.drawRect(0,0,size.x,size.y*0.5764);
// 		g.endFill();
// 		grid.container.mask = new PIXI.Sprite(g.generateTexture());
// 		g.destroy();
// 	}())
// 	addLerp(grid.container,0.05);
// 	grid.cellWidth = 6;
// 	grid.cellHeight = 6;
// 	grid.container.lerp.t.x = grid.container.x = size.x/2;
// 	grid.container.lerp.t.y = grid.container.y = size.y*0.5764/2;
// 	for(var y = 0; y < grid.length; ++y){
// 	for(var x = 0; x < grid[y].length; ++x){
// 		if(grid[y][x]){
// 			var g = grid[y][x] = {};
// 			g.connects = [];
// 			var s = g.spr = new PIXI.Sprite(PIXI.Texture.fromFrame("room.png"));
// 			s.visible = false;
// 			s.x = x*(grid.cellWidth);
// 			s.y = y*(grid.cellHeight);
// 			s.anchor.x = 0.5;
// 			s.anchor.y = 0.5;
// 			grid.containers.layout.addChild(s);
// 		}
// 	}
// 	}

// 	for(var y = 0; y < grid.length; ++y){
// 	for(var x = 0; x < grid[y].length; ++x){
// 		var g1 = grid[y][x];
// 		if(g1){
// 			var t=[
// 				{x:-1,y:0},
// 				{x:0,y:-1},
// 				{x:1,y:0},
// 				{x:0,y:1}
// 			]
// 			for(var z = 0; z < t.length; ++z){
// 				var o = t[z];
// 				var x2=x+o.x;
// 				var y2=y+o.y;
// 				var g2 = grid[y2] && grid[y2][x2];
// 				if(g2){
// 					var s = new PIXI.Sprite(PIXI.Texture.fromFrame("connect.png"));
// 					s.x = (x+(x2-x)/2)*(grid.cellWidth);
// 					s.y = (y+(y2-y)/2)*(grid.cellHeight);
// 					s.anchor.x = 0.5;
// 					s.anchor.y = 0.5;
// 					s.rotation = Math.abs(o.x)>Math.abs(o.y) ? 0 : Math.PI/2;
// 					s.visible = false;
// 					grid.containers.connections.addChild(s);
// 					g1.connects.push(s);
// 					g2.connects.push(s);

// 					if(!g2.door){
// 						s = new PIXI.Sprite(PIXI.Texture.fromFrame("door.png"));
// 						s.x = (x+(x2-x))*(grid.cellWidth);
// 						s.y = (y+(y2-y))*(grid.cellHeight);
// 						s.anchor.x = 0.5;
// 						s.anchor.y = 0.5;
// 						//s.rotation = Math.abs(o.x)>Math.abs(o.y) ? 0 : Math.PI/2;
// 						s.visible = false;
// 						grid.containers.overlay.addChild(s);
// 						g2.door = s;
// 					}
// 					g1.connects.push(g2.door);
// 				}
// 			}
// 		}
// 	}
// 	}
// 	player = {
// 		spr: new PIXI.Sprite(PIXI.Texture.fromFrame("player.png")),
// 		x: 0,
// 		y: 0
// 	};
// 	player.spr.anchor.x = player.spr.anchor.y = 0.5;
// 	addLerp(player.spr,0.2);
// 	grid.container.addChild(player.spr);

// 	frame = new PIXI.Sprite(PIXI.Texture.fromFrame("frame.png"));
// 	scene.addChild(grid.container);
// 	//scene.addChild(menu.container);
// 	scene.addChild(frame);
// 	scene.addChild(pointer);

// 	var hp = new PIXI.Container();
// 	for(var i = 0; i < 10; ++i){
// 		var s = new PIXI.Sprite(PIXI.Texture.fromFrame("hp-full.png"));
// 		s.anchor.y = 1;
// 		s.x = i*(s.width-1);
// 		hp.addChild(s);
// 	}

// 	var sp = new PIXI.Container();
// 	for(var i = 0; i < 10; ++i){
// 		var s = new PIXI.Sprite(PIXI.Texture.fromFrame("sp-full.png"));
// 		s.anchor.y = 1;
// 		s.x = i*(s.width-1);
// 		sp.addChild(s);
// 	}
// 	scene.addChild(hp);
// 	scene.addChild(sp);
// 	hp.x = 6;
// 	hp.y = 82;
// 	sp.x = 6;
// 	sp.y = 82 - 9;
// 	// start the main loop
// 	window.onresize = onResize;
// 	_resize();
// 	game.ticker.update();
// }



// function startGame(){
// 	game.started=true;
// 	screen_filter.uniforms.uBrightness=1;
// }

// function update(){

// 	if(!game.started){
// 		menu.update();
// 	}else{

// 	}

// 	if(Math.abs(screen_filter.uniforms.uBrightness - screen_filter.targetBrightness) < 0.025){
// 		screen_filter.uniforms.uBrightness= screen_filter.targetBrightness;
// 	}else{
// 		screen_filter.uniforms.uBrightness -= Math.sign(screen_filter.uniforms.uBrightness - screen_filter.targetBrightness)*0.025;
// 	}



// 	// update lerps
// 	for(var i = 0; i < lerps.length; ++i){
// 		lerps[i].spr.position.y = lerp(lerps[i].spr.position.y, lerps[i].t.y, lerps[i].by);
// 		lerps[i].spr.position.x = lerp(lerps[i].spr.position.x, lerps[i].t.x, lerps[i].by);
// 	}


// 	// shortcuts for mute/palette swap
// 	if(keys.isJustDown(keys.M)){
// 		toggleMute();
// 		sounds["sfx_select"].play();
// 	}
// 	if(keys.isJustDown(keys.P)){
// 		swapPalette();
// 		sounds["sfx_select"].play();
// 	}


// 	var input = getInput();
// 	if(input.up && grid[player.y-1] && grid[player.y-1][player.x]){
// 		player.y -= 1;
// 		grid.container.lerp.t.y += grid.cellHeight;
// 	}
// 	if(input.down && grid[player.y+1] && grid[player.y+1][player.x]){
// 		player.y += 1;
// 		grid.container.lerp.t.y -= grid.cellHeight;
// 	}
// 	if(input.left && grid[player.y][player.x-1]){
// 		player.x -= 1;
// 		grid.container.lerp.t.x += grid.cellWidth;
// 	}
// 	if(input.right && grid[player.y][player.x+1]){
// 		player.x += 1;
// 		grid.container.lerp.t.x -= grid.cellWidth;
// 	}
// 	player.spr.lerp.t.x = player.x*grid.cellWidth;
// 	player.spr.lerp.t.y = player.y*grid.cellHeight;
// 	var g = grid[player.y][player.x];
// 	g.spr.visible = true;
// 	g.door.renderable = false;
// 	for(var i = 0; i < g.connects.length; ++i){
// 		g.connects[i].visible = true;
// 	}

// 	// update input managers
// 	gamepads.update();
// 	keys.update();
// 	mouse.update();

// 	// keep mouse within screen
// 	mouse.pos.x = clamp(0, mouse.pos.x, (size.x-2) * scaleMultiplier);
// 	mouse.pos.y = clamp(0, mouse.pos.y, (size.y-2) * scaleMultiplier);
// 	// update pointer
// 	pointer.x = Math.round(mouse.pos.x/scaleMultiplier);
// 	pointer.y = Math.round(mouse.pos.y/scaleMultiplier);
// }


// lerps=[];
// function addLerp(_spr,_by){
// 	var l={
// 		t:{
// 			x:_spr.position.x,
// 			y:_spr.position.y,
// 		},
// 		spr:_spr,
// 		by:_by||0.1
// 	};

// 	_spr.lerp=l;
// 	lerps.push(l);
// }


// function swapPalette(){
// 	currentPalette = (currentPalette + 1) % palettes.length;
// 	screen_filter.uniforms.uPalette = currentPalette / palettes.length + .5/palettes.length;
// 	var s = new PIXI.Sprite(screen_filter.uniforms.uPaletteSampler);
// 	var c = game.renderer.plugins.extract.pixels(s).slice(currentPalette * 4 * 4,(currentPalette + 1) * 4 * 4);
// 	document.body.style.background = 'rgba(' + c[0] + ', ' + c[1] + ', ' + c[2] + ', ' + c[3] / 255 + ')';
// }
// function toggleMute(){
// 	if(Howler._muted){
// 		Howler.unmute();
// 	}else{
// 		Howler.mute();
// 	}
// }


// function flash(_dark){
// 	screen_filter.uniforms.uBrightness+=0.25 * (_dark ? -1 : 1);
// }


// function getInput(){
// 	var res = {
// 		up: false,
// 		down: false,
// 		left: false,
// 		right: false,
// 		confirm: false,
// 		cancel: false
// 	};

// 	res.up |= keys.isJustDown(keys.UP);
// 	res.up |= keys.isJustDown(keys.W);
// 	res.up |= gamepads.isJustDown(gamepads.DPAD_UP);
// 	res.up |= gamepads.axisJustPast(gamepads.LSTICK_V, 0.5);

// 	res.down |= keys.isJustDown(keys.DOWN);
// 	res.down |= keys.isJustDown(keys.S);
// 	res.down |= gamepads.isJustDown(gamepads.DPAD_DOWN);
// 	res.down |= gamepads.axisJustPast(gamepads.LSTICK_V, -0.5);

// 	res.left |= keys.isJustDown(keys.LEFT);
// 	res.left |= keys.isJustDown(keys.A);
// 	res.left |= gamepads.isJustDown(gamepads.DPAD_LEFT);
// 	res.left |= gamepads.axisJustPast(gamepads.LSTICK_H, -0.5);

// 	res.right |= keys.isJustDown(keys.RIGHT);
// 	res.right |= keys.isJustDown(keys.D);
// 	res.right |= gamepads.isJustDown(gamepads.DPAD_RIGHT);
// 	res.right |= gamepads.axisJustPast(gamepads.LSTICK_H, 0.5);

// 	return res;
// }
