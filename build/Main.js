const can = new fabric.Canvas("Can", {
    backgroundColor: "white",
});
let IsPanning = false;
let ScaleFactor = 0;
document.addEventListener("contextmenu", function (ev) {
    ev.preventDefault();
});
can.on("mouse:down", function (opt) {
    if (IsPanning) {
        this.isdragging = true;
        this.selection = false;
        this.lastPosX = opt.e.clientX;
        this.lastPosY = opt.e.clientY;
    }
    else {
        this.isdragging = false;
        this.selection = true;
    }
}).on("mouse:move", function (ev) {
    if (IsPanning && ev.e.buttons == 1) {
        this.viewportTransform[4] += ev.e.clientX - this.lastPosX;
        this.viewportTransform[5] += ev.e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = ev.e.clientX;
        this.lastPosY = ev.e.clientY;
    }
}).on("mouse:wheel", ev => {
    var delta = ev.e.deltaY;
    var zoom = can.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20)
        zoom = 10;
    if (zoom < 0.01)
        zoom = 0.1;
    can.setZoom(zoom);
    ev.e.preventDefault();
    ev.e.stopPropagation();
}).on("object:scaling", function (opt) {
    console.log();
});
document.addEventListener("keypress", ev => {
});
const Keybinds = {
    "g": function () {
        IsPanning = !IsPanning;
    },
    "Control+C": function (ev) {
    },
    "Control+V": function (ev) {
    },
    "b": function (ev) {
        const ZoomFactor = 1 / can.getZoom();
        const Building = new fabric.Textbox("Building 1", {
            fontSize: 32 * ZoomFactor,
            width: 100 * ZoomFactor,
            height: 100 * ZoomFactor,
            textAlign: "center",
        });
        can.add(Building);
    }
};
document.addEventListener("keydown", ev => {
    if (ev.key.length == 1) {
        let Keybind = (ev.ctrlKey ? "Control+" : "") + (ev.shiftKey ? "Shift+" : "") + (ev.altKey ? "Alt+" : "") + ev.key.toLowerCase();
        console.log(Keybind);
        if (Keybinds[Keybind]) {
            Keybinds[Keybind](ev);
        }
    }
});
function FitCanvasInWindow() {
    can.setWidth(window.innerWidth);
    can.setHeight(window.innerHeight - 100);
}
FitCanvasInWindow();
let WindowResizeTimeoutID = undefined;
window.onresize = () => {
    if (WindowResizeTimeoutID) {
        clearTimeout(WindowResizeTimeoutID);
    }
    WindowResizeTimeoutID = setTimeout(FitCanvasInWindow, 500);
};
