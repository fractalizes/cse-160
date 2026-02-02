class Cylinder {
  constructor() {
    this.type = "cylinder";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.height = 0.5;
    this.radius = 0.5;
    this.segments = 10; // how many triangles the base/top circles are composed of
  }

  render() {
    const rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);        // pass the color of a point to u_FragColor variable
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);      // pass the matrix to u_ModelMatrix attribute

    const vertices = createCylinderVertices(this);
    drawTriangle3D(vertices.length / 3, vertices);
  }
}

function createCylinderVertices(cylinderObj) {
  const vertices = [];
  const h = cylinderObj.height / 2;

  for (let i = 0; i < cylinderObj.segments; i++) {
    const theta = i * (2 * Math.PI / cylinderObj.segments);
    const phi = (i + 1) * (2 * Math.PI / cylinderObj.segments);

    const x1 = cylinderObj.radius * Math.cos(theta) / 2;
    const z1 = cylinderObj.radius * Math.sin(theta) / 2;
    const x2 = cylinderObj.radius * Math.cos(phi) / 2;
    const z2 = cylinderObj.radius * Math.sin(phi) / 2;

    // left side
    vertices.push(
      x1, -h, z1,
      x2, -h, z2,
      x2, h, z2
    );

    // right side
    vertices.push(
      x1, -h, z1,
      x2, h, z2,
      x1, h, z1
    );

    // base circle
    vertices.push(
      0, -h, 0,
      x1, -h, z1,
      x2, -h, z2
    );

    // top circle
    vertices.push(
      0, h, 0,
      x2, h, z2,
      x1, h, z1
    );

    // base circle
    vertices.push(
      0, -h, 0,
      x1, -h, z1,
      x2, -h, z2
    );
  } return vertices;
}