document.addEventListener('DOMContentLoaded', () => {

    const wrapper = document.getElementById('numbers-wrapper');

    let clearScreen = false;

    for (let i=10; i>=0; i--) {
        const button = document.createElement("button");
        if(i == 0) {
            button.textContent = '.';
        }
        else {
            button.textContent = i-1;
        }
        button.id = 'numbers-button';
        wrapper.appendChild(button);
        button.addEventListener('click', function() {
            if(clearScreen == true) {
                document.getElementById('screen').textContent = '0';
                clearScreen = false;

            }
            
            const currentContent = document.getElementById('screen').textContent;
            if(currentContent == '0') {
                document.getElementById('screen').textContent = button.textContent;
            }
            else {
                document.getElementById('screen').textContent = currentContent + button.textContent;
            }
        }); 
    }

    const operatorButtons = document.querySelectorAll('.operator-button');

    operatorButtons.forEach(button => {
        if(button.textContent !== '=') {
            button.addEventListener('click', function() {
                const currentContent = document.getElementById('screen').textContent;
                document.getElementById('screen').textContent = currentContent + button.textContent;
                clearScreen = false;

            })
        }
        else {
            button.addEventListener('click', function() {
                const currentContent = document.getElementById('screen').textContent;
                document.getElementById('screen').textContent = calculate(currentContent);
                clearScreen = true;
            })
        }
    })



    function calculate(screenContent) {
        const inputContent = screenContent;
        const regex = /(\d+)\s*(x|÷)\s*(\d+)/g;//serach for divide
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
