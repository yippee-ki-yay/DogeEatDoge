 //returns a random color for the player circles
function getRndColor() {
    
    var r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
    
        return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function clamp(value, min, max){
    if(value < min) return min;
    else if(value > max) return max;
    return value;
}