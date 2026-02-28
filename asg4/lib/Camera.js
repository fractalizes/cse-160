class Camera {
  /**
   * @class
   * Camera class that keeps track of eye, at, up for movement (.setLookAt)
   * @properties
   * this.eye (Vector3), this.at (Vector3), this.up (Vector3), this.angle (degrees)
   */
  constructor() {
    this.eye = new Vector3([0, 5, 0]);
    this.at = new Vector3([0, 5, -1]);
    this.up = new Vector3([0, 1, 0]);
    
    this.angle = 5;

    // horizontal/vertical rotation
    this.yaw = -90;
    this.pitch = 0;

    this.sensitivity = 0.2;
  }

  /**
   * @helper
   * Helper function that converts degrees into radians
   */
  degToRad(deg) {
    return deg * Math.PI / 180;
  }

  /**
   * @helper
   * Helper function that returns the new forward direction vector
   */
  getForward() {
    let f = new Vector3(this.at.elements);
    f.sub(this.eye);
    f.normalize();
    return f;
  }

  /**
   * @helper
   * Helper function that returns the new right direction vector
   */
  getRight() {
    let f = this.getForward();
    let s = f.cross(this.up);
    s.normalize();
    return s;
  }

  /**
   * @returns
   * The camera's looking direction vector
   */
  getLookDirection() {
    let direction = new Vector3([
      this.at.elements[0] - this.eye.elements[0],
      this.at.elements[1] - this.eye.elements[1],
      this.at.elements[2] - this.eye.elements[2]
    ]);
    direction.normalize();
    return direction;
  }

  /**
   * @function
   * Moves the camera forward
   */
  moveForward() {
    let f = this.getForward();
    this.eye.add(f);
    this.at.add(f);
  }

  /**
   * @function
   * Moves the camera backwards
   */
  moveBack() {
    let f = this.getForward();
    this.eye.sub(f);
    this.at.sub(f);
  }

  /**
   * @function
   * Moves the camera to the left
   */
  moveLeft() {
    let s = this.getRight();
    this.eye.sub(s);
    this.at.sub(s);
  }

  /**
   * @function
   * Moves the camera to the right
   */
  moveRight() {
    let s = this.getRight();
    this.eye.add(s);
    this.at.add(s);
  }

  /**
   * @function
   * Pans the camera to the left
   */
  panLeft() {
    const rad = -this.degToRad(this.angle);

    // calculate forward vector
    let f = new Vector3(this.at.elements);
    f.sub(this.eye);

    // calculate new angle
    f.elements[0] = f.elements[0] * Math.cos(rad) - f.elements[2] * Math.sin(rad);
    f.elements[2] = f.elements[0] * Math.sin(rad) + f.elements[2] * Math.cos(rad);

    this.at = new Vector3(this.eye.elements);
    this.at.add(f);
  }

  /**
   * @function
   * Pans the camera to the left
   */
  panRight() {
    const rad = this.degToRad(this.angle);

    // calculate forward vector
    let f = new Vector3(this.at.elements);
    f.sub(this.eye);

    // calculate new angle
    f.elements[0] = f.elements[0] * Math.cos(rad) - f.elements[2] * Math.sin(rad);
    f.elements[2] = f.elements[0] * Math.sin(rad) + f.elements[2] * Math.cos(rad);

    this.at = new Vector3(this.eye.elements);
    this.at.add(f);
  }

  updateDirection() {
    let front = new Vector3([
      Math.cos(this.degToRad(this.yaw)) * Math.cos(this.degToRad(this.pitch)),
      Math.sin(this.degToRad(this.pitch)),
      Math.sin(this.degToRad(this.yaw)) * Math.cos(this.degToRad(this.pitch))
    ]);

    front.normalize();

    this.at = new Vector3(this.eye.elements);
    this.at.add(front);
  }

  /**
   * @function
   * 
   */
  processMouseMovement(xOffset, yOffset) {
    xOffset *= this.sensitivity;
    yOffset *= this.sensitivity;

    this.yaw += xOffset;
    this.pitch += yOffset;

    // prevent y-axis flipping
    if (this.pitch > 89) this.pitch = 89;
    if (this.pitch < -89) this.pitch = -89;

    this.updateDirection();
  }
}

function cameraControls() {
  let projMat = new Matrix4();
  projMat.setPerspective(
    60,                           // fov
    canvas.width / canvas.height, // aspect ratio
    0.1,                          // near plane
    100                           // far plane
  );
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // camera movement
  let viewMat = new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0],  g_camera.at.elements[1],  g_camera.at.elements[2],
    g_camera.up.elements[0],  g_camera.up.elements[1],  g_camera.up.elements[2]
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  let globalRotMat = new Matrix4();
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
}