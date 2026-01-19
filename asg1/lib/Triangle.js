class Triangle {
  constructor() {
    this.type = "triangle";
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
  }

  render() {
    let xy = this.position,
        rgba = this.color,
        size = this.size;

    // pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // pass the size of a point to u_Size variable
    gl.uniform1f(u_Size, size);

    // Draw
    let d = this.size / 200;
    drawTriangle([
        xy[0], xy[1],
        xy[0] + d, xy[1],
        xy[0], xy[1] + d
    ]);
  }
}

function drawTriangle(vertices) {
  let n = 3; // # of vertices
  let vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // bind the buffer object to target and write data into buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false,  0, 0);

  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}