// standard global variables
var container, scene, camera, renderer, controls, stats, cube, woodTexture, textColor="#669900", spinFloor;

init();
animate();

// functions
function createText(color) {
  var materialFront = new THREE.MeshLambertMaterial({
    color: color
  });
  var materialSide = new THREE.MeshLambertMaterial({
    color: "#fff"
  });

  var materialArray = [materialFront, materialSide];

  var textGeom = new THREE.TextGeometry(moment().format('h:mm:ss'), {
    size: 100,
    height: 30,
    curveSegments: 3,
    font: "helvetiker",
    weight: "bold",
    style: "normal",
    bevelThickness: 1,
    bevelSize: 2,
    bevelEnabled: true,
    material: 0,
    extrudeMaterial: 1
  });

  var textMaterial = new THREE.MeshFaceMaterial(materialArray);
  textMesh = new THREE.Mesh(textGeom, textMaterial);

  // shadow
  textMesh.castShadow = true;
  textMesh.receiveShadow = false;

  // positioning
  textGeom.computeBoundingBox();
  var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;

  textMesh.position.set(-0.5 * textWidth, 5, 0);

  // Add to scene
  scene.add(textMesh);

}

function init() {

  // create Scene
  scene = new THREE.Scene();

  // CAMERA
  var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;

  var VIEW_ANGLE = 45,
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
    NEAR = 0.1,
    FAR = 20000;

  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0, 150, 800);
  camera.lookAt(scene.position);

  // RENDERER
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.shadowMapEnabled = true;

  container = document.getElementById('ThreeJS');
  container.appendChild(renderer.domElement);

  // CONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // STATS
  // stats = new Stats();
  // stats.domElement.style.position = 'absolute';
  // stats.domElement.style.bottom = '0px';
  // stats.domElement.style.zIndex = 100;
  // container.appendChild( stats.domElement );

  // texture
  woodTexture = THREE.ImageUtils.loadTexture( "../images/texture.jpg" );
  woodTexture.wrapS = THREE.RepeatWrapping;
  woodTexture.wrapT = THREE.RepeatWrapping;
  // texture.repeat.set( 4, 4 );

  // LIGHT
  var spotLight = new THREE.SpotLight(0xffffff, 3);
  spotLight.position.set(0, 800, 200);

  spotLight.castShadow = true;

  spotLight.shadowMapWidth = 1024;
  spotLight.shadowMapHeight = 1024;

  spotLight.shadowCameraNear = 500;
  spotLight.shadowCameraFar = 4000;
  spotLight.shadowCameraFov = 30;

  scene.add( spotLight );

  // HemisphereLight
  var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x0000ff, 1);
  hemisphereLight.position.set(1, 0, 1).normalize();
  scene.add(hemisphereLight);

  // cube group
  group = new THREE.Object3D();
  group.position.y = 50;
  group.position.z = -100;

  colors = ['white', 'green', 'red', 'blue', 'orange', 'yellow'];

  for (i=0; i < 6; i++) {

    cube = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), new THREE.MeshLambertMaterial({
      map: woodTexture,
      color: colors[i]
    }));

    // cube.position.y = 50*(i+1)-(25);
    cube.position.y = 0;
    cube.position.x = (i*160) - 400;
    cube.position.z = 0;

    cube.castShadow = true;
    cube.receiveShadow = false;

    group.add(cube);

  }

  scene.add(group);

  // FLOOR

  var floorMaterial = new THREE.MeshLambertMaterial({
    map: woodTexture,
    color: '#222',
    side: THREE.DoubleSide
  });
  var floorGeometry = new THREE.PlaneGeometry(1000, 500, 10, 10);
  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2;

  floor.castShadow = false;
  floor.receiveShadow = true;



  scene.add(floor);


  // SKYBOX/FOG
  var skyBoxGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );
  var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: '#222', side: THREE.DoubleSide } );
  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );

  scene.add(skyBox);
  scene.fog = new THREE.FogExp2( 0x222222, 0.0006 );

  // add 3D text
  createText(textColor);
}

function animate() {
  requestAnimationFrame(animate);

  for (i=0; i < group.children.length; i++) {

    if (i%2) {
      group.children[i].rotation.y += 0.1;
    } else {
      group.children[i].rotation.y -= 0.1;
    }

  }

  if (spinFloor) {
    floor.rotation.z += 0.1;
  }

  // group.rotation.x += 0.1;
  // floor.rotation.z += 0.1;

  render();
  update();
}

function update() {
  scene.remove(textMesh);
  createText(textColor);

  controls.update();
}

function render() {
  renderer.render(scene, camera);
}

//events
$('form').on('submit', function(e) {
  e.preventDefault();

  scene.remove(textMesh);
  textColor = $('.text-input').val();
  createText(textColor);

});

$('.spin-floor').on('click', function() {
  if (spinFloor) {
    spinFloor = false;
  } else {
    spinFloor = true;
  }

});
