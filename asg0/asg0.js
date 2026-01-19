// originally DrawTriangle.js (c) 2012 matsuda
// repurposed for CSE 140 Spring 2026 Quarter
// https://canvas.ucsc.edu/courses/88811/assignments/798365

function main() {
  // ----------------------------------- //
  // ---                             --- //
  // ---          FUNCTIONS          --- //
  // ---                             --- //
  // ----------------------------------- //

  function angleBetween(v1, v2) {
    return Math.acos(
      Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude())
    ) * (180 / Math.PI);
  }

  function areaTriangle(v1, v2) {
    return Vector3.cross(v1, v2).magnitude() / 2;
  }

  function drawVector(v, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    const originWidth = width / 2,
          originHeight = height / 2,
          scale = 20;

    ctx.moveTo(originWidth, originHeight); // move to canvas origin
    ctx.lineTo(originWidth + (v.elements[0] * scale), originHeight - (v.elements[1] * scale));
    ctx.stroke();
  }

  function handleDrawEvent() {
    const v1 = new Vector3([
      Number(document.getElementById("x1-input").value),
      Number(document.getElementById("y1-input").value),
      0
    ]);
    const v2 = new Vector3([
      Number(document.getElementById("x2-input").value),
      Number(document.getElementById("y2-input").value),
      0
    ]);
    let v3 = new Vector3([0, 0, 0]),
        v4 = new Vector3([0, 0, 0]);
    v3.set(v1);
    v4.set(v2);

    const operation = document.getElementById("operation-select").value,
          scalar = document.getElementById("scalar-input").value;
    switch (operation) {
      case "add":
        v3 = v3.add(v2);
        v4 = v4.mul(0);
        break;

      case "sub":
        v3 = v3.sub(v2);
        v4 = v4.mul(0);
        break;

      case "mul":
        v3 = v3.mul(scalar);
        v4 = v4.mul(scalar);
        break;

      case "div":
        v3 = v3.div(scalar);
        v4 = v4.div(scalar);
        break;

      case "abt":
        console.log("Angle: " + angleBetween(v3, v4));
        v3 = v3.mul(0);
        v4 = v4.mul(0);
        break;
      
      case "are":
        console.log("Area of the Triangle: " + areaTriangle(v3, v4));
        v3 = v3.mul(0);
        v4 = v4.mul(0);
        break;
      
      case "mag":
        console.log("Magnitude v1: " + v1.magnitude());
        console.log("Magnitude v2: " + v2.magnitude());
        v3 = v3.mul(0);
        v4 = v4.mul(0);
        break;

      case "nor":
        v3 = v3.normalize();
        v4 = v4.normalize();
        break;

      default:
        break;
    }

    // clear canvas and redraw rectangle
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
    ctx.fillRect(0, 0, width, height);

    drawVector(v1, "red");
    drawVector(v2, "blue");
    drawVector(v3, "green");
    drawVector(v4, "green");
  }

  // ----------------------------------- //
  // ---                             --- //
  // ---      DOCUMENT ELEMENTS      --- //
  // ---                             --- //
  // ----------------------------------- //

  const canvas = document.getElementById("example");  
  if (!canvas) { 
    console.log("Failed to retrieve the <canvas> element");
    return false; 
  } const ctx = canvas.getContext("2d");

  const width = canvas.width,
        height = canvas.height;

  // draw a black rectangle
  ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
  ctx.fillRect(0, 0, width, height);

  // add event listener
  const drawButton = document.getElementById("draw-button");
  drawButton.addEventListener("click", handleDrawEvent);
}