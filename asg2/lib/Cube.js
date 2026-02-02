class Cube {
  constructor() {
    this.type = "cube";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
  }

  render() {
    const rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);        // pass the color of a point to u_FragColor variable
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);      // pass the matrix to u_ModelMatrix attribute

    // front of cube
    drawTriangle3D(
      3,
      [
        0.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
        1.0, 0.0, 0.0
      ]
    );
    drawTriangle3D(
      3,
      [
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        1.0, 1.0, 0.0
      ]
    );

    // back of cube
    drawTriangle3D(
      3,
      [      
        0.0, 0.0, 1.0,
        1.0, 0.0, 1.0,
        1.0, 1.0, 1.0
      ]
    );
    drawTriangle3D(
      3,
      [
        0.0, 0.0, 1.0,
        1.0, 1.0, 1.0,
        0.0, 1.0, 1.0
      ]
    );

    // top of cube
    drawTriangle3D(
      3,
      [      
        0.0, 1.0, 0.0,
        0.0, 1.0, 1.0,
        1.0, 1.0, 1.0
      ]
    );
    drawTriangle3D(
      3,
      [
        0.0, 1.0, 0.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, 0.0
      ]
    );

    // bottom of cube
    drawTriangle3D(
      3,
      [
        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 1.0
      ]
    );
    drawTriangle3D(
      3,
      [
        0.0, 0.0, 0.0,
        1.0, 0.0, 1.0,
        0.0, 0.0, 1.0
      ]
    );

    // left of cube
    drawTriangle3D(
      3,
      [
        0.0, 0.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 1.0, 1.0
      ]
    );
    drawTriangle3D(
      3,
      [
        0.0, 0.0, 0.0,
        0.0, 1.0, 1.0,
        0.0, 1.0, 0.0
      ]
    );

    // right of cube
    drawTriangle3D(
      3,
      [
        1.0, 0.0, 0.0,
        1.0, 1.0, 1.0,
        1.0, 0.0, 1.0
      ]
    );
    drawTriangle3D(
      3,[
        1.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
        1.0, 1.0, 1.0
      ]
    );
  }
}