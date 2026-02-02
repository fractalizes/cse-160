// ----------------------------------- //
// ---                             --- //
// ---       GLOBAL VARIABLE       --- //
// ---                             --- //
// ----------------------------------- //

// vertex shader program
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }
`;

// fragment shader program
const FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`;

let canvas, gl, a_Position, u_FragColor, u_ModelMatrix, u_GlobalRotateMatrix, u_ViewMatrix, u_ProjectionMatrix;

let g_rotY = 0,
    g_rotX = 0,
    g_bodyAngle = 0,
    g_legAngle = 0,
    g_headAngle = 0,
    g_headAngleAmp = 0;
    g_headAnimationDuration = 5;
    g_walkAnimation = false,
    g_isDragging = false;

let fpsIndicator,
    lastMouseX,
    lastMouseY,
    animationOnButton,
    animationOffButton;

// ----------------------------------- //
// ---                             --- //
// ---          FUNCTIONS          --- //
// ---                             --- //
// ----------------------------------- //

function setupWebGL() {
  canvas = document.getElementById("webgl");
  if (!(gl = canvas.getContext("webgl", { preserveDrawingBuffer: true }))) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }
  gl.enable(gl.DEPTH_TEST);

  canvas.addEventListener("click", (event) => { 
    if (event.shiftKey) g_headAngleAmp = g_headAnimationDuration;
  });

  canvas.addEventListener("mouseup", () => { g_isDragging = false; });
  canvas.addEventListener("mouseleave", () => { g_isDragging = false; });
  canvas.addEventListener("mousedown", (event) => {
    g_isDragging = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  });
  canvas.addEventListener("mousemove", (event) => {
    if (!g_isDragging) return;

    const dx = event.clientX - lastMouseX,
          dy = event.clientY - lastMouseY,
          factor = 0.75; // sensitivity

    g_rotY += dx * factor;
    g_rotX -= dy * factor;

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  });
}

function connectVariablesToGLSL() {
   // initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("[INIT ERROR] Failed to intialize shaders.");
    return;
  }

  if ((a_Position = gl.getAttribLocation(gl.program, "a_Position")) < 0) {
    console.log("[INIT ERROR] Failed to get the storage location of a_Position");
    return;
  }

  if (!(u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_FragColor");
    return;
  }

  if (!(u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_ModelMatrix");
    return;
  }

  if (!(u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_GlobalRotateMatrix");
    return;
  }

  if (!(u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_ViewMatrix");
    return;
  }

  if (!(u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_ProjectionMatrix");
    return;
  }

  // set an initial value for these matrices to identity
  const identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);
}

function addUIActions() {
  animationOnButton = document.getElementById("animation-on-button");
  animationOnButton.addEventListener("mousedown", () => { g_walkAnimation = true; });

  animationOffButton = document.getElementById("animation-off-button");
  animationOffButton.addEventListener("mousedown", () => { g_walkAnimation = false; });

  fpsIndicator = document.getElementById("fps-span");
}

// reference photo:
// https://pbs.twimg.com/media/Ee1pgqUUcAABMbO.png
function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  cameraControls();
  updateAnimations();

  let body = new Sphere();
  body.color = [0.67, 0.52, 0.42, 1.0]; /*[0.59, 0.45, 0.25, 1.0];*/
  body.matrix.setTranslate(0.0, -0.1, 0.0);
  body.matrix.rotate(g_bodyAngle, 0, 1, 0);
  bodyMatrix = new Matrix4(body.matrix);
  body.matrix.scale(2.0, 2.0, 3.5);
  body.matrix.translate(0.0, -0.025, -0.075);
  body.render();

  let tail = new Cone();
  tail.color = [0.67, 0.52, 0.42, 1.0];
  tail.height = 1.75;
  tail.matrix = new Matrix4(bodyMatrix);
  tail.matrix.scale(0.1, 0.1, 0.1, 0);
  tail.matrix.rotate(-67.5, 45, 0, 1);
  tail.matrix.translate(0.0, 7.0, -2.0);
  tail.render();

  let collar = new Cylinder();
  collar.color = [1.0, 0.0, 0.0, 1.0];
  collar.height = 0.05;
  collar.radius = 0.325;
  collar.segments = 20;
  collar.matrix = new Matrix4(bodyMatrix);
  collar.matrix.translate(0.0, 0.05, -0.025);
  collar.matrix.rotate(40, 1, 0, 0);
  collar.render();

  // =====     HEAD     ===== //
  let head = new Sphere();
  head.color = [0.67, 0.52, 0.42, 1.0];
  head.matrix = new Matrix4(bodyMatrix);
  head.matrix.scale(2.25, 2.25, 2.25);
  head.matrix.translate(0.0, 0.1, 0.05);
  head.matrix.rotate(g_headAngle, 0, 0, 1);
  head.render();

  let leftEar = new Cone();
  leftEar.color = [0.67, 0.52, 0.42, 1.0];
  leftEar.height = 0.2;
  leftEar.radius = 0.075;
  leftEar.matrix = new Matrix4(head.matrix);
  leftEar.matrix.scale(0.44, 0.44, 0.44);
  leftEar.matrix.rotate(-45, 0, 0, 1);
  leftEar.matrix.translate(0.025, 0.4, 0.0);
  leftEar.render();

  let rightEar = new Cone();
  rightEar.color = [0.67, 0.52, 0.42, 1.0];
  rightEar.height = 0.2;
  rightEar.radius = 0.075;
  rightEar.matrix = new Matrix4(head.matrix);
  rightEar.matrix.scale(-0.44, 0.44, 0.44);
  rightEar.matrix.rotate(-45, 0, 0, 1);
  rightEar.matrix.translate(0.025, 0.4, 0.0);
  rightEar.render();

  let leftEye = new Cylinder();
  leftEye.color = [0.0, 0.0, 0.0, 1.0];
  leftEye.radius = 0.035;
  leftEye.height = 0.005;
  leftEye.matrix = new Matrix4(head.matrix);
  leftEye.matrix.rotate(-90, 1, 0, 0);
  leftEye.matrix.translate(0.045, -0.09, 0.035);
  leftEye.render();

  let rightEye = new Cylinder();
  rightEye.color = [0.0, 0.0, 0.0, 1.0];
  rightEye.radius = 0.035;
  rightEye.height = 0.005;
  rightEye.matrix = new Matrix4(head.matrix);
  rightEye.matrix.rotate(-90, 1, 0, 0);
  rightEye.matrix.scale(-1.0, 1.0, 1.0, 0.0);
  rightEye.matrix.translate(0.045, -0.09, 0.035);
  rightEye.render();

  let snout = new Sphere();
  snout.color = [0.67, 0.52, 0.42, 1.0];
  snout.matrix = new Matrix4(head.matrix);
  snout.matrix.scale(0.5, 0.5, 0.5);
  snout.matrix.translate(0.0, -0.05, 0.2);
  snout.render();

  let nose = new Sphere();
  nose.color = [0.0, 0.0, 0.0, 1.0];
  nose.matrix = new Matrix4(snout.matrix);
  nose.matrix.translate(0.0, 0.05, 0.09);
  nose.matrix.scale(0.25, 0.25, 0.25);
  nose.render();

  let mouth = new Cylinder();
  mouth.color = [0.0, 0.0, 0.0, 1.0];
  mouth.height = 0.025;
  mouth.radius = 0.425;
  mouth.segments = 20;
  mouth.matrix = new Matrix4(snout.matrix);
  mouth.matrix.scale(0.5, 0.5, 0.5);
  mouth.render();

  // =====     LEGS     ===== //
  const legRadius = 0.45, legHeight = 0.75,
        footY = -0.025, footZ = -0.15;

  let leftFrontLeg = new Cylinder();
  leftFrontLeg.color = [0.67, 0.52, 0.42, 1.0];
  leftFrontLeg.radius = legRadius;
  leftFrontLeg.height = legHeight / 2;
  leftFrontLeg.matrix = new Matrix4(bodyMatrix);
  leftFrontLeg.matrix.scale(-0.175, 0.4, 0.175);
  leftFrontLeg.matrix.translate(-0.55, -0.55, -0.25);
  leftFrontLeg.matrix.rotate(-g_legAngle, 1, 0, 0);
  leftFrontLeg.render();

  let leftFrontLeg2 = new Cylinder();
  leftFrontLeg2.color = [0.67, 0.52, 0.42, 1.0];
  leftFrontLeg2.radius = legRadius;
  leftFrontLeg2.height = legHeight / 2;
  leftFrontLeg2.matrix = new Matrix4(leftFrontLeg.matrix);
  leftFrontLeg2.matrix.translate(0, -0.35, 0);
  leftFrontLeg2.matrix.rotate(Math.abs(g_legAngle), 1, 0, 0);
  leftFrontLeg2.render();

  let leftFrontFoot = new Hemisphere();
  leftFrontFoot.color = [0.67, 0.52, 0.42, 1.0];
  leftFrontFoot.matrix = new Matrix4(leftFrontLeg2.matrix);
  leftFrontFoot.matrix.scale(
    5.715 * 0.75,
    2.5 * 0.75,
    5.715 * 0.75
  );
  leftFrontFoot.matrix.rotate(
    ((g_legAngle < 0) ? g_legAngle * 1.5 : - g_legAngle / 2) - 90,
    1,
    0,
    0
  );
  leftFrontFoot.matrix.translate(0.0, footY, footZ);
  leftFrontFoot.render();

  let leftBackLeg = new Cylinder();
  leftBackLeg.color = [0.67, 0.52, 0.42, 1.0];
  leftBackLeg.radius = legRadius;
  leftBackLeg.height = legHeight / 2;
  leftBackLeg.matrix = new Matrix4(bodyMatrix);
  leftBackLeg.matrix.scale(-0.175, 0.4, 0.175);
  leftBackLeg.matrix.translate(-0.55, -0.55, -2.75);
  leftBackLeg.matrix.rotate(-g_legAngle, 1, 0, 0);
  leftBackLeg.render();

  let leftBackLeg2 = new Cylinder();
  leftBackLeg2.color = [0.67, 0.52, 0.42, 1.0];
  leftBackLeg2.radius = legRadius;
  leftBackLeg2.height = legHeight / 2;
  leftBackLeg2.matrix = new Matrix4(leftBackLeg.matrix);
  leftBackLeg2.matrix.translate(0, -0.35, 0);
  leftBackLeg2.render();

  let leftBackFoot = new Hemisphere();
  leftBackFoot.color = [0.67, 0.52, 0.42, 1.0];
  leftBackFoot.matrix = new Matrix4(leftBackLeg2.matrix);
  leftBackFoot.matrix.scale(
    5.715 * 0.75,
    2.5 * 0.75,
    5.715 * 0.75
  );
  leftBackFoot.matrix.rotate(-90, 1, 0, 0);
  leftBackFoot.matrix.translate(0.0, footY, footZ);
  leftBackFoot.render();

  let rightFrontLeg = new Cylinder();
  rightFrontLeg.color = [0.67, 0.52, 0.42, 1.0];
  rightFrontLeg.radius = legRadius;
  rightFrontLeg.height = legHeight / 2;
  rightFrontLeg.matrix = new Matrix4(bodyMatrix);
  rightFrontLeg.matrix.scale(0.175, 0.4, 0.175);
  rightFrontLeg.matrix.translate(-0.55, -0.55, -0.25);
  rightFrontLeg.matrix.rotate(g_legAngle, 1, 0, 0);
  rightFrontLeg.render();

  let rightFrontLeg2 = new Cylinder();
  rightFrontLeg2.color = [0.67, 0.52, 0.42, 1.0];
  rightFrontLeg2.radius = legRadius;
  rightFrontLeg2.height = legHeight / 2;
  rightFrontLeg2.matrix = new Matrix4(rightFrontLeg.matrix);
  rightFrontLeg2.matrix.translate(0, -0.35, 0);
  rightFrontLeg2.matrix.rotate(Math.abs(g_legAngle), 1, 0, 0);
  rightFrontLeg2.render();

  let rightFrontFoot = new Hemisphere();
  rightFrontFoot.color = [0.67, 0.52, 0.42, 1.0];
  rightFrontFoot.matrix = new Matrix4(rightFrontLeg2.matrix);
  rightFrontFoot.matrix.scale(
    5.715 * 0.75,
    2.5 * 0.75,
    5.715 * 0.75
  );
  rightFrontFoot.matrix.rotate(
    -90 - ((g_legAngle > 0) ? g_legAngle * 1.5 : - g_legAngle / 2),
    1,
    0,
    0
  );
  rightFrontFoot.matrix.translate(0.0, footY, footZ);
  rightFrontFoot.render();

  let rightBackLeg = new Cylinder();
  rightBackLeg.color = [0.67, 0.52, 0.42, 1.0];
  rightBackLeg.radius = legRadius;
  rightBackLeg.height = legHeight / 2;
  rightBackLeg.matrix = new Matrix4(bodyMatrix);
  rightBackLeg.matrix.scale(0.175, 0.4, 0.175);
  rightBackLeg.matrix.translate(-0.55, -0.55, -2.75);
  rightBackLeg.matrix.rotate(g_legAngle, 1, 0, 0);
  rightBackLeg.render();

  let rightBackLeg2 = new Cylinder();
  rightBackLeg2.color = [0.67, 0.52, 0.42, 1.0];
  rightBackLeg2.radius = legRadius;
  rightBackLeg2.height = legHeight / 2;
  rightBackLeg2.matrix = new Matrix4(rightBackLeg.matrix);
  rightBackLeg2.matrix.translate(0, -0.35, 0);
  rightBackLeg2.render();

  let rightBackFoot = new Hemisphere();
  rightBackFoot.color = [0.67, 0.52, 0.42, 1.0];
  rightBackFoot.matrix = new Matrix4(rightBackLeg2.matrix);
  rightBackFoot.matrix.scale(
    5.715 * 0.75,
    2.5 * 0.75,
    5.715 * 0.75
  );
  rightBackFoot.matrix.rotate(-90, 1, 0, 0);
  rightBackFoot.matrix.translate(0.0, footY, footZ);
  rightBackFoot.render();

  /*
  // let body = new Cube();
  // body.color = [1.0, 0.0, 0.0, 1.0];
  // body.matrix.setTranslate(-0.25, -0.5, 0.0);
  // body.matrix.rotate(-5, 1, 0, 0);
  // body.matrix.scale(0.5, 0.3, 0.5);
  // body.render();

  // let leftArm = new Cube();
  // leftArm.color = [1.0, 1.0, 0.0, 1.0];
  // leftArm.matrix.setTranslate(0.0, -0.5, 0.0);
  // leftArm.matrix.rotate(-5, 1, 0, 1);
  // leftArm.matrix.rotate(
  //   (g_animationOn) ? 45 * Math.sin(g_seconds) : -g_armAngle,
  //   0, 0, 1
  // );
  // let leftArmCoords = new Matrix4(leftArm.matrix);
  // leftArm.matrix.scale(0.25, 0.7, 0.5);
  // leftArm.matrix.translate(-0.5, 0.0, 0.0);
  // leftArm.render();

  // let box = new Cube();
  // box.color = [1.0, 0.0, 1.0, 1.0];
  // box.matrix = leftArmCoords;
  // box.matrix.translate(0.0, 0.7, 0.0);
  // box.matrix.translate(-0.1, 0.1, 0.0);
  // box.matrix.rotate(-30, 1, 0, 0);
  // box.matrix.scale(0.2, 0.4, 0.2);
  // box.render();
  */
}

let lastFrameTime = performance.now();
let g_startTime = performance.now() / 1000,
    g_seconds = performance.now() / 1000 - g_startTime;
    
function tick() {
  const now = performance.now();
  const delta = now - lastFrameTime;
  lastFrameTime = now;

  const fps = 1000 / delta;
  fpsIndicator.innerHTML = fps.toFixed(1);

  g_seconds = now / 1000 - g_startTime;
  renderAllShapes();
  requestAnimationFrame(tick);
}

function cameraControls() {
  let projMat = new Matrix4();
  projMat.setPerspective(
    25, // fov
    canvas.width / canvas.height, // aspect ratio
    0.1, // near plane
    100 // far plane
  );
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  let viewMat = new Matrix4();
  viewMat.setLookAt(0, 0, 5, 0, 0, 0, 0, 1, 0); 
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // camera controls
  let globalRotMat = new Matrix4();
  globalRotMat
    .rotate(g_rotX, 1.0, 0.0, 0.0)
    .rotate(g_rotY, 0.0, 1.0, 0.0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
}

function updateAnimations() {
  if (g_walkAnimation) {
    g_legAngle = 30 * Math.sin(3 * g_seconds);
    g_bodyAngle = 5 * Math.cos(g_seconds);
  }
  if (g_headAngleAmp > 0) {
    g_headAngle = 4 * g_headAngleAmp * Math.cos(g_seconds);
    if (!(g_seconds % 1)) {
      g_headAngleAmp--;
    }
  }
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addUIActions();

  // specify the color for clearing <canvas>
  gl.clearColor(0.53, 0.81, 0.92, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderAllShapes();
  tick();
}