const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");

function drawLine(ctx, line) {
  const {
    start,
    end,
    lineWidth = 1,
    lineCap = "round",
    strokeStyle = "red",
  } = line;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.lineWidth = lineWidth;
  ctx.lineCap = lineCap;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

function drawDot(ctx, crossDot) {
  const { xc, yc } = crossDot;
  ctx.beginPath();
  ctx.arc(xc, yc, 5, 0, 2 * Math.PI);
  ctx.stroke();
}

const mouse = {
  isPressed: false,
  down: null,
  current: null,
  up: null,
  setDown: function (event, element) {
    this.isPressed = true;
    this.down = this.getPosition(event, element);
  },
  setUp: function (event, element) {
    this.isPressed = false;
    this.up = this.getPosition(event, element);
  },
  setCurrent: function (event, element) {
    this.current = this.getPosition(event, element);
  },
  getPosition: function (event, element) {
    let position = {
      x: event.clientX - element.offsetLeft,
      y: event.clientY - element.offsetTop,
    };
    return position;
  },
};

function clearCanvas(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let lines = [];
let crossDots = [];

function clearAll() {
  clearCanvas(ctx);
  lines = [];
}

function draw() {
  clearCanvas(ctx);
  lines.forEach((line) => {
    drawLine(ctx, line);
  });
}

function ifCross(x1, y1, x2, y2, x3, y3, x4, y4) {
  let tTop = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  let uTop = (y3 - y1) * (x1 - x2) - (x3 - x1) * (y1 - y2);
  let bottom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  let crossDot = { xc: null, yc: null };
  if (bottom != 0) {
    let u = uTop / bottom;
    let t = tTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      crossDot.xc = x1 + (x2 - x1) * t;
      crossDot.yc = y1 + (y2 - y1) * t;
    }
  }
  return crossDot;
}

function handleMouseDown(e) {
  mouse.setDown(e, canvas);

  const line = {
    start: mouse.down,
    end: mouse.down,
  };
  lines.push(line);

  draw();
}
function handleMuseUp(e) {
  mouse.setUp(e, canvas);
}
function handleMouseMove(e) {
  if (mouse.isPressed) {
    mouse.setCurrent(e, canvas);

    let line = {
      start: mouse.down,
      end: mouse.current,
    };
    lines.pop();
    lines.push(line);
    draw();
    if (lines.length > 1) {
      for (let i = 0; i < lines.length; ++i) {
        let crossDot = ifCross(
          lines[lines.length - 1].start.x,
          lines[lines.length - 1].start.y,
          lines[lines.length - 1].end.x,
          lines[lines.length - 1].end.y,
          lines[i].start.x,
          lines[i].start.y,
          lines[i].end.x,
          lines[i].end.y
        );

        if (crossDot.xc != null) {
          crossDots.pop();
          crossDots.push(crossDot);
          crossDots.forEach((crossDot) => {
            drawDot(ctx, crossDot);
          });
        }
      }
    }
  }
}

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", handleMuseUp);
canvas.addEventListener("mousemove", handleMouseMove);
