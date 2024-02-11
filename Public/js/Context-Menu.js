var Main;
(function (Main) {
    const Keybinds = {};
    const BuildingObjects = {
        "Main Building": []
    };
    const Buildings = {};
    function Init() {
        Main.can = new fabric.Canvas("Can", {
            backgroundColor: "white",
            width: 500,
            height: 500,
            stopContextMenu: true,
            fireRightClick: true,
        });
        let TimerID = undefined;
        ResizeCanvas();
        window.addEventListener("resize", ev => {
            if (TimerID)
                clearTimeout(TimerID);
            TimerID = setTimeout(ResizeCanvas, 500);
        });
        ContextMenu.Init();
    }
    Main.Init = Init;
    function ResizeCanvas() {
        Main.can.setWidth(window.innerWidth);
        Main.can.setHeight(window.innerHeight);
    }
    document.addEventListener("keydown", ev => {
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
        let elem = document.createElement("div");
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
        console.log(Actions);
    }
    ContextMenu.CreateAction = CreateAction;
    function Init() {
        TargetMenu = document.getElementById("ContextMenu");
        document.body.appendChild(TargetMenu);
        Main.can.on("mouse:down", function (opt) {
            ContextMenuIsOver_Element = opt.target;
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
                    for (const Action of Actions[ContextMenuIsOver]) {
                        TargetMenu.appendChild(Action[1]);
                    }
                    for (const e of inital) {
                        TargetMenu.removeChild(e);
                    }
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
        }).on("object:scaling", function (opt) {
            console.log(opt.target.name);
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
        width: 25,
        height: 25,
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
