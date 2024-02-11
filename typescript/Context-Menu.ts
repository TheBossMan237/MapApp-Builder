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


        let GridLineStyle  = {
            stroke : "gray",
            strokeWidth : CellSize / 10,
            selectable : false,
            hoverCursor : "cursor",
            name : "Can" //Name is can becuase it allowes context menu to click through it 
        }
        //draw the grid
        for(let i = 0; i < window.innerWidth; i += CellSize) {
            let elem = new fabric.Line([i, 0, i, window.innerHeight], GridLineStyle)
            GridLines.push(elem)
            can.add(elem);
        }
        for(let i = 0; i < window.innerHeight; i += CellSize) {
            let elem = new fabric.Line([0, i, window.innerWidth, i], GridLineStyle)
            GridLines.push(elem);
            can.add(elem);
        }







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
    let ContextMenuIsOver : string;
    let TargetMenu : HTMLElement;
    let IsNewContext : boolean;

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

            console.log(opt.target);
            
            ContextMenuIsOver_Element = opt.target    
            if(opt.e.buttons == 4) opt.e.preventDefault();
            if(opt.button == 3) {
                let ev = opt.e;
                let x = opt.e.clientX
                let y = ev.clientY;



                
                if(opt.target) {
                    ContextMenuIsOver = opt.target.name;
                } else ContextMenuIsOver = "Can";
                if(Actions[ContextMenuIsOver]) {
                    let inital = Array.from(TargetMenu.children);
                    for(const e of inital) {TargetMenu.removeChild(e);}
                    for(const Action of Actions[ContextMenuIsOver]) {
                        
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
        document.addEventListener("contextmenu", (ev : MouseEV) => {
            if(ev.target.parentElement == TargetMenu) ev.preventDefault();
        })

        TargetMenu.classList.add("HideContextMenu");
            
    }

}
Main.Init();









ContextMenu.CreateAction("Can","Create Building", () => {
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



