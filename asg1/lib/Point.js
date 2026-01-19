class Point {
  constructor() {
    this.type = "point";
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
  }

  render() {
    let xy = this.position,
        rgba = this.color,
        size = this.size;

    // quit using the buffer to send the attribute
    gl.disableVertexAttribArray(a_Position);

    // pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // pass the size of a point to u_Size variable
    gl.uniform1f(u_Size, size);
    
    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}