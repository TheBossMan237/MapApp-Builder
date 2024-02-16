/**Clamps a value between 2 other values */
function clamp(min : number, /**The value to be clamped*/val : number, max : number) {
    if(val < min) val = min
    if(val > max) val = max;
    return val; 
}
function cycle(min : number, val : number, max : number, step = 1) {
    val += step;
    if(val < min) val = max; 
    if(val > max) val = min;
    return val;
}
class Rect {
    constructor(public x : number, public y : number, public width : number, public height : number) {
        
    }
}