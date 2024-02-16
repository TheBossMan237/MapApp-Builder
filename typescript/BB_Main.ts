let LastClientX = 0;
let LastClientY = 0;
let IsPanning = false;
const can = new fabric.Canvas("Can", {
    backgroundColor : "white",
    width : 500,
    height : 500,
    stopContextMenu : true,
    fireRightClick : true,
    fireMiddleClick : true,
})

can.on("mouse:wheel", function(opt) {

    var delta = opt.e.deltaY
    var zoom = can.getZoom();
    zoom *= .999 ** delta;
    zoom = clamp(0.5, zoom, 2);
    can.zoomToPoint({x : opt.e.offsetX, y : opt.e.offsetY}, zoom)

    opt.e.preventDefault();
    opt.e.stopPropagation();
    var vpt = can.viewportTransform;
    if(zoom < 0.4) {
        vpt[4] = 200 - 500 * zoom
        vpt[5] = 200 - 500 * zoom
    } else {
        if(vpt[4] >= 0) {
            vpt[4] = 0;
        }
    }



}).on("mouse:down", ContextmenuEvent)

.on("mouse:up", function(opt) {
    if(opt.button == 2) IsPanning = false;
}).on("object:moving", function(opt) {

    let left = Math.round(opt.target.left / CellSize)
    let top = Math.round(opt.target.top / CellSize)
    opt.target.set({
        left : left * CellSize,
        top : top * CellSize
    }).setCoords();
}).on("mouse:move", function(opt) {
    if(IsPanning) { 
        console.log(opt.pointer);
        
        let ev = opt.e;
        var vpt = can.viewportTransform;
        let dx = ev.clientX - LastClientX;
        let dy = ev.clientY - LastClientY;
        vpt[4] += dx
        vpt[5] += dy;

        

        can.requestRenderAll()
        LastClientX = ev.clientX;
        LastClientY = ev.clientY; 
        
    }
})
function ResizeCanvas() {
    can.setWidth(window.innerWidth);
    can.setHeight(window.innerHeight);
}
ResizeCanvas()







let TimerID = undefined

window.addEventListener("resize", ev => {
    if(TimerID) clearTimeout(TimerID);
    TimerID = setTimeout(ResizeCanvas, 500);
})