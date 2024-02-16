/**Clamps a value between 2 other values */
function clamp(min, /**The value to be clamped*/ val, max) {
    if (val < min)
        val = min;
    if (val > max)
        val = max;
    return val;
}
function cycle(min, val, max, step = 1) {
    val += step;
    if (val < min)
        val = max;
    if (val > max)
        val = min;
    return val;
}
class Rect {
    x;
    y;
    width;
    height;
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
let LastClientX = 0;
let LastClientY = 0;
let IsPanning = false;
const can = new fabric.Canvas("Can", {
    backgroundColor: "white",
    width: 500,
    height: 500,
    stopContextMenu: true,
    fireRightClick: true,
    fireMiddleClick: true,
});
can.on("mouse:wheel", function (opt) {
    var delta = opt.e.deltaY;
    var zoom = can.getZoom();
    zoom *= .999 ** delta;
    zoom = clamp(0.5, zoom, 2);
    can.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
    var vpt = can.viewportTransform;
    if (zoom < 0.4) {
        vpt[4] = 200 - 500 * zoom;
        vpt[5] = 200 - 500 * zoom;
    }
    else {
        if (vpt[4] >= 0) {
            vpt[4] = 0;
        }
    }
}).on("mouse:down", ContextmenuEvent)
    .on("mouse:up", function (opt) {
    if (opt.button == 2)
        IsPanning = false;
}).on("object:moving", function (opt) {
    let left = Math.round(opt.target.left / CellSize);
    let top = Math.round(opt.target.top / CellSize);
    opt.target.set({
        left: left * CellSize,
        top: top * CellSize
    }).setCoords();
}).on("mouse:move", function (opt) {
    if (IsPanning) {
        console.log(opt.pointer);
        let ev = opt.e;
        var vpt = can.viewportTransform;
        let dx = ev.clientX - LastClientX;
        let dy = ev.clientY - LastClientY;
        vpt[4] += dx;
        vpt[5] += dy;
        can.requestRenderAll();
        LastClientX = ev.clientX;
        LastClientY = ev.clientY;
    }
});
function ResizeCanvas() {
    can.setWidth(window.innerWidth);
    can.setHeight(window.innerHeight);
}
ResizeCanvas();
let TimerID = undefined;
window.addEventListener("resize", ev => {
    if (TimerID)
        clearTimeout(TimerID);
    TimerID = setTimeout(ResizeCanvas, 500);
});
const Actions = {};
let ContextMenuIsOver_Element;
let ContextMenuIsOver_Name;
let ContextMenuIsOver_PosX = 0;
let ContextMenuIsOver_PosY = 0;
let ContextMenu = document.getElementById("ContextMenu");
document.addEventListener("contextmenu", (ev) => {
    if (ev.target.parentElement == ContextMenu)
        ev.preventDefault();
});
function ContextmenuEvent(opt) {
    ContextMenuIsOver_Element = opt.target;
    if (opt.e.buttons == 4) {
        opt.e.preventDefault();
        LastClientX = opt.e.clientX;
        LastClientY = opt.e.clientY;
        IsPanning = true;
    }
    if (opt.button == 3) {
        let ev = opt.e;
        let x = opt.e.clientX;
        let y = ev.clientY;
        if (opt.target) {
            ContextMenuIsOver_Name = opt.target.name;
        }
        else
            ContextMenuIsOver_Name = "Can";
        if (Actions[ContextMenuIsOver_Name]) {
            let inital = Array.from(ContextMenu.children);
            for (const e of inital) {
                ContextMenu.removeChild(e);
            }
            for (const Action of Actions[ContextMenuIsOver_Name]) {
                ContextMenu.appendChild(Action[1]); //Actions 1 is the element 
            }
        }
        else {
            return;
        }
        if (window.innerWidth - ContextMenu.clientWidth - x < 0) {
            x -= ContextMenu.clientWidth;
        }
        if (window.innerHeight - ContextMenu.clientHeight - y < 0) {
            y -= ContextMenu.clientHeight;
        }
        ContextMenu.style.left = x + "px";
        ContextMenu.style.top = y + "px";
        ContextMenu.classList.toggle("Hidden");
        ShowContextMenu();
    }
    else {
        HideContextMenu();
    }
}
function HideContextMenu() {
    ContextMenu.classList.add("Hidden");
}
function ShowContextMenu() {
}
function CreateAction(Context, name, func) {
    let elem = document.createElement("span");
    elem.classList.add("Context-Menu-Item");
    elem.innerText = name;
    elem.onclick = () => {
        func(ContextMenuIsOver_Element);
        HideContextMenu();
    };
    if (!Actions[Context])
        Actions[Context] = [[name, elem]];
    else
        Actions[Context].push([name, elem]);
}
CreateAction("Can", "Create Building", (target) => {
    let elem = new fabric.Rect({
        left: -target,
        width: CellSize,
        height: CellSize,
        lockUniScaling: true,
    });
    elem.name = "Building";
    can.add(elem);
});
CreateAction("Building", "Delete Building", (target) => {
    can.remove(target);
});
CreateAction("Building", "Rename Building", (target) => {
});
CreateAction("Building", "Enter Building", (target) => {
});
let GridLineStyle = { stroke: "black", strokeWidth: 5 };
let CellSize = 20;
//@ts-ignore
let GridLimits = new Rect(-1000, -1000, 1000, 1000);
//@ts-ignore
can.add(new fabric.Rect({
    top: -1000,
    left: -1000,
    width: 2000,
    height: 2000,
    stroke: "black",
    strokeWidth: 10,
    fill: "transparent",
    originX: "right",
    originY: "center",
    selectable: false,
    name: "Can" //context menu can click through
}));
//Credit 
//   https://stackoverflow.com/questions/68604136/fabric-js-canvas-infinite-background-grid-like-miro
//   waffentrager
let InfiniteGrid = fabric.util.createClass(fabric.Object, {
    type: "InfGrid",
    initialize: function () {
    },
    render: function (ctx) {
        let zoom = can.getZoom();
        let offX = can.viewportTransform[4];
        let offY = can.viewportTransform[5];
        ctx.save();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        let gridSize = CellSize * zoom;
        const numCellsX = Math.ceil(can.width / gridSize);
        const numCellsY = Math.ceil(can.width / gridSize);
        let gridOffsetX = offX % gridSize;
        let gridOffsetY = offY % gridSize;
        ctx.beginPath();
        for (let i = 0; i < numCellsX * gridSize; i += gridSize) {
            let x = gridOffsetX + i;
            ctx.moveTo((x - offX) / zoom, (0 - offY) / zoom);
            ctx.lineTo((x - offX) / zoom, (can.height - offY) / zoom);
        }
        for (let i = 0; i < numCellsY * gridSize; i += gridSize) {
            let y = gridOffsetY + i;
            ctx.moveTo((0 - offX) / zoom, (y - offY) / zoom);
            ctx.lineTo((can.width - offX) / zoom, (y - offY) / zoom);
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
});
//@ts-ignore
can.add(new InfiniteGrid());
