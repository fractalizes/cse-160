class Triangle {
  constructor() {
    this.type = "triangle";
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
  }

  render() {
    const xy = this.position,
          rgba = this.color,
          size = this.size;

    // pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // pass the size of a point to u_Size variable
    gl.uniform1f(u_Size, size);

    // Draw
    const d = this.size / 200;
    drawTriangle([
        xy[0], xy[1],
        xy[0] + d, xy[1],
        xy[0], xy[1] + d
    ]);
  }
}

function drawTriangle3DUVNormal(vertices, uv, normals) {
  const n = vertices.length / 3;

  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object for vertexBuffer");
    return -1;
  }

  // bind the buffer object to target and write data into buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // assign the buffer object to a_Position variable
  // notice how 2 turned to 3 because 3d space
  // represents number of parameters being passed through
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false,  0, 0);
  gl.enableVertexAttribArray(a_Position);

  const uvBuffer = gl.createBuffer();
  if (!uvBuffer) {
    console.log("Failed to create the buffer object for uvBuffer");
    return -1;
  }

  // bind the buffer object to target and write data into buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

  // assign the buffer object to a_UV variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false,  0, 0);
  gl.enableVertexAttribArray(a_UV);

  const normalBuffer = gl.createBuffer();
  if (!normalBuffer) {
    console.log("Failed to create the buffer object for normalBuffer");
    return -1;
  }

  // bind the buffer object to target and write data into buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);

    // assign the buffer object to a_Normal variable
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false,  0, 0);
  gl.enableVertexAttribArray(a_Normal);

  gl.drawArrays(gl.TRIANGLES, 0, n); // n = # of vertices
  g_vertexBuffer = null;
}