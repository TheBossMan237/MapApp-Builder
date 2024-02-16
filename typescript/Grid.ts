let GridLineStyle = {stroke : "black", strokeWidth : 5}
let CellSize = 20;

//@ts-ignore
let GridLimits = new Rect(-1000, -1000, 1000, 1000);



//@ts-ignore
can.add(new fabric.Rect({
    top : -1000,
    left : -1000,
    width : 2000,
    height : 2000,
    stroke : "black",
    strokeWidth : 10,
    fill : "transparent",
    originX : "right",
    originY : "center",
    selectable : false,
    name : "Can" //context menu can click through
}))

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


//@ts-ignore
can.add(new InfiniteGrid()); 