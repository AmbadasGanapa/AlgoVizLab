// Array Visualizer JavaScript

let arrayData = [];
let arraySize = 10;

function initializeArray() {
    arraySize = parseInt(document.getElementById('arraySize').value) || 10;
    arrayData = new Array(arraySize).fill(null);
    renderArray();
    updateStatus('status', 'ready', 'Array Initialized');
    
    // Clear operation log and start fresh
    const logContainer = document.getElementById('operationLog');
    if (logContainer) {
        logContainer.innerHTML = '';
    }
    
    logOperation('Array initialized with size ' + arraySize, 'info');
}

function renderArray() {
    const container = document.getElementById('arrayContainer');
    container.innerHTML = '';
    
    const arrayWrapper = document.createElement('div');
    arrayWrapper.className = 'd-flex flex-wrap justify-content-center';
    
    arrayData.forEach((value, index) => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'array-element' + (value === null ? ' empty' : '');
        elementDiv.textContent = value === null ? 'null' : value;
        elementDiv.id = `array-element-${index}`;
        
        const indexDiv = document.createElement('div');
        indexDiv.className = 'array-index';
        indexDiv.textContent = index;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'text-center';
        wrapper.appendChild(elementDiv);
        wrapper.appendChild(indexDiv);
        
        arrayWrapper.appendChild(wrapper);
    });
    
    container.appendChild(arrayWrapper);
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

async function performOperation() {
    const operation = document.getElementById('operation').value;
    const index = parseInt(document.getElementById('index').value);
    const value = document.getElementById('value').value;
    
    // Validation
    if (arrayData.length === 0) {
        alert('Please initialize the array first');
        return;
    }
    
    updateStatus('status', 'running', 'Processing...');
    
    if (operation === 'insert') {
        if (isNaN(index) || index < 0 || index >= arraySize) {
            alert(`Please enter a valid index (0-${arraySize - 1})`);
            updateStatus('status', 'error', 'Invalid Input');
            return;
        }
        if (!value.trim()) {
            alert('Please enter a value');
            updateStatus('status', 'error', 'Invalid Input');
            return;
        }
        
        const oldValue = arrayData[index];
        arrayData[index] = value;
        renderArray();
        
        if (oldValue === null) {
            logOperation(`Inserted "${value}" at index ${index}`, 'success');
        } else {
            logOperation(`Updated index ${index} from "${oldValue}" to "${value}"`, 'success');
        }
        updateStatus('status', 'success', 'Item Inserted');
        
    } else if (operation === 'delete') {
        if (isNaN(index) || index < 0 || index >= arraySize) {
            alert(`Please enter a valid index (0-${arraySize - 1})`);
            updateStatus('status', 'error', 'Invalid Input');
            return;
        }
        
        const deletedValue = arrayData[index];
        if (deletedValue === null) {
            logOperation(`Index ${index} is already empty`, 'warning');
        } else {
            arrayData[index] = null;
            renderArray();
            logOperation(`Deleted "${deletedValue}" from index ${index}`, 'success');
        }
        updateStatus('status', 'success', 'Item Deleted');
        
    } else if (operation === 'search') {
        if (!value.trim()) {
            alert('Please enter a value to search');
            updateStatus('status', 'error', 'Invalid Input');
            return;
        }
        
        const searchAlgo = document.getElementById('searchAlgo').value;
        const result = await performSearch(value, searchAlgo);
        if (result.found) {
            logOperation(`Value "${value}" found at index ${result.index} using ${searchAlgo} search`, 'success');
        } else {
            logOperation(`Value "${value}" not found using ${searchAlgo} search`, 'warning');
        }
        updateStatus('status', 'success', 'Search Complete');
    }
}

async function performSearch(searchValue, algorithm = 'linear') {
    switch(algorithm) {
        case 'linear': return await linearSearch(searchValue);
        case 'binary': return await binarySearch(searchValue);
        case 'jump': return await jumpSearch(searchValue);
        case 'interpolation': return await interpolationSearch(searchValue);
        default: return await linearSearch(searchValue);
    }
}

async function linearSearch(searchValue) {
    let found = false;
    let foundIndex = -1;
    
    for (let i = 0; i < arrayData.length; i++) {
        highlightElement(i, 'comparing');
        await sleep(300);
        
        if (arrayData[i] && arrayData[i].toString() === searchValue.toString()) {
            highlightElement(i, 'found');
            found = true;
            foundIndex = i;
            await sleep(1000);
            break;
        }
        
        resetElementHighlight(i);
        await sleep(100);
    }
    
    setTimeout(() => {
        for (let i = 0; i < arrayData.length; i++) {
            resetElementHighlight(i);
        }
    }, 1500);
    
    return { found, index: foundIndex };
}

async function binarySearch(searchValue) {
    // First sort the array for binary search
    const sortedIndices = arrayData.map((val, idx) => ({ val, idx }))
        .filter(item => item.val !== null)
        .sort((a, b) => parseInt(a.val) - parseInt(b.val));
    
    if (sortedIndices.length === 0) {
        return { found: false, index: -1 };
    }
    
    let left = 0;
    let right = sortedIndices.length - 1;
    let found = false;
    let foundIndex = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midIndex = sortedIndices[mid].idx;
        const midValue = sortedIndices[mid].val;
        
        highlightElement(midIndex, 'comparing');
        await sleep(500);
        
        if (midValue.toString() === searchValue.toString()) {
            highlightElement(midIndex, 'found');
            found = true;
            foundIndex = midIndex;
            await sleep(1000);
            break;
        } else if (parseInt(midValue) < parseInt(searchValue)) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
        
        resetElementHighlight(midIndex);
        await sleep(200);
    }
    
    setTimeout(() => {
        for (let i = 0; i < arrayData.length; i++) {
            resetElementHighlight(i);
        }
    }, 1500);
    
    return { found, index: foundIndex };
}

async function jumpSearch(searchValue) {
    const n = arrayData.filter(val => val !== null).length;
    const step = Math.floor(Math.sqrt(n));
    let prev = 0;
    
    // Find the block where element is present
    while (prev < arrayData.length && arrayData[prev] !== null && parseInt(arrayData[prev]) < parseInt(searchValue)) {
        highlightElement(prev, 'comparing');
        await sleep(400);
        resetElementHighlight(prev);
        prev += step;
        if (prev >= arrayData.length) break;
    }
    
    // Linear search in the identified block
    const start = Math.max(0, prev - step);
    const end = Math.min(prev, arrayData.length);
    
    for (let i = start; i < end; i++) {
        if (arrayData[i] === null) continue;
        
        highlightElement(i, 'comparing');
        await sleep(300);
        
        if (arrayData[i].toString() === searchValue.toString()) {
            highlightElement(i, 'found');
            await sleep(1000);
            
            setTimeout(() => {
                for (let j = 0; j < arrayData.length; j++) {
                    resetElementHighlight(j);
                }
            }, 1500);
            
            return { found: true, index: i };
        }
        
        resetElementHighlight(i);
        await sleep(100);
    }
    
    setTimeout(() => {
        for (let i = 0; i < arrayData.length; i++) {
            resetElementHighlight(i);
        }
    }, 1500);
    
    return { found: false, index: -1 };
}

async function interpolationSearch(searchValue) {
    // Get sorted non-null values with their indices
    const sortedData = arrayData.map((val, idx) => ({ val: val === null ? null : parseInt(val), idx }))
        .filter(item => item.val !== null)
        .sort((a, b) => a.val - b.val);
    
    if (sortedData.length === 0) {
        return { found: false, index: -1 };
    }
    
    let low = 0;
    let high = sortedData.length - 1;
    const target = parseInt(searchValue);
    
    while (low <= high && target >= sortedData[low].val && target <= sortedData[high].val) {
        if (low === high) {
            const idx = sortedData[low].idx;
            highlightElement(idx, 'comparing');
            await sleep(500);
            
            if (sortedData[low].val === target) {
                highlightElement(idx, 'found');
                await sleep(1000);
                
                setTimeout(() => {
                    for (let i = 0; i < arrayData.length; i++) {
                        resetElementHighlight(i);
                    }
                }, 1500);
                
                return { found: true, index: idx };
            }
            break;
        }
        
        // Calculate position using interpolation formula
        const pos = low + Math.floor(((target - sortedData[low].val) / (sortedData[high].val - sortedData[low].val)) * (high - low));
        const actualIndex = sortedData[pos].idx;
        
        highlightElement(actualIndex, 'comparing');
        await sleep(500);
        
        if (sortedData[pos].val === target) {
            highlightElement(actualIndex, 'found');
            await sleep(1000);
            
            setTimeout(() => {
                for (let i = 0; i < arrayData.length; i++) {
                    resetElementHighlight(i);
                }
            }, 1500);
            
            return { found: true, index: actualIndex };
        }
        
        if (sortedData[pos].val < target) {
            low = pos + 1;
        } else {
            high = pos - 1;
        }
        
        resetElementHighlight(actualIndex);
        await sleep(200);
    }
    
    setTimeout(() => {
        for (let i = 0; i < arrayData.length; i++) {
            resetElementHighlight(i);
        }
    }, 1500);
    
    return { found: false, index: -1 };
}

function highlightElement(index, type) {
    const element = document.getElementById(`array-element-${index}`);
    if (element) {
        element.classList.remove('highlight', 'found', 'comparing');
        element.classList.add(type);
    }
}

function resetElementHighlight(index) {
    const element = document.getElementById(`array-element-${index}`);
    if (element) {
        element.classList.remove('highlight', 'found', 'comparing');
    }
}

function clearArray() {
    arrayData = [];
    document.getElementById('arrayContainer').innerHTML = '<div class="text-muted">Click "Initialize" to create an array</div>';
    updateStatus('status', 'ready', 'Ready');
    logOperation('Array cleared', 'info');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Utility functions
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



// Update max index when array size changes
document.getElementById('arraySize').addEventListener('input', function() {
    const size = parseInt(this.value) || 10;
    document.getElementById('index').max = size - 1;
});

// Show/hide fields based on operation
function updateFieldVisibility() {
    const operation = document.getElementById('operation').value;
    const indexField = document.getElementById('indexField');
    const valueField = document.getElementById('valueField');
    const searchAlgoField = document.getElementById('searchAlgoField');
    
    if (operation === 'insert') {
        indexField.style.display = 'block';
        valueField.style.display = 'block';
        searchAlgoField.style.display = 'none';
    } else if (operation === 'delete') {
        indexField.style.display = 'block';
        valueField.style.display = 'none';
        searchAlgoField.style.display = 'none';
        document.getElementById('value').value = '';
    } else if (operation === 'search') {
        indexField.style.display = 'none';
        valueField.style.display = 'block';
        searchAlgoField.style.display = 'block';
        document.getElementById('index').value = '';
    }
    updateComplexityDisplay();
}

function updateComplexityDisplay() {
    const operation = document.getElementById('operation').value;
    const searchAlgo = document.getElementById('searchAlgo').value;
    const complexityText = document.getElementById('complexityText');
    
    if (operation === 'search') {
        let searchComplexity = '';
        switch(searchAlgo) {
            case 'linear': searchComplexity = 'O(n)'; break;
            case 'binary': searchComplexity = 'O(log n)'; break;
            case 'jump': searchComplexity = 'O(√n)'; break;
            case 'interpolation': searchComplexity = 'O(log log n)'; break;
        }
        complexityText.innerHTML = `
            <strong>Insert:</strong> O(1)<br>
            <strong>Delete:</strong> O(1)<br>
            <strong>${searchAlgo.charAt(0).toUpperCase() + searchAlgo.slice(1)} Search:</strong> ${searchComplexity}
        `;
    } else {
        complexityText.innerHTML = `
            <strong>Insert:</strong> O(1)<br>
            <strong>Delete:</strong> O(1)<br>
            <strong>Linear Search:</strong> O(n)
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeArray();
    updateFieldVisibility();
    
    // Add event listeners
    document.getElementById('operation').addEventListener('change', updateFieldVisibility);
    document.getElementById('searchAlgo').addEventListener('change', updateComplexityDisplay);
});