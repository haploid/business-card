const { EventEmitter } = require('events');
const three = require('three');
const OBJLoader = require('./OBJLoader');

let robotParts = [];

function interfaceUser() {
  const uiRenderer = new EventEmitter();

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setClearColor(new THREE.Color('lightgrey'), 0);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0px';
  renderer.domElement.style.left = '0px';

  document.body.appendChild(renderer.domElement);

  // Initialize scene and camera
  const scene = new THREE.Scene();

  // Initialize a basic camera

  // Create a camera
  const camera = new THREE.Camera();
  scene.add(camera);

  // Handle arToolkitSource

  const arToolkitSource = new THREEx.ArToolkitSource({ sourceType: 'webcam' });

  // Handle resize

  arToolkitSource.init(() => arToolkitSource.onResize(renderer.domElement));

  window.addEventListener('resize', () => arToolkitSource.onResize(renderer.domElement));

  // Initialize arToolkitContext

  // Create atToolkitContext
  const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'data/camera_para.dat',
    detectionMode: 'mono',
    maxDetectionRate: 30,
    canvasWidth: 80 * 3,
    canvasHeight: 60 * 3,
  });

  // Initialize it
  arToolkitContext.init(() =>
    // Copy projection matrix to camera
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix()));

  // update artoolkit on every frame
  uiRenderer.on('render', () => {
    if (arToolkitSource.ready === false) {
      return;
    }

    arToolkitContext.update(arToolkitSource.domElement);
  });

  // Create a ArMarkerControls

  const markerRoot = new THREE.Group();
  scene.add(markerRoot);

  const artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: 'pattern',
    patternUrl: 'data/business-card.hiro',
  });

  // Add an object in the scene

  /*
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);

  markerRoot.add(mesh);
  */

  const robotPartNameOrder = [
    'manipulator_1_geom_Untitled.001',
    'manipulator_2_geom_Untitled.086',
    'manipulator_3_geom_Untitled.094',
    'manipulator_4_geom_Untitled.016',
    'manipulator_5_geom_Untitled.023',
    'manipulator_6_geom_Untitled.031',
  ];

  const robotPartAxes = [
    { x: -0.37902, z: -0.0078, y: 0.40346 },
    { x: 26.12417, z: -11.76343, y: 26.77528 },
    { x: 0, z: 68.08733, y: 0 },
    { x: 43.75659, z: -3.50633, y: -11.97334 },
    { x: -0.01491, z: -0.00476, y: 23.37467 },
    { x: 0.70055, z: -0.00567, y: 1.3171 },
  ];

  function getGlobalAxisPosition(index) {
    const total = { x: 0, y: 0, z: 0 };

    for (let i = index; i >= 0; i -= 1) {
      total.x += robotPartAxes[i].x;
      total.y += robotPartAxes[i].y;
      total.z += robotPartAxes[i].z;
    }

    return total;
  }

  //scene.add(new three.AmbientLight(0xffffff));
  scene.add(new three.HemisphereLight(0xffffbb, 0x080820, 1));

  const objLoader = new OBJLoader();
  objLoader.load('kr16.obj', (obj) => {
    const materialOptions = {
      color: 0xffffff,
      specular: 0xffffff,
      //shininess: 50,
      shading: three.SmoothShading,
    };

    obj.material = new three.MeshPhongMaterial(materialOptions);

    obj.traverse((childObj) => {
      childObj.material = new three.MeshPhongMaterial(materialOptions);

      const partIndex = robotPartNameOrder.indexOf(childObj.name);
      if (partIndex !== -1) {
        robotParts[partIndex] = childObj;
      }
    });

    obj.position.x = 0.4;

    /*robotParts = robotParts.map((part, i) => {
      const pivot = new three.Object3D();

      const geometry = new THREE.BoxGeometry(.05, .05, .05);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const box = new THREE.Mesh(geometry, material);
      pivot.add(box);

      const s = 0.01;
      const pos = robotPartAxes[i];
      pivot.position.x = s * pos.x;
      pivot.position.y = s * pos.y;
      pivot.position.z = -s * pos.z;

      part.position.x = -pivot.position.x;
      part.position.y = -pivot.position.y;
      part.position.z = -pivot.position.z;

      //pivot.add(part);

      return pivot;
    });

    console.log(robotParts);

    for (let i = 0; i < robotParts.length - 1; i += 1) {
      robotParts[i].add(robotParts[i + 1]);
    }

    robotParts.forEach(part => console.log(part));

    markerRoot.add(robotParts[0]);*/
    markerRoot.add(obj);
  });

  // Render the whole thing on the page

  uiRenderer.on('render', () => renderer.render(scene, camera));

  // Run the rendering loop

  let lastTimeMsec = null;

  function animate(nowMsec) {
    // keep looping
    requestAnimationFrame(animate);

    // measure time
    lastTimeMsec = lastTimeMsec || nowMsec - (1000 / 60);
    const deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
    lastTimeMsec = nowMsec;

    /*if (robotParts[0] !== undefined) {
      robotParts[0].rotation.y += 0.01;
    }*/

    uiRenderer.emit('render', deltaMsec / 1000, nowMsec / 1000);
  }

  // Kick it all off
  requestAnimationFrame(animate);
}

module.exports = {
  interfaceUser,
};
