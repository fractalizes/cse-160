class Circle {
  constructor() {
    this.type = "circle";
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
    this.segments = 10; // how many triangles the circle is composed of
  }

  render() {
    let xy = this.position,
        rgba = this.color,
        size = this.size;
    
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    let d = size / 200,
        angleStep = 360 / this.segments; // cos of triangle
    
    for (let angle = 0; angle < 360; angle += angleStep) {
      let centerPt = [xy[0], xy[1]],
          angle1 = angle,
          angle2 = angle + angleStep,
          vec1 = [Math.cos(angle1 * Math.PI / 180) * d, Math.sin(angle1 * Math.PI / 180) * d],
          vec2 = [Math.cos(angle2 * Math.PI / 180) * d, Math.sin(angle2 * Math.PI / 180) * d],
          pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]],
          pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];
      
      drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
    }
  }
}