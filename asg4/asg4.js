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
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    /*v_Normal = a_Normal;*/
    v_VertPos = u_ModelMatrix * a_Position;
  }
`;

// fragment shader program
const FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform vec3 u_PointLightPos;
  uniform vec3 u_SpotLightPos;
  uniform vec3 u_SpotDirection;
  uniform vec3 u_CameraPos;
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
  uniform float u_SpotCutoff;
  uniform float u_SpotOuterCutoff;
  uniform bool u_lightOn;
  
  void main() {
    if (u_whichTexture == -3) gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);  // use normal diffuse
    else if (u_whichTexture == -2) gl_FragColor = u_FragColor;                   // use color
    else if (u_whichTexture == -1) gl_FragColor = vec4(v_UV, 1.0, 1.0);          // use uv debug color
    else if (u_whichTexture == 0) gl_FragColor = texture2D(u_Sampler0, v_UV);    // use texture0
    else if (u_whichTexture == 1) gl_FragColor = texture2D(u_Sampler1, v_UV);    // use texture1
    else if (u_whichTexture == 2) gl_FragColor = texture2D(u_Sampler2, v_UV);    // use texture2
    else if (u_whichTexture == 3) gl_FragColor = texture2D(u_Sampler3, v_UV);    // use texture3
    else if (u_whichTexture == 4) gl_FragColor = texture2D(u_Sampler4, v_UV);    // use texture4
    else if (u_whichTexture == 5) gl_FragColor = texture2D(u_Sampler5, v_UV);    // use texture5
    else if (u_whichTexture == 6) gl_FragColor = texture2D(u_Sampler6, v_UV);    // use texture6
    else if (u_whichTexture == 7) gl_FragColor = texture2D(u_Sampler7, v_UV);    // use texture7
    else gl_FragColor = vec4(1, 0.2, .2, 1);                                     // error, use reddish color

    vec3 pointLightVector = u_PointLightPos - vec3(v_VertPos);
    
    // n dot l
    vec3 pointL = normalize(pointLightVector);
    vec3 pointN = normalize(v_Normal);
    float pointNDotL = max(dot(pointN, pointL), 0.0);

    // reflection
    vec3 pointR = reflect(-pointL, pointN);

    // eye
    vec3 pointE = normalize(u_CameraPos - vec3(v_VertPos));

    // red/green visualization
    // if (pointR < 1.0) gl_FragColor = vec4(1, 0, 0, 1);
    // else if (pointR < 2.0) gl_FragColor = vec4(0, 1, 0, 1);

    // light falloff visualization 1/(r^2)
    // gl_FragColor = vec4(vec3(gl_FragColor) / (pointR * pointR), 1);

    vec3 spotLightVector = u_SpotLightPos - vec3(v_VertPos);
    float r = length(spotLightVector);

    vec3 spotL = normalize(spotLightVector);
    vec3 spotN = normalize(v_Normal);
    float spotNDotL = max(dot(spotN, spotL), 0.0);

    // spotlight intensity
    vec3 spotVector = normalize(-u_SpotDirection);  
    float theta = dot(spotL, spotVector);

    // smooth edge
    float epsilon = u_SpotCutoff - u_SpotOuterCutoff;
    float intensity = clamp((theta - u_SpotOuterCutoff) / epsilon, 0.0, 1.0);

    float specular = pow(max(dot(pointE, pointR), 0.0), 10.0);
    vec3 diffuse = (vec3(gl_FragColor) * pointNDotL) + (vec3(gl_FragColor) * spotNDotL * intensity);
    vec3 ambient = (vec3(gl_FragColor) * 0.3) + (vec3(gl_FragColor) * 0.2);
    if (u_lightOn) {
      if (u_whichTexture == -3) {
        gl_FragColor = vec4(diffuse + ambient, 1.0);
      }
      else {
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      }
    }
  }
`;

// ----------------------------------- //
// ---                             --- //
// ---       GLOBAL VARIABLE       --- //
// ---                             --- //
// ----------------------------------- //

const texturePath = `./assets/textures/`;

let canvas, gl, program, fpsIndicator, normalIndicator,
    a_Position, a_UV, a_Normal,
    u_FragColor, u_PointLightPos, u_SpotLightPos, u_SpotDirection, u_SpotCutoff, u_SpotOuterCutoff,
    u_CameraPos, u_ModelMatrix, u_NormalMatrix, u_GlobalRotateMatrix, u_ViewMatrix, u_ProjectionMatrix,
    u_Sampler0, u_Sampler1, u_Sampler2, u_Sampler3, u_Sampler4, u_Sampler5, u_Sampler6, u_Sampler7, u_whichTexture, u_lightOn;

let g_camera = new Camera(),
    g_pointLightPos = [0.0, 16.0, 0.0],
    g_spotLightPos = [0.0, 15.0, 0.0],
    g_spotDirection = [0.0, -1.0, 0.0],
    g_spotCutoff = Math.cos(Math.PI / 8),
    g_spotOuterCutoff = Math.cos(Math.PI / 6),
    g_lightOn = true,
    g_normalOn = false,
    g_bunnyPos = [0.5, 5.0, 0.5]
    g_bunnyAngle = 0.0;

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

  if ((a_Normal = gl.getAttribLocation(gl.program, "a_Normal")) < 0) {
    console.log("[INIT ERROR] Failed to get the storage location of a_Normal");
    return;
  }
  if (!(u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_FragColor");
    return;
  }

  if (!(u_PointLightPos = gl.getUniformLocation(gl.program, "u_PointLightPos"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_PointLightPos");
    return;
  }

  if (!(u_SpotLightPos = gl.getUniformLocation(gl.program, "u_SpotLightPos"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_SpotLightPos");
    return;
  }

  if (!(u_SpotDirection = gl.getUniformLocation(gl.program, "u_SpotDirection"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_SpotDirection");
    return;
  }

  if (!(u_SpotCutoff = gl.getUniformLocation(gl.program, "u_SpotCutoff"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_SpotCutoff");
    return;
  }

  if (!(u_SpotOuterCutoff = gl.getUniformLocation(gl.program, "u_SpotOuterCutoff"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_SpotOuterCutoff");
    return;
  }

  if (!(u_CameraPos = gl.getUniformLocation(gl.program, "u_CameraPos"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_CameraPos");
    return;
  }

  if (!(u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_ModelMatrix");
    return;
  }

  if (!(u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_NormalMatrix");
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

  if (!(u_lightOn = gl.getUniformLocation(gl.program, "u_lightOn"))) {
    console.log("[INIT ERROR] Failed to get the storage location of u_lightOn");
    return;
  }

  // set an initial value for these matrices to identity
  const identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);

  return {
    a_Position:         gl.getAttribLocation (gl.program, "a_Position"),
    a_Normal:           gl.getAttribLocation (gl.program, "a_Normal"),
    u_ModelMatrix:      gl.getUniformLocation(gl.program, "u_ModelMatrix"),
    u_ProjectionMatrix: gl.getUniformLocation(gl.program, "u_ProjectionMatrix"),
    u_ViewMatrix:       gl.getUniformLocation(gl.program, "u_ViewMatrix"),
    u_NormalMatrix:     gl.getUniformLocation(gl.program, "u_NormalMatrix"),
    u_CameraPos:        gl.getUniformLocation(gl.program, "u_CameraPos"),
    u_FragColor:        gl.getUniformLocation(gl.program, "u_FragColor"),
    a_UV:               gl.getAttribLocation(gl.program, "a_UV"),
  };
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
      !image0, !image1, !image2, !image3, !image4, !image5, !image6, !image7
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
  const normalButton = document.getElementById("normal-button"),
        lightingButton = document.getElementById("lighting-button"),
        lightXSlider = document.getElementById("light-x-slider"),
        lightYSlider = document.getElementById("light-y-slider"),
        lightZSlider = document.getElementById("light-z-slider");

  fpsIndicator = document.getElementById("fps-span");
  normalIndicator = document.getElementById("normal-span");
  lightingIndicator = document.getElementById("lighting-span");

  globalThis.addEventListener("keydown", (event) => {
    // camera movement
    if (event.code === "KeyW") g_camera.moveForward();
    if (event.code === "KeyA") g_camera.moveLeft();
    if (event.code === "KeyS") g_camera.moveBack();
    if (event.code === "KeyD") g_camera.moveRight();

    // camera panning with keys
    if (event.code === "KeyQ") g_camera.panLeft();
    if (event.code === "KeyE") g_camera.panRight();
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

  normalButton.addEventListener("click", () => {
    if (g_normalOn) {
      normalIndicator.textContent = "OFF";
      normalButton.style.color = `rgb(255, 123, 123)`;
    } else {
      normalIndicator.textContent = "ON";
      normalButton.style.color = `rgb(50, 255, 94)`;
    }
    g_normalOn = !g_normalOn;
  });

  lightingButton.addEventListener("click", () => {
    if (g_lightOn) {
      lightingIndicator.textContent = "OFF";
      lightingButton.style.color = `rgb(255, 123, 123)`;
    } else {
      lightingIndicator.textContent = "ON";
      lightingButton.style.color = `rgb(50, 255, 94)`;
    }
    g_lightOn = !g_lightOn;
  });

  lightXSlider.addEventListener("input", () => { g_pointLightPos[0] = Number(lightXSlider.value) - 16 });
  lightYSlider.addEventListener("input", () => { g_pointLightPos[1] = Number(lightYSlider.value) });
  lightZSlider.addEventListener("input", () => { g_pointLightPos[2] = Number(lightZSlider.value) - 16 });
}

function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniform3f(u_PointLightPos, g_pointLightPos[0], g_pointLightPos[1], g_pointLightPos[2]);    // pass the point light position to glsl
  gl.uniform3f(u_SpotLightPos, g_spotLightPos[0], g_spotLightPos[1], g_spotLightPos[2]);        // pass the spotlight position to glsl
  gl.uniform3f(u_SpotDirection, g_spotDirection[0], g_spotDirection[1], g_spotDirection[2]);    // pass the spotlight direction to glsl
  gl.uniform1f(u_SpotCutoff, g_spotCutoff);
  gl.uniform1f(u_SpotOuterCutoff, g_spotOuterCutoff);
  gl.uniform3f(u_CameraPos, g_camera.eye.x, g_camera.eye.y, g_camera.eye.z);                    // pass the camera position to glsl
  gl.uniform1i(u_lightOn, g_lightOn);                                                           // pass the light boolean to glsl
  cameraControls();
  drawMap();

  // render light object only when light is on
  if (g_lightOn) {
    const light = new Cube();
    light.color = [1.0, 1.0, 0.0, 1.0];
    light.matrix.translate(g_pointLightPos[0], g_pointLightPos[1], g_pointLightPos[2]);
    light.matrix.scale(0.1, 0.1, 0.1);
    light.matrix.translate(-0.5, -0.5, -0.5);       // center cube to light source
    light.render();
  }

  const groundPlane = new Cube();
  groundPlane.color = [0.1, 0.1, 0.1, 1.0];
  if (g_normalOn) groundPlane.textureNum = -3;
  groundPlane.matrix.translate(0, -0.75, 0.0);
  groundPlane.matrix.scale(32, 0, 32);
  groundPlane.matrix.translate(-0.5, -1, -0.5);
  groundPlane.render();

  const skyBox = new Cube();
  skyBox.color = [0.75, 1.0, 1.0, 1.0];
  if (g_normalOn) skyBox.textureNum = -3;
  skyBox.matrix.scale(500, 500, 500);
  skyBox.matrix.translate(-0.5, -0.5, -0.5);
  skyBox.render();

  const sphere = new Sphere();
  sphere.color = [1.0, 0.55, 0.63, 1.0];
  if (g_normalOn) sphere.textureNum = -3;
  sphere.matrix.scale(1, 1, 1);
  sphere.matrix.translate(-5.0, 4.0, -0.5);
  sphere.render();

  if (bunny) {
    bunny.matrix.setIdentity();
    bunny.matrix.scale(0.25, 0.25, 0.25);
    bunny.matrix.translate(g_bunnyPos[0], g_bunnyPos[1] + Math.abs(5 * Math.cos(5 * g_seconds)), g_bunnyPos[2]);
    bunny.matrix.rotate(g_bunnyAngle, 0.0, 1.0, 0.0);
    bunny.render(gl, program);
  }
}

let lastFrameTime = performance.now();
let g_startTime = performance.now() / 1000,
    g_seconds = performance.now() / 1000 - g_startTime;
    
let frameCount = 0;
let fpsTime = 0;

function updateAnimation() {
  g_pointLightPos[0] = Math.cos(g_seconds);
  if ((g_bunnyAngle += 5) >= 360) g_bunnyAngle -= 360;
}

function tick() {
  const now = performance.now();
  const delta = now - lastFrameTime;
  lastFrameTime = now;

  frameCount++;
  fpsTime += delta;
  g_seconds = now / 1000 - g_startTime;

  if (fpsTime >= 1000) {
    const fps = frameCount;
    fpsIndicator.textContent = fps.toFixed(1);
    frameCount = 0;
    fpsTime = 0;
  }

  renderAllShapes();
  updateAnimation();
  requestAnimationFrame(tick);
}

let groundPlane, bunny, skyBox;
function main() {
  setupWebGL();
  program = connectVariablesToGLSL();
  addUIActions();
  initTextures();

  // specify the color for clearing <canvas>
  gl.clearColor(0.75, 1.0, 1.0, 1.0);

  // initialize object
  bunny = new Model(gl, `./assets/bunny.obj`);

  renderAllShapes();
  tick();
}