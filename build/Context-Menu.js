const ContextMenu = document.getElementById("Context-Menu");
const ContextMenuItems = document.getElementsByClassName("ContextMenuItem");
const ContextMenuCreated = false;
document.addEventListener("mousedown", function (ev) {
    console.log(ev.target.className);
    if (ev.target.className == "ContextMenuItem") {
        return;
    }
    if (ev.target.id != "Context-Menu") {
        ContextMenu.classList.add("HideContextMenu");
    }
});
document.addEventListener("contextmenu", function (ev) {
    ev.preventDefault();
    if (ev.target.className == "upper-canvas ") {
        ContextMenu.classList.remove("HideContextMenu");
        ContextMenu.style.left = (ev.clientX - 200) + "px";
        ContextMenu.style.top = (ev.clientY) + "px";
    }
});
