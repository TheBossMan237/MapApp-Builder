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
    export class Rect {
        constructor(public x : number, public y : number, public width : number, public height : number) {}
    }
    export class Point {
        constructor(public x : number, public y : number) {
            
        }
    }
}


namespace Popup {
    interface PopupElem extends HTMLElement {PopupLoaded : boolean} //Make's Typescript happy
    interface I_PopupElems {[key : string] : PopupElem}
    let Popup_Elems : I_PopupElems= {};
    export function GetPopup(name : string, id : string) {
        let popup : PopupElem = <any>document.getElementById(id);
        popup.classList.add("Popup");
        popup.PopupLoaded = true;
        Popup_Elems[name] = popup;
    }
    export function Show(name : string) {
        let elem = Popup_Elems[name];
        if(!elem) return;
        elem.style.display = "none";
    }
    export function Hide(name : string) {
        let elem = Popup_Elems[name];
        if(!elem) return;
        elem.style.display = "block"
    }

}

namespace Grid {
    export let CellSize = 10;
    let GridStyle = {
        stroke : "gray",
        strokeWidth : CellSize / 10
    }
    export const GridLines = [];
    export let GridElement : fabric.Group;
    export let GridDim : Utils.Rect;
    export function CreateGrid() {
        for(let i = 0; i < window.innerWidth; i+=CellSize) {
            let elem = new fabric.Line([i, 0, i, window.innerHeight], GridStyle)
            GridLines.push(elem);
        }
        for(let i = 0; i < window.innerHeight; i += CellSize) {
            let elem = new fabric.Line([0, i, window.innerWidth, i], GridStyle)
            GridLines.push(elem);
        }
        Main.can.add(new fabric.Group(GridLines, {
            selectable : false,
            hoverCursor : "cursor",
            name : "Can"
        }))


    }
}
namespace Main {
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
    export function ResizeGrid() {
        
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
        Grid.CreateGrid()
        //canvas Events 
        can.on("mouse:wheel", function(opt) {
            var delta = opt.e.deltaY
            var zoom = can.getZoom();
            zoom *= .999 ** delta;
            zoom = Utils.clamp(0.1, zoom, 2);
            can.zoomToPoint({x : opt.e.offsetX, y : opt.e.offsetY}, zoom)
            opt.e.preventDefault();
            opt.e.stopPropagation();
        }).on("mouse:down", ContextMenu.MouseDownEV     )

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
    let ContextMenuIsOver_Coords = new Utils.Point(0, 0);
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
        TargetMenu.classList.add("hidden")
    }
    export function ShowContextMenu() {
        TargetMenu.classList.remove("hidden");
    }
    export function MouseDownEV(opt : fabric.IEvent<MouseEvent>) {
        ContextMenuIsOver_Element = opt.target    
        if(opt.e.buttons == 4) {
            opt.e.preventDefault();
            LastClientX = opt.e.clientX;
            LastClientY = opt.e.clientY;
            IsPanning = true;
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
            TargetMenu.classList.toggle("hidden")
            ShowContextMenu();
            
        } else {
            HideContextMenu();
        }
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
        
        Main.can.on("mouse:up", function(opt) {
            if(opt.button == 2) IsPanning = false;
        })
        Main.can.on("object:moving", function(opt) {

            let left = Math.round(opt.target.left / Grid.CellSize)
            let top = Math.round(opt.target.top / Grid.CellSize)
            opt.target.set({
                left : left * Grid.CellSize,
                top : top * Grid.CellSize
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
            console.log(opt.target.scaleX);
            
            opt.target.set({
                scaleX : opt.target.scaleX,
                
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
        width : Grid.CellSize,
        height : Grid.CellSize,
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
Popup.GetPopup("Size", "GridSize");


