class Cube {
  constructor() {
    this.type = "cube";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textureNum = 0;
  }

  render() {
    const rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);                        // pass the texture number
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);        // pass the color of a point to u_FragColor variable
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);      // pass the matrix to u_ModelMatrix attribute

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
    drawTriangle3DUV(allVerts.flat(), allUvs.flat());
    
    
    /*
    // front of cube
    drawTriangle3DUV(
      [
        0, 0, 0,
        1, 1, 0,
        1, 0, 0
      ],
      [
        0, 0,
        1, 1,
        1, 0
      ]
    );
    drawTriangle3DUV(
      [
        0, 0, 0,
        0, 1, 0,
        1, 1, 0
      ],
      [
        0, 0,
        0, 1,
        1, 1
      ]
    );

    // back of cube
    drawTriangle3DUV(
      [      
        0, 0, 1,
        1, 0, 1,
        1, 1, 1
      ],
      [
        0, 0,
        1, 0,
        1, 1
      ]
    );
    drawTriangle3DUV(
      [
        0, 0, 1,
        1, 1, 1,
        0, 1, 1
      ],
      [
        0, 0,
        1, 1,
        0, 1
      ]
    );

    // top of cube
    drawTriangle3DUV(
      [      
        0, 1, 0,
        0, 1, 1,
        1, 1, 1
      ],
      [
        0, 0,
        0, 1,
        1, 1
      ]
    );
    drawTriangle3DUV(
      [
        0, 1, 0,
        1, 1, 1,
        1, 1, 0
      ],
      [
        0, 0,
        1, 1,
        1, 0
      ]
    );

    // bottom of cube
    drawTriangle3DUV(
      [
        0, 0, 0,
        1, 0, 0,
        1, 0, 1
      ],
      [
        0, 0,
        1, 0,
        1, 1
      ]
    );
    drawTriangle3DUV(
      [
        0, 0, 0,
        1, 0, 1,
        0, 0, 1
      ],
      [
        0, 0,
        1, 1,
        0, 1
      ]
    );

    // left of cube
    drawTriangle3DUV(
      [
        0, 0, 0,
        0, 0, 1,
        0, 1, 1
      ],
      [
        0, 0,
        1, 0,
        1, 1
      ]
    );
    drawTriangle3DUV(
      [
        0, 0, 0,
        0, 1, 1,
        0, 1, 0
      ],
      [
        0, 0,
        1, 1,
        0, 1
      ]
    );

    // right of cube
    drawTriangle3DUV(
      [
        1, 0, 0,
        1, 1, 1,
        1, 0, 1
      ],
      [
        0, 0,
        1, 1,
        1, 0
      ]
    );
    drawTriangle3DUV(
      [
        1, 0, 0,
        1, 1, 0,
        1, 1, 1
      ],
      [
        0, 0,
        0, 1,
        1, 1
      ]
    );
    */
  }
}