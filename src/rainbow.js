function main() {
    const a = rainbow();
}

var ele = /*Your Form Element*/;
if(ele.addEventListener){
    ele.addEventListener("submit", callback, false);  //Modern browsers
}else if(ele.attachEvent){
    ele.attachEvent('onsubmit', callback);            //Old IE
}

/**
 * Generates an 8bit Hexcolor String out of int values ranging from 0-255.
 * greater/lower values than 0-255 will be set to 0 or 255
 * @param {*} r red
 * @param {*} g green
 * @param {*} b blue
 * @returns html color code
 */
function rgbToHex(r, g, b) {
    let temp = '#';
    [r, g, b].forEach(elem => {
        temp += toPaddedHex(elem);
    });
    return  temp
}

/**
 * @param {number} n 
 * @param {String} mode limit or loop 
 * @return hex value of a number limited to 0-255
 */
function toPaddedHex(n, mode= 'limit') {
    if (mode === 'limit') {
        return clamp(n, 0, 255).toString(16).padStart(2, '0');
    } else if (mode === 'loop') {
        return (n % 256).toString(16).padStart(2, '0');
    }
}

function clamp(n, min, max) {
    return n < min ? min : (n > max ? max : n)
}

/**
 * Creates a rainbow by using repeating sine waves for color generation. Using no offset creates a monochromatic rainbow (black and white).
 * @param {number} offset angle of offset in degrees. Perfect rainbow means 120 degrees
 * @param {Array[String, number]} frequency the distance every color "travels" on the color wheel with each iteration
 * @returns {Array} of hexcolors
 */
function rainbow(
    offset = [0, 120, 120], 
    frequency = 64, 
    amplitude = {r:255 / 2, g:255 / 2, b:255 / 2}, 
    center = {r:255 / 2, g:255 / 2, b:255 / 2}) {
    /*
    rainbow repeats at 2 pi = 6.28318530718 = 360°
    1 pi = 180°
    golden angle = 2.3999632297 = 137.5077640500° (getting cycles to not repeat)
    */
    /*
    using offsets that differ by exactly 2*Math.PI/3 = 120° generates the perfect rainbow because 120°*3 = 360°.
    Experiment with other offsets to see the effects:
        offset of 0,0,0 makes a monochromatic (black and white) 'rainbow'
        offset of a,a,b means that red and green always have the same value
    */
    offset = setOffset(...offset);
    frequency = setFrequency(frequency);
    const colorPalette = [];

    for (let i = 0; i < 64; ++i) {
        //translate sine wave into an R/G/B color ranging from 0 to 255
        const r = Math.round(Math.sin(frequency.b * i + offset.r) * amplitude.r + center.r);
        const g = Math.round(Math.sin(frequency.g * i + offset.g) * amplitude.g + center.g);
        const b = Math.round(Math.sin(frequency.b * i + offset.b) * amplitude.b + center.b);

        colorPalette.push(rgbToHex(r, g, b));
    }
    return colorPalette;
}

/**
 * Helper function of rainbow. Creates an offset to allow for the rainbow effect.
 * All inputs in degree. Maybe this picture will explain better what we do here https://i.stack.imgur.com/01XJ7.png
 * [0,120,120] creates a perfect rainbow with the most distance between every phase
 * [a,a,a] creates a monochromatic rainbow, as all phases overlay
 * [0,0,180] creates a yellow-to-blue rainbow, as red+green = yellow and blue is exactly opposite to it
 * @param {number} initial initial offset of the first phase
 * @param {number} distP1P2 distance between Phase 1 and Phase 2
 * @param {number} distP2P3 distance between Phase 2 and Phase 3
 * @returns {object} offset, 360° gets converted into 2PI, which is 1 revelation of a sine wave
 */
function setOffset(initial, distP1P2, distP2P3) {
    return {r: (initial) * 2 * Math.PI /360, 
            g: (initial + distP1P2) * 2 * Math.PI /360,
            b: (initial + distP1P2 + distP2P3) * 2 * Math.PI /360};
}

/**
 * Helper function for rainbow. 
 * @param {number} steps 2 * Math.PI is a full rotation/360°. Steps is the number of iterations needed to get a full revelation
 *      Writing "goldenangle" as steps gives you the divisor used to get the golden angle.
 *      Information about the golden angle can be found here http://gofiguremath.org/natures-favorite-math/the-golden-ratio/the-golden-angle/
 *      For colors, we can use the golden angle to get colors that differ from each other as much as possible. This can be used for coloring graphs as we will never get the same color again.
 */
function setFrequency(steps = "32") {
    if (steps === "goldenangle") {
        steps =  2.61803751195 //(2 * Math.PI) / 2.61803751195 = 137.5077640500° which is the golden angle
    }
    return { r: (2 * Math.PI) / steps, g: (2 * Math.PI) / steps, b: (2 * Math.PI) / steps };
}

/**
 * Displays a box containing the given hexcolor or Array of hexcolors
 * @param {String|Array} color hexcolor or Array of hexcolors
 */
function display_color(color, mode) {
    if (!Array.isArray(color)) {
        color = [color]
    }

    if (mode === 'seperate') {
        let r = '';
        let g = '';
        let b = '';
        let only_r;
        let only_g;
        let only_b;
        for (let elem of color) {
            only_r = '#' + (elem[1] + elem[2]).repeat(3) //#RRRRRR
            only_g = '#' + (elem[3] + elem[4]).repeat(3) //#GGGGGG
            only_b = '#' + (elem[5] + elem[6]).repeat(3) //#BBBBBB
            // Note that &#9608; is a unicode character that makes a solid block
            r += '<font style="color:' + only_r + '">&#9608;</font>';
            g += '<font style="color:' + only_g + '">&#9608;</font>';
            b += '<font style="color:' + only_b + '">&#9608;</font>';
        }
        document.write(r + 'R<br>')
        document.write(g + 'G<br>')
        document.write(b + 'B<br>')
    }

    let rgb = '';
    for (let elem of color) {
        // Note that &#9608; is a unicode character that makes a solid block
        rgb += '<font style="color:' + elem + '">&#9608;</font>';
    }
    document.write(rgb + '<br>')
}

/* testing
console.log(rgbToHex(-10, 70, 400));
console.log(rgbToHex(10, 20, 30));
const a = rainbow();
//console.log(a);
//display_color(a);
//display_color(a, 'seperate');
*/
