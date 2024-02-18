let LastClientX = 0;
let LastClientY = 0;
let IsPanning = false;
let zoom = .5;
/**`1 / zoom` used for getting the position of thigns with zoom in consideration*/
let InverseZoom = 1;
let IsFirstScale = false;
let IsFirstScaleDirection = 0
/**The cursor position with respect to the zooming */
const CanvasCursorPos = {
    x : 0,
    y : 0
}
const can = new fabric.Canvas("Can", {
    backgroundColor : "white",
    width : 500,
    height : 500,
    stopContextMenu : true,
    fireRightClick : true,
    fireMiddleClick : true,
})
can.zoomToPoint({x : 0, y : 0}, .5)
const Actions : I_Actions = {};
let ContextMenuIsOver_Element : fabric.Object;
let ContextMenuIsOver_Name : string;
let ContextMenuIsOver_PosX = 0;
let ContextMenuIsOver_PosY = 0;
let ContextMenu : HTMLElement = document.getElementById("ContextMenu");
let GridLineStyle = {stroke : "black", strokeWidth : 5}
let CellSize = 40;


let GridLimits = new Rect(-1000, -1000, 1000, 1000);

let _ContextMenu = new fabric.Rect({
    width : 500,
    height : 800,
    selectable : false,
    hoverCursor : "cursor",
    fill : "transparent",
    stroke : "black",
    strokeWidth : 10
})
let OGCanWidth = can.getWidth();
let OGCanHeight = can.getHeight() 