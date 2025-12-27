// Stack Visualizer JavaScript

let stackData = [];
let svg;

function initializeStackVisualization() {
    svg = d3.select('#stackSvg');
    svg.selectAll('*').remove();
    renderStack();
    updateStackInfo();
}

async function performOperation() {
    const operation = document.getElementById('operation').value;
    const value = document.getElementById('value').value;
    
    if (operation === 'push' && !value) {
        alert('Please enter a value to push');
        return;
    }
    
    updateStatus('status', 'running', 'Processing...');
    
    try {
        const requestData = {
            operation: operation,
            session_id: currentSessionId
        };
        
        if (operation === 'push') {
            requestData.value = value;
        }
        
        const result = await makeAPICall('/stack/', requestData, 'POST');
        
        if (result.error) {
            logOperation(`Error: ${result.error}`, 'danger');
            updateStatus('status', 'error', 'Error');
            return;
        }
        
        stackData = result.stack_state;
        await animateOperation(result);
        
        updateStackInfo();
        updateStatus('status', 'complete', 'Operation Complete');
        
        let message = '';
        switch (operation) {
            case 'push':
                message = `Pushed "${result.item}" onto stack`;
                break;
            case 'pop':
                message = `Popped "${result.item}" from stack`;
                break;
            case 'peek':
                message = `Top element: "${result.item}"`;
                break;
        }
        
        logOperation(message, 'success');
        
        // Clear input after push
        if (operation === 'push') {
            document.getElementById('value').value = '';
        }
        
    } catch (error) {
        updateStatus('status', 'error', 'Error');
        logOperation(`Error: ${error.message}`, 'danger');
    }
}

async function animateOperation(result) {
    if (result.action === 'push') {
        await animatePush(result);
    } else if (result.action === 'pop') {
        await animatePop(result);
    } else if (result.action === 'peek') {
        await animatePeek(result);
    }
    
    renderStack();
}

async function animatePush(result) {
    renderStack();
    
    // Highlight the new top element
    if (stackData.length > 0) {
        highlightStackElement(stackData.length - 1, 'stack-element-new');
        await sleep(800);
        resetStackElementHighlight(stackData.length - 1);
    }
}

async function animatePop(result) {
    // Highlight the element being popped
    if (stackData.length >= 0) {
        highlightStackElement(stackData.length, 'stack-element-delete');
        await sleep(800);
    }
    
    renderStack();
}

async function animatePeek(result) {
    renderStack();
    
    // Highlight the top element
    if (stackData.length > 0) {
        highlightStackElement(stackData.length - 1, 'stack-element-peek');
        await sleep(1000);
        resetStackElementHighlight(stackData.length - 1);
    }
}

function renderStack() {
    svg.selectAll('*').remove();
    
    if (stackData.length === 0) {
        svg.append('text')
            .attr('x', 200)
            .attr('y', 200)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('fill', '#6c757d')
            .text('Empty Stack - Push some elements!');
        return;
    }
    
    const elementWidth = 120;
    const elementHeight = 40;
    const startX = 200;
    const startY = 350;
    
    // Draw stack elements from bottom to top
    stackData.forEach((item, index) => {
        const y = startY - (index * (elementHeight + 5));
        
        const elementGroup = svg.append('g')
            .attr('id', `stack-element-${index}`);
        
        // Element rectangle
        elementGroup.append('rect')
            .attr('x', startX - elementWidth/2)
            .attr('y', y)
            .attr('width', elementWidth)
            .attr('height', elementHeight)
            .attr('class', 'stack-element')
            .attr('rx', 5);
        
        // Element text
        elementGroup.append('text')
            .attr('x', startX)
            .attr('y', y + elementHeight/2)
            .attr('class', 'stack-element-text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .style('fill', 'white')
            .style('font-weight', 'bold')
            .text(item);
        
        // Add index label
        elementGroup.append('text')
            .attr('x', startX - elementWidth/2 - 20)
            .attr('y', y + elementHeight/2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .style('font-size', '12px')
            .style('fill', '#6c757d')
            .text(index);
    });
    
    // Add "TOP" indicator
    if (stackData.length > 0) {
        const topY = startY - ((stackData.length - 1) * (elementHeight + 5));
        svg.append('text')
            .attr('x', startX + elementWidth/2 + 30)
            .attr('y', topY + elementHeight/2)
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'central')
            .style('font-size', '14px')
            .style('fill', '#dc3545')
            .style('font-weight', 'bold')
            .text('← TOP');
    }
}

function highlightStackElement(index, className) {
    const elementGroup = svg.select(`#stack-element-${index}`);
    elementGroup.select('.stack-element').attr('class', `stack-element ${className}`);
}

function resetStackElementHighlight(index) {
    const elementGroup = svg.select(`#stack-element-${index}`);
    elementGroup.select('.stack-element').attr('class', 'stack-element');
}

function updateStackInfo() {
    document.getElementById('stackSize').textContent = stackData.length;
    document.getElementById('stackTop').textContent = 
        stackData.length > 0 ? stackData[stackData.length - 1] : 'Empty';
}

function clearStack() {
    stackData = [];
    renderStack();
    updateStackInfo();
    updateStatus('status', 'ready', 'Ready');
    logOperation('Stack cleared', 'info');
    
    // Clear session on server
    if (currentSessionId) {
        makeAPICall(`/session/${currentSessionId}/clear/`, null, 'DELETE')
            .catch(error => console.error('Error clearing session:', error));
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Show/hide value input based on operation
document.getElementById('operation').addEventListener('change', function() {
    const operation = this.value;
    const valueGroup = document.getElementById('valueGroup');
    
    if (operation === 'push') {
        valueGroup.style.display = 'block';
    } else {
        valueGroup.style.display = 'none';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeStackVisualization();
});