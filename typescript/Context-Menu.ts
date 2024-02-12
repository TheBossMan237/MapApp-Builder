type ContextMenuFunc = (ev : Event) => any
interface MouseEV extends MouseEvent {
    target : HTMLElement | undefined
} 
namespace Utils {
    /**Clamps the middle argument between the other 2 arguments */
    export function clamp(min : number, val : number, max : number) : number {
        if(val < min) val = min;
        if(val > max) val = max;
        return val;
    }
}





namespace Main {
    export let CellSize = 10;

    export function NewShortcut(Shortcut : string, func : () => {}) {
        Shortcuts[Shortcut] = func;
    }
    const Shortcuts = {};
    const BuildingObjects = {
        "Main Building" : []
    }
    const Buildings = {};
    const GridLines = [];
    let InitCalled = false;
    let GridLineStyle  = {
        stroke : "gray",
        strokeWidth : CellSize / 10  
    }
    export function ResizeGrid() {
        
    }
    export function CreateGrid() {
        for(let i = 0; i < window.innerWidth; i+=CellSize) {
            let elem = new fabric.Line([i, 0, i, window.innerHeight], GridLineStyle)
            GridLines.push(elem);
        }
        for(let i = 0; i < window.innerHeight; i += CellSize) {
            let elem = new fabric.Line([0, i, window.innerWidth, i], GridLineStyle)
            GridLines.push(elem);
        }
        let GridElem = new fabric.Group(GridLines, {
            selectable : false, 
            hoverCursor : "cursor",
            name : "Can" //Name is "can" becuase it allowes the user to click througn it
        })
        can.add(GridElem);
    }






    export let can : fabric.Canvas;
    export function Init() {
        can = new fabric.Canvas("Can", {
            backgroundColor : "white",
            width : 500,
            height : 500,
            stopContextMenu : true,
            fireRightClick : true,
            fireMiddleClick : true,
        })








        CreateGrid();
        //canvas Events 
        can.on("mouse:wheel", function(opt) {
            var delta = opt.e.deltaY
            var zoom = can.getZoom();
            zoom *= .999 ** delta;
            zoom = Utils.clamp(0.1, zoom, 2);
            can.zoomToPoint({x : opt.e.offsetX, y : opt.e.offsetY}, zoom)
            opt.e.preventDefault();
            opt.e.stopPropagation();
        })

        //Window resizing 
        let TimerID = undefined
        ResizeCanvas()
        window.addEventListener("resize", ev => {
            if(TimerID) clearTimeout(TimerID);
            TimerID = setTimeout(ResizeCanvas, 500);
        })

        ContextMenu.Init();
        InitCalled = true;
    }
    function ResizeCanvas() {
        can.setWidth(window.innerWidth);
        can.setHeight(window.innerHeight);
    }

    document.addEventListener("keydown", ev => {
        let KeyCode = ""
        if(ev.key != "Shift" && ev.key != "Control") {
            KeyCode = ev.shiftKey ? "Shift+" : "" + ev.ctrlKey ? "Ctrl+" : "" + ev.key
            if(Shortcuts[KeyCode]) Shortcuts[KeyCode]();
        }
    })
}
namespace ContextMenu {
    let ContextMenuIsOver_Element : fabric.Object;
    let ContextMenuIsOver_Name : string;
    let TargetMenu : HTMLElement;
    
    
    let IsPanning = false;
    let LastClientX = 0;
    let LastClientY = 0;




    interface I_Actions {
        [TargetName : string | undefined] : [[string, HTMLElement]]
    }
    interface I_ActionOptions  {
        
    }




    export function HideContextMenu() {
        TargetMenu.classList.add("HideContextMenu")
    }
    export function ShowContextMenu() {
        TargetMenu.classList.remove("HideContextMenu");
    }
    const Actions : I_Actions = {};
    export function CreateAction(Context : string, name : string, func : (target : fabric.Object) => any) {
        let elem = document.createElement("span");
        elem.classList.add("Context-Menu-Item")
        elem.innerText = name;
        elem.onclick = () => {
            func(ContextMenuIsOver_Element)
            HideContextMenu();
        }
        if(!Actions[Context]) Actions[Context] = [[name, elem]]
        else Actions[Context].push([name, elem]);
        
        


    }


    export function Init() {
        TargetMenu = document.getElementById("ContextMenu");
        
        document.body.appendChild(TargetMenu)
        Main.can.on("mouse:down",function(opt) {

            ContextMenuIsOver_Element = opt.target    
            if(opt.e.buttons == 4) {
                opt.e.preventDefault();
                IsPanning = true;
                LastClientX = opt.e.clientX;
                LastClientY = opt.e.clientY
                
            
            }
            if(opt.button == 3) {
                let ev = opt.e;
                let x = opt.e.clientX
                let y = ev.clientY;



                
                if(opt.target) {
                    ContextMenuIsOver_Name = opt.target.name;
                } else ContextMenuIsOver_Name = "Can";
                if(Actions[ContextMenuIsOver_Name]) {
                    let inital = Array.from(TargetMenu.children);
                    for(const e of inital) {TargetMenu.removeChild(e);}
                    for(const Action of Actions[ContextMenuIsOver_Name]) {
                        TargetMenu.appendChild(Action[1])  //Actions 1 is the element 
                    }

                } else {return;}
                
                if(window.innerWidth - TargetMenu.clientWidth - x < 0) {
                    x -= TargetMenu.clientWidth;
                }
                if(window.innerHeight - TargetMenu.clientHeight - y < 0) {
                    y -= TargetMenu.clientHeight;
                }
                TargetMenu.style.left = x + "px";
                TargetMenu.style.top = y + "px";
                TargetMenu.classList.toggle("HideContextMenu")
                ShowContextMenu();
                
            } else {
                HideContextMenu();
            }

        })
        
        Main.can.on("mouse:up", function(opt) {
            console.log(opt.button)
            if(opt.button == 2) IsPanning = false;
        })
        Main.can.on("object:moving", function(opt) {
            let left = Math.round(opt.target.left / Main.CellSize)
            let top = Math.round(opt.target.top / Main.CellSize)
            opt.target.set({
                left : left * Main.CellSize,
                top : top * Main.CellSize
            }).setCoords();
        })
        Main.can.on("mouse:move", function(opt) {
            if(IsPanning) {
                let ev = opt.e;
                var vpt = Main.can.viewportTransform;
                vpt[4] += ev.clientX - LastClientX
                vpt[5] += ev.clientY - LastClientY;
                Main.can.requestRenderAll()
                LastClientX = ev.clientX;
                LastClientY = ev.clientY; 
            }
        })
        Main.can.on("object:scaling", function(opt) {
            console.log(opt.target.width);
            opt.target.set({
                scaleX : Math.ceil(opt.target.scaleX)
            })
        })
        document.addEventListener("contextmenu", (ev : MouseEV) => {
            if(ev.target.parentElement == TargetMenu) ev.preventDefault();
        })

        TargetMenu.classList.add("HideContextMenu");
            
    }

}
Main.Init();









ContextMenu.CreateAction("Can","Create Building", (target) => {
    let elem = new fabric.Rect({
        width : Main.CellSize,
        height : Main.CellSize,
        lockUniScaling : true,  
    })
    
    
    elem.name = "Building"
    Main.can.add(elem);
})
ContextMenu.CreateAction("Building", "Delete Building", (target) => {
    Main.can.remove(target);
    
})
ContextMenu.CreateAction("Building", "Rename Building", (target) => {
})
ContextMenu.CreateAction("Building", "Enter Building", (target) => {

})



