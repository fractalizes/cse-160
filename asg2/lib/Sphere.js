class Sphere {
  constructor() {
    this.type = "sphere";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.radius = 0.1;
    // how many triangles the circle is composed of
    this.stacks = 20;
    this.slices = 20;
  }

  render() {
    const rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);        // pass the color of a point to u_FragColor variable
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);      // pass the matrix to u_ModelMatrix attribute

    const vertices = createSphereVertices(this);
    drawTriangle3D(vertices.length / 3, vertices);
  }
}

function createSphereVertices(sphereObj) {
  const vertices = [];

  for (let i = 0; i < sphereObj.stacks; i++) {
    const theta1 = i * Math.PI / sphereObj.stacks;
    const theta2 = (i + 1) * Math.PI / sphereObj.stacks;

    for (let j = 0; j < sphereObj.slices; j++) {
      const phi1 = 2 * j * Math.PI / sphereObj.slices;
      const phi2 = 2 * (j + 1) * Math.PI / sphereObj.slices;

      // first triangle (cartesian -> spherical)
      vertices.push(
        sphereObj.radius * Math.sin(theta1) * Math.cos(phi1),             // x = p * cos(theta) * sin(phi)
        sphereObj.radius * Math.sin(theta1) * Math.sin(phi1),             // y = p * sin(theta) * sin(phi)
        sphereObj.radius * Math.cos(theta1),                              // z = p * cos(phi)

        sphereObj.radius * Math.sin(theta2) * Math.cos(phi1),
        sphereObj.radius * Math.sin(theta2) * Math.sin(phi1),
        sphereObj.radius * Math.cos(theta2),

        sphereObj.radius * Math.sin(theta2) * Math.cos(phi2),
        sphereObj.radius * Math.sin(theta2) * Math.sin(phi2),
        sphereObj.radius * Math.cos(theta2)
      );

      // second triangle
      vertices.push(
        sphereObj.radius * Math.sin(theta1) * Math.cos(phi1),
        sphereObj.radius * Math.sin(theta1) * Math.sin(phi1),
        sphereObj.radius * Math.cos(theta1),

        sphereObj.radius * Math.sin(theta2) * Math.cos(phi2),
        sphereObj.radius * Math.sin(theta2) * Math.sin(phi2),
        sphereObj.radius * Math.cos(theta2),

        sphereObj.radius * Math.sin(theta1) * Math.cos(phi2),
        sphereObj.radius * Math.sin(theta1) * Math.sin(phi2),
        sphereObj.radius * Math.cos(theta1)
      );
    }
  } return vertices;
}