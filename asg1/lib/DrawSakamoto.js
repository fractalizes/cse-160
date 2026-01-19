// sakamoto from nichijou, reference photo i used:
// https://media.tenor.com/3qDw5i6bwGUAAAAM/dm4uz3-nichijou.gif

function drawSakamoto() {
  // Float32Array([topX, topY, leftX, leftY, rightX, rightY])
  /*const background = [
    [1, 1, -1, -1, 1, -1],
    [-1, -1, 1, 1, -1, 1]
  ];
  background.forEach((vertex) => {
    let triangle = new CustomTriangle(vertex, [0.7, 1, 0.75, 1]);
    g_shapesList.push(triangle);
    triangle.render();
  });*/
  
  const tail = [
    [-3.5, -4.25, -1.5, -4.75, -3.5, -4.75],
    [-1.5, -4.75, -3.5, -4.25, -1.5, -4.25],
    [-3.5, -4.75, -4, -3.75, -3.5, -3.75],
    [-3.5, -2.75, -4, -3.75, -3.5, -3.75],
    [-3.5, -2.75, -3.25, -4.25, -3.5, -4.25],
    [-3.25, -4.25, -3.5, -2.75, -3.25, -2.75],
    [-3.25, -2.75, -3, -3.25, -3.25, -3.25],
    [-3.25, -4, -3, -3.25, -3.25, -3.25],
    [-3.25, -3.75, -3, -4.25, -3.25, -4.25],
  ];
  tail.forEach((vertex) => {
    let triangle = new CustomTriangle(scaleDown(vertex), [0.325, 0.325, 0.325, 1]);
    g_shapesList.push(triangle);
    triangle.render();
  });

  const body = [
    [-0.5, -1.5, -1, -2, -0.5, -2],
    [-1, -2, -1.75, -4, -1, -4],
    [-1.75, -4, 2, -4.5, -1.75, -4.5],
    [-1.5, -4.75, -1.75, -4.5, -1.5, -4.5],
    [-1.5, -4.5, 2, -4.75, -1.5, -4.75],
    [1.75, -1.5, 2, -4, 1.75, -4],
    [2, -4, 2.25, -4.5, 2, -4.5],
    [2, -4.75, 2.25, -4.5, 2, -4.5],
    // fill empty space
    [2, -4.5, -1.75, -4, 2, -4],
    [2, -4.75, -1.5, -4.5, 2, -4.5],
    [-0.5, -2, 1.75, -1.5, -0.5, -1.5],
    [1.75, -1.5, -1, -2, 1.75, -2],
    [-1, -4, 1.75, -2, -1, -2],
    [1.75, -2, -1, -4, 1.75, -4]
  ];
  body.forEach((vertex) => {
    let triangle = new CustomTriangle(scaleDown(vertex), [0.388, 0.388, 0.388, 1]);
    g_shapesList.push(triangle);
    triangle.render();
  });

  const bandana = [
    [-0.5, -0.75, -0.25, -1, -1, -1],
    [-0.5, -1.5, -0.5, -1, -1, -1],
    [1, -2.5, 1, -1.5, -0.5, -1.5],
    [1, -2.5, 1, -1.25, 2, -1.25],
    [-0.5, -0.75, -0.5, 0, -1.25, 0],
    [-1.25, 0, -1.25, 0.75, -1.75, 0.75],
    [-1.75, 1.75, -1.75, 0.75, -0.5, 0.75],
    [-1.75, 2, -1.75, 1.75, -0.75, 1.75],
    [-0.75, 1.75, -0.75, 1.5, -0.5, 1.5],
    [-0.5, 1.5, -0.5, 0.25, -0.2, 0.25],
    [-0.5, -1, -0.5, 0.25, -0.2, 0.25],
    [0.5, 1.6, 0.25, 0.6, 0.5, 0.6],
    [1, 2, 0.5, 1.6, 1, 1.6],
    [1, 2, 1.5, 1.25, 1, 1.25],
    [1.25, 0.25, 1.5, 1.25, 1, 1.25],
    // fill empty spaces
    [-0.5, -0.75, -0.5, -1.5, 1.25, -1.5],
    [-0.75, 0.75, -0.75, 1.75, -1.75, 1.75],
    [-1.25, 1.5, -1.25, 0, -0.25, 0],
    [-0.5, 0, -0.5, 1.5, -1.5, 1.5],
    [0.5, 0.25, 0.25, 0.6, 0.5, 0.6],
    [0.5, 0.25, 1, 1.6, 0.5, 1.6],
    [1, 1.6, 0.5, 0.25, 1, 0.25],
    [1, 1.25, 0.75, 0.25, 1.4, -0.25]
  ];
  bandana.forEach((vertex) => {
    let triangle = new CustomTriangle(scaleDown(vertex), [0.88, 0.42, 0.46, 1]);
    g_shapesList.push(triangle);
    triangle.render();
  });

  const head = [
    [0, 1, -0.5, -0.75, 0, -0.75],
    [0, 1, 0.5, 0.25, 0, 0.25],
    [2, 1, 1.5, 0.25, 2, 0.25],
    [2, 1, 2.25, -0.5, 2, -0.5],
    [2.25, -0.5, 2.75, -1, 2.25, -1],
    [1.25, -1.5, 2.75, -1, 1.25, -1],
    [-0.25, -1.25, -0.5, -0.75, -0.25, -0.75],
    [1.25, -1.5, 1.25, -1.25, -0.25, -1.25],
    // fill empty spaces
    [2, -1.25, 2, 0.25, 0.5, 0.25],
    [0.5, 0.25, 0.5, -1.25, 2, -1.25],
    [0, -1.25, 1.75, 0.25, 0, 0.25],
    [0, -1.25, 1.75, -1.25, 0, 0.25],
    [-0.25, -1.25, 0, -0.5, -0.25, -0.5],
    [0, -0.5, -0.25, -1.25, 0, -1.25],
    [1.75, -0.5, 2.25, -1, 1.75, -1],
    [2.25, -1, 1.75, -0.5, 2.25, -0.5]
  ];
  head.forEach((vertex) => {
    let triangle = new CustomTriangle(scaleDown(vertex), [0.388, 0.388, 0.388, 1]);
    g_shapesList.push(triangle);
    triangle.render();
  });

  const eyes = [
    [0, -0.5, 0, -0.75, 0.75, -0.75],
    [0.75, -0.75, 0.75, -0.5, 0, -0.5],
    [1.25, -0.5, 1.25, -0.75, 2, -0.75],
    [2, -0.75, 2, -0.5, 1.25, -0.5]
  ];
  eyes.forEach((vertex) => {
    let triangle = new CustomTriangle(scaleDown(vertex), [0, 0, 0, 1]);
    g_shapesList.push(triangle);
    triangle.render();
  });
}

function scaleDown(vertices) {
  const scaleFactor = 0.2,
        xOffset = 0.1,
        yOffset = 0.3;
  return new Float32Array([
    (vertices[0] * scaleFactor) + xOffset,
    (vertices[1] * scaleFactor) + yOffset,
    (vertices[2] * scaleFactor) + xOffset,
    (vertices[3] * scaleFactor) + yOffset,
    (vertices[4] * scaleFactor) + xOffset,
    (vertices[5] * scaleFactor) + yOffset
  ]);
}