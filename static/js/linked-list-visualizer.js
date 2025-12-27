// Linked List Visualizer JavaScript

let listData = [];

function updateStatus(elementId, status, message) {
    const statusElement = document.getElementById(elementId);
    if (statusElement) {
        statusElement.textContent = message;
        const colorMap = {
            'ready': 'secondary',
            'running': 'warning', 
            'success': 'success',
            'error': 'danger'
        };
        statusElement.className = `badge bg-${colorMap[status] || 'secondary'}`;
    }
}

function logOperation(message, type = 'info') {
    const logContainer = document.getElementById('operationLog');
    if (logContainer) {
        // Clear placeholder text if it exists
        if (logContainer.innerHTML.includes('text-muted')) {
            logContainer.innerHTML = '';
        }
        
        const logEntry = document.createElement('div');
        logEntry.className = `alert alert-${type} alert-sm mb-1`;
        logEntry.innerHTML = `<small>${new Date().toLocaleTimeString()}: ${message}</small>`;
        
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
}

function performOperation() {
    const operation = document.getElementById('operation').value;
    const value = document.getElementById('value').value;
    
    if (!value) {
        alert('Please enter a value');
        return;
    }
    
    updateStatus('status', 'running', 'Processing...');
    
    if (operation === 'insert_beginning') {
        const newNode = { id: Date.now(), data: value };
        listData.unshift(newNode);
        renderList();
        logOperation(`Inserted "${value}" at beginning`, 'success');
        updateStatus('status', 'success', 'Item Inserted');
        
    } else if (operation === 'insert_end') {
        const newNode = { id: Date.now(), data: value };
        listData.push(newNode);
        renderList();
        logOperation(`Inserted "${value}" at end`, 'success');
        updateStatus('status', 'success', 'Item Inserted');
        
    } else if (operation === 'delete') {
        const index = listData.findIndex(node => node.data === value);
        if (index !== -1) {
            listData.splice(index, 1);
            renderList();
            logOperation(`Deleted "${value}"`, 'success');
            updateStatus('status', 'success', 'Item Deleted');
        } else {
            logOperation(`Value "${value}" not found`, 'warning');
            updateStatus('status', 'success', 'Operation Complete');
        }
    }
}

function renderList() {
    const container = document.getElementById('listContainer');
    container.innerHTML = '';
    
    if (listData.length === 0) {
        container.innerHTML = '<div class="text-muted text-center" style="padding: 50px;">Empty List - Add some nodes!</div>';
        return;
    }
    
    const listWrapper = document.createElement('div');
    listWrapper.className = 'd-flex align-items-center justify-content-center flex-wrap';
    listWrapper.style.padding = '20px';
    
    listData.forEach((node, index) => {
        // Node element
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'list-node';
        nodeDiv.style.cssText = `
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 10px 15px;
            margin: 5px;
            background: white;
            min-width: 60px;
            text-align: center;
            font-weight: bold;
        `;
        nodeDiv.textContent = node.data;
        
        listWrapper.appendChild(nodeDiv);
        
        // Arrow element (except for last node)
        if (index < listData.length - 1) {
            const arrowDiv = document.createElement('div');
            arrowDiv.innerHTML = '→';
            arrowDiv.style.cssText = `
                font-size: 20px;
                margin: 0 10px;
                color: #6c757d;
            `;
            listWrapper.appendChild(arrowDiv);
        }
    });
    
    // NULL indicator
    const nullDiv = document.createElement('div');
    nullDiv.innerHTML = '→ NULL';
    nullDiv.style.cssText = `
        font-size: 16px;
        margin: 0 10px;
        color: #6c757d;
    `;
    listWrapper.appendChild(nullDiv);
    
    container.appendChild(listWrapper);
}

function clearList() {
    listData = [];
    renderList();
    updateStatus('status', 'ready', 'Ready');
    
    const logContainer = document.getElementById('operationLog');
    if (logContainer) {
        logContainer.innerHTML = '';
    }
    
    logOperation('List cleared', 'info');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderList();
});