var mesh;

var Wall = function(url) {

	_this = this;
	_this.mesh = mesh;

	var loaderObject = new THREE.JSONLoader();

	loaderObject.load(url, function(geometry){
		
		_this.geometry = geometry;
		_this.material = new THREE.MeshLambertMaterial( {
			color: 0x777777,
			specular: 0xffffff
			// map: THREE.ImageUtils.loadTexture("models/AO-1.jpg")
		});

		_this.mesh = new THREE.Mesh(_this.geometry, _this.material);
		_this.mesh.name = 'wall';

		this.dispatchEvent(build);
	});


};

Wall.prototype.getMesh = function( geometry ) {
	return this.mesh;
};