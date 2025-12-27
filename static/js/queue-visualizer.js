// Queue Visualizer JavaScript

let queueData = [];
let svg;

function initializeQueueVisualization() {
    svg = d3.select('#queueSvg');
    svg.selectAll('*').remove();
    renderQueue();
    updateQueueInfo();
}

async function performOperation() {
    const operation = document.getElementById('operation').value;
    const value = document.getElementById('value').value;
    
    if (operation === 'enqueue' && !value) {
        alert('Please enter a value to enqueue');
        return;
    }
    
    updateStatus('status', 'running', 'Processing...');
    
    try {
        const requestData = {
            operation: operation,
            session_id: currentSessionId
        };
        
        if (operation === 'enqueue') {
            requestData.value = value;
        }
        
        const result = await makeAPICall('/queue/', requestData, 'POST');
        
        if (result.error) {
            logOperation(`Error: ${result.error}`, 'danger');
            updateStatus('status', 'error', 'Error');
            return;
        }
        
        queueData = result.queue_state;
        await animateOperation(result);
        
        updateQueueInfo();
        updateStatus('status', 'complete', 'Operation Complete');
        
        let message = '';
        switch (operation) {
            case 'enqueue':
                message = `Enqueued "${result.item}" to queue`;
                break;
            case 'dequeue':
                message = `Dequeued "${result.item}" from queue`;
                break;
            case 'front':
                message = `Front element: "${result.item}"`;
                break;
        }
        
        logOperation(message, 'success');
        
        // Clear input after enqueue
        if (operation === 'enqueue') {
            document.getElementById('value').value = '';
        }
        
    } catch (error) {
        updateStatus('status', 'error', 'Error');
        logOperation(`Error: ${error.message}`, 'danger');
    }
}

async function animateOperation(result) {
    if (result.action === 'enqueue') {
        await animateEnqueue(result);
    } else if (result.action === 'dequeue') {
        await animateDequeue(result);
    } else if (result.action === 'front') {
        await animateFront(result);
    }
    
    renderQueue();
}

async function animateEnqueue(result) {
    renderQueue();
    
    // Highlight the new rear element
    if (queueData.length > 0) {
        highlightQueueElement(queueData.length - 1, 'queue-element-new');
        await sleep(800);
        resetQueueElementHighlight(queueData.length - 1);
    }
}

async function animateDequeue(result) {
    // Highlight the element being dequeued
    if (queueData.length >= 0) {
        highlightQueueElement(0, 'queue-element-delete');
        await sleep(800);
    }
    
    renderQueue();
}

async function animateFront(result) {
    renderQueue();
    
    // Highlight the front element
    if (queueData.length > 0) {
        highlightQueueElement(0, 'queue-element-peek');
        await sleep(1000);
        resetQueueElementHighlight(0);
    }
}

function renderQueue() {
    svg.selectAll('*').remove();
    
    if (queueData.length === 0) {
        svg.append('text')
            .attr('x', 300)
            .attr('y', 125)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('fill', '#6c757d')
            .text('Empty Queue - Enqueue some elements!');
        return;
    }
    
    const elementWidth = 80;
    const elementHeight = 50;
    const startX = 50;
    const startY = 100;
    
    // Draw queue elements from front to rear (left to right)
    queueData.forEach((item, index) => {
        const x = startX + (index * (elementWidth + 10));
        
        const elementGroup = svg.append('g')
            .attr('id', `queue-element-${index}`);
        
        // Element rectangle
        elementGroup.append('rect')
            .attr('x', x)
            .attr('y', startY)
            .attr('width', elementWidth)
            .attr('height', elementHeight)
            .attr('class', 'queue-element')
            .attr('rx', 5);
        
        // Element text
        elementGroup.append('text')
            .attr('x', x + elementWidth/2)
            .attr('y', startY + elementHeight/2)
            .attr('class', 'queue-element-text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .style('fill', 'white')
            .style('font-weight', 'bold')
            .text(item);
        
        // Add index label
        elementGroup.append('text')
            .attr('x', x + elementWidth/2)
            .attr('y', startY - 10)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#6c757d')
            .text(index);
        
        // Draw arrows between elements
        if (index < queueData.length - 1) {
            svg.append('line')
                .attr('x1', x + elementWidth + 2)
                .attr('y1', startY + elementHeight/2)
                .attr('x2', x + elementWidth + 8)
                .attr('y2', startY + elementHeight/2)
                .attr('stroke', '#6c757d')
                .attr('stroke-width', 2)
                .attr('marker-end', 'url(#arrow)');
        }
    });
    
    // Add arrow marker definition
    const defs = svg.append('defs');
    defs.append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#6c757d');
    
    // Add "FRONT" and "REAR" indicators
    if (queueData.length > 0) {
        // Front indicator
        svg.append('text')
            .attr('x', startX + elementWidth/2)
            .attr('y', startY + elementHeight + 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('fill', '#28a745')
            .style('font-weight', 'bold')
            .text('FRONT');
        
        // Rear indicator
        const rearX = startX + ((queueData.length - 1) * (elementWidth + 10)) + elementWidth/2;
        svg.append('text')
            .attr('x', rearX)
            .attr('y', startY + elementHeight + 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('fill', '#dc3545')
            .style('font-weight', 'bold')
            .text('REAR');
    }
}

function highlightQueueElement(index, className) {
    const elementGroup = svg.select(`#queue-element-${index}`);
    elementGroup.select('.queue-element').attr('class', `queue-element ${className}`);
}

function resetQueueElementHighlight(index) {
    const elementGroup = svg.select(`#queue-element-${index}`);
    elementGroup.select('.queue-element').attr('class', 'queue-element');
}

function updateQueueInfo() {
    document.getElementById('queueSize').textContent = queueData.length;
    document.getElementById('queueFront').textContent = 
        queueData.length > 0 ? queueData[0] : 'Empty';
}

function clearQueue() {
    queueData = [];
    renderQueue();
    updateQueueInfo();
    updateStatus('status', 'ready', 'Ready');
    logOperation('Queue cleared', 'info');
    
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
    
    if (operation === 'enqueue') {
        valueGroup.style.display = 'block';
    } else {
        valueGroup.style.display = 'none';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeQueueVisualization();
});