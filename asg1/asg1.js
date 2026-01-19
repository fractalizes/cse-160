// originally ColoredPoints.js (c) 2012 matsuda
// repurposed for CSE 140 Spring 2026 Quarter
// https://canvas.ucsc.edu/courses/88811/assignments/798366

// ----------------------------------- //
// ---                             --- //
// ---       GLOBAL VARIABLE       --- //
// ---                             --- //
// ----------------------------------- //

// vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`;

// fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

let canvas, gl, a_Position, u_FragColor, u_Size;

let redSlider, greenSlider, blueSlider,
    selectedSize = document.getElementById("size-range").value,
    selectedSeg = document.getElementById("segment-range").value,
    colorPreview = document.getElementById("color-preview-bg");

let shapeButtons = [pointButton, triangleButton, circleButton] = [
  document.getElementById("point-button"),
  document.getElementById("triangle-button"),
  document.getElementById("circle-button")
];
pointButton.disabled = true;

let g_shapesList = [],
    g_shapesRedoList = [];

// ----------------------------------- //
// ---                             --- //
// ---           CLASSES           --- //
// ---                             --- //
// ----------------------------------- //

class ColorSlider {
  constructor(slider, value) {
    this.slider = slider;
    this.value = value;
  }
  get val() { return this.value; }
  set val(val) { this.value = val; }
}

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
}

function connectVariablesToGLSL() {
   // initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  if ((a_Position = gl.getAttribLocation(gl.program, "a_Position")) < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  if (!(u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor"))) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }

  if (!(u_Size = gl.getUniformLocation(gl.program, "u_Size"))) {
    console.log("Failed to get the storage location of u_FragColor");
  }
}

function convertCoordinatesEventToGL(event) {
  let x = event.clientX; // x coordinate of a mouse pointer
  let y = event.clientY; // y coordinate of a mouse pointer
  let rect = event.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  
  return [x, y];
}

function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT); // clear <canvas>
  g_shapesList.forEach((shape) => { shape.render() });
}

function click(event) {
  let [x, y] = convertCoordinatesEventToGL(event);

  let point = (
    pointButton.disabled ? new Point() :
    triangleButton.disabled ? new Triangle() :
    new Circle()
  );
  point.position = [x, y];
  point.color = [
    redSlider.val / 255,
    greenSlider.val / 255,
    blueSlider.val / 255,
    alphaSlider.val
  ];
  point.size = selectedSize;
  if (point.type === "circle") point.segments = selectedSeg;

  g_shapesList.push(point);
  renderAllShapes();
}

function addUIActions() {
  redSlider = new ColorSlider(
    document.getElementById("red-range"),
    document.getElementById("red-range").value
  );
  blueSlider = new ColorSlider(
    document.getElementById("blue-range"),
    document.getElementById("blue-range").value
  );
  greenSlider = new ColorSlider(
    document.getElementById("green-range"),
    document.getElementById("green-range").value
  );
  alphaSlider = new ColorSlider(
    document.getElementById("alpha-range"),
    document.getElementById("alpha-range").value
  );

  // thanks to this stack overflow!
  // https://stackoverflow.com/questions/2173229/how-do-i-write-a-rgb-color-value-in-javascript
  redSlider.slider.addEventListener("mouseup", () => {
    redSlider.val = redSlider.slider.value;
    colorPreview.style.backgroundColor = `rgba(${redSlider.val}, ${greenSlider.val}, ${blueSlider.val}, ${alphaSlider.val})`;
  });
  blueSlider.slider.addEventListener("mouseup", () => {
    blueSlider.val = blueSlider.slider.value;
    colorPreview.style.backgroundColor = `rgba(${redSlider.val}, ${greenSlider.val}, ${blueSlider.val}, ${alphaSlider.val})`;
  });
  greenSlider.slider.addEventListener("mouseup", () => {
    greenSlider.val = greenSlider.slider.value;
    colorPreview.style.backgroundColor = `rgba(${redSlider.val}, ${greenSlider.val}, ${blueSlider.val}, ${alphaSlider.val})`;
  });
  alphaSlider.slider.addEventListener("mouseup", () => {
    alphaSlider.val = alphaSlider.slider.value / 100;
    colorPreview.style.backgroundColor = `rgba(${redSlider.val}, ${greenSlider.val}, ${blueSlider.val}, ${alphaSlider.val})`;
  });

  document.getElementById("size-range").addEventListener("mouseup", () => { selectedSize = Number(document.getElementById("size-range").value) });
  document.getElementById("segment-range").addEventListener("mouseup", () => { selectedSeg = Number(document.getElementById("segment-range").value) });
  
  document.getElementById("clear-button").addEventListener("mousedown", () => {
    g_shapesList.splice(0, g_shapesList.length);
    g_shapesRedoList.splice(0, g_shapesRedoList.length);
    gl.clear(gl.COLOR_BUFFER_BIT);
  });
  document.getElementById("undo-button").addEventListener("mousedown", () => {
    if (g_shapesList.length > 0) {
      g_shapesRedoList.push(g_shapesList.pop());
      renderAllShapes();
    }
  });
  document.getElementById("redo-button").addEventListener("mousedown", () => {
    if (g_shapesRedoList.length > 0) {
      g_shapesList.push(g_shapesRedoList.pop());
      renderAllShapes();
    }
  });
  document.getElementById("sakamoto-button").addEventListener("mousedown", drawSakamoto);

  shapeButtons.forEach((shapeButton) => {
    shapeButton.addEventListener("mousedown", () => {
      shapeButtons.forEach((button) => { button.disabled = false });
      shapeButton.disabled = true;
    });
  });  
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addUIActions();

  // update color preview when page loads
  colorPreview.style.backgroundColor = `rgb(${redSlider.val}, ${greenSlider.val}, ${blueSlider.val}, ${alphaSlider.val / 100})`

  // if mouse is held down and moved
  canvas.addEventListener("mousemove", (event) => {
    if (event.buttons === 1) click(event);
  });

  // if mouse is clicked once
  canvas.addEventListener("mousedown", (event) => { click(event) });

  // specify the color for clearing <canvas>, then clear it
  gl.clear(gl.COLOR_BUFFER_BIT);
}