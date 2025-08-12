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
        operators.push(button.textContent);
    })

    operatorButtons.forEach(button => {
        button.id = 'calc-button';
        button.addEventListener('click', function() {
            const currentContent = screen.textContent;

            if(button.textContent == '=') {
                screen.textContent = calculate(currentContent);
                clearScreen = true;
            }

            else if(button.textContent == 'AC') {
                screen.textContent = '0';
            }

            else {
                if(operators.includes(currentContent.charAt(currentContent.length - 1))) {   //Check if end char is number or operator
                    screen.textContent = currentContent.slice(0, -1) + button.textContent;

                }

                else {
                    screen.textContent = currentContent + button.textContent;

                }

                clearScreen = false;
            }

        })
    })



    function calculate(screenContent) {
        const inputContent = screenContent;
        const regex = /(\d+)\s*(x|÷)\s*(\d+)/g;//search for mult or divide
        let match;
        const equation = [];

        while ((match = regex.exec(inputContent)) !== null) {
            const numberBefore = parseFloat(match[1]);
            const operator = match[2];
            const numberAfter = parseFloat(match[3]);

            let result;

            switch(operator) {
                case('x'):
                    result = numberBefore * numberAfter;
                    break;
                case('÷'):
                    result = numberBefore / numberAfter;
                    break;
            }

            equation.push({
                match: match[0],
                result: result
            });
        }

        let outputString = inputContent;
        equation.forEach(item => {
            outputString = outputString.replace(item.match, item.result.toString());
        });

        console.log(outputString);
        return outputString;


    }





})
