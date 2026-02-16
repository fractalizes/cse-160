// ----------------------------------- //
// ---                             --- //
// ---       SHADER FUNCTION       --- //
// ---                             --- //
// ----------------------------------- //

// vertex shader program
const VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }
`;

// fragment shader program
const FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform sampler2D u_Sampler6;
  uniform sampler2D u_Sampler7;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) gl_FragColor = u_FragColor;                       // use color
    else if (u_whichTexture == -1) gl_FragColor = vec4(v_UV, 1.0, 1.0);         // use uv debug color
    else if (u_whichTexture == 0) gl_FragColor = texture2D(u_Sampler0, v_UV);   // use texture0
    else if (u_whichTexture == 1) gl_FragColor = texture2D(u_Sampler1, v_UV);   // use texture1
    else if (u_whichTexture == 2) gl_FragColor = texture2D(u_Sampler2, v_UV);   // use texture2
    else if (u_whichTexture == 3) gl_FragColor = texture2D(u_Sampler3, v_UV);   // use texture3
    else if (u_whichTexture == 4) gl_FragColor = texture2D(u_Sampler4, v_UV);   // use texture4
    else if (u_whichTexture == 5) gl_FragColor = texture2D(u_Sampler5, v_UV);   // use texture5
    else if (u_whichTexture == 6) gl_FragColor = texture2D(u_Sampler6, v_UV);   // use texture6
    else if (u_whichTexture == 7) gl_FragColor = texture2D(u_Sampler7, v_UV);   // use texture7
    else gl_FragColor = vec4(1, 0.2, .2, 1);                                    // error, use reddish color
  }
`;

// ----------------------------------- //
// ---                             --- //
// ---       GLOBAL VARIABLE       --- //
// ---                             --- //
// ----------------------------------- //

const texturePath = `./assets/textures/`,
      hotbarPath = `./assets/hotbar/`;

let canvas, gl,
    a_Position, a_UV,
    u_FragColor, u_ModelMatrix, u_GlobalRotateMatrix, u_ViewMatrix, u_ProjectionMatrix,
    u_Sampler0, u_Sampler1, u_Sampler2, u_Sampler3, u_Sampler4, u_Sampler5, u_Sampler6, u_Sampler7, u_whichTexture;

let g_camera = new Camera(),
    g_hotbar = new Hotbar();

let fpsIndicator,
    goldIndicator;

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

  if ((a_UV = gl.getAttribLocation(gl.program, "a_UV")) < 0) {
    console.log("[INIT ERROR] Failed to get the storage location of a_UV");
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

  if (!(u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_Sampler0");
    return;
  }

  if (!(u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_Sampler1");
    return;
  }

  if (!(u_Sampler2 = gl.getUniformLocation(gl.program, "u_Sampler2"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_Sampler2");
    return;
  }

  if (!(u_Sampler3 = gl.getUniformLocation(gl.program, "u_Sampler3"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_Sampler3");
    return;
  }

  if (!(u_Sampler4 = gl.getUniformLocation(gl.program, "u_Sampler4"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_Sampler4");
    return;
  }

  if (!(u_Sampler5 = gl.getUniformLocation(gl.program, "u_Sampler5"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_Sampler5");
    return;
  }

  if (!(u_Sampler6 = gl.getUniformLocation(gl.program, "u_Sampler6"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_Sampler6");
    return;
  }

    if (!(u_Sampler7 = gl.getUniformLocation(gl.program, "u_Sampler7"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_Sampler7");
    return;
  }

  if (!(u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_whichTexture");
    return;
  }

  // set an initial value for these matrices to identity
  const identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);
}

function initTextures() {
  const image0 = new Image(),
        image1 = new Image(),
        image2 = new Image(),
        image3 = new Image(),
        image4 = new Image(),
        image5 = new Image(),
        image6 = new Image(),
        image7 = new Image();
  if (!image0 || !image1 || !image2 || !image3 || !image4 || !image5 || !image6 || !image7) {
    console.log(
      "[INIT ERROR] Failed to create the image object",
      !image0, !image1, !image2, !image3, !image7
    );
    return false;
  }

  // first texture
  image0.onload = () => { sendTextureToGLSL(image0, u_Sampler0, 0) }
  image0.src = texturePath + `stone_texture.webp`;

  // second texture
  image1.onload = () => { sendTextureToGLSL(image1, u_Sampler1, 1) }
  image1.src = texturePath + `dirt_texture.png`;

  // third texture
  image2.onload = () => { sendTextureToGLSL(image2, u_Sampler2, 2) }
  image2.src = texturePath + `grass_texture.jpg`;

  // fourth texture
  image3.onload = () => { sendTextureToGLSL(image3, u_Sampler3, 3) }
  image3.src = texturePath + `leaves_texture.webp`;

  // fifth texture
  image4.onload = () => { sendTextureToGLSL(image4, u_Sampler4, 4) }
  image4.src = texturePath + `glass_texture.png`;

  // sixth texture
  image5.onload = () => { sendTextureToGLSL(image5, u_Sampler5, 5) }
  image5.src = texturePath + `lucky_texture.png`;

  // seventh texture
  image6.onload = () => { sendTextureToGLSL(image6, u_Sampler6, 6) }
  image6.src = texturePath + `unknown_texture.webp`;

  // eighth texture
  image7.onload = () => { sendTextureToGLSL(image7, u_Sampler7, 7) }
  image7.src = texturePath + `gold_texture.webp`;

  return true;
}

function sendTextureToGLSL(image, samplerNum, textureNum) {
  const texture = gl.createTexture();
  if (!texture) {
    console.log("[INIT ERROR] Failed to create the texture object");
    return false;
  }

  // flip the image y-axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  // enable texture unit0
  gl.activeTexture(gl.TEXTURE0 + textureNum);
  // bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  // set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // set the texture unit 0 to the sampler
  gl.uniform1i(samplerNum, textureNum);
}

function addUIActions() {
  fpsIndicator = document.getElementById("fps-span");
  goldIndicator = document.getElementById("gold-span");

  globalThis.addEventListener("keydown", (event) => {
    // camera movement
    if (event.code === "KeyW") g_camera.moveForward();
    if (event.code === "KeyA") g_camera.moveLeft();
    if (event.code === "KeyS") g_camera.moveBack();
    if (event.code === "KeyD") g_camera.moveRight();

    // camera panning with keys
    if (event.code === "KeyQ") g_camera.panLeft();
    if (event.code === "KeyE") g_camera.panRight();

    const digitNum = Number(event.code.slice(5));
    if (event.code.slice(0, 5) == "Digit" && (digitNum >= 1 && digitNum <= 9)) g_hotbar.setBlock(digitNum)
  });

  canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
  });

  // camera panning with mouse
  canvas.addEventListener("mousemove", (event) => {
    if (document.pointerLockElement === canvas) {
      g_camera.processMouseMovement(
        event.movementX,
        -event.movementY
      );
    }
  });

  // block placing
  canvas.addEventListener("mousedown", (event) => {
    if (
      event.button === 0 ||   // left mouse button (lmb)
      event.button === 2      // right mouse button (rmb)
    ) {
      let hit = raycast(event.button);
      if (hit) {
        // if within range, place block
        if (hit.mapZ < g_groundMap[0][0].length) {
          if (g_hotbar.num == 1) g_groundMap[hit.mapY][hit.mapX][hit.mapZ] = g_GRASSMAPNUM;
          if (g_hotbar.num == 2) g_groundMap[hit.mapY][hit.mapX][hit.mapZ] = g_LEAVESMAPNUM;
          if (g_hotbar.num == 3) g_groundMap[hit.mapY][hit.mapX][hit.mapZ] = g_DIRTMAPNUM;
          if (g_hotbar.num == 4) g_groundMap[hit.mapY][hit.mapX][hit.mapZ] = g_STONEMAPNUM;
          if (g_hotbar.num == 5) g_groundMap[hit.mapY][hit.mapX][hit.mapZ] = g_GLASSMAPNUM;
          if (g_hotbar.num == 6) g_groundMap[hit.mapY][hit.mapX][hit.mapZ] = g_LUCKYMAPNUM;
          if (g_hotbar.num == 7) g_groundMap[hit.mapY][hit.mapX][hit.mapZ] = g_UNKNOWNMAPNUM;
          if (g_hotbar.num == 8) g_groundMap[hit.mapY][hit.mapX][hit.mapZ] = g_PINKMAPNUM;
          if (g_hotbar.num == 9) g_groundMap[hit.mapY][hit.mapX][hit.mapZ] = g_MAROONMAPNUM;
        }
      }
    }
  });
}

// reference photo:
// https://pbs.twimg.com/media/Ee1pgqUUcAABMbO.png
function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  cameraControls();
  drawMap();

  let groundPlane = new Cube();
  groundPlane.color = [0.1, 0.1, 0.1, 1.0];
  groundPlane.textureNum = -2;
  groundPlane.matrix.translate(0, -0.75, 0.0);
  groundPlane.matrix.scale(32, 0, 32);
  groundPlane.matrix.translate(-0.5, -1, -0.5);
  groundPlane.render();

  let skyBox = new Cube();
  skyBox.color = [0.75, 1.0, 1.0, 1.0];
  skyBox.textureNum = -2;
  skyBox.matrix.scale(50, 50, 50);
  skyBox.matrix.translate(-0.5, -0.5, -0.5);
  skyBox.render();
}

let lastFrameTime = performance.now();
let g_startTime = performance.now() / 1000,
    g_seconds = performance.now() / 1000 - g_startTime;
    
let frameCount = 0;
let fpsTime = 0;

function tick() {
  const now = performance.now();
  const delta = now - lastFrameTime;
  lastFrameTime = now;

  frameCount++;
  fpsTime += delta;

  if (fpsTime >= 1000) {
    const fps = frameCount;
    fpsIndicator.innerHTML = fps.toFixed(1);
    frameCount = 0;
    fpsTime = 0;
  }

  renderAllShapes();
  requestAnimationFrame(tick);
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addUIActions();
  initTextures();

  // specify the color for clearing <canvas>
  gl.clearColor(0.75, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderAllShapes();
  tick();
}