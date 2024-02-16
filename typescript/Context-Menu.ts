type ContextMenuFunc = (ev : Event) => any
interface MouseEV extends MouseEvent {
    target : HTMLElement | undefined
} 
interface I_Actions {
    [TargetName : string | undefined] : [[string, HTMLElement]]
}
const Actions : I_Actions = {};
let ContextMenuIsOver_Element : fabric.Object;
let ContextMenuIsOver_Name : string;
let ContextMenuIsOver_PosX = 0;
let ContextMenuIsOver_PosY = 0;



let ContextMenu : HTMLElement = document.getElementById("ContextMenu");
document.addEventListener("contextmenu", (ev : MouseEV) => {
    if(ev.target.parentElement == ContextMenu) ev.preventDefault();
})
function ContextmenuEvent(opt : fabric.IEvent<MouseEvent>) {
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
            let inital = Array.from(ContextMenu.children);
            for(const e of inital) {ContextMenu.removeChild(e);}
            for(const Action of Actions[ContextMenuIsOver_Name]) {
                ContextMenu.appendChild(Action[1])  //Actions 1 is the element 
            }

        } else {return;}
        
        if(window.innerWidth - ContextMenu.clientWidth - x < 0) {
            x -= ContextMenu.clientWidth;
        }
        if(window.innerHeight - ContextMenu.clientHeight - y < 0) {
            y -= ContextMenu.clientHeight;
        }
        ContextMenu.style.left = x + "px";
        ContextMenu.style.top = y + "px";
        ContextMenu.classList.toggle("Hidden")
        ShowContextMenu();
        
    } else {
        HideContextMenu();
    }
}
function HideContextMenu() {
    ContextMenu.classList.add("Hidden")
}
function ShowContextMenu() {

}
function CreateAction(Context : string, name : string, func : (target : fabric.Object) => any) {
        
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
CreateAction("Can","Create Building", (target) => {
    let elem = new fabric.Rect({
        left : -target,
        width : CellSize,
        height : CellSize,
        lockUniScaling : true,  
    })
    
    
    elem.name = "Building"
    can.add(elem);
})
CreateAction("Building", "Delete Building", (target) => {
    can.remove(target);
    
})
CreateAction("Building", "Rename Building", (target) => {
})
CreateAction("Building", "Enter Building", (target) => {

})

