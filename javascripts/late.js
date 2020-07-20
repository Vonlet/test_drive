var stats, intersects, intersected;
var scene, camera, rascaster, renderer, spotLight, sphere, plane;
var Pi = 3.1415926535;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

init();
animate();

function init(){
  camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight, 0.1, 1000);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  var sphereGeometry = new THREE.SphereGeometry(50);
  var sphereMaterial = new THREE.MeshStandardMaterial();
  var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
  sphere.name = "PlaneFloor";
  sphere.receiveShadow = true;
  sphere.castShadow = true;
  sphere.position.set(100,0,100);
  scene.add(sphere);

  //default 夕方 : 0xf4dd8a , 昼 : 0xdff8dd, night:0x7159ee
  spotLight = new THREE.SpotLight(0xf4dd8a);
  spotLight.position.set(0, 500, 0);
  spotLight.lookAt(0,0,0);
  spotLight.shadow.camera.far = 1000;
  spotLight.target = target;
  spotLight.castShadow = true;
  scene.add(spotLight);

  var planeGeometry = new THREE.PlaneGeometry(1000,1000);
  var planeMaterial = new THREE.MeshStandardMaterial();
  var plane = new THREE.Mesh(planeGeometry,planeMaterial);
  plane.position.set(0,-200,0);
  plane.receiveShadow = true;
  scene.add(plane);

  renderer = new THREE.WebGLRenderer({ antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  camera.position.set(0,0,0);
  camera.lookAt(new THREE.Vector3(100, 0, 100));

  stats = initStats();

  document.getElementById("WebGL-output").appendChild(renderer.domElement);
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  window.addEventListener( 'resize', onWindowResize, false );

}

function initStats(){
  var stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.getElementById("Stats-output").appendChild(stats.domElement);

  return stats;
}

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth,window.innerHeight);
}

function onDocumentMouseMove(event){
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth)*2-1;
  mouse.y = - (event.clientY / window.innerHeight)*2+1;
}

function onDocumentMouseDown(event){
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth)*2-1;
  mouse.y = - (event.clientY / window.innerHeight)*2+1;
}

function animate(){
  requestAnimationFrame(animate);

  render();
  stats.update();
}

function render(){
  camera.updateMatrixWorld();

  if(intersected!=undefined){
    intersected[0].object.material.color.set( 0xFFFFFF );
  }
  //console.log(intersected);

  raycaster.setFromCamera(mouse,camera);
  intersects = raycaster.intersectObjects(scene.children);
  //console.log(intersects);
  if(intersects.length > 1){
    if(intersects[0].object.name!=""){
      intersects[0].object.material.color.set( 0xf1ff0a );
      intersected = intersects.slice();
    }else if(intersects[0].object.name==""){
      console.log('%cxxxx----Unregistered Object was prevented.----xxxx','color: red');
    }
  }

  renderer.render(scene, camera);
}
