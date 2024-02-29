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
  const maxChars = 9;

  if (display.innerText.length < maxChars && display.innerText !== '0') {

    if (e.target.classList.contains('op')) {
      num1 = display.innerText;
      op = e.target.innerText;
    } else if (e.target.classList.contains('num')) {
      if(op == undefined) {
        display.innerText += e.target.innerText;
      } else { // if the operator is stored
          if(op) { 
            // if last clicked button was operator
            // 
            display.innerText = '';
          }
          display.innerText += e.target.innerText;
      }

    } else if (e.target.classList.contains('equals')) {
      if (num1 !== undefined && num2 !== undefined && op !== undefined) {
        return parseInt(num1) + op + parseInt(num2);
      }
    }

  }  else if (display.innerText === '0') {
    display.innerText = '';
    display.innerText += e.target.innerText;
  }
  
};

// Operator functions
function add(num1, num2) { return num1 + num2; };
function subtract(num1, num2) { return num1 - num2; };
function multiply(num1, num2) { return num1 * num2; };
function divide(num1, num2) { return num1 / num2; };