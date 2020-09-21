/**
 * Generates an 8bit Hexcolor String out of int values ranging from 0-255.
 * Uses the helper function "byte2hex" for conversion between int and hex
 * @param {int} r 
 * @param {int} g 
 * @param {int} b 
 * @returns {String} Hexcolor String written like this: #RRGGBB
 */
function RGB2Color(r,g,b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

/**
 * TODO create better function
 * @deprecated There are now better functions in JS to do this.
 * Converts a byte into a 2-Char hex.
 * Script copied from https://krazydad.com/tutorials/makecolors.php
 * @param {byte} n
 * @returns {String} hex value of byte 
 */
function byte2Hex(n) {
    const nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

console.log("Hello");
let a = 100;
let b = 200;
let c = 187;
console.log(RGB2Color(a,b,c));


/**
 * Creates a rainbow by using repeating sine waves for color generation. Using no offset creates a monochromatic rainbow (black and white).
 * 
 * @returns {array} of hexcolors
 */
function rainbow() {
    /*
    rainbow repeats at 2 pi = 6.28318530718 = 360°
    1 pi = 180°
    golden angle = 2.3999632297 = 137.5077640500°
    */
    const frequency = (2* Math.PI) / 32; //repeats after n times
    const amplitude = 255/2;
    const center = 255/2;

    const color_palette = [];

    for (let i = 0; i < 128; ++i){
        let r = Math.round(Math.sin(frequency * i) * amplitude + center); //translate sine wave into an R/G/B color ranging from 0 to 255
        let color = RGB2Color(r, r, r); //monocromatic
        //document.write(color + "    " + Math.sin(frequency * i) + "<br>");


    }
}
/*
document.write(color + "    " + Math.sin(frequency * i) + "<br>");
// Note that &#9608; is a unicode character that makes a solid block
document.write( '<font style="color:' + color + '">&#9608;</font>');
*/
