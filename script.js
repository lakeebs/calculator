// Variables
let op;
let num1;
let num2;
let display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');

// Event listener
buttons.forEach(button => {
  button.addEventListener('click', buttonClick);
});

// Button functions
function buttonClick(e) {
  const maxChars = 8;

  // If the display shows a number that isn't zero
  if (display.innerText !== '0') {
    if (display.innerText.length < maxChars) {
      if (e.target.classList.contains('op')) { // If the user clicked an operator
        num1 = display.innerText;
        op = e.target.innerText;
      } else if (e.target.classList.contains('num')) { // If the user clicked a number
        display.innerText += e.target.innerText;
      }
    }

  // If the display shows a zero or if a value is stored in op
  } else if (display.innerText === '0' || op !== undefined) {
    console.log(op);
    display.innerText = '';
    let newNum = document.createTextNode(e.target.innerText);
    display.appendChild(newNum);
  }

  if (e.target.classList.contains('sum')) {
  // check if num1, num2, and op exist, perform the operation

  }
  
};

// Operator functions
function add(num1, num2) { return num1 + num2; };
function subtract(num1, num2) { return num1 - num2; };
function multiply(num1, num2) { return num1 * num2; };
function divide(num1, num2) { return num1 / num2; };