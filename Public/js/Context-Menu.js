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
    class Rect {
        x;
        y;
        width;
        height;
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
    }
    Utils.Rect = Rect;
    class Point {
        x;
        y;
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }
    Utils.Point = Point;
})(Utils || (Utils = {}));
var Grid;
(function (Grid) {
    Grid.CellSize = 10;
    let GridStyle = {
        stroke: "gray",
        strokeWidth: Grid.CellSize / 10
    };
    Grid.GridLines = [];
    function CreateGrid() {
        for (let i = 0; i < window.innerWidth; i += Grid.CellSize) {
            let elem = new fabric.Line([i, 0, i, window.innerHeight], GridStyle);
            Grid.GridLines.push(elem);
        }
        for (let i = 0; i < window.innerHeight; i += Grid.CellSize) {
            let elem = new fabric.Line([0, i, window.innerWidth, i], GridStyle);
            Grid.GridLines.push(elem);
        }
        Main.can.add(new fabric.Group(Grid.GridLines, {
            selectable: false,
            hoverCursor: "cursor",
            name: "Can"
        }));
    }
    Grid.CreateGrid = CreateGrid;
})(Grid || (Grid = {}));
var Main;
(function (Main) {
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
    function ResizeGrid() {
    }
    Main.ResizeGrid = ResizeGrid;
    function Init() {
        Main.can = new fabric.Canvas("Can", {
            backgroundColor: "white",
            width: 500,
            height: 500,
            stopContextMenu: true,
            fireRightClick: true,
            fireMiddleClick: true,
        });
        Grid.CreateGrid();
        //canvas Events 
        Main.can.on("mouse:wheel", function (opt) {
            var delta = opt.e.deltaY;
            var zoom = Main.can.getZoom();
            zoom *= .999 ** delta;
            zoom = Utils.clamp(0.1, zoom, 2);
            Main.can.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        }).on("mouse:down", ContextMenu.MouseDownEV);
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
    let ContextMenuIsOver_Name;
    let ContextMenuIsOver_Coords = new Utils.Point(0, 0);
    let TargetMenu;
    let IsPanning = false;
    let LastClientX = 0;
    let LastClientY = 0;
    function HideContextMenu() {
        TargetMenu.classList.add("HideContextMenu");
    }
    ContextMenu.HideContextMenu = HideContextMenu;
    function ShowContextMenu() {
        TargetMenu.classList.remove("HideContextMenu");
    }
    ContextMenu.ShowContextMenu = ShowContextMenu;
    function MouseDownEV(opt) {
        ContextMenuIsOver_Element = opt.target;
        if (opt.e.buttons == 4) {
            opt.e.preventDefault();
            LastClientX = opt.e.clientX;
            LastClientY = opt.e.clientY;
            IsPanning = true;
        }
        if (opt.button == 3) {
            let ev = opt.e;
            let x = opt.e.clientX;
            let y = ev.clientY;
            if (opt.target) {
                ContextMenuIsOver_Name = opt.target.name;
            }
            else
                ContextMenuIsOver_Name = "Can";
            if (Actions[ContextMenuIsOver_Name]) {
                let inital = Array.from(TargetMenu.children);
                for (const e of inital) {
                    TargetMenu.removeChild(e);
                }
                for (const Action of Actions[ContextMenuIsOver_Name]) {
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
    }
    ContextMenu.MouseDownEV = MouseDownEV;
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
        Main.can.on("mouse:up", function (opt) {
            if (opt.button == 2)
                IsPanning = false;
        });
        Main.can.on("object:moving", function (opt) {
            let left = Math.round(opt.target.left / Grid.CellSize);
            let top = Math.round(opt.target.top / Grid.CellSize);
            opt.target.set({
                left: left * Grid.CellSize,
                top: top * Grid.CellSize
            }).setCoords();
        });
        Main.can.on("mouse:move", function (opt) {
            if (IsPanning) {
                let ev = opt.e;
                var vpt = Main.can.viewportTransform;
                vpt[4] += ev.clientX - LastClientX;
                vpt[5] += ev.clientY - LastClientY;
                Main.can.requestRenderAll();
                LastClientX = ev.clientX;
                LastClientY = ev.clientY;
            }
        });
        Main.can.on("object:scaling", function (opt) {
            console.log(opt.target.scaleX);
            opt.target.set({
                scaleX: opt.target.scaleX,
            });
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
ContextMenu.CreateAction("Can", "Create Building", (target) => {
    let elem = new fabric.Rect({
        width: Grid.CellSize,
        height: Grid.CellSize,
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
