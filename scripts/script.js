
// global variables
var renderer;
var scene;
var camera;
var cameraControl;
var stats;
// current number of share
var shared = 150;
// most shared wall's value of share
var maxShared = 200;
// Dimension of the ilot
var boxSize= {
		width: 70,
		height: 2,
		depth: 70,
		widthSeg: 50,
		heightSeg: 5,
		depthSeg: 50
	};
// colors of the two parts of the top surface
var colors = {
		first : { r: 0.9137, g: 0.6784, b: 0.3294 },
		second : { r: 0.7843, g: 0.6901, b: 0.4352 }
	};
// Each wall shoud have its own value seed. It will create the same topology each time it's realoded
// var seeder = 1565131650;
var seeder = Math.random();
// url model
var url = 'models/1.json';
//event sent when wall build
var build = new Event('buildWall');

function init() {
	
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x08080b, 1.0);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;


	var topLight = new THREE.SpotLight(0xffffff);
	topLight.position.set(50, 30, 50);
	topLight.target.position.z = -10;
	topLight.shadowCameraNear = 20;
	// intensity is set by the most shared wall's value of share
	topLight.intensity = mapper(shared, 0, maxShared, 0.2, 2);
	topLight.shadowCameraFar = 200;
	scene.add(topLight);

	var bottomLight = new THREE.SpotLight(0xffffff);
	bottomLight.position.set(0, -30, 10);
	bottomLight.target.position.z = -10;
	bottomLight.shadowCameraNear = 20;
	bottomLight.intensity = 1;
	bottomLight.shadowCameraFar = 50;
	scene.add(bottomLight);
	
	var ambientLight = new THREE.AmbientLight(0x444444);
	scene.add(ambientLight);


	this.ilot = new Ilot(boxSize, seeder, colors);
	this.ilot.mesh.receiveShadow = true;
	scene.add(this.ilot.mesh);

	
	this.wall = new Wall(url);
	// createte the wall when he's downloaded
	this.addEventListener('buildWall', function(event) {
		this.wall.mesh.scale.set(4.8, 4.8, 4.8);
		this.wall.mesh.rotation.y = Math.PI / 2;
		this.wall.mesh.position.y = 1;
		this.wall.mesh.castShadow = true;
		scene.add(this.wall.mesh);
	});

	camera.position.x = 60;
	camera.position.y = 68;
	camera.position.z = 52;
	camera.lookAt(scene.position);
	cameraControl = new THREE.OrbitControls(camera);

	addStatsObject();

	document.body.appendChild(renderer.domElement);

	render();
}


function render() {
	stats.update();
	cameraControl.update();
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}


function addStatsObject() {
	stats = new Stats();
	stats.setMode(0);

	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	document.body.appendChild(stats.domElement);
}

function handleResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;
window.addEventListener('resize', handleResize, false);







// This function needs to be displaced in a more appropriate place
function clone(obj) {
	if (null === obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}