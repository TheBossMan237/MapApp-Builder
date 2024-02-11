var Utils;
(function (Utils) {
    /**Clamps the middle argument between the other 2 arguments */
    function clamp(min, val, max) {
        if (val < min)
            val = min;
        if (val > max)
            val = max;
        return val;
    }
    Utils.clamp = clamp;
})(Utils || (Utils = {}));
var Main;
(function (Main) {
    Main.CellSize = 10;
    function NewShortcut(Shortcut, func) {
        Shortcuts[Shortcut] = func;
    }
    Main.NewShortcut = NewShortcut;
    const Shortcuts = {};
    const BuildingObjects = {
        "Main Building": []
    };
    const Buildings = {};
    const GridLines = [];
    let InitCalled = false;
    function Init() {
        Main.can = new fabric.Canvas("Can", {
            backgroundColor: "white",
            width: 500,
            height: 500,
            stopContextMenu: true,
            fireRightClick: true,
            fireMiddleClick: true,
        });
        let GridLineStyle = {
            stroke: "gray",
            strokeWidth: Main.CellSize / 10,
            selectable: false,
            hoverCursor: "cursor",
            name: "Can" //Name is can becuase it allowes context menu to click through it 
        };
        //draw the grid
        for (let i = 0; i < window.innerWidth; i += Main.CellSize) {
            let elem = new fabric.Line([i, 0, i, window.innerHeight], GridLineStyle);
            GridLines.push(elem);
            Main.can.add(elem);
        }
        for (let i = 0; i < window.innerHeight; i += Main.CellSize) {
            let elem = new fabric.Line([0, i, window.innerWidth, i], GridLineStyle);
            GridLines.push(elem);
            Main.can.add(elem);
        }
        //canvas Events 
        Main.can.on("mouse:wheel", function (opt) {
            var delta = opt.e.deltaY;
            var zoom = Main.can.getZoom();
            zoom *= .999 ** delta;
            zoom = Utils.clamp(0.1, zoom, 2);
            Main.can.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });
        //Window resizing 
        let TimerID = undefined;
        ResizeCanvas();
        window.addEventListener("resize", ev => {
            if (TimerID)
                clearTimeout(TimerID);
            TimerID = setTimeout(ResizeCanvas, 500);
        });
        ContextMenu.Init();
        InitCalled = true;
    }
    Main.Init = Init;
    function ResizeCanvas() {
        Main.can.setWidth(window.innerWidth);
        Main.can.setHeight(window.innerHeight);
    }
    document.addEventListener("keydown", ev => {
        let KeyCode = "";
        if (ev.key != "Shift" && ev.key != "Control") {
            KeyCode = ev.shiftKey ? "Shift+" : "" + ev.ctrlKey ? "Ctrl+" : "" + ev.key;
            if (Shortcuts[KeyCode])
                Shortcuts[KeyCode]();
        }
    });
})(Main || (Main = {}));
var ContextMenu;
(function (ContextMenu) {
    let ContextMenuIsOver_Element;
    let ContextMenuIsOver;
    let TargetMenu;
    let IsNewContext;
    function HideContextMenu() {
        TargetMenu.classList.add("HideContextMenu");
    }
    ContextMenu.HideContextMenu = HideContextMenu;
    function ShowContextMenu() {
        TargetMenu.classList.remove("HideContextMenu");
    }
    ContextMenu.ShowContextMenu = ShowContextMenu;
    const Actions = {};
    function CreateAction(Context, name, func) {
        let elem = document.createElement("span");
        elem.classList.add("Context-Menu-Item");
        elem.innerText = name;
        elem.onclick = () => {
            func(ContextMenuIsOver_Element);
            HideContextMenu();
        };
        if (!Actions[Context])
            Actions[Context] = [[name, elem]];
        else
            Actions[Context].push([name, elem]);
    }
    ContextMenu.CreateAction = CreateAction;
    function Init() {
        TargetMenu = document.getElementById("ContextMenu");
        document.body.appendChild(TargetMenu);
        Main.can.on("mouse:down", function (opt) {
            console.log(opt.target);
            ContextMenuIsOver_Element = opt.target;
            if (opt.e.buttons == 4)
                opt.e.preventDefault();
            if (opt.button == 3) {
                let ev = opt.e;
                let x = opt.e.clientX;
                let y = ev.clientY;
                if (opt.target) {
                    ContextMenuIsOver = opt.target.name;
                }
                else
                    ContextMenuIsOver = "Can";
                if (Actions[ContextMenuIsOver]) {
                    let inital = Array.from(TargetMenu.children);
                    for (const e of inital) {
                        TargetMenu.removeChild(e);
                    }
                    for (const Action of Actions[ContextMenuIsOver]) {
                        TargetMenu.appendChild(Action[1]); //Actions 1 is the element 
                    }
                }
                else {
                    return;
                }
                if (window.innerWidth - TargetMenu.clientWidth - x < 0) {
                    x -= TargetMenu.clientWidth;
                }
                if (window.innerHeight - TargetMenu.clientHeight - y < 0) {
                    y -= TargetMenu.clientHeight;
                }
                TargetMenu.style.left = x + "px";
                TargetMenu.style.top = y + "px";
                TargetMenu.classList.toggle("HideContextMenu");
                ShowContextMenu();
            }
            else {
                HideContextMenu();
            }
        });
        document.addEventListener("contextmenu", (ev) => {
            if (ev.target.parentElement == TargetMenu)
                ev.preventDefault();
        });
        TargetMenu.classList.add("HideContextMenu");
    }
    ContextMenu.Init = Init;
})(ContextMenu || (ContextMenu = {}));
Main.Init();
ContextMenu.CreateAction("Can", "Create Building", () => {
    let elem = new fabric.Rect({
        width: Main.CellSize,
        height: Main.CellSize,
        lockUniScaling: true,
    });
    elem.name = "Building";
    Main.can.add(elem);
});
ContextMenu.CreateAction("Building", "Delete Building", (target) => {
    Main.can.remove(target);
});
ContextMenu.CreateAction("Building", "Rename Building", (target) => {
});
ContextMenu.CreateAction("Building", "Enter Building", (target) => {
});
