interface MapNode extends fabric.Object {
    
} 
interface Building extends fabric.Object {

}
interface jsonNode{
    id: string
    type: string
    nearIds: string[]
    dists: number[]
    extraParams: any[]
    priv: boolean | number
}









const can = new fabric.Canvas("Can", {
    backgroundColor : "white"
})
const ContextMenu = document.getElementById("Context-Menu")
let IsPanning = false;
let NumMouseDown = 0;
let ScaleFactor = 0;
let ContextMenuCreated = false;

document.addEventListener("contextmenu", function(ev : any) {
    ev.preventDefault();
    if(ev.target.classList.contains("upper-canvas") || ev.target.clientList.contains("Context-Element")) {
        
        ContextMenu.style.display = "grid"
        ContextMenuCreated = true;
        if(ev.clientX > window.innerWidth / 2) {
            
        }
        ContextMenu.style.left = (ev.clientX > window.innerWidth / 2 ? ev.clientX - 200 : ev.clientX) +  "px" 
        ContextMenu.style.top = ev.clientY + "px"
    }
})

can.on("mouse:down", function(opt) {
    console.log(opt.e);
    if(IsPanning) {
        this.isdragging = true;
        this.selection = false;
        this.lastPosX = opt.e.clientX;
        this.lastPosY = opt.e.clientY;
    } else {
        
        
        
        this.isdragging = false;
        this.selection = true;
    }

    NumMouseDown = NumMouseDown < 2 ? NumMouseDown + 1 : 0;
}).on("mouse:move", function(ev) {
    if(IsPanning && ev.e.buttons == 1) {
        this.viewportTransform[4] += ev.e.clientX - this.lastPosX;
        this.viewportTransform[5] += ev.e.clientY - this.lastPosY;
        this.requestRenderAll()
        this.lastPosX = ev.e.clientX;
        this.lastPosY = ev.e.clientY;
    }
    if(ContextMenuCreated) {
        ContextMenu.style.display = "none"
    }

}).on("mouse:wheel", ev => {
    var delta = ev.e.deltaY;
    var zoom = can.getZoom();
    zoom *= 0.999 ** delta;
    if(zoom > 20) zoom = 10;
    if(zoom < 0.01) zoom = 0.1;
    can.setZoom(zoom);
    ev.e.preventDefault();
    ev.e.stopPropagation();
})

document.addEventListener("keypress", ev => {
    
})




document.addEventListener("keydown", ev => {
    console.log(ev.ctrlKey);
    
    
    if(ev.key.length == 1 && !ev.repeat && !ev.ctrlKey) {
        switch(ev.key) {
            case "g": IsPanning = !IsPanning; break;
            case "b": 
                ScaleFactor = 1 / can.getZoom();
                let NewBuilding = new fabric.Rect({
                    left : 100,
                    top : 100,
                    width : 300 * ScaleFactor,
                    height : 300 * ScaleFactor,
                    backgroundColor:"black"
                })
                can.add(NewBuilding)
                break;
            case "c":
                ScaleFactor = 1 / can.getZoom();
                let Building = new fabric.Circle({

                })
        }
    } else {
        switch(ev.key) {
            case "Backspace":
                if(can.selection) {
                    
                    can.remove(can.getActiveObject())
                }
                
        }
    }
    
})
function FitCanvasInWindow() {
    can.setWidth(window.innerWidth)
    can.setHeight(window.innerHeight - 100)
}
FitCanvasInWindow();
let WindowResizeTimeoutID = undefined
window.onresize = () => {
    if(WindowResizeTimeoutID) {
        clearTimeout(WindowResizeTimeoutID);
    }
    WindowResizeTimeoutID = setTimeout(FitCanvasInWindow, 500);

}
