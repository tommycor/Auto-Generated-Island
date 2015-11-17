var vertexShader = [

	
	'attribute float side;',

	'varying float type;',
	'varying vec2 vUV;',
	'varying vec3 pos;',
	'varying vec3 vNormal;',

	'void main() {',

		'vNormal = normal;',
		'vUV = uv;',
		'pos = position;',

		'type = side;',

		'gl_Position = projectionMatrix * modelViewMatrix * vec4( position , 1.0 );',

	'}'


].join('\n');