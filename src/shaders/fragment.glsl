
#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')

varying vec2 v_uv;
uniform vec2 u_mouse;
uniform vec2 u_res;
uniform float u_time;
uniform sampler2D u_image;
uniform sampler2D u_imagehover;

float inCircle(vec2 currentCoord, vec2 origin, float radius, float edge) {
    float lengthToOrigin = distance(currentCoord, origin);
    
    // If currentCoord is outside of the circle, return black
    return smoothstep(lengthToOrigin - edge, lengthToOrigin + edge, radius);
}

void main() {
	vec2 res = u_res * pixelRatio;
	float aspectRatio = res.x / res.y;

	vec2 currentCoord = gl_FragCoord.xy / res;
	currentCoord.y = currentCoord.y / aspectRatio;

	vec2 mouse = u_mouse / u_res; 
	mouse.y = (1. - mouse.y) / aspectRatio;

	// Noise - function output runs between [-1, 1]
	// but we will subtract it by -1 to make sure that if it's used alone,
	// it can only render a black color
	float offx = currentCoord.x + sin(currentCoord.y + u_time * .1);
	float offy = currentCoord.y - u_time * 0.1 - cos(u_time * .001) * .01;
	float n = snoise3(vec3(offx, offy, u_time / 100.) * 10.) - 1.;

	// Make sure we create a circle with edge + smoothstep, because we need that edge
	// to be able to combine with the noise constant ^
	// If we use a full, normal circle, the output will only be 0 and 1.
	// We want the smooth-stepped values in between so that (inCircle + n)
	// will produce smooth values when the noise values approach near the circle edge
	float inCircle = inCircle(currentCoord, mouse, 0.1, 0.1) * 3.;

	float finalMask = smoothstep(0.1, 0.9, inCircle + n);

	vec4 image = texture2D(u_image, v_uv);
	vec4 hoverImage = texture2D(u_imagehover, v_uv);
	
	vec4 finalImage = mix(image, vec4(1.), finalMask);
	// vec4 finalImage = mix(image, hoverImage, finalMask);

	// gl_FragColor = vec4(vec3(finalMask), 1.);
	gl_FragColor = finalImage;
}
