// Variables
let prevNum;
let operator;
let currentNum;
let opClicked = false;
let operated = false;
let showsDecimal = false;
let display = document.querySelector('.display');
let clear = document.querySelector('#row2 button:first-child');
let operatorBox = document.querySelector('.operator');
let result = parseFloat(display.textContent);
const buttons = document.querySelectorAll('button');
const maxChars = 7;

// Event listeners
buttons.forEach(button => {
  button.addEventListener('click', buttonClick);
});

// Functions
function buttonClick(e) {

  // If display doesn't read 0
  if (display.textContent !== '0') {

    // IF USER CLICKS A NUMBER
    if (e.target.classList.contains('num')) {

      // Limit max chars
      if ((display.textContent.length == maxChars) && !opClicked) {
        return;
      }

      // ...and operator has been clicked
      if (opClicked) {
        operator = operatorBox.textContent;
        display.textContent = '';
        operatorBox.textContent = '';
        opClicked = false;
        operated = false;
      }

      // ...and operator hasn't been clicked
      if (!opClicked) {

        // If the display includes a decimal, the 'prevent multiple decimals' code will prevent a decimal from being typed. So, we empty the display first.
        if (showsDecimal) {
          display.textContent = '';
          showsDecimal = false;
        }

        // Prevent multiple decimals
        if (e.target.classList.contains('decimal')) {
          if (display.textContent.indexOf('.') !== -1) { 
            return;
          }
        }

        // If operate() hasn't run and operated is false
        if (!operated) {
          display.textContent += e.target.textContent;
          e.target.classList.contains('decimal') ? addZeroToDecimal() : null;
          return;
        }

        // If operate() has run and operated is true
        if (operated) {

          // if (!prevNum) {
          //   display.textContent = '';
          // }

          operated = false;
          display.textContent += e.target.textContent;
          e.target.classList.contains('decimal') ? addZeroToDecimal() : null;
        }
        
      }
      
    }

    // IF USER CLICKS AN OPERATOR
    if (e.target.classList.contains('op')) {

      // Prevent multiple operations from clicking on operators continuously
      if (!(operatorBox.textContent == '')) {
        operatorBox.textContent = e.target.textContent;
        return;
      }

      // ...and previous number isn't stored
      if (!prevNum) {
        prevNum = display.textContent;
        operatorBox.textContent = e.target.textContent;
        opClicked = true;
        return;
      }

      // ...and previous number is stored
      if (prevNum) {
        currentNum = display.textContent;
        operate(prevNum, currentNum, operator);

        if (display.textContent !== '0') {
          opClicked = true;
          operatorBox.textContent = e.target.textContent;
          prevNum = display.textContent;
          return;
        }
      }
    }

    // IF USER CLICKS THE EQUALS BUTTON
    if (e.target.classList.contains('equals')) {
      if (prevNum && operator) {
        currentNum = display.textContent;

        if (operatorBox.textContent == '') {
          operate(prevNum, currentNum, operator);
        } else {
          return;
        }

        if(display.textContent.indexOf('.') !== -1) {
          showsDecimal = true;
        }

        prevNum = '';
        currentNum = '';
        operator = '';
      } else {
        return;
      }
    }

      // IF USER CLICKS THE POS/NEG BUTTON
    if (e.target.classList.contains('posneg')) {
      let number = parseFloat(display.textContent);
      if (number > 0) {
        display.textContent = '-' + display.textContent;
      } else if (display.textContent.indexOf('-') !== -1) {
        display.textContent = display.textContent.replace('-', '');
      }
    }

    // IF USER CLICKS THE CLEAR BUTTON
    if (e.target.classList.contains('clear')) {
      display.textContent = '0';
      showsDecimal = false;
      clear.classList.add('all-clear');
      clear.classList.remove('clear');
      clear.textContent = 'AC';

      // On the off chance the user clicks clear while opClicked, clear all.
      if (opClicked) {
        operatorBox.textContent = '';
        prevNum = '';
        currentNum = '';
        operator = '';
        operated = false;
        opClicked = false;
      }

      return;
    }

    // IF USER CLICKS THE PERCENTAGE BUTTON
    if (e.target.classList.contains('percentage')) {
      let percentage = display.textContent * Math.pow(10, -2);
      
      // Truncate output to maxChars
      if (percentage.toString().length > maxChars + 1) { // Plus one to dismiss the decimal
        percentage = percentage.toString().substring(0, maxChars).replace(/\.?0*$/, '');
      }

      display.textContent = percentage;
      showsDecimal = true;
      return;
    }

  }

  // If the display reads 0 and user clicks a number
  if (display.textContent == '0' && e.target.classList.contains('num')) {
    display.textContent = '';
    display.textContent += e.target.textContent;
    showsDecimal = false;

    // Switch from AC to C for every number except 0
    if (!(e.target.classList.contains('zero'))) {
      clear.classList.add('clear');
      clear.classList.remove('all-clear');
      clear.textContent = 'C';
    }

    // Prepend a 0 if the number starts with a decimal
    e.target.classList.contains('decimal') ? addZeroToDecimal() : null;
    return;
  }

  // If user clicks the AC button
  if (e.target.classList.contains('all-clear')) {
    allClear();
  }

}

function operate(prevNum, currentNum, operator) {

  const add = (prevNum, currentNum) => parseFloat(prevNum) + parseFloat(currentNum);
  const subtract = (prevNum, currentNum) => parseFloat(prevNum) - parseFloat(currentNum);
  const multiply = (prevNum, currentNum) => parseFloat(prevNum) * parseFloat(currentNum);
  const divide = (prevNum, currentNum) => {
    if (parseFloat(currentNum) === 0) {
      return 0;
    }
    parseFloat(prevNum) / parseFloat(currentNum);
  }

  switch (operator) {
    case '+':
      result = add(prevNum, currentNum);
      break;
    case '−':
      result = subtract(prevNum, currentNum);
      break;
    case '×':
      result = multiply(prevNum, currentNum);
      break;
    case '÷':
      result = divide(prevNum, currentNum);
      break;
  }

  result = formatResult(result);

  // Show result
  if (result == 0) {
    allClear();
    return;
  } else {
    display.textContent = result;
    operated = true;
  }

};

function formatResult(num) {
  let numStr = num.toString();
  if (numStr.length > maxChars) {
    numStr = num.toExponential(2);
  }
  return numStr;
};

function allClear() {
  prevNum = '';
  operator = '';
  currentNum = '';
  opClicked = false;
  operated = false;
  display.textContent = '0';
  operatorBox.textContent = '';
  clear.textContent = 'AC';
  showsDecimal = false;
  clear.classList.add('all-clear');
  clear.classList.remove('clear');
  return;
};

function addZeroToDecimal() {
  if (display.textContent.charAt(0) === '.') {
    display.textContent = '0' + display.textContent;
  }
};

function divideByZero () {
  
}

// Tasks
// keyboard support
// touch support
// easter egg
// message when dividing by 0
// design