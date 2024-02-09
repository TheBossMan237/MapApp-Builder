type ContextMenuFunc = (ev : Event) => any
interface MouseEV extends MouseEvent {
    target : HTMLElement | undefined
} 
namespace Main {
    const BuildingObjects = {
        "Main Building" : []
    }
    const Buildings = {};
    
    export let can : fabric.Canvas;
    export function Init() {
        can = new fabric.Canvas("Can", {
            backgroundColor : "white",
            width : 500,
            height : 500,
            stopContextMenu : true,
            fireRightClick : true,
        })
        
        let TimerID = undefined
        ResizeCanvas()
        window.addEventListener("resize", ev => {
            if(TimerID) clearTimeout(TimerID);
            TimerID = setTimeout(ResizeCanvas, 500);
        })

        ContextMenu.Init();
    }
    function ResizeCanvas() {
        can.setWidth(window.innerWidth);
        can.setHeight(window.innerHeight);
    }
}
namespace ContextMenu {
    let ContextMenuIsOver : string;
    let TargetMenu : HTMLElement;
    interface I_Actions {
        [TargetName : string | undefined] : [[string, HTMLElement]]
    }




    export function HideContextMenu() {
        TargetMenu.classList.add("HideContextMenu")
    }
    export function ShowContextMenu() {
        TargetMenu.classList.remove("HideContextMenu");
    }
    const Actions : I_Actions = {};
    export function CreateAction(Context : string, name : string, func : (target : string) => any) {
        let elem = document.createElement("div");
        elem.classList.add("Context-Menu-Item")
        elem.innerText = name;
        elem.onclick = () => {
            func(ContextMenuIsOver)
        }
        if(!Actions[Context]) Actions[Context] = [[name, elem]]
        else Actions[Context].push([name, elem]);
        console.log(Actions);
        


    }



    export function Init() {
        TargetMenu = document.getElementById("ContextMenu");
        
        document.body.appendChild(TargetMenu)
        Main.can.on("mouse:down",function(opt) {
            
            if(opt.button == 3) {
                let ev = opt.e;
                let x = opt.e.clientX
                let y = ev.clientY;



                
                if(opt.target) {
                    ContextMenuIsOver = opt.target.name;
                } else ContextMenuIsOver = "Can";
                if(Actions[ContextMenuIsOver]) {
                    for(const e of TargetMenu.children) {
                        TargetMenu.removeChild(e);
                    }
                    for(const Action of Actions[ContextMenuIsOver]) {
                        TargetMenu.appendChild(Action[1])
                        
                        
                    }
                }
                
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
        document.addEventListener("mousedown", (ev : MouseEV) => {
            if(ev.target == TargetMenu && ev.buttons == 3) ev.preventDefault()
        })

        TargetMenu.classList.add("HideContextMenu");
    }
}
Main.Init();
ContextMenu.CreateAction("Can","Create Building", () => {
    let elem = new fabric.Rect({
        width : 25,
        height : 25,
        lockUniScaling : true,
        
    })
    
    elem.name = "Building"
    Main.can.add(elem);
})

ContextMenu.CreateAction("Building", "Rename Building", (target) => {
    console.log(target);
})



