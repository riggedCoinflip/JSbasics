

const rgbToHex = (red, green, blue) =>
    "#" + [red, green, blue].map(toPaddedHex).join("");

const toPaddedHex = (number) =>
    clamp(number, 0, 255).toString(16).padStart(2, "0");
  
const clamp = (number, min, max) => 
    number < min
        ? min
        : number > max
            ? max
            : number;


/**
 * Generates an 8bit Hexcolor String out of int values ranging from 0-255.
 * greater/lower values than 0-255 will be set to 0 or 255
 * Uses the helper function 'byte_to_hex' for conversion between int and hex
 * @param {number} r 
 * @param {number} g 
 * @param {number} b 
 * @returns {String} Hexcolor String written like this: #RRGGBB
 */
function a_to_hex(r, g, b) {
    for (const [i, arg] of Array.from(arguments).entries()) {
        arguments[i] = arg >= 0 ? (arg <= 255 ? arg : 255) : 0; //if under 0: 0, else if over 255: 255, else arg
    }
    return '#' + rgb_to_hex(r) + rgb_to_hex(g) + rgb_to_hex(b);
}

/**
 * Converts a number into a 2-Char hex used for colors.
 * @param {number} n
 * @returns {String} hex value of least significant byte 
 */
function rgb_to_hex(n) {
    const temp = (Math.abs(n) % 256).toString(16);
    return temp.length < 2 ? '0' + temp : temp; //adds a leading zero in case we have a value below 16 (0x), to always get a string of length 2
}

/**
 * Creates a rainbow by using repeating sine waves for color generation. Using no offset creates a monochromatic rainbow (black and white).
 * @param {number} offset angle of offset in degrees. Perfect rainbow means 120 degrees
 * @param {Array[String, number]} frequency the distance every color "travels" on the color wheel with each iteration
 * @param {boolean} random when true, adds a random (eqal) offset to all colors, "rotating" the color wheel
 * @returns {Array} of hexcolors
 */
function rainbow(offset, frequency, random = false, amplitude = 255 / 2, center = 255 / 2) {
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
    offset = set_offset(offset);
    frequency = set_frequency(...frequency);
    if (random) {
        random = Math.random() * (2 * Math.PI)
    } else {
        random = 0
    }

    const color_palette = [];

    for (let i = 0; i < 64; ++i) {
        //translate sine wave into an R/G/B color ranging from 0 to 255
        r = Math.round(Math.sin(frequency.b * i + offset.r + random) * amplitude + center);
        g = Math.round(Math.sin(frequency.g * i + offset.g + random) * amplitude + center);
        b = Math.round(Math.sin(frequency.b * i + offset.b + random) * amplitude + center);



        let color = a_to_hex(r, g, b);
        color_palette.push(color);
    }
    return color_palette;
}

/**
 * Helper function of rainbow. Creates an offset to allow for the rainbow effect
 * @param {number} angle default 120. Angle of the offset in degrees. 0 equals monocrome, 120 is the perfect rainbow. Try for yourself
 * @returns {object} offset
 */
function set_offset(angle = 120) {
    return { r: 0, g: 2 * (angle / 120) * Math.PI / 3, b: 4 * (angle / 120) * Math.PI / 3 };
}

/**
 * Helper function for rainbow. 
 * @param {String} mode 
 *      goldenangle aims to create a non-repeating pattern with as much difference between the colors as possible.
 *      repeating generates a repeating color pattern every n steps
 * @param {number} steps 2* Math.PI is a full rotation/360°. Steps is the divisor.
 */
function set_frequency(mode = "repeating", steps = "32") {
    if (mode === "goldenangle") {
        //equals (2 * Math.PI) / 2.61803751195 = 137.5077640500°
        return { r: 2.3999632297, g: 2.3999632297, b: 2.3999632297 };
    } else if (mode === "repeating") {
        return { r: (2 * Math.PI) / steps, g: (2 * Math.PI) / steps, b: (2 * Math.PI) / steps };
    }
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
        for (let elem of color) {
            only_r = '#' + (elem[1] + elem[2]).repeat(3) //#RRRRRR
            only_g = '#' + (elem[3] + elem[4]).repeat(3)//#GGGGGG
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
console.log(a_to_hex(-10, 70, 400))
console.log(a_to_hex(10, 20, 30))
//const a = rainbow(120, [mode = "repeating", steps = "32"], random = true);
//console.log(a);
//display_color(a);
//display_color(a, 'seperate');


/*
function f(params) {
  const {a, b = 10, c = false} = params
  // ...do stuff...
}

f({a: 5, c: true})
*/