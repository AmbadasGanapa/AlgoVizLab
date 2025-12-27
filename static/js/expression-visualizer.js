// Expression Evaluator JavaScript

let animationController;
let currentExpression = '';
let currentMode = 'evaluate';

class ExpressionAnimationController extends AnimationController {
    executeStep(step) {
        updateStepInfo(step);
        
        if (currentMode === 'evaluate') {
            switch (step.action) {
                case 'read_token':
                    highlightCurrentToken(step.token);
                    break;
                case 'push_operand':
                    updateStackDisplay(step.stack);
                    break;
                case 'calculate':
                    showCalculation(step);
                    updateStackDisplay(step.stack);
                    break;
                case 'complete':
                    showFinalResult(step.final_result);
                    break;
            }
        } else {
            switch (step.action) {
                case 'read_token':
                    highlightCurrentToken(step.token);
                    updateStackDisplay(step.stack || []);
                    updateOutputDisplay(step.output || []);
                    break;
                case 'add_operand':
                case 'push_operator':
                case 'pop_operator':
                case 'push_operand':
                    updateStackDisplay(step.stack || []);
                    updateOutputDisplay(step.output || []);
                    break;
                case 'combine':
                    showCombination(step);
                    updateStackDisplay(step.stack || []);
                    break;
                case 'complete':
                    showConversionResult(step.result);
                    break;
            }
        }
    }
    
    resetVisualization() {
        resetDisplay();
    }
}

function initializeExpressionVisualization() {
    animationController = new ExpressionAnimationController();
    
    // Set up speed control
    document.getElementById('speedControl').addEventListener('input', function() {
        animationController.setSpeed(2300 - parseInt(this.value));
    });
}

async function evaluateExpression() {
    const expression = document.getElementById('expression').value.trim();
    
    if (!expression) {
        alert('Please enter a postfix expression');
        return;
    }
    
    currentExpression = expression;
    resetDisplay();
    updateStatus('status', 'running', 'Evaluating...');
    
    try {
        const requestData = {
            expression: expression
        };
        
        const result = await makeAPICall('/expression/', requestData, 'POST');
        
        animationController.loadSteps(result.steps);
        logOperation(`Expression "${expression}" loaded for evaluation`, 'info');
        
        updateStatus('status', 'ready', 'Ready to Animate');
        
    } catch (error) {
        updateStatus('status', 'error', 'Error');
        logOperation(`Error: ${error.message}`, 'danger');
    }
}

function highlightCurrentToken(token) {
    document.getElementById('currentToken').textContent = `Current Token: ${token}`;
}

function updateStackDisplay(stack) {
    const stackDisplay = document.getElementById('stackDisplay');
    stackDisplay.innerHTML = '';
    
    if (stack.length === 0) {
        stackDisplay.innerHTML = '<span class="badge bg-secondary">Empty</span>';
        return;
    }
    
    stack.forEach((item, index) => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary me-1';
        badge.textContent = item;
        badge.style.fontSize = '14px';
        stackDisplay.appendChild(badge);
    });
}

function showCalculation(step) {
    const calculation = `${step.operand1} ${step.operator} ${step.operand2} = ${step.result}`;
    document.getElementById('currentToken').innerHTML = `
        <div class="calculation">
            <span class="text-info">${calculation}</span>
        </div>
    `;
}

function showFinalResult(result) {
    document.getElementById('finalResult').textContent = result;
    document.getElementById('finalResult').className = 'badge bg-success fs-6';
}

function updateStepInfo(step) {
    const stepInfoElement = document.getElementById('stepInfo');
    let message = '';
    
    switch (step.action) {
        case 'read_token':
            message = `Reading token: <strong>${step.token}</strong>`;
            break;
        case 'push_operand':
            message = `Pushed operand <strong>${step.token}</strong> onto stack`;
            break;
        case 'calculate':
            message = `Calculated: <strong>${step.operand1} ${step.operator} ${step.operand2} = ${step.result}</strong>`;
            break;
        case 'complete':
            if (currentMode === 'evaluate') {
                message = `<strong class="text-success">Evaluation complete! Result: ${step.final_result}</strong>`;
            } else {
                message = `<strong class="text-success">Conversion complete! Result: ${step.result}</strong>`;
            }
            break;
        case 'add_operand':
            message = `Added operand <strong>${step.token}</strong> to output`;
            break;
        case 'push_operator':
            message = `Pushed operator <strong>${step.operator}</strong> to stack`;
            break;
        case 'pop_operator':
            message = `Popped operator <strong>${step.operator}</strong> to output`;
            break;
        case 'combine':
            message = `Combined: <strong>${step.operand1} ${step.operator} ${step.operand2} → ${step.result}</strong>`;
            break;
        default:
            message = `Step ${step.step}: ${step.action}`;
    }
    
    stepInfoElement.innerHTML = message;
}

function resetDisplay() {
    document.getElementById('currentToken').textContent = '-';
    document.getElementById('stackDisplay').innerHTML = '<span class="badge bg-secondary">Empty</span>';
    document.getElementById('outputDisplay').innerHTML = '<span class="badge bg-info">Empty</span>';
    document.getElementById('finalResult').textContent = '-';
    document.getElementById('finalResult').className = 'badge bg-success';
}

async function convertExpression() {
    const conversionType = document.getElementById('conversionType').value;
    const inputExpression = document.getElementById('inputExpression').value.trim();
    
    if (!inputExpression) {
        alert('Please enter an expression to convert');
        return;
    }
    
    currentMode = 'convert';
    resetDisplay();
    updateStatus('status', 'running', 'Converting...');
    
    try {
        const requestData = {
            expression: inputExpression,
            conversion_type: conversionType
        };
        
        const result = await makeAPICall('/expression-conversion/', requestData, 'POST');
        
        animationController.loadSteps(result.steps);
        logOperation(`Converting "${inputExpression}" using ${conversionType.replace('_', ' ')}`, 'info');
        
        updateStatus('status', 'ready', 'Ready to Animate');
        
    } catch (error) {
        updateStatus('status', 'error', 'Error');
        logOperation(`Error: ${error.message}`, 'danger');
    }
}

function toggleMode() {
    const mode = document.getElementById('mode').value;
    currentMode = mode;
    
    if (mode === 'evaluate') {
        document.getElementById('evaluateMode').style.display = 'block';
        document.getElementById('convertMode').style.display = 'none';
        document.getElementById('stackSection').style.display = 'block';
        document.getElementById('outputSection').style.display = 'none';
        document.getElementById('infoText').innerHTML = `
            <strong>Operators:</strong> +, -, *, /<br>
            <strong>Format:</strong> Postfix (RPN)<br>
            <strong>Example:</strong> 5 3 + = 8
        `;
    } else {
        document.getElementById('evaluateMode').style.display = 'none';
        document.getElementById('convertMode').style.display = 'block';
        document.getElementById('stackSection').style.display = 'block';
        document.getElementById('outputSection').style.display = 'block';
        document.getElementById('infoText').innerHTML = `
            <strong>Conversions:</strong> All types supported<br>
            <strong>Operators:</strong> +, -, *, /, ^, ( )<br>
            <strong>Example:</strong> A + B * C
        `;
    }
    
    resetDisplay();
}

function updateOutputDisplay(output) {
    const outputDisplay = document.getElementById('outputDisplay');
    outputDisplay.innerHTML = '';
    
    if (output.length === 0) {
        outputDisplay.innerHTML = '<span class="badge bg-info">Empty</span>';
        return;
    }
    
    output.forEach((item, index) => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-info me-1';
        badge.textContent = item;
        badge.style.fontSize = '14px';
        outputDisplay.appendChild(badge);
    });
}

function showCombination(step) {
    const combination = `Combine: ${step.operand1} ${step.operator} ${step.operand2} → ${step.result}`;
    document.getElementById('currentToken').innerHTML = `
        <div class="combination">
            <span class="text-success">${combination}</span>
        </div>
    `;
}

function showConversionResult(result) {
    document.getElementById('finalResult').textContent = result;
    document.getElementById('finalResult').className = 'badge bg-success fs-6';
    document.getElementById('currentToken').innerHTML = `
        <div class="text-success">
            <strong>Conversion Complete!</strong><br>
            <span class="fs-5">${result}</span>
        </div>
    `;
}

function loadSample() {
    if (currentMode === 'evaluate') {
        const samples = [
            '5 3 + 2 *',
            '15 7 1 1 + - / 3 * 2 1 1 + + -',
            '5 1 2 + 4 * + 3 -',
            '2 3 1 * + 9 -'
        ];
        
        const randomSample = samples[Math.floor(Math.random() * samples.length)];
        document.getElementById('expression').value = randomSample;
        
        logOperation(`Sample expression loaded: ${randomSample}`, 'info');
    } else {
        const samples = {
            'infix_to_postfix': ['A + B * C', '(A + B) * C', 'A + B * C - D'],
            'infix_to_prefix': ['A + B * C', '(A + B) * C', 'A * B + C'],
            'postfix_to_infix': ['A B + C *', 'A B C + *', 'A B + C D + *'],
            'prefix_to_infix': ['+ A * B C', '* + A B C', '+ * A B C']
        };
        
        const conversionType = document.getElementById('conversionType').value;
        const sampleType = conversionType.includes('postfix_to') ? 'postfix_to_infix' : 
                          conversionType.includes('prefix_to') ? 'prefix_to_infix' : 
                          conversionType.includes('to_postfix') ? 'infix_to_postfix' : 'infix_to_prefix';
        
        const sampleList = samples[sampleType] || samples['infix_to_postfix'];
        const randomSample = sampleList[Math.floor(Math.random() * sampleList.length)];
        
        document.getElementById('inputExpression').value = randomSample;
        logOperation(`Sample expression loaded: ${randomSample}`, 'info');
    }
}

// Animation control functions
function playAnimation() {
    animationController.play();
}

function pauseAnimation() {
    animationController.pause();
}

function stepForward() {
    animationController.stepForward();
}

function resetAnimation() {
    animationController.reset();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeExpressionVisualization();
});