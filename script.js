document.addEventListener('DOMContentLoaded', () => {

    const wrapper = document.getElementById('numbers-wrapper');
    const screen = document.getElementById('screen');

    let clearScreen = false;


    //Initialize numbers
    for (let i=10; i>=0; i--) {
        const button = document.createElement("button");
        if(i == 0) {
            button.textContent = '.';
        }
        else {
            button.textContent = i-1;
        }
        button.id = 'calc-button';
        wrapper.appendChild(button);
        button.addEventListener('click', function() {
            if(clearScreen == true) {
                screen.textContent = '0';
                clearScreen = false;

            }
            
            const currentContent = screen.textContent;
            if(currentContent == '0') {
                screen.textContent = button.textContent;
            }
            else {
                screen.textContent = currentContent + button.textContent;
            }
        }); 
    }


    //Initialize operators
    const operatorButtons = document.querySelectorAll('#operators-wrapper button');
    let operators = [];
    operatorButtons.forEach(button => {
        operators.push(button.textContent.toString());
    });

    operatorButtons.forEach(button => {
        button.id = 'calc-button';
        button.addEventListener('click', function() {
            const currentContent = screen.textContent;

            if(button.textContent === '=') {
                screen.textContent = calculate(currentContent.toString());
                console.log('Equals button pressed content is ' + screen.textContent);
                clearScreen = true;
            }

            else if(button.textContent === 'AC') {
                screen.textContent = '0';
            }

            else if(button.textContent === 'DEL') {
                if(currentContent.length > 1)
                    screen.textContent = currentContent.slice(0, -1);
                else 
                    screen.textContent = '0';
            }

            else {
                if(operators.includes(currentContent.charAt(currentContent.length - 1))) { //Check if end char is number or operator
                    if(button.textContent === '(') {
                        screen.textContent = currentContent + button.textContent;
                        
                    }
                    else {
                        console.log(button.textContent);
                        screen.textContent = currentContent.slice(0, -1) + button.textContent;
                    }
                }

                else { 
                    if(button.textContent === '(') {
                        screen.textContent = currentContent + 'x' + button.textContent;
                    }
                    else {
                        screen.textContent = currentContent + button.textContent;
                    }
                }

                clearScreen = false;
            }

        })
    })


    const defineOperators = {
        '+' : { precedence: 2, associativity: 'Left', fn: (a, b) => a + b},
        '-' : { precedence: 2, associativity: 'Left', fn: (a, b) => a - b},
        'x' : { precedence: 3, associativity: 'Left', fn: (a, b) => a * b},
        '÷' : { precedence: 3, associativity: 'Left', fn: (a, b) => a / b},
        '^' : { precedence: 4, associativity: 'Right', fn: (a, b) => Math.pow(a, b)},
    };

    function equationToTokens(screenContent) {
        const regexToken = /\s*([()+\-x÷^]|[0-9]*\.?[0-9]+)\s*/g;
        const tokens = [];
        let regexMatch;

        while((regexMatch = regexToken.exec(screenContent))) {
            tokens.push(regexMatch[1]);
        }

        return tokens;
    }

    function infixToPostfix(equationTokens) {
        const postFixEquation = [];
        const operatorStack = [];

        equationTokens.forEach(token => {
            if(!isNaN(token)) {
                postFixEquation.push(token);
            }
            else if (token in defineOperators) {

                const operatorOne = defineOperators[token];

                while(operatorStack.length) {

                    const operatorTwo = defineOperators[operatorStack[operatorStack.length - 1]];

                    if(!operatorTwo) { //no operator two, break while loop
                        break;
                    }

                    const shouldPop = 
                        (operatorOne.associativity === 'Left'   && operatorOne.precedence <= operatorTwo.precedence) ||
                        (operatorOne.associativity === 'Right'  && operatorOne.precedence < operatorTwo.precedence);

                    if(!shouldPop) {    //should pop false - break loop
                        break;
                    }

                    postFixEquation.push(operatorStack.pop());
                }

                operatorStack.push(token);

            } else if (token === '(') { //brackets not specified in operators, special conditions
                operatorStack.push(token);
            } else if (token === ')') {
                while(operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
                    postFixEquation.push(operatorStack.pop());
                }
                if(operatorStack.length && operatorStack[operatorStack.length - 1] === '(') { //if there is a bracket, pop it
                    operatorStack.pop();
                }
                else {
                    return('Error');
                }
            } else {
                return('Unknown token' + $[token]);
            }  
        });

        while(operatorStack.length) {
            const operator = operatorStack.pop();
            if(operator === '(' || operator === ')') 
                return('Error');
            postFixEquation.push(operator);
        }

        return postFixEquation;
    }

    function solveRPN(postFixEquation) {
        const stack = [];
        for (const token of postFixEquation) {
            if(!isNaN(token)) {
                stack.push(Number(token));
            } else {
                const op = defineOperators[token];
                if(!op) 
                    throw new Error(`Unknown operator: ${token}`);
                const b = stack.pop();
                const a = stack.pop();
                if(a === undefined || b === undefined)
                    return('Syntax error');
                stack.push(op.fn(a,b));
            }
        }
        if(stack.length !== 1)
            return('Syntax error');
        return stack[0];
    }
    
    

    function calculate(screenContent) {
        const equationTokens = equationToTokens(screenContent);
        const postFixEquation = infixToPostfix(equationTokens);
        if(postFixEquation !== 'Error') {
            return solveRPN(postFixEquation);
        
        }
        else {
            return 'Syntax error';
        }
        

    }






})
