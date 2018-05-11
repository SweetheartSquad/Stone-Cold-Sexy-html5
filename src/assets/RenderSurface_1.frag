precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float whiteout;
uniform float redout;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
float rand(float x, float y){
	return rand(vec2(x, y));
}

void main(void) {
	// get pixels
	vec2 r = vTextureCoord;
	vec2 p = r;
	
	// distort uvs
	r.x += (0.5 - r.x) * 0.25;
	r.y += (0.5 - r.y) * 0.25;

	r.x += (p.x - r.x) * (1.0-redout+whiteout);
	r.y += (p.y - r.y) * (1.0-redout+whiteout);

	// original
	vec4 orig = vec4(texture2D(uSampler, vTextureCoord) );

	// new
	vec4 col = vec4(texture2D(uSampler, r) );
    col.r += (1.0 - orig.r)*(redout+(whiteout*3.0));
    col.rgb += vec3(whiteout);
	
	// combined
	float centerD = distance(p, vec2(0.5, 0.65));
	float mixAmount = max(0.0, 0.5 - centerD);
	mixAmount += whiteout;

	vec4 outColor = mix(orig, col, mixAmount);
	vec4 t = outColor;
	if(centerD < 0.4){
		outColor *= max(orig, col);
		outColor /= min(orig, col);
		outColor = mix(t, outColor, max(0.0, 0.4 - centerD));
	}
	gl_FragColor = outColor;
}
