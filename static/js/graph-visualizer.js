// Simple Graph Visualizer - Working Version

let graph = {};
let nodes = new Set();
let animationSteps = [];
let currentStep = 0;
let isPlaying = false;
let animationSpeed = 1000;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Graph visualizer loaded');
    renderGraph();
});

function addNode() {
    console.log('Add node clicked');
    const input = document.getElementById('newNode');
    if (!input) {
        console.error('Input not found');
        return;
    }
    
    const nodeName = input.value.trim().toUpperCase();
    console.log('Adding node:', nodeName);
    
    if (!nodeName) {
        alert('Please enter a node name');
        return;
    }
    
    if (nodes.has(nodeName)) {
        alert('Node already exists');
        return;
    }
    
    nodes.add(nodeName);
    graph[nodeName] = [];
    input.value = '';
    
    console.log('Nodes:', Array.from(nodes));
    renderGraph();
    showMessage(`Added node ${nodeName}`);
}

function addEdge() {
    console.log('Add edge clicked');
    const fromInput = document.getElementById('fromNode');
    const toInput = document.getElementById('toNode');
    const bidirectional = document.getElementById('bidirectional');
    
    if (!fromInput || !toInput) {
        console.error('Edge inputs not found');
        return;
    }
    
    const fromNode = fromInput.value.trim().toUpperCase();
    const toNode = toInput.value.trim().toUpperCase();
    const isBidirectional = bidirectional ? bidirectional.checked : true;
    
    if (!fromNode || !toNode) {
        alert('Please enter both nodes');
        return;
    }
    
    if (!nodes.has(fromNode) || !nodes.has(toNode)) {
        alert('Both nodes must exist. Add them first.');
        return;
    }
    
    if (!graph[fromNode].includes(toNode)) {
        graph[fromNode].push(toNode);
    }
    
    if (isBidirectional && !graph[toNode].includes(fromNode)) {
        graph[toNode].push(fromNode);
    }
    
    fromInput.value = '';
    toInput.value = '';
    
    console.log('Graph:', graph);
    renderGraph();
    showMessage(`Added edge ${fromNode} → ${toNode}${isBidirectional ? ' (bidirectional)' : ''}`);
}

function clearGraph() {
    console.log('Clear graph clicked');
    graph = {};
    nodes.clear();
    animationSteps = [];
    currentStep = 0;
    renderGraph();
    showMessage('Graph cleared');
}

function loadSampleGraph() {
    console.log('Load sample clicked');
    clearGraph();
    
    // Add nodes
    ['A', 'B', 'C', 'D', 'E'].forEach(node => {
        nodes.add(node);
        graph[node] = [];
    });
    
    // Add edges
    const edges = [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'E'], ['D', 'E']];
    edges.forEach(([from, to]) => {
        graph[from].push(to);
        graph[to].push(from);
    });
    
    const startInput = document.getElementById('startNode');
    if (startInput) startInput.value = 'A';
    
    console.log('Sample loaded:', graph);
    renderGraph();
    showMessage('Sample graph loaded');
}

function startTraversal() {
    console.log('Start traversal clicked');
    const algorithmSelect = document.getElementById('algorithm');
    const startInput = document.getElementById('startNode');
    
    if (!algorithmSelect || !startInput) {
        console.error('Algorithm or start node input not found');
        return;
    }
    
    const algorithm = algorithmSelect.value;
    const startNode = startInput.value.trim().toUpperCase();
    
    if (nodes.size === 0) {
        alert('Please add some nodes first');
        return;
    }
    
    if (!startNode || !nodes.has(startNode)) {
        alert('Please enter a valid start node');
        return;
    }
    
    console.log('Starting traversal:', algorithm, 'from', startNode);
    
    if (algorithm === 'bfs') {
        animationSteps = bfsTraversal(startNode);
    } else if (algorithm === 'dfs') {
        animationSteps = dfsTraversal(startNode);
    } else {
        animationSteps = dijkstraTraversal(startNode);
    }
    
    currentStep = 0;
    renderGraph();
    showMessage(`${algorithm.toUpperCase()} traversal ready. Click Play to start.`);
}

function bfsTraversal(startNode) {
    const steps = [];
    const visited = new Set();
    const queue = [startNode];
    
    steps.push({
        action: 'start',
        node: startNode,
        queue: [...queue],
        visited: [],
        description: `Start BFS from ${startNode}`
    });
    
    while (queue.length > 0) {
        const current = queue.shift();
        if (visited.has(current)) continue;
        
        visited.add(current);
        steps.push({
            action: 'visit',
            node: current,
            queue: [...queue],
            visited: Array.from(visited),
            description: `Visit node ${current}`
        });
        
        const neighbors = graph[current] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor) && !queue.includes(neighbor)) {
                queue.push(neighbor);
                steps.push({
                    action: 'add',
                    node: current,
                    neighbor: neighbor,
                    queue: [...queue],
                    visited: Array.from(visited),
                    description: `Add ${neighbor} to queue`
                });
            }
        }
    }
    
    return steps;
}

function dfsTraversal(startNode) {
    const steps = [];
    const visited = new Set();
    const stack = [startNode];
    
    steps.push({
        action: 'start',
        node: startNode,
        stack: [...stack],
        visited: [],
        description: `Start DFS from ${startNode}`
    });
    
    while (stack.length > 0) {
        const current = stack.pop();
        if (visited.has(current)) continue;
        
        visited.add(current);
        steps.push({
            action: 'visit',
            node: current,
            stack: [...stack],
            visited: Array.from(visited),
            description: `Visit node ${current}`
        });
        
        const neighbors = (graph[current] || []).slice().reverse();
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                stack.push(neighbor);
                steps.push({
                    action: 'add',
                    node: current,
                    neighbor: neighbor,
                    stack: [...stack],
                    visited: Array.from(visited),
                    description: `Add ${neighbor} to stack`
                });
            }
        }
    }
    
    return steps;
}

function dijkstraTraversal(startNode) {
    const steps = [];
    const distances = {};
    const visited = new Set();
    
    nodes.forEach(node => {
        distances[node] = node === startNode ? 0 : Infinity;
    });
    
    steps.push({
        action: 'start',
        node: startNode,
        distances: {...distances},
        visited: [],
        description: `Start Dijkstra from ${startNode}`
    });
    
    const unvisited = Array.from(nodes);
    
    while (unvisited.length > 0) {
        unvisited.sort((a, b) => distances[a] - distances[b]);
        const current = unvisited.shift();
        
        if (distances[current] === Infinity) break;
        
        visited.add(current);
        steps.push({
            action: 'visit',
            node: current,
            distances: {...distances},
            visited: Array.from(visited),
            description: `Visit ${current} (distance: ${distances[current]})`
        });
        
        const neighbors = graph[current] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                const newDist = distances[current] + 1;
                if (newDist < distances[neighbor]) {
                    distances[neighbor] = newDist;
                    steps.push({
                        action: 'update',
                        node: current,
                        neighbor: neighbor,
                        distance: newDist,
                        distances: {...distances},
                        visited: Array.from(visited),
                        description: `Update distance to ${neighbor}: ${newDist}`
                    });
                }
            }
        }
    }
    
    return steps;
}

function renderGraph() {
    const container = document.getElementById('graphContainer');
    if (!container) {
        console.error('Graph container not found');
        return;
    }
    
    container.innerHTML = '';
    
    if (nodes.size === 0) {
        container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">Add nodes and edges to create a graph</div>';
        return;
    }
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '500');
    svg.style.background = '#f8f9fa';
    svg.style.border = '1px solid #ddd';
    svg.style.borderRadius = '8px';
    
    // Calculate positions
    const nodeArray = Array.from(nodes);
    const centerX = 400;
    const centerY = 250;
    const radius = 120;
    
    const positions = {};
    if (nodeArray.length === 1) {
        positions[nodeArray[0]] = { x: centerX, y: centerY };
    } else {
        nodeArray.forEach((node, index) => {
            const angle = (2 * Math.PI * index) / nodeArray.length;
            positions[node] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        });
    }
    
    // Draw edges
    Object.keys(graph).forEach(from => {
        graph[from].forEach(to => {
            if (positions[from] && positions[to]) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', positions[from].x);
                line.setAttribute('y1', positions[from].y);
                line.setAttribute('x2', positions[to].x);
                line.setAttribute('y2', positions[to].y);
                line.setAttribute('stroke', '#6c757d');
                line.setAttribute('stroke-width', '2');
                svg.appendChild(line);
            }
        });
    });
    
    // Draw nodes
    nodeArray.forEach(node => {
        const pos = positions[node];
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', pos.x);
        circle.setAttribute('cy', pos.y);
        circle.setAttribute('r', '25');
        circle.setAttribute('fill', '#007bff');
        circle.setAttribute('stroke', '#0056b3');
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('id', `node-${node}`);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', pos.x);
        text.setAttribute('y', pos.y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-size', '14');
        text.textContent = node;
        
        svg.appendChild(circle);
        svg.appendChild(text);
    });
    
    container.appendChild(svg);
    console.log('Graph rendered with', nodes.size, 'nodes');
}

function showMessage(message) {
    const stepInfo = document.getElementById('stepInfo');
    if (stepInfo) {
        stepInfo.innerHTML = `<strong>${message}</strong>`;
    }
    console.log('Message:', message);
}

function playAnimation() {
    if (animationSteps.length === 0) {
        alert('Please start traversal first');
        return;
    }
    isPlaying = true;
    runAnimation();
}

function runAnimation() {
    if (!isPlaying || currentStep >= animationSteps.length) {
        isPlaying = false;
        return;
    }
    
    const step = animationSteps[currentStep];
    executeStep(step);
    currentStep++;
    
    setTimeout(() => {
        if (isPlaying) runAnimation();
    }, animationSpeed);
}

function executeStep(step) {
    showMessage(step.description);
    
    // Reset all nodes
    document.querySelectorAll('[id^="node-"]').forEach(node => {
        node.setAttribute('fill', '#007bff');
    });
    
    // Highlight current node
    if (step.node) {
        const node = document.getElementById(`node-${step.node}`);
        if (node) {
            if (step.action === 'visit') {
                node.setAttribute('fill', '#28a745');
            } else {
                node.setAttribute('fill', '#ffc107');
            }
        }
    }
    
    // Update data display
    const visitedElement = document.getElementById('visitedNodes');
    const structureElement = document.getElementById('dataStructure');
    
    if (visitedElement && step.visited) {
        visitedElement.textContent = step.visited.join(' → ');
    }
    
    if (structureElement) {
        if (step.queue) {
            structureElement.textContent = `Queue: [${step.queue.join(', ')}]`;
        } else if (step.stack) {
            structureElement.textContent = `Stack: [${step.stack.join(', ')}]`;
        } else if (step.distances) {
            const distStr = Object.entries(step.distances)
                .map(([node, dist]) => `${node}:${dist === Infinity ? '∞' : dist}`)
                .join(', ');
            structureElement.textContent = `Distances: {${distStr}}`;
        }
    }
}

function pauseAnimation() {
    isPlaying = false;
}

function stepForward() {
    if (currentStep < animationSteps.length) {
        executeStep(animationSteps[currentStep]);
        currentStep++;
    }
}

function resetAnimation() {
    isPlaying = false;
    currentStep = 0;
    renderGraph();
    showMessage('Animation reset');
    
    const visitedElement = document.getElementById('visitedNodes');
    const structureElement = document.getElementById('dataStructure');
    
    if (visitedElement) visitedElement.textContent = '-';
    if (structureElement) structureElement.textContent = '-';
}