/*
    $$ Recommended System Requirements $$
       three.js ver : 0.117.1
       browser {chrome ver : 78.0.2 (64bit)}
       must importing {stats, dat.gui}
*/

var file_path = "https://github.com/Vonlet/test_drive/tree/master/images/late/";
var info_array = [
  {name:"EB18JoVUYAAkkZf.jpg",url:"https://twitter.com/Late327/status/1161220793059037184"},
  {name:"EB-rI4GVAAMBXCP.jpg",url:"https://twitter.com/Late327/status/1161835403952807937"},
  {name:"ECBjCvcUwAAt-qf.jpg",url:"https://twitter.com/Late327/status/1162037606328102912"},
  {name:"ECqfKbtU4AAG7X5.jpg",url:"https://twitter.com/Late327/status/1164918459844612098"},
  {name:"ECUEaSMVAAACArg.jpg",url:"https://twitter.com/Late327/status/1163340932466397185"},
  {name:"EDxCw-FU8AEYzBW.jpg",url:"https://twitter.com/Late327/status/1169883416973627393"},
  {name:"EG231BGUYAIEnqk.jpg",url:"https://twitter.com/Late327/status/1183804400189333505"},
  {name:"EVelXaKU4AAZKgV.jpg",url:"https://twitter.com/Late327/status/1249649250473893889"},
  {name:"EVoCOS2U4AYKFJN.jpg",url:"https://twitter.com/Late327/status/1250314300045983745"},
  {name:"EVQIPXNUUAELTA9.jpg",url:"https://twitter.com/Late327/status/1248632064049438726"},
  {name:"EVZQ-tAU8AEwgxy.jpg",url:"https://twitter.com/Late327/status/1249274998008643584"},
  {name:"EWInllWUYAADqWj.jpg",url:"https://twitter.com/Late327/status/1252607178050899969"},
  {name:"EWSAIskVAAAsQsp.jpg",url:"https://twitter.com/Late327/status/1253267489556848641"},
  {name:"EW-yO-tU0AAqNWm.jpg",url:"https://twitter.com/Late327/status/1256418795742097409"},
  {name:"EX8R_SbUcAIBO9q.jpg",url:"https://twitter.com/Late327/status/1260746205472194560"},
  {name:"EX8STSjVcAAVfR9.jpg",url:"https://twitter.com/Late327/status/1260746547886579712"},
  {name:"EYoXgVdUwAEEhme.jpg",url:"https://twitter.com/Late327/status/1263848495800152065"},
  {name:"EZ6b_LdU4AEaJZD.jpg",url:"https://twitter.com/Late327/status/1269623659947159552"}
];

var stats, intersects, intersected;
var scene, camera, rascaster, renderer, spotLight, ambientLight, cube, shape;

// camera distance(position_y) recommended is -200, test should be -500.
var position_x = 0, position_y = -200, position_z = 0, step = 0;
var position_cx, position_cy, position_cz, position_lx, position_lz;
var spot_x = 0, spot_z = 0, switch1 = 0, switch2 = 0, limit = 5, spot_gain = 0.05;
var Pi = 3.1415926535;
var cube_position_array = [];
var leaf_position_array = [];
var controls;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var target = new THREE.Object3D();

init();
animate();

function init(){
  camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight, 0.1, 1000);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  controls = new function () {
      this.numberOfObjects = scene.children.length;
      this.lookat_x = 0, this.lookat_y = 100, this.lookat_z = 0, this.light_x = 0, this.light_y = -400, this.light_z = 0;

      this.removeCube = function () {
          var allChildren = scene.children;
          var lastObject = allChildren[allChildren.length - 1];
          if (lastObject instanceof THREE.Mesh) {
              scene.remove(lastObject);
              this.numberOfObjects = scene.children.length;
          }
      };

      this.addCube = function (num,__path__) {
          ratio = 2.5;
          var cubeGeometry = new THREE.BoxGeometry(14*ratio, 20*ratio, 1*ratio);
          //var cubeMaterial = new THREE.MeshNormalMaterial();
          //var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

          var loader = new THREE.TextureLoader();
          loader.load(
            file_path+__path__,
            function(texture){
              var material = new THREE.MeshStandardMaterial({
                map: texture
              });
              var cube = new THREE.Mesh(cubeGeometry,material);

              cube.name = info_array[num].name;
              cube.url = info_array[num].url

              let x_degree = (Math.random()*2*Pi);
              let x_max = 20, x_min = 10, z_max = 35, z_min = 10, x_gain = 25, z_gain = 10;

              position_cx = Math.round((Math.random()*(x_max-x_min)-x_min)*x_gain*Math.sin(x_degree));
              position_cy = 90;
              position_cz = Math.round((Math.random()*(z_max-z_min)-z_min)*z_gain*Math.cos(x_degree));

              cube_position_array[num] = {x:position_cx,y:position_cy,z:position_cz};

              for(let position_search = 0;position_search < num;position_search++){
                if(Math.abs(cube_position_array[position_search].x-position_cx)<20){
                  if(Math.abs(cube_position_array[position_search].z-position_cz)<20){
                    position_cx = Math.round((Math.random()*(x_max-x_min)-x_min)*x_gain*Math.sin(x_degree));
                    position_cy = 90;
                    position_cz = Math.round((Math.random()*(z_max-z_min)-z_min)*z_gain*Math.cos(x_degree));
                    position_search = 0;
                  }
                }
              }

              cube.position.x = position_cx;
              cube.position.y = position_cy;
              cube.position.z = position_cz;
              cube.lookAt(position_x,position_y-200,position_z);
              cube.receiveShadow = true;
              scene.add(cube);
              this.numberOfObjects = scene.children.length;

            },
            undefined,
            function(err){
              console.error("An error happened.");
            }
          );
      };

      this.addLeaf = function(num){

          let x_degree = (Math.random()*2*Pi);
          let x_max = 105, x_min = 20, z_max = 200, z_min = 35, x_gain = 1, z_gain = 1;

          position_lx = Math.round((Math.random()*(x_max-x_min)-x_min)*x_gain*Math.sin(x_degree));
          position_lz = Math.round((Math.random()*(z_max-z_min)-z_min)*z_gain*Math.cos(x_degree));

          leaf_position_array[num] = {x:position_lx,z:position_lz};

          for(let position_search = 0;position_search < num;position_search++){
            if(Math.abs(leaf_position_array[position_search].x-position_lx)<1){
              if(Math.abs(leaf_position_array[position_search].z-position_lz)<1){
                position_lx = Math.round((Math.random()*(x_max-x_min)-x_min)*x_gain*Math.sin(x_degree));
                position_lz = Math.round((Math.random()*(z_max-z_min)-z_min)*z_gain*Math.cos(x_degree));
                position_search = 0;
              }
            }
          }


          var leaf = createMesh(new THREE.ShapeGeometry(drawShape()));

          leaf.position.x = position_lx;
          leaf.position.y = -300;
          leaf.position.z = position_lz;
          leaf.lookAt(Math.random()*360,Math.random()*360,Math.random()*360);
          leaf.castShadow = true;
          // add the sphere to the scene
          scene.add(leaf);
        }

        function drawShape() {

            // create a basic shape
            var shape = new THREE.Shape();

            shape.moveTo(40,40);
            shape.splineThru([
                new THREE.Vector2(35,25),
                new THREE.Vector2(28,20),
              ]
            );
            shape.splineThru([
                new THREE.Vector2(30,30),
                new THREE.Vector2(40,40),
              ]
            );
            // return the shape
            return shape;
        }

        function createMesh(geom) {
            // assign two materials
            var meshMaterial = new THREE.MeshStandardMaterial();
            meshMaterial.side = THREE.DoubleSide;
            // create a multimaterial
            var leafMesh = new THREE.Mesh(geom,meshMaterial);
            return leafMesh;
      }

      this.outputObjects = function () {
          console.log(scene.children);
      }
  };

  scene.add(target);
  //default 夕方 : 0xf4dd8a , 昼 : 0xdff8dd, night:0x7159ee
  spotLight = new THREE.SpotLight(0xf4dd8a);
  spotLight.position.set(0, -400, 0);
  //default : 1.2
  spotLight.intensity = 1;
  spotLight.shadowMapWidth = 2048;
  spotLight.shadowMapHeight = 2048;
  spotLight.shadow.camera.far = 1000;
  spotLight.target = target;
  spotLight.castShadow = true;
  scene.add(spotLight);

  //default:0xe1e3a5 ,evening:0xc7c89d ,night:0x220b99
  ambientLight = new THREE.AmbientLight(0xc7c89d);
  scene.add(ambientLight);

  var planeGeometry = new THREE.PlaneGeometry(1000,1000);
  var plane_loader = new THREE.TextureLoader();
  plane_loader.load(
    "https://github.com/Vonlet/test_drive/tree/master/images/floor-wood.jpg",
    function(texture){
      var planeMaterial = new THREE.MeshStandardMaterial({
        map: texture
      });
      var plane = new THREE.Mesh(planeGeometry,planeMaterial);
      plane.position.set(0,100,0);
      plane.lookAt(0,0,0);
      plane.receiveShadow = true;

      scene.add(plane);
    },
    undefined,
    function(err){
      console.log("An error happened.");
    }
  );

  for(let leaf_num = 0;leaf_num < 300;leaf_num++){
    controls.addLeaf(leaf_num);
  }

  renderer = new THREE.WebGLRenderer({ antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  camera.position.x = position_x;
  camera.position.y = position_y;
  camera.position.z = position_z;
  camera.lookAt(new THREE.Vector3(0, 100, 0));

  for(var image_num in info_array){
    controls.addCube(image_num,info_array[image_num].name);
  }

  // add the output of the renderer to the html element
  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  var gui = new dat.GUI();
  gui.add(controls, 'addCube');
  gui.add(controls, 'removeCube');
  gui.add(controls, 'outputObjects');
  gui.add(controls, 'lookat_x',-50,50);
  gui.add(controls, 'lookat_y',0,100);
  gui.add(controls, 'lookat_z',-50,50);
  gui.add(controls, 'numberOfObjects').listen();

  stats = initStats();

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  window.addEventListener( 'resize', onWindowResize, false );

}

function moveSpotLight(){
  let x_degree = (Math.random()*2*Pi);

  if(spot_x>limit){
    spot_x = spot_x - spot_gain*Math.random();
    switch1 = 1;
  }else if(spot_x<0){
    spot_x = spot_x + spot_gain*Math.random();
    switch1 = 0;
  }else if(switch1==1){
    spot_x = spot_x - spot_gain*Math.random();
  }else if(switch1==0){
    spot_x = spot_x + spot_gain*Math.random();
  }

  if(spot_z>limit){
    spot_z = spot_z - spot_gain*Math.random();
    switch2 = 1;
  }else if(spot_z<0){
    spot_z = spot_z + spot_gain*Math.random();
    switch2 = 0;
  }else if(switch2==1){
    spot_z = spot_z - spot_gain*Math.random();
  }else if(switch2==0){
    spot_z = spot_z + spot_gain*Math.random();
  }

  spotLight.position.set(
    spot_x,
    -400,
    spot_z
  );

  // position and point the camera to the center of the scene
  camera.position.x = position_x;
  camera.position.y = position_y;
  camera.position.z = position_z;
  camera.lookAt(new THREE.Vector3(0, 100, 0));
}

function initStats() {
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

  raycaster.setFromCamera(mouse,camera);
  let intersects = raycaster.intersectObjects(scene.children);
  if(intersects.length>0){
    for(var t = 0;t < intersects.length;t++){
      if(intersects[t].object.name.length>0){
        console.log(t+" : "+intersects[t].object.name+" was detected!; url : "+intersects[t].object.url);
        window.location.href = intersects[t].object.url;
      }else{
        console.log(t+" : Unregistered Object was detected!");
      }
    }
    console.log("--------------------------");
  }
}

function animate(){
  requestAnimationFrame(animate);

  render();
  stats.update();
}

function render(){
  camera.lookAt(
    controls.lookat_x,
    controls.lookat_y,
    controls.lookat_z
  );
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

  moveSpotLight();

  renderer.render(scene, camera);
}
