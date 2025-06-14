const userInput = document.getElementById("user-input");
const answerInput = document.getElementById("answer-input");

let expression = "";
let calculated = false;

// Helper function for factorial
function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0) return 1;
  let f = 1;
  for (let i = 1; i <= n; i++) f *= i;
  return f;
}


function safeEval(expr) {
  window.factorial = factorial; 

  console.log("safeEval: Original expression for evaluation:", expr); 

  let processedExpr = expr;

  
  processedExpr = processedExpr.replace(/π/g, "Math.PI");
  processedExpr = processedExpr.replace(/÷/g, "/");
  processedExpr = processedExpr.replace(/x/g, "*");
  processedExpr = processedExpr.replace(/%/g, "/100"); 

  
  processedExpr = processedExpr.replace(/(\d+)!/g, (_, num) => `factorial(${num})`);
  console.log("safeEval: After factorial:", processedExpr);

  
  processedExpr = processedExpr.replace(/e\^(\d+(\.\d*)?)/g, `Math.E**($1)`); 
  processedExpr = processedExpr.replace(/e\^\(([^)]+)\)/g, `Math.E**($1)`); 
  processedExpr = processedExpr.replace(/e\^(sin|cos|tan)\(([^)]+)\)/g, `Math.E**(Math.$1(($2)*Math.PI/180))`);
  processedExpr = processedExpr.replace(/e\^(log|ln|sqrt)\(([^)]+)\)/g, `Math.E**(Math.$1($2))`);
  processedExpr = processedExpr.replace(/e\^(pi)/g, `Math.E**Math.PI`);
  console.log("safeEval: After e^x:", processedExpr);

    processedExpr = processedExpr.replace(/log\(([^)]+)\)/g, "Math.log10($1)"); 
  console.log("safeEval: After ln/log:", processedExpr);

  
  processedExpr = processedExpr.replace(/sin\(([^)]+)\)/g, "Math.sin(($1)*Math.PI/180)");
  processedExpr = processedExpr.replace(/cos\(([^)]+)\)/g, "Math.cos(($1)*Math.PI/180)");
  processedExpr = processedExpr.replace(/tan\(([^)]+)\)/g, "Math.tan(($1)*Math.PI/180)");
  console.log("safeEval: After trig:", processedExpr);

  
  processedExpr = processedExpr.replace(/sqrt\(([^)]+)\)/g, "Math.sqrt($1)");
  console.log("safeEval: After sqrt:", processedExpr);

 processedExpr = processedExpr.replace(/\^/g, "**"); 

  console.log("safeEval: Final processed expression for eval:", processedExpr);

  try {
    const result = eval(processedExpr);
    if (Number.isFinite(result) || Number.isNaN(result)) {
      return result;
    } else {
      console.warn("safeEval: Result is not finite (e.g., Infinity):", result);
      return NaN;
    }
  } catch (e) {
    console.error("safeEval: ERROR evaluating: '" + processedExpr + "' -- Details:", e);
    return NaN;
  }
}


function updateDisplay() {
  userInput.textContent = expression || "0";
  if (!calculated && expression === "") {
    answerInput.textContent = "0";
  } else if (!calculated) {
    answerInput.textContent = "0";
  }
}

function appendToExpression(value) {
  console.log("appendToExpression: Appending value:", value, "Current expression:", expression, "Calculated state:", calculated);

  let shouldClear = false;
  if (calculated) {
    if (/[0-9.]/.test(value) || value === "(" || value.endsWith('(') ||
        value === "e^" || value === "log(" || value === "ln(" || value === "sqrt(" ||
        value === "sin(" || value === "cos(" || value === "tan(") {
      shouldClear = true;
    } else if (/[+\-*/%]/.test(value)) {
      shouldClear = false;
    } else {
        shouldClear = false;
    }
  }

  if (shouldClear) {
    expression = "";
    calculated = false;
  } else if (calculated && value !== "=" && value !== "AC" && value !== "DEL") {
      calculated = false;
  }
  
  expression += value;
  console.log("appendToExpression: New expression:", expression);
  updateDisplay();
}

function clearAll() {
  expression = "";
  calculated = false;
  answerInput.textContent = "0";
  updateDisplay();
  console.log("clearAll: Calculator reset.");
}

function deleteLast() {
  expression = expression.slice(0, -1);
  calculated = false;
  updateDisplay();
  console.log("deleteLast: New expression:", expression);
}

function calculate() {
  console.log("calculate: Attempting to calculate expression:", expression);
  const result = safeEval(expression);
  if (isNaN(result)) {
    answerInput.textContent = "Error";
    expression = "";
    console.error("calculate: Calculation resulted in Error.");
  } else {
    answerInput.textContent = result.toString();
    expression = result.toString();
    calculated = true;
    console.log("calculate: Calculation successful. Result:", result, "New expression:", expression);
  }
}

// --- Event Listeners (unchanged from last version, as they should be correct) ---
document.querySelectorAll(".keys button").forEach(button => {
  button.addEventListener("click", () => {
    const val = button.getAttribute("data-value");
    console.log("Button Clicked (keys):", val);

    if (val === "AC") {
      clearAll();
      return;
    }
    if (val === "DEL") {
      deleteLast();
      return;
    }
    if (val === "=") {
      calculate();
      return;
    }
    appendToExpression(val);
  });
});

document.querySelectorAll(".sci-btn").forEach(button => {
  button.addEventListener("click", () => {
    const val = button.getAttribute("data-value");
    console.log("Button Clicked (sci-btn):", val);

    if (calculated) {
      const currentAnswer = answerInput.textContent;
      if (currentAnswer !== "Error" && currentAnswer !== "") {
        if (val === "pow" || val === "factorial" || val === "square") {
          expression = currentAnswer;
        } else if (val === "sqrt" || val === "exp" || val === "log10" || 
                 val === "pi" || val === "sin" || val === "cos" || val === "tan" || val === "(") {
          expression = "";
        } else if (val === ")") {
         
        }
      } else {
        expression = "";
      }
      calculated = false;
    }

    switch (val) {
      case "pow":
        appendToExpression("^");
        break;
      case "factorial":
        appendToExpression("!");
        break;
      case "sqrt":
        appendToExpression("sqrt(");
        break;
      case "square":
        appendToExpression("^2");
        break;
      case "exp":
        appendToExpression("e^");
        break;
      case "log10":
        appendToExpression("log(");
        break;
      case "pi":
        appendToExpression("π");
        break;
      case "sin":
      case "cos":
      case "tan":
        appendToExpression(val + "(");
        break;
      case "(":
        appendToExpression("(");
        break;
      case ")":
        appendToExpression(")");
        break;
      case "/":
        appendToExpression("/");
        break;
      default:
        console.warn("Unhandled scientific button value:", val);
        break;
    }
  });
});

updateDisplay();