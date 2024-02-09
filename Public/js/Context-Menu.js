var Main;
(function (Main) {
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
})(Main || (Main = {}));
var ContextMenu;
(function (ContextMenu) {
    let ContextMenuIsOver;
    let TargetMenu;
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
            func(ContextMenuIsOver);
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
                    for (const e of TargetMenu.children) {
                        TargetMenu.removeChild(e);
                    }
                    for (const Action of Actions[ContextMenuIsOver]) {
                        TargetMenu.appendChild(Action[1]);
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
        });
        document.addEventListener("mousedown", (ev) => {
            if (ev.target == TargetMenu && ev.buttons == 3)
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
ContextMenu.CreateAction("Building", "Rename Building", (target) => {
    console.log(target);
});
