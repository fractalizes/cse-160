class Cube {
  constructor() {
    this.type = "cube";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();
    this.textureNum = -2;
  }

  render() {
    const rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);                        // pass the texture number
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);        // pass the color of a point to u_FragColor variable
    
    // pass the matrices to u_ModelMatrix and u_NormalMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

    // calculate normal
    this.normalMatrix.setInverseOf(this.matrix).transpose();

    const allVerts = [
      // front of cube
      [
        0, 0, 0,
        1, 1, 0,
        1, 0, 0
      ],
      [
        0, 0, 0,
        0, 1, 0,
        1, 1, 0
      ],
      // back of cube
      [      
        0, 0, 1,
        1, 0, 1,
        1, 1, 1
      ],
      [
        0, 0, 1,
        1, 1, 1,
        0, 1, 1
      ],
      // top of cube
      [      
        0, 1, 0,
        0, 1, 1,
        1, 1, 1
      ],
      [
        0, 1, 0,
        1, 1, 1,
        1, 1, 0
      ],
      // bottom of cube
      [
        0, 0, 0,
        1, 0, 0,
        1, 0, 1
      ],
      [
        0, 0, 0,
        1, 0, 1,
        0, 0, 1
      ],
      // left of cube
      [
        0, 0, 0,
        0, 0, 1,
        0, 1, 1
      ],
      [
        0, 0, 0,
        0, 1, 1,
        0, 1, 0
      ],
      // right of cube
      [
        1, 0, 0,
        1, 1, 1,
        1, 0, 1
      ],
      [
        1, 0, 0,
        1, 1, 0,
        1, 1, 1
      ]
    ];
    const allUvs = [
      // front of cube
      [
        0, 0,
        1, 1,
        1, 0
      ],
      [
        0, 0,
        0, 1,
        1, 1
      ],
      // back of cube
      [
        0, 0,
        1, 0,
        1, 1
      ],
      [
        0, 0,
        1, 1,
        0, 1
      ],
      // top of cube
      [
        0, 0,
        1, 0,
        1, 1
      ],
      [
        0, 0,
        1, 1,
        0, 1
      ],
      // bottom of cube
      [
        0, 0,
        1, 0,
        1, 1
      ],
      [
        0, 0,
        1, 1,
        0, 1
      ],
      // left of cube
      [
        0, 0,
        1, 0,
        1, 1
      ],
      [
        0, 0,
        1, 1,
        0, 1
      ],
      // right of cube
      [
        0, 0,
        1, 1,
        1, 0
      ],
      [
        0, 0,
        0, 1,
        1, 1
      ]
    ];
    const allNormals = [
      // front of cube
      [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
      ],
      [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
      ],
      // back of cube
      [
        0, 0, -1,
        0, 0, -1,
        0, 0, -1
      ],
      [
        0, 0, -1,
        0, 0, -1,
        0, 0, -1
      ],
      // top of cube
      [
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
      ],
      [
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
      ],
      // bottom of cube
      [
        0, -1, 0,
        0, -1, 0,
        0, -1, 0
      ],
      [
        0, -1, 0,
        0, -1, 0,
        0, -1, 0
      ],
      // left of cube
      [
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0
      ],
      [
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0
      ],
      // right of cube
      [
        1, 0, 0,
        1, 0, 0,
        1, 0, 0
      ],
      [
        1, 0, 0,
        1, 0, 0,
        1, 0, 0
      ]
    ];
    drawTriangle3DUVNormal(allVerts.flat(), allUvs.flat(), allNormals.flat());
  }
}