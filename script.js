
// global variables
var renderer;
var scene;
var camera;
var cameraControl;
var stats;


function init() {
    
    scene = new THREE.Scene();


    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    var cubeGeometry = new THREE.BoxGeometry(6, 4, 6);
    var cubeMaterial = new THREE.MeshLambertMaterial({wireframe: true});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    scene.add(cube);

    camera.position.x = 15;
    camera.position.y = 16;
    camera.position.z = 13;
    camera.lookAt(scene.position);
    cameraControl = new THREE.OrbitControls(camera);


    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(10, 20, 20);
    spotLight.shadowCameraNear = 20;
    spotLight.shadowCameraFar = 50;
    scene.add(spotLight);
    
    var ambientLight = new THREE.AmbientLight(0x999999);
    scene.ass(ambientLight);

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
