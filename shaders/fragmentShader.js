var fragmentShader = [

	
		'float rand(vec2 co) {',
			'return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);',
		'}',
		'float mapper(float val, float oMin, float oMax, float nMin, float nMax) {',
			'val = val - oMin;',
			'oMax = oMax - oMin;',
			'nMax = nMax - nMin;',
			'return ( ( val * nMax ) / oMax ) + nMin;',
		'}',


		'uniform float middleSize;',
		'uniform vec3 first;',
		'uniform vec3 second;',
		'varying float type;',
		'varying vec2 vUV;',
		'varying vec3 pos;',
		'varying vec3 vNormal;',

		'vec3 color;',
		'float addUV;',
		'vec3 influencedFirst;',
		'vec3 influencedSecond;',
		'vec3 brown;',
		'vec3 brownBottom;',

		'void main() {',

			'addUV = vUV.x + vUV.y;',
			'brown = vec3(0.5607, 0.4196, 0.1764);',

			'// if top',
			'if ( type == 1. ){',
				'// COLOR 1',
				'if ( addUV < ( 1. - middleSize ) )',
					'color = first;',
				'// COLOR 2',
				'else if ( addUV > ( 1. + middleSize ) )',
					'color = second;',
				'// MIDDLE',
				'else {',
					'// influencedSecond = ( ( addUV - ( 1. - middleSize) ) * ( 1. / ( middleSize + middleSize ) ) ) * second;',
					'// influencedFirst = ( - ( addUV - ( 1. + middleSize ) ) * ( 1. / ( middleSize + middleSize ) ) ) * first;',

					'color.x = mapper(addUV, 1. - middleSize, 1. + middleSize, first.x, second.x);',
					'color.y = mapper(addUV, 1. - middleSize, 1. + middleSize, first.y, second.y);',
					'color.z = mapper(addUV, 1. - middleSize, 1. + middleSize, first.z, second.z);',
				'}',

				'// MIDDLE MOUNTAIN',
				'if(pos.y > 1. && pos.y < 3.){',
					'color.x = mapper(pos.y, 1., 3., color.x, brown.x);',
					'color.y = mapper(pos.y, 1., 3., color.y, brown.y);',
					'color.z = mapper(pos.y, 1., 3., color.z, brown.z);',
				'}',
				'// HIGH MOUNTAIN',
				'else if(pos.y > 3.)',
					'color = brown;',


			'}',

			'// IF BOTTOM',
			'else  if ( type == 2. ){',
				'color.x = mapper(pos.y, 0., -3., 0.6313, 0.4313);',
				'color.y = mapper(pos.y, 0., -3., 0.5058, 0.3058);',
				'color.z = mapper(pos.y, 0., -3., 0.2862, 0.0862);',

			'}',
			'// IF SIDES',
			'else{',
				'color = brown + rand(vec2(pos.y,pos.y)) * 0.1;',
			'}',

			'// color = color + vNormal * 0.01;',
			'gl_FragColor = vec4(color, 1);',

		'}'

].join('\n');