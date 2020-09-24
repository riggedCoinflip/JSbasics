/* Event Listeners */

//Syntax: element.addEventListener(event, function, useCapture);

console.log("Hello World");

var myP = document.getElementById("myP");
var myDiv = document.getElementById("myDiv");
var myP2 = document.getElementById("myP2");
var myDiv2 = document.getElementById("myDiv2");

myDiv.addEventListener("mouseover", () =>
    myP.textContent = "mouseover"
);

myDiv.addEventListener("mouseout", () =>
    myP.textContent = "mouseout"
);