const ContextMenu = document.getElementById("Context-Menu")
const ContextMenuItems = document.getElementsByClassName("ContextMenuItem")
const ContextMenuCreated = false
interface MouseEV extends MouseEvent {target : HTMLElement | null}
    document.addEventListener("mousedown", function(ev : MouseEV) {
        console.log(ev.target.className);
        if(ev.target.className == "ContextMenuItem") {
        return;
        }
        if(ev.target.id != "Context-Menu") {
            ContextMenu.classList.add("HideContextMenu")
        
        
    }
})
document.addEventListener("contextmenu", function(ev : MouseEV) {
    ev.preventDefault();
    
    if(ev.target.className == "upper-canvas ") {
        ContextMenu.classList.remove("HideContextMenu")
        ContextMenu.style.left = (ev.clientX - 200) + "px"
        ContextMenu.style.top = (ev.clientY) + "px";
    }
})