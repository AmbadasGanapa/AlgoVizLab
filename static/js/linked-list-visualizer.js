// Linked List Visualizer JavaScript

let listData = [];
let svg;

function initializeVisualization() {
    svg = d3.select('#listSvg');
    svg.selectAll('*').remove();
    
    // Add arrow marker definition
    const defs = svg.append('defs');
    defs.append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#6c757d');
    
    defs.append('marker')
        .attr('id', 'arrowhead-back')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 2)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M10,-5L0,0L10,5')
        .attr('fill', '#6c757d');
    
    renderList();
}

async function performOperation() {
    const operation = document.getElementById('operation').value;
    const value = document.getElementById('value').value;
    
    if (!value) {
        alert('Please enter a value');
        return;
    }
    
    updateStatus('status', 'running', 'Processing...');
    
    try {
        const requestData = {
            operation: operation,
            value: value,
            list_type: document.getElementById('listType').value,
            session_id: currentSessionId
        };
        
        const result = await makeAPICall('/linked-list/', requestData, 'POST');
        
        listData = result.list_state;
        await animateOperation(result);
        
        updateStatus('status', 'complete', 'Operation Complete');
        
        let message = '';
        switch (operation) {
            case 'insert_beginning':
                message = `Inserted "${value}" at beginning`;
                break;
            case 'insert_end':
                message = `Inserted "${value}" at end`;
                break;
            case 'delete':
                message = result.found ? `Deleted "${value}"` : `Value "${value}" not found`;
                break;
        }
        
        logOperation(message, result.found !== false ? 'success' : 'warning');
        
    } catch (error) {
        updateStatus('status', 'error', 'Error');
        logOperation(`Error: ${error.message}`, 'danger');
    }
}

async function animateOperation(result) {
    if (result.action === 'insert_beginning' || result.action === 'insert_end') {
        await animateInsertion(result);
    } else if (result.action === 'delete') {
        await animateDeletion(result);
    }
    
    renderList();
}

async function animateInsertion(result) {
    // Highlight the new node temporarily
    renderList();
    
    const newNodeIndex = listData.findIndex(node => node.id === result.node_id);
    if (newNodeIndex !== -1) {
        highlightNode(newNodeIndex, 'node-new');
        await sleep(800);
        resetNodeHighlight(newNodeIndex);
    }
}

async function animateDeletion(result) {
    if (result.found) {
        const deletedNodeIndex = listData.findIndex(node => node.id === result.deleted_id);
        if (deletedNodeIndex !== -1) {
            highlightNode(deletedNodeIndex, 'node-delete');
            await sleep(800);
        }
    }
}

function renderList() {
    svg.selectAll('.node-group').remove();
    svg.selectAll('.link-arrow').remove();
    svg.selectAll('.null-text').remove();
    svg.selectAll('.empty-message').remove();
    
    if (listData.length === 0) {
        svg.append('text')
            .attr('x', 50)
            .attr('y', 125)
            .attr('class', 'empty-message text-muted')
            .style('font-size', '16px')
            .text('Empty List - Add some nodes!');
        return;
    }
    
    const nodeWidth = 60;
    const nodeHeight = 40;
    const nodeSpacing = 100;
    const startX = 50;
    const startY = 100;
    const listType = document.getElementById('listType').value;
    
    // Draw nodes
    listData.forEach((node, index) => {
        const x = startX + index * nodeSpacing;
        const y = startY;
        
        const nodeGroup = svg.append('g')
            .attr('class', 'node-group')
            .attr('id', `node-${index}`);
        
        // Node rectangle
        nodeGroup.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', nodeWidth)
            .attr('height', nodeHeight)
            .attr('class', 'node')
            .attr('rx', 5);
        
        // Node text
        nodeGroup.append('text')
            .attr('x', x + nodeWidth / 2)
            .attr('y', y + nodeHeight / 2)
            .attr('class', 'node-text')
            .text(node.data);
        
        // Draw forward connections
        if (index < listData.length - 1) {
            // Regular forward arrow
            const arrowY = listType === 'doubly' ? y + nodeHeight / 2 - 5 : y + nodeHeight / 2;
            svg.append('line')
                .attr('class', 'link-arrow')
                .attr('x1', x + nodeWidth)
                .attr('y1', arrowY)
                .attr('x2', x + nodeSpacing - 10)
                .attr('y2', arrowY)
                .attr('marker-end', 'url(#arrowhead)');
        }
        
        // Draw backward arrow for doubly linked list
        if (listType === 'doubly' && index > 0) {
            svg.append('line')
                .attr('class', 'link-arrow')
                .attr('x1', x)
                .attr('y1', y + nodeHeight / 2 + 5)
                .attr('x2', x - nodeSpacing + nodeWidth + 10)
                .attr('y2', y + nodeHeight / 2 + 5)
                .attr('marker-start', 'url(#arrowhead-back)');
        }
        
        // Draw circular connection for circular lists
        if (listType === 'circular' && index === listData.length - 1 && listData.length > 1) {
            // Curved arrow back to first node
            const path = `M ${x + nodeWidth} ${y + nodeHeight/2} 
                         Q ${x + nodeWidth + 30} ${y - 30} 
                         ${startX + nodeWidth/2} ${y - 20} 
                         Q ${startX - 30} ${y - 30} 
                         ${startX} ${y + nodeHeight/2}`;
            
            svg.append('path')
                .attr('d', path)
                .attr('class', 'link-arrow')
                .attr('fill', 'none')
                .attr('marker-end', 'url(#arrowhead)');
        }
    });
    
    // Add NULL indicator at the end (only for non-circular lists)
    if (listData.length > 0 && listType !== 'circular') {
        const lastX = startX + listData.length * nodeSpacing;
        const nullY = listType === 'doubly' ? startY + nodeHeight / 2 - 5 : startY + nodeHeight / 2;
        svg.append('text')
            .attr('class', 'null-text')
            .attr('x', lastX)
            .attr('y', nullY)
            .style('font-size', '14px')
            .style('fill', '#6c757d')
            .text('NULL');
            
        // Add NULL for prev pointer in doubly linked list
        if (listType === 'doubly') {
            svg.append('text')
                .attr('class', 'null-text')
                .attr('x', startX - 40)
                .attr('y', startY + nodeHeight / 2 + 5)
                .style('font-size', '14px')
                .style('fill', '#6c757d')
                .text('NULL');
        }
    }
}

function highlightNode(index, className) {
    const nodeGroup = svg.select(`#node-${index}`);
    nodeGroup.select('.node').attr('class', `node ${className}`);
}

function resetNodeHighlight(index) {
    const nodeGroup = svg.select(`#node-${index}`);
    nodeGroup.select('.node').attr('class', 'node');
}

function clearList() {
    listData = [];
    renderList();
    updateStatus('status', 'ready', 'Ready');
    logOperation('List cleared', 'info');
    
    // Clear session on server
    if (currentSessionId) {
        makeAPICall(`/session/${currentSessionId}/clear/`, null, 'DELETE')
            .catch(error => console.error('Error clearing session:', error));
    }
}

// Update list type change handler
document.getElementById('listType').addEventListener('change', function() {
    if (listData.length > 0) {
        renderList(); // Re-render with new list type visualization
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeVisualization();
});