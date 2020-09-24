/* Event Listeners */

//Syntax: element.addEventListener(event, function, useCapture);

console.log("Hello World");

const myP = document.getElementById("myP");
const myDiv = document.getElementById("myDiv");
const myP2 = document.getElementById("myP2");
const myDiv2 = document.getElementById("myDiv2");
const myButton = document.getElementById("myButton");

myDiv.addEventListener("mouseover", () =>
    myP.textContent = "mouseover"
);

myDiv.addEventListener("mouseout", () =>
    myP.textContent = "mouseout"
);

myButton.addEventListener("click", () => {
    myButton.dataset.howOftenClicked = parseInt(myButton.dataset.howOftenClicked) + 1;
    myButton.textContent = "Clicked: " + myButton.dataset.howOftenClicked;
    }
)