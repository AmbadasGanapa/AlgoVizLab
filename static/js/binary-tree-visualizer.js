// Binary Tree Visualizer JavaScript

let treeData = { nodes: [], edges: [] };
let svg;

function initializeTreeVisualization() {
    svg = d3.select('#treeSvg');
    svg.selectAll('*').remove();
    renderTree();
}

async function insertNode() {
    const value = parseInt(document.getElementById('value').value);
    
    if (isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }
    
    updateStatus('status', 'running', 'Inserting...');
    
    try {
        const requestData = {
            value: value,
            session_id: currentSessionId
        };
        
        const result = await makeAPICall('/binary-tree/', requestData, 'POST');
        
        treeData = result.tree_state;
        await animateInsertion(result);
        
        updateTreeInfo();
        updateStatus('status', 'complete', 'Node Inserted');
        logOperation(`Inserted node with value ${value}`, 'success');
        
        // Clear input
        document.getElementById('value').value = '';
        
    } catch (error) {
        updateStatus('status', 'error', 'Error');
        logOperation(`Error: ${error.message}`, 'danger');
    }
}

async function animateInsertion(result) {
    // Highlight the new node
    renderTree();
    
    if (result.node_id) {
        const newNode = treeData.nodes.find(node => node.id === result.node_id);
        if (newNode) {
            highlightTreeNode(result.node_id, 'tree-node-new');
            await sleep(1000);
            resetTreeNodeHighlight(result.node_id);
        }
    }
}

function renderTree() {
    svg.selectAll('*').remove();
    
    if (treeData.nodes.length === 0) {
        svg.append('text')
            .attr('x', 200)
            .attr('y', 200)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('fill', '#6c757d')
            .text('Empty Tree - Insert some nodes!');
        return;
    }
    
    // Calculate positions for nodes
    const positions = calculateNodePositions();
    
    // Draw edges first
    treeData.edges.forEach(edge => {
        const fromNode = positions.find(p => p.id === edge.from);
        const toNode = positions.find(p => p.id === edge.to);
        
        if (fromNode && toNode) {
            svg.append('line')
                .attr('class', 'tree-edge')
                .attr('x1', fromNode.x)
                .attr('y1', fromNode.y)
                .attr('x2', toNode.x)
                .attr('y2', toNode.y);
        }
    });
    
    // Draw nodes
    positions.forEach(node => {
        const nodeGroup = svg.append('g')
            .attr('id', `tree-node-${node.id}`);
        
        nodeGroup.append('circle')
            .attr('cx', node.x)
            .attr('cy', node.y)
            .attr('r', 20)
            .attr('class', 'tree-node');
        
        nodeGroup.append('text')
            .attr('x', node.x)
            .attr('y', node.y)
            .attr('class', 'tree-node-text')
            .text(node.data);
    });
}

function calculateNodePositions() {
    if (treeData.nodes.length === 0) return [];
    
    const positions = [];
    const svgWidth = parseInt(svg.style('width')) || 800;
    const levelHeight = 80;
    const startY = 50;
    
    // Simple positioning algorithm - can be improved for better layout
    const levels = {};
    
    // Group nodes by level (simple approach)
    treeData.nodes.forEach((node, index) => {
        const level = Math.floor(Math.log2(index + 1));
        if (!levels[level]) levels[level] = [];
        levels[level].push(node);
    });
    
    // Position nodes
    Object.keys(levels).forEach(level => {
        const levelNodes = levels[level];
        const levelWidth = svgWidth / (levelNodes.length + 1);
        
        levelNodes.forEach((node, index) => {
            positions.push({
                id: node.id,
                data: node.data,
                x: levelWidth * (index + 1),
                y: startY + level * levelHeight
            });
        });
    });
    
    return positions;
}

function highlightTreeNode(nodeId, className) {
    const nodeGroup = svg.select(`#tree-node-${nodeId}`);
    nodeGroup.select('.tree-node').attr('class', `tree-node ${className}`);
}

function resetTreeNodeHighlight(nodeId) {
    const nodeGroup = svg.select(`#tree-node-${nodeId}`);
    nodeGroup.select('.tree-node').attr('class', 'tree-node');
}

function updateTreeInfo() {
    document.getElementById('nodeCount').textContent = treeData.nodes.length;
    
    // Calculate tree height (simple approximation)
    const height = treeData.nodes.length > 0 ? Math.floor(Math.log2(treeData.nodes.length)) + 1 : 0;
    document.getElementById('treeHeight').textContent = height;
}

async function traverseTree() {
    const traversalType = document.getElementById('traversalType').value;
    
    if (treeData.nodes.length === 0) {
        alert('Please insert some nodes first');
        return;
    }
    
    updateStatus('status', 'running', 'Traversing...');
    
    try {
        const requestData = {
            traversal_type: traversalType,
            session_id: currentSessionId
        };
        
        const result = await makeAPICall('/tree-traversal/', requestData, 'POST');
        
        logOperation(`${traversalType} traversal: [${result.result.join(', ')}]`, 'success');
        updateStatus('status', 'complete', 'Traversal Complete');
        
        // Animate traversal
        await animateTraversal(result.result);
        
    } catch (error) {
        updateStatus('status', 'error', 'Error');
        logOperation(`Error: ${error.message}`, 'danger');
    }
}

async function animateTraversal(sequence) {
    for (let i = 0; i < sequence.length; i++) {
        const value = sequence[i];
        const node = treeData.nodes.find(n => n.data == value);
        if (node) {
            highlightTreeNode(node.id, 'tree-node-traversal');
            await sleep(800);
            resetTreeNodeHighlight(node.id);
            await sleep(200);
        }
    }
}

function clearTree() {
    treeData = { nodes: [], edges: [] };
    renderTree();
    updateTreeInfo();
    updateStatus('status', 'ready', 'Ready');
    logOperation('Tree cleared', 'info');
    
    // Clear session on server
    if (currentSessionId) {
        makeAPICall(`/session/${currentSessionId}/clear/`, null, 'DELETE')
            .catch(error => console.error('Error clearing session:', error));
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTreeVisualization();
    updateTreeInfo();
});

function clearTree() {
    treeData = { nodes: [], edges: [] };
    renderTree();
    updateTreeInfo();
    updateStatus('status', 'ready', 'Ready');
    logOperation('Tree cleared', 'info');
    
    // Clear session on server
    if (currentSessionId) {
        makeAPICall(`/session/${currentSessionId}/clear/`, null, 'DELETE')
            .catch(error => console.error('Error clearing session:', error));
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTreeVisualization();
    updateTreeInfo();
});