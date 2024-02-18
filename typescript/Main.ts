
/**Converts the position in the html page and the canvas with respect to zooming/scale */
function LocalToCanvasPos(x : number, y : number) {
    return [
        (can.viewportTransform[4] - x) * InverseZoom ,
        (can.viewportTransform[5] - y) * InverseZoom 
    ]
}


can.add(_ContextMenu)
can.on("mouse:wheel", function(opt) {

    var delta = -clamp(-.1, opt.e.deltaY, .1);
    zoom = clamp(0.5, zoom + delta, 2)
    
    InverseZoom = 1 / zoom;
    zoom = clamp(0.5, zoom, 2);

    can.zoomToPoint({x : opt.e.offsetX, y : opt.e.offsetY}, zoom)
    opt.e.preventDefault();
    opt.e.stopPropagation();
    _ContextMenu.width 


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
    console.log(can.viewportTransform);
    
}).on("mouse:move", function(opt) {
    var vpt = can.viewportTransform;
    if(IsPanning ) { 
        
        let ev = opt.e;
        let dx = ev.clientX - LastClientX;
        let dy = ev.clientY - LastClientY;
        console.log(dx);
        
        vpt[4] = clamp(-1000, vpt[4], 1000) + dx;
        vpt[5] = clamp(-2500, vpt[5], 2500) + dy;

        

        can.requestRenderAll()
        LastClientX = ev.clientX;
        LastClientY = ev.clientY; 
        
    }
}).on("object:scaling", function(opt) {

    let trans = opt.transform
    let deltaX = 0;
    //Scaling Up, Down, Left, Right
    
    if(trans[1] == "r") deltaX = CellSize
    else if(trans[1] == "l") deltaX = -CellSize
    console.log(LocalToCanvasPos);
    
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