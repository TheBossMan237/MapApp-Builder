let LastClientX = 0;
let LastClientY = 0;
let IsPanning = false;
let zoom = 1;
/**`1 / zoom` used for getting the position of thigns with zoom in consideration*/
let InverseZoom = 1;



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
    zoom *= .999 ** delta;
    InverseZoom = 1 / zoom;
    zoom = clamp(0.5, zoom, 2);
    can.zoomToPoint({x : opt.e.offsetX, y : opt.e.offsetY}, zoom)
    opt.e.preventDefault();
    opt.e.stopPropagation();
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
    var vpt = can.viewportTransform;
    if(IsPanning && vpt[4] * InverseZoom < 5000) { 
        
        let ev = opt.e;
        let dx = ev.clientX - LastClientX;
        let dy = ev.clientY - LastClientY;
        
        vpt[4] = clamp(-1000, vpt[4], 1000) + dx;
        vpt[5] = clamp(-2500, vpt[5], 2500) + dy;

        

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