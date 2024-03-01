// Variables
let opClicked = false;
let numPushed = false;
let display = document.querySelector('.display');
let operator = document.querySelector('.operator');
const buttons = document.querySelectorAll('button');

// Event listener
buttons.forEach(button => {
  button.addEventListener('click', buttonClick);
});

// Calculation
const calc = [];

// Button functions
function buttonClick(e) {
  const maxChars = 8;

  if (display.innerText.length < maxChars && display.innerText !== '0') {
    if (e.target.classList.contains('op')) {
      operator.innerText = e.target.innerText;
      opClicked = true;
      numPushed = false; // Reset to false
    }
    
    else if (e.target.classList.contains('num')) {
      if(opClicked == false) {
        display.innerText += e.target.innerText;
      } 
      else if (opClicked == true) {
        if(numPushed == false) {
          calc.push(display.innerText);
          numPushed = true;
          calc.push(operator.innerText);
          opClicked = false; // Reset to false
          display.innerText = '';
          display.innerText += e.target.innerText;
        } else if (numPushed == true) {
          display.innerText += e.target.innerText;
        }
      }
    } 
    
    else if (e.target.classList.contains('equals')) {
      if (numPushed == true && opClicked == true) {
        return;
      }
    }

  } else if (display.innerText === '0') {
      display.innerText = '';
      display.innerText += e.target.innerText;
  }
  
};