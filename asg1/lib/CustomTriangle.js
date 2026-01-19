class CustomTriangle {
  constructor(vertices, color) {
    this.type = "custom-triangle";
    this.vertices = vertices;
    this.color = color;
  }

  render() {
    let rgba = this.color;

    // pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    drawTriangle(this.vertices);
  }
}