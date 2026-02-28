class Sphere {
  constructor() {
    this.type = "sphere";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textureNum = -2;
    this.verts32 = new Float32Array([]);
  }

  render() {
    const rgba = this.color;

    // pass the texture number and the color of a point to u_FragColor uniform variable
    // pass the color of a point to u_FragColor uniform variable
    // pass the matrix to u_ModelMatrix attribute
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    const d = Math.PI / 10, dd = Math.PI / 10;
    for (let t = 0; t < Math.PI; t += d) {
      for (let r = 0; r < 2 * Math.PI; r += d) {
        const p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];

        const p2 = [Math.sin(t + dd) * Math.cos(r), Math.sin(t + dd) * Math.sin(r), Math.cos(t + dd)];
        const p3 = [Math.sin(t) * Math.cos(r + dd), Math.sin(t) * Math.sin(r + dd), Math.cos(t)];
        const p4 = [Math.sin(t + dd) * Math.cos(r + dd), Math.sin(t + dd) * Math.sin(r + dd), Math.cos(t + dd)];

        let v = [], uv = [];
        v = v.concat(p1); uv = uv.concat([0, 0]);
        v = v.concat(p2); uv = uv.concat([0, 0]);
        v = v.concat(p4); uv = uv.concat([0, 0]);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        drawTriangle3DUVNormal(v, uv, v);

        v = [], uv = [];
        v = v.concat(p1); uv = uv.concat([0, 0]);
        v = v.concat(p4); uv = uv.concat([0, 0]);
        v = v.concat(p3); uv = uv.concat([0, 0]);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        drawTriangle3DUVNormal(v, uv, v);
      }
    }
  }
}