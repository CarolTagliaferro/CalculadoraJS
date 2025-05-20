const input = document.getElementById('input');
const historyList = document.getElementById('historyList');
let deveLimpar = false; 

function clearHistory() {
    historyList.innerHTML = '';
  }
  
function appendValue(value) {
  if (deveLimpar) {
    input.value = '';
    deveLimpar = false;
  }
  input.value += value;
}

function clearDisplay() {
  input.value = '';
  deveLimpar = false;
}

function deleteLast() {
  if (deveLimpar) {
    input.value = '';
    deveLimpar = false;
  } else {
    input.value = input.value.slice(0, -1);
  }
}

function calculate() {
    try {
      let expression = input.value;
  
      // Raiz quadrada
      expression = expression.replace(/√\(/g, 'Math.sqrt(');
      expression = expression.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');
  
      // Porcentagem 
      expression = expression.replace(/(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)%/g, 
        (match, base, operator, percent) => {
          if (operator === '+' || operator === '-') {
            return `${base} ${operator} (${base} * ${percent} / 100)`;
          } else if (operator === '*') {
            return `${base} * (${percent} / 100)`;
          } else if (operator === '/') {
            return `${base} / (${percent} / 100)`;
          }
          return match;
        }
      );
  
      const result = Function('"use strict"; return (' + expression + ')')();
      addToHistory(input.value + ' = ' + result);
      input.value = result;
      deveLimpar = true;
    } catch (error) {
      input.value = 'Erro';
      deveLimpar = true;
    }
  }
  
expression = expression.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

function addToHistory(entry) {
  const li = document.createElement('li');
  li.textContent = entry;
  historyList.prepend(li);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    calculate();
  } else if (event.key === 'Backspace') {
    deleteLast();
  } else if (!isNaN(event.key) || "+-*/().^".includes(event.key)) {
    appendValue(event.key);
  }
});