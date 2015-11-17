// size -> information about the dimensions of the box mapped on the boxGeometry arguments
// noiseSeed -> information that feeds the perlin. Each map shoud have his own noiseSeed.
// colors -> left color and right color. R,G and B components are between 0 and 1.
// size = {
//     width: ,
//     height: ,
//     depth: ,
//     widthSeg: ,
//     heightSeg: ,
//     depthSeg: 
// };
// noiseSeed = float;
// var colors = {
//		first : { r: float, g: float, b: float },
//		second : { r: float, g: float, b: float }
//	};

var Ilot = function(size, noiseSeed, colors) {
	this.noiseSeed = noiseSeed;
	this.size = size;
	this.colors = colors;

	// the frequence of mountains
	this.factorPerlin = 0.04;
	// the high of mountains and gaps 
	this.influencePerlin = {
		x: 4,
		y: 8,
		z: 4
	};
	// width of the flate part and color gradiant
	this.marginValley = 6;

	// Size object
	this.topVertexValue = this.size.height / 2 ;
	this.bottomVertexValue = - this.size.height / 2 ;

	this.Geometry = new THREE.SphereGeometry(boxSize.width, boxSize.widthSeg, boxSize.depthSeg);
	this.pancake();
	this.destord();
	this.Geometry.dynamic = true;

	for( i = 0 ; i < this.Geometry.faces.length ; i++ )
	{
		this.Geometry.faces[i].color = this.Geometry.colors[ this.Geometry.faces[i].a ];
	}
	this.Material = new THREE.MeshLambertMaterial( {
		vertexColors: THREE.VertexColors,
		shading: THREE.FlatShading,
		castShadow: true,
		receiveShadow: true
	});

	this.mesh = new THREE.Mesh(this.Geometry, this.Material);
	this.mesh.castShadow = true;
	this.mesh.receiveShadow = true;
	this.mesh.name = 'ilot';
};

// Create topology
Ilot.prototype.destord = function() {
	noise.seed(this.noiseSeed);

	var displacement;
	var valley = 1;
	var type;
	var available = {
		x: this.size.width / this.size.widthSeg,
		z: this.size.depth / this.size.depthSeg
	};
	// var distXZ;

	for ( i = 0; i < this.Geometry.vertices.length; i++){

		displacement = {
				x: 0,
				y: 0,
				z: 0
			};

		//// DEFINITION SIDE PAR VERTEX
		// Si appartien face du haut
		if ( this.Geometry.vertices[i].y == this.topVertexValue )
			type = 'top';
		// Si appartien face du bas
		else if ( this.Geometry.vertices[i].y == this.bottomVertexValue )
			type = 'bottom';
		// Si appartien face de côté
		else
			type = 'side';


		this.Geometry.vertices[i].x += ( available.x ) - ( available.x / 2 );
		this.Geometry.vertices[i].z += ( available.z ) - ( available.z / 2 );

		// bottom points
		if ( type == 'bottom' ){
			//// the slope for the bottom
			displacement.y = -17 + ( 0.4 * Math.sqrt( this.Geometry.vertices[i].x * this.Geometry.vertices[i].x + this.Geometry.vertices[i].z * this.Geometry.vertices[i].z ) );
			if (displacement.y > -2)
				displacement.y = -2;

			// Perlin noise and random y
			displacement.y += ( this.influencePerlin.y * noise.simplex2(this.Geometry.vertices[i].x * this.factorPerlin, this.Geometry.vertices[i].z * this.factorPerlin) ) - ( Math.random() * 5 * ( - displacement.y * 0.3 ) );
		}
		// Other points
		else {
			// Perlin noise y
			displacement.y += ( ( this.influencePerlin.y * noise.simplex2(this.Geometry.vertices[i].x * this.factorPerlin, this.Geometry.vertices[i].z * this.factorPerlin) ) + 2 );
		}

		// Perlin noise and random x
		displacement.x = ( this.influencePerlin.x * noise.simplex2(this.Geometry.vertices[i].x * this.factorPerlin, this.Geometry.vertices[i].z * this.factorPerlin) );
		this.Geometry.vertices[i].x = this.Geometry.vertices[i].x + ( displacement.x + Math.random() );
		
		// Perlin noise and random z
		displacement.z = ( this.influencePerlin.z * noise.simplex2(this.Geometry.vertices[i].x * this.factorPerlin, this.Geometry.vertices[i].z * this.factorPerlin) );
		this.Geometry.vertices[i].z = this.Geometry.vertices[i].z + ( displacement.z + Math.random() );

		// Flatten for the valley
		if ( type == 'top' || type == 'side') {
			if ( this.Geometry.vertices[i].x >= - this.marginValley && this.Geometry.vertices[i].x <= this.marginValley )
				valley = 0;
			else
				valley = 1;
		}
		this.Geometry.vertices[i].y =  this.Geometry.vertices[i].y + ( displacement.y + Math.random() ) * valley;


		this.colorVertices(i, type);
	}


	this.Geometry.colorsNeedUpdate = true;
	this.Geometry.computeFaceNormals();

};

// Color point on their position
Ilot.prototype.colorVertices = function(i, type) {

	var color = { r: 0, g: 0, b: 0 };

	// color mountains
	var brown_moutain = { r: 0.5607, g: 0.4352, b: 0.1 };
	// color high bottom part
	var brown_bottom__light = { r: 0.5372, g: 0.3529, b: 0.0431 };
	// color low bottom part
	var brown_bottom__dark = { r: 0.4313, g: 0.3058, b: 0.0862 };

	// IF TOP
	if ( type == 'top' ) {
		// COLOR 1
		if ( this.Geometry.vertices[i].x <= - this.marginValley )
			color = clone(this.colors.first);
		// COLOR 2
		else if ( this.Geometry.vertices[i].x >= this.marginValley )
			color = clone(this.colors.second);
		// MIDDLE GRADIANT
		else{
			color.r = mapper(this.Geometry.vertices[i].x, -this.marginValley, this.marginValley, this.colors.first.r, this.colors.second.r);
			color.g = mapper(this.Geometry.vertices[i].x, -this.marginValley, this.marginValley, this.colors.first.g, this.colors.second.g);
			color.b = mapper(this.Geometry.vertices[i].x, -this.marginValley, this.marginValley, this.colors.first.b, this.colors.second.b);
		}

		// MIDDLE MOUNTAIN
		if(this.Geometry.vertices[i].y > 1 && this.Geometry.vertices[i].y < 8) {
			color.r = mapper(this.Geometry.vertices[i].y, 2, 8, color.r, brown_moutain.r);
			color.g = mapper(this.Geometry.vertices[i].y, 2, 8, color.g, brown_moutain.g);
			color.b = mapper(this.Geometry.vertices[i].y, 2, 8, color.b, brown_moutain.b);
		}
		// HIGH MOUNTAIN
		else if(this.Geometry.vertices[i].y > 8)
			color = clone(brown_moutain);
	}

	// IF BOTTOM
	else  if ( type == 'bottom' ){
		color.r = mapper(this.Geometry.vertices[i].y, 1, -8, brown_bottom__light.r, brown_bottom__dark.r);
		color.g = mapper(this.Geometry.vertices[i].y, 1, -8, brown_bottom__light.g, brown_bottom__dark.g);
		color.b = mapper(this.Geometry.vertices[i].y, 1, -8, brown_bottom__light.b, brown_bottom__dark.b);
	}

	// IF SIDES
	else{
		color.r = mapper(this.Geometry.vertices[i].y, 1, -3, brown_bottom__light.r, brown_bottom__dark.r);
		color.g = mapper(this.Geometry.vertices[i].y, 1, -3, brown_bottom__light.g, brown_bottom__dark.g);
		color.b = mapper(this.Geometry.vertices[i].y, 1, -3, brown_bottom__light.b, brown_bottom__dark.b);
	}

	// set color ading little random
	color = new THREE.Color(color.r + ( Math.random() * 0.1 - 0.05 ) , color.g + ( Math.random() * 0.1 - 0.05 ) , color.b + ( Math.random() * 0.1 - 0.05 ) );

	this.Geometry.colors.push(color);

};
Ilot.prototype.pancake = function(i, type) {

	for ( i = 0; i < this.Geometry.vertices.length; i++){


		// rotate points
		var axis = new THREE.Vector3( 0, 0, 1 );
		var angle = Math.PI / 2;
		this.Geometry.vertices[i] = this.Geometry.vertices[i].applyAxisAngle( axis, angle );

		// flatten the sphere
		if ( this.Geometry.vertices[i].y > this.topVertexValue )
			this.Geometry.vertices[i].y = this.topVertexValue;
		else if ( this.Geometry.vertices[i].y > this.bottomVertexValue )
			this.Geometry.vertices[i].y = this.topVertexValue;
	}

};