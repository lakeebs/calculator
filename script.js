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
const buttonsArray = Array.from(buttons);
const maxChars = 7;
const keyMap = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
  '.': '.',
  '%': '%',
  'Enter': '=',
  'Delete': 'C',
  'Backspace': 'C',
  'Delete-AC': 'AC', // Add a hyphen to create custom branches
  'Backspace-AC': 'AC',
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9'
};

// Keypad event listener
let lastKeyPressTime = 0;
let lastKeyPressKey = '';

document.addEventListener('keydown', function(e) {
  const key = e.key;

  if (keyMap[key]) {

    // Return the value corresponding to the matched key
    const pressedButton = buttonsArray.find(button => button.textContent === keyMap[key]);

    if (pressedButton) {
      pressedButton.click();
    }
  } 
  
  if (e.key === 'Delete' || e.key === 'Backspace') {
    
    const currentTime = new Date().getTime();

    if (key === lastKeyPressKey && currentTime - lastKeyPressTime < 300) { // Adjust the double tap time
      const acButton = 'AC';
      const pressedButton = buttonsArray.find(button => button.textContent === acButton);

      if (pressedButton) {
        pressedButton.click();
      }
    }

    lastKeyPressTime = currentTime;
    lastKeyPressKey = key;

  }
});

// Touch event listener (prevent double tapping to zoom)
let lastTapTime = 0;

// Prevent double tapping on touch devices
document.addEventListener('touchend', function(event) {

  const currentTime = new Date().getTime();
  const timeSinceLastTap = currentTime - lastTapTime;

  // Check if the time between two taps is less than a certain threshold
  if (timeSinceLastTap < 300) {
    // If the time between two taps is too short, prevent the default behavior of the second tap
    event.preventDefault();
  }

  // Update the last tap time to the current time
  lastTapTime = currentTime;
});

// Button event listener
buttons.forEach(button => {
  button.addEventListener('click', buttonClick);
});

// Button click function
function buttonClick(e) {

  // If display doesn't read 0
  if (display.textContent !== '0') {

    // IF USER CLICKS A NUMBER
    if (e.target.classList.contains('num')) {

      // Limit max chars
      if ((display.textContent.length == maxChars) && !opClicked && (!display.textContent.includes('e')) && !operated && !display.classList.contains('egg')) {
        return;
      }

      // ...and operator has been clicked
      if (opClicked) {

        // If the user clicked zero
        if (e.target.classList.contains('zero')) {
          currentNum = '0';
        }

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
          operated = false;
          display.classList.remove('egg');
          display.textContent = '';
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

      if (display.textContent == '838383') {
        display.textContent = 'hi jennie';
        display.classList.add('egg');
        operated = true;
        return;
      }

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

      // On the off chance the user does an operation, clicks equals, and clicks clear
      if (operated) {
        operated = false;
      }

      // On the off chance the user clicks clear while opClicked, clear all
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
  if (display.textContent == '0' && e.target.classList.contains('num') && currentNum !== '0') {
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
  
  // If the currentNum is 0 (if the user deliberately clicked 0)
  else if (currentNum == '0') {

    if (e.target.classList.contains('equals')) {
      if (prevNum && operator) {
        operate(prevNum, currentNum, operator);
      }
      prevNum = '';
      operator = '';
      currentNum = '';
      operated = true;
    }

  }

  // If user clicks the AC button
  if (e.target.classList.contains('all-clear')) {
    allClear();
  }

}

// Operate function
function operate(prevNum, currentNum, operator) {

  const add = (prevNum, currentNum) => parseFloat(prevNum) + parseFloat(currentNum);
  const subtract = (prevNum, currentNum) => parseFloat(prevNum) - parseFloat(currentNum);
  const multiply = (prevNum, currentNum) => parseFloat(prevNum) * parseFloat(currentNum);
  const divide = (prevNum, currentNum) => {
    if (currentNum == '0') {
      return 8008135;
    } else {
      return parseFloat(prevNum) / parseFloat(currentNum);
    }
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

// Format result function
function formatResult(num) {
  let numStr = num.toString();

  // Check if the number is in exponential notation
  if (numStr.includes('e')) {
    return numStr; // Return as is if already in exponential notation
  }

  // Check if the number has trailing zeros
  if (numStr.includes('.') && !numStr.includes('e')) {
    numStr = num.toFixed(10).replace(/\.?0*$/, ''); // Truncate trailing zeros
  }

  // Check if the number exceeds maxChars
  if (numStr.length > maxChars) {
    return num.toExponential(2);
  }
  // If not, return the number with a fixed number of decimal places
  return parseFloat(num.toFixed(2)).toString();
};

// All clear function
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

// Add zero to decimal function
function addZeroToDecimal() {
  if (display.textContent.charAt(0) === '.') {
    display.textContent = '0' + display.textContent;
  }
};