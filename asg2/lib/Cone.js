class Cone {
  constructor() {
    this.type = "cone";
    this.apex = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.height = 0.5;
    this.radius = 0.5;
    this.segments = 10; // how many triangles the base circle is composed of
  }

  render() {
    const rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);        // pass the color of a point to u_FragColor variable
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);      // pass the matrix to u_ModelMatrix attribute

    const vertices = createConeVertices(this);
    drawTriangle3D(vertices.length / 3, vertices);
  }
}

function createConeVertices(coneObj) {
  const vertices = [];

  const [ax, ay, az] = coneObj.apex;
  const baseY = ay - coneObj.height;

  for (let i = 0; i < coneObj.segments; i++) {
    const theta = (i / coneObj.segments) * Math.PI * 2;
    const phi = ((i + 1) / coneObj.segments) * Math.PI * 2;

    const x1 = ax + coneObj.radius * Math.cos(theta);
    const z1 = az + coneObj.radius * Math.sin(theta);

    const x2 = ax + coneObj.radius * Math.cos(phi);
    const z2 = az + coneObj.radius * Math.sin(phi);

    // side triangles
    vertices.push(
      ax, ay, az,
      x1, baseY, z1,
      x2, baseY, z2
    );

    // base circle
    vertices.push(
      0, -coneObj.height, 0,
      x1, -coneObj.height, z1,
      x2, -coneObj.height, z2
    );
  } return vertices;
}
