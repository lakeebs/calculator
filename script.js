// Variables
let prevNum;
let operator;
let currentNum;
let opClicked = false;
let operated = false;
let equalClicked = false;
let percentageClicked = false;
let display = document.querySelector('.display');
let clear = document.querySelector('#row2 button:first-child');
let operatorBox = document.querySelector('.operator');
let result = parseFloat(display.textContent);
const buttons = document.querySelectorAll('button');

// Event listeners
buttons.forEach(button => {
  button.addEventListener('click', buttonClick);
});

// Functions
function allClear() {
  prevNum = '';
  operator = '';
  currentNum = '';
  opClicked = false;
  operated = false;
  display.textContent = '0';
  operatorBox.textContent = '';
  clear.textContent = 'AC';
  equalClicked = false;
  percentageClicked = false;
  clear.classList.add('all-clear');
  clear.classList.remove('clear');
  return;
}

function addZeroToDecimal() {
  if (display.textContent.charAt(0) === '.') {
    display.textContent = '0' + display.textContent;
  }
}

function buttonClick(e) {
  const maxChars = 6;

  // If display doesn't read 0
  if (display.textContent.length <= maxChars && display.textContent !== '0') {

    // if (display.textContent.length == maxChars) {
    //   console.log('limit reached');
    //   display.textContent = display.textContent.substring(0, maxChars);
    // }

    // IF USER CLICKS A NUMBER
    if (e.target.classList.contains('num')) {

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
        if (equalClicked || percentageClicked) {
          display.textContent = '';
          equalClicked = false;
          percentageClicked = false;
        }

        // Prevent multiple decimals
        if (e.target.classList.contains('decimal')) {
          if (display.textContent.indexOf('.') !== -1) { 
            return;
          }
        }

        if (!operated) {
          display.textContent += e.target.textContent;
          e.target.classList.contains('decimal') ? addZeroToDecimal() : null;
          return;
        }
        
        if (operated) {
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

        prevNum = '';
        currentNum = '';
        operator = '';
        equalClicked = true;
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
      equalClicked = false;
      clear.classList.add('all-clear');
      clear.classList.remove('clear');
      clear.textContent = 'AC';
      return;
    }

    // IF USER CLICKS THE PERCENTAGE BUTTON
    if (e.target.classList.contains('percentage')) {
      let percentage = display.textContent * Math.pow(10, -2);
      display.textContent = percentage;
      percentageClicked = true;
      return;
    }

  }

  // If the display reads 0 and user clicks a number
  if (display.textContent == '0' && e.target.classList.contains('num')) {
    display.textContent = '';
    display.textContent += e.target.textContent;
    equalClicked = false;

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
  const divide = (prevNum, currentNum) => parseFloat(prevNum) / parseFloat(currentNum);

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

  // Check if result has decimal places
  if (result % 1 !== 0) {
    result = result.toPrecision(5) / 1; // Dividing by 1 removes trailing zeroes
  } else {
    result = parseInt(result);
  }

  // Show result
  if (result == 0) {
    allClear();
    return;
  } else {
    display.textContent = result;
    operated = true;
  }

}

// Tasks
// keyboard support
// touch support
// easter egg
// maxchars function (code block doesn't run after maxchars reached, result shows more than 8 chars)
// message when dividing by 0
// design