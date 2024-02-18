/**Clamps a value between 2 other values */
function clamp(min : number, /**The value to be clamped*/val : number, max : number) {
    if(val < min) val = min
    if(val > max) val = max;
    return val; 
}
function cycle(min : number, val : number, max : number, step = 1) {
    val += step;
    if(val < min) val = max; 
    if(val > max) val = min;
    return val;
}
class Rect {
    constructor(public x : number, public y : number, public width : number, public height : number) {
        
    }
}
//Credit 
//   https://stackoverflow.com/questions/68604136/fabric-js-canvas-infinite-background-grid-like-miro
//   waffentrager
let InfiniteGrid = fabric.util.createClass(fabric.Object, {
    type : "InfGrid",
    initialize: function () {
        
    },
    render:function(ctx : CanvasRenderingContext2D) {
        let zoom = can.getZoom();
        let offX = can.viewportTransform[4];
        let offY = can.viewportTransform[5];
        ctx.save();
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 1;
        
        let gridSize = CellSize * zoom;
        const numCellsX = Math.ceil(can.width / gridSize);
        const numCellsY = Math.ceil(can.width / gridSize);
        
        let gridOffsetX = offX % gridSize;
        let gridOffsetY = offY % gridSize;
        ctx.beginPath();
        for(let i = 0; i < numCellsX * gridSize; i+=gridSize) {
            let x = gridOffsetX + i;
            ctx.moveTo((x - offX) / zoom, (0 - offY) / zoom);
            ctx.lineTo((x - offX) / zoom, (can.height - offY) / zoom);
        }
        for(let i = 0; i < numCellsY * gridSize; i+=gridSize) {
            let y = gridOffsetY + i;
            ctx.moveTo((0 - offX) / zoom, (y - offY) / zoom);
            ctx.lineTo((can.width - offX) / zoom, (y - offY) / zoom)
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        
    }
})
interface I_FabricCreateClass {
    type : string,
    /**use `fabric.Object.prototype.stateProperties.concat(additinal_props)`*/stateProperties : string[],


}
