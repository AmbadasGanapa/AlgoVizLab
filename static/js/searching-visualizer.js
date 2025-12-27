// Comprehensive Searching Visualizer JavaScript

let searchData = [];
let targetValue = 0;
let animationSteps = [];
let currentStep = 0;
let isPlaying = false;
let animationSpeed = 800;
let searchContainer;

function initializeSearching() {
    searchContainer = document.getElementById('searchContainer');
    updateComplexityInfo();
    
    // Speed control
    document.getElementById('speedControl').addEventListener('input', function() {
        animationSpeed = 2200 - parseInt(this.value);
    });
    
    // Algorithm change listener
    document.getElementById('algorithm').addEventListener('change', updateComplexityInfo);
}

async function startSearching() {
    const algorithm = document.getElementById('algorithm').value;
    const arrayInput = document.getElementById('arrayInput').value;
    const targetInput = document.getElementById('targetInput').value;
    
    if (!arrayInput.trim()) {
        alert('Please enter an array');
        return;
    }
    
    if (!targetInput.trim()) {
        alert('Please enter a target value');
        return;
    }
    
    try {
        searchData = arrayInput.split(',').map(x => parseInt(x.trim()));
        targetValue = parseInt(targetInput.trim());
        
        if (searchData.some(isNaN) || isNaN(targetValue)) {
            throw new Error('Invalid numbers');
        }
    } catch (error) {
        alert('Please enter valid numbers');
        return;
    }
    
    if (searchData.length > 20) {
        alert('Please use arrays with 20 or fewer elements');
        return;
    }
    
    // Sort array for algorithms that require sorted input
    const sortedAlgorithms = ['binary_search', 'ternary_search', 'interpolation_search', 
                             'exponential_search', 'fibonacci_search', 'meta_binary_search'];
    
    if (sortedAlgorithms.includes(algorithm)) {
        searchData.sort((a, b) => a - b);
        document.getElementById('arrayInput').value = searchData.join(',');
    }
    
    renderSearchArray(searchData);
    updateStepInfo('Generating search steps...');
    
    // Generate steps based on algorithm
    animationSteps = generateSearchSteps(algorithm, [...searchData], targetValue);
    currentStep = 0;
    
    updateStepCounter();
    updateStepInfo('Ready to start animation. Click Play to begin.');
}

function generateSearchSteps(algorithm, arr, target) {
    switch (algorithm) {
        case 'linear_search': return linearSearch(arr, target);
        case 'binary_search': return binarySearch(arr, target);
        case 'ternary_search': return ternarySearch(arr, target);
        case 'jump_search': return jumpSearch(arr, target);
        case 'interpolation_search': return interpolationSearch(arr, target);
        case 'exponential_search': return exponentialSearch(arr, target);
        case 'fibonacci_search': return fibonacciSearch(arr, target);
        case 'sentinel_search': return sentinelSearch(arr, target);
        case 'meta_binary_search': return metaBinarySearch(arr, target);
        case 'hash_search': return hashSearch(arr, target);
        case 'bfs_search': return bfsSearch(arr, target);
        case 'dfs_search': return dfsSearch(arr, target);
        default: return [];
    }
}

// Search Algorithm Implementations

function linearSearch(arr, target) {
    const steps = [];
    
    for (let i = 0; i < arr.length; i++) {
        steps.push({
            action: 'check',
            index: i,
            value: arr[i],
            target: target,
            array: [...arr],
            description: `Checking element at index ${i}: ${arr[i]}`
        });
        
        if (arr[i] === target) {
            steps.push({
                action: 'found',
                index: i,
                value: arr[i],
                array: [...arr],
                description: `Target ${target} found at index ${i}!`
            });
            return steps;
        }
    }
    
    steps.push({
        action: 'not_found',
        array: [...arr],
        description: `Target ${target} not found in the array`
    });
    
    return steps;
}

function binarySearch(arr, target) {
    const steps = [];
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        steps.push({
            action: 'set_bounds',
            left: left,
            right: right,
            mid: mid,
            array: [...arr],
            description: `Setting bounds: left=${left}, right=${right}, mid=${mid}`
        });
        
        steps.push({
            action: 'compare',
            index: mid,
            value: arr[mid],
            target: target,
            array: [...arr],
            description: `Comparing arr[${mid}]=${arr[mid]} with target ${target}`
        });
        
        if (arr[mid] === target) {
            steps.push({
                action: 'found',
                index: mid,
                value: arr[mid],
                array: [...arr],
                description: `Target ${target} found at index ${mid}!`
            });
            return steps;
        } else if (arr[mid] < target) {
            left = mid + 1;
            steps.push({
                action: 'search_right',
                new_left: left,
                array: [...arr],
                description: `${arr[mid]} < ${target}, searching right half`
            });
        } else {
            right = mid - 1;
            steps.push({
                action: 'search_left',
                new_right: right,
                array: [...arr],
                description: `${arr[mid]} > ${target}, searching left half`
            });
        }
    }
    
    steps.push({
        action: 'not_found',
        array: [...arr],
        description: `Target ${target} not found in the array`
    });
    
    return steps;
}

function ternarySearch(arr, target) {
    const steps = [];
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid1 = left + Math.floor((right - left) / 3);
        const mid2 = right - Math.floor((right - left) / 3);
        
        steps.push({
            action: 'set_bounds',
            left: left,
            right: right,
            mid1: mid1,
            mid2: mid2,
            array: [...arr],
            description: `Ternary bounds: left=${left}, mid1=${mid1}, mid2=${mid2}, right=${right}`
        });
        
        if (arr[mid1] === target) {
            steps.push({
                action: 'found',
                index: mid1,
                value: arr[mid1],
                array: [...arr],
                description: `Target ${target} found at index ${mid1}!`
            });
            return steps;
        }
        
        if (arr[mid2] === target) {
            steps.push({
                action: 'found',
                index: mid2,
                value: arr[mid2],
                array: [...arr],
                description: `Target ${target} found at index ${mid2}!`
            });
            return steps;
        }
        
        if (target < arr[mid1]) {
            right = mid1 - 1;
            steps.push({
                action: 'search_left',
                new_right: right,
                array: [...arr],
                description: `Target < ${arr[mid1]}, searching left third`
            });
        } else if (target > arr[mid2]) {
            left = mid2 + 1;
            steps.push({
                action: 'search_right',
                new_left: left,
                array: [...arr],
                description: `Target > ${arr[mid2]}, searching right third`
            });
        } else {
            left = mid1 + 1;
            right = mid2 - 1;
            steps.push({
                action: 'search_middle',
                new_left: left,
                new_right: right,
                array: [...arr],
                description: `Target in middle third, narrowing search`
            });
        }
    }
    
    steps.push({
        action: 'not_found',
        array: [...arr],
        description: `Target ${target} not found in the array`
    });
    
    return steps;
}

function jumpSearch(arr, target) {
    const steps = [];
    const n = arr.length;
    const jumpStep = Math.floor(Math.sqrt(n));
    let prev = 0;
    let curr = jumpStep;
    
    steps.push({
        action: 'set_step',
        step: jumpStep,
        array: [...arr],
        description: `Jump step size: ${jumpStep} (√${n})`
    });
    
    // Find the block where element is present
    while (curr < n && arr[curr] < target) {
        steps.push({
            action: 'jump',
            index: curr,
            value: arr[curr],
            array: [...arr],
            description: `Jumping: arr[${curr}]=${arr[curr]} < ${target}, continue jumping`
        });
        
        prev = curr;
        curr += jumpStep;
    }
    
    // If we've gone past the array, set curr to the last index
    if (curr >= n) {
        curr = n - 1;
    }
    
    steps.push({
        action: 'jump',
        index: curr,
        value: arr[curr],
        array: [...arr],
        description: `Jump stopped at arr[${curr}]=${arr[curr]} >= ${target}`
    });
    
    // Linear search in the identified block
    steps.push({
        action: 'linear_search_block',
        start: prev,
        end: curr,
        array: [...arr],
        description: `Linear search in block from index ${prev} to ${curr}`
    });
    
    // Linear search in the block
    for (let i = prev; i <= curr; i++) {
        steps.push({
            action: 'check',
            index: i,
            value: arr[i],
            array: [...arr],
            description: `Checking arr[${i}]=${arr[i]}`
        });
        
        if (arr[i] === target) {
            steps.push({
                action: 'found',
                index: i,
                value: arr[i],
                array: [...arr],
                description: `Target ${target} found at index ${i}!`
            });
            return steps;
        }
    }
    
    steps.push({
        action: 'not_found',
        array: [...arr],
        description: `Target ${target} not found in the array`
    });
    
    return steps;
}

function interpolationSearch(arr, target) {
    const steps = [];
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right && target >= arr[left] && target <= arr[right]) {
        if (left === right) {
            if (arr[left] === target) {
                steps.push({
                    action: 'found',
                    index: left,
                    value: arr[left],
                    array: [...arr],
                    description: `Target ${target} found at index ${left}!`
                });
            } else {
                steps.push({
                    action: 'not_found',
                    array: [...arr],
                    description: `Target ${target} not found in the array`
                });
            }
            return steps;
        }
        
        // Interpolation formula
        const pos = left + Math.floor(((target - arr[left]) * (right - left)) / (arr[right] - arr[left]));
        
        steps.push({
            action: 'interpolate',
            left: left,
            right: right,
            pos: pos,
            array: [...arr],
            description: `Interpolated position: ${pos} based on value distribution`
        });
        
        if (arr[pos] === target) {
            steps.push({
                action: 'found',
                index: pos,
                value: arr[pos],
                array: [...arr],
                description: `Target ${target} found at index ${pos}!`
            });
            return steps;
        }
        
        if (arr[pos] < target) {
            left = pos + 1;
            steps.push({
                action: 'search_right',
                new_left: left,
                array: [...arr],
                description: `${arr[pos]} < ${target}, searching right`
            });
        } else {
            right = pos - 1;
            steps.push({
                action: 'search_left',
                new_right: right,
                array: [...arr],
                description: `${arr[pos]} > ${target}, searching left`
            });
        }
    }
    
    steps.push({
        action: 'not_found',
        array: [...arr],
        description: `Target ${target} not found in the array`
    });
    
    return steps;
}

function exponentialSearch(arr, target) {
    const steps = [];
    
    if (arr[0] === target) {
        steps.push({
            action: 'found',
            index: 0,
            value: arr[0],
            array: [...arr],
            description: `Target ${target} found at index 0!`
        });
        return steps;
    }
    
    let bound = 1;
    while (bound < arr.length && arr[bound] <= target) {
        steps.push({
            action: 'expand_bound',
            bound: bound,
            value: arr[bound],
            array: [...arr],
            description: `Expanding bound: arr[${bound}]=${arr[bound]} <= ${target}`
        });
        bound *= 2;
    }
    
    // Binary search in the found range
    const left = Math.floor(bound / 2);
    const right = Math.min(bound, arr.length - 1);
    
    steps.push({
        action: 'binary_search_range',
        left: left,
        right: right,
        array: [...arr],
        description: `Binary search in range [${left}, ${right}]`
    });
    
    const binarySteps = binarySearchRange(arr, target, left, right);
    return steps.concat(binarySteps);
}

function binarySearchRange(arr, target, left, right) {
    const steps = [];
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        steps.push({
            action: 'compare',
            index: mid,
            value: arr[mid],
            target: target,
            array: [...arr],
            description: `Comparing arr[${mid}]=${arr[mid]} with target ${target}`
        });
        
        if (arr[mid] === target) {
            steps.push({
                action: 'found',
                index: mid,
                value: arr[mid],
                array: [...arr],
                description: `Target ${target} found at index ${mid}!`
            });
            return steps;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    steps.push({
        action: 'not_found',
        array: [...arr],
        description: `Target ${target} not found in the array`
    });
    
    return steps;
}

function fibonacciSearch(arr, target) {
    const steps = [];
    const n = arr.length;
    
    // Generate Fibonacci numbers
    let fib2 = 0; // (m-2)'th Fibonacci number
    let fib1 = 1; // (m-1)'th Fibonacci number
    let fib = fib2 + fib1; // m'th Fibonacci number
    
    while (fib < n) {
        fib2 = fib1;
        fib1 = fib;
        fib = fib2 + fib1;
    }
    
    steps.push({
        action: 'fibonacci_setup',
        fib: fib,
        array: [...arr],
        description: `Using Fibonacci number ${fib} for array of size ${n}`
    });
    
    let offset = -1;
    
    while (fib > 1) {
        const i = Math.min(offset + fib2, n - 1);
        
        steps.push({
            action: 'check',
            index: i,
            value: arr[i],
            array: [...arr],
            description: `Checking arr[${i}]=${arr[i]} using Fibonacci division`
        });
        
        if (arr[i] < target) {
            fib = fib1;
            fib1 = fib2;
            fib2 = fib - fib1;
            offset = i;
            steps.push({
                action: 'search_right',
                offset: offset,
                array: [...arr],
                description: `${arr[i]} < ${target}, eliminating left part`
            });
        } else if (arr[i] > target) {
            fib = fib2;
            fib1 = fib1 - fib2;
            fib2 = fib - fib1;
            steps.push({
                action: 'search_left',
                array: [...arr],
                description: `${arr[i]} > ${target}, eliminating right part`
            });
        } else {
            steps.push({
                action: 'found',
                index: i,
                value: arr[i],
                array: [...arr],
                description: `Target ${target} found at index ${i}!`
            });
            return steps;
        }
    }
    
    if (fib1 && offset + 1 < n && arr[offset + 1] === target) {
        steps.push({
            action: 'found',
            index: offset + 1,
            value: arr[offset + 1],
            array: [...arr],
            description: `Target ${target} found at index ${offset + 1}!`
        });
    } else {
        steps.push({
            action: 'not_found',
            array: [...arr],
            description: `Target ${target} not found in the array`
        });
    }
    
    return steps;
}

function sentinelSearch(arr, target) {
    const steps = [];
    const n = arr.length;
    const last = arr[n - 1];
    
    // Place sentinel
    arr[n - 1] = target;
    steps.push({
        action: 'place_sentinel',
        index: n - 1,
        value: target,
        array: [...arr],
        description: `Placed sentinel ${target} at end of array`
    });
    
    let i = 0;
    while (arr[i] !== target) {
        steps.push({
            action: 'check',
            index: i,
            value: arr[i],
            array: [...arr],
            description: `Checking arr[${i}]=${arr[i]}`
        });
        i++;
    }
    
    // Restore original value
    arr[n - 1] = last;
    
    if (i < n - 1 || arr[n - 1] === target) {
        steps.push({
            action: 'found',
            index: i,
            value: target,
            array: [...arr],
            description: `Target ${target} found at index ${i}!`
        });
    } else {
        steps.push({
            action: 'not_found',
            array: [...arr],
            description: `Target ${target} not found in the array`
        });
    }
    
    return steps;
}

function metaBinarySearch(arr, target) {
    const steps = [];
    const n = arr.length;
    let lg = Math.floor(Math.log2(n - 1)) + 1;
    let pos = 0;
    
    steps.push({
        action: 'meta_setup',
        lg: lg,
        array: [...arr],
        description: `Meta binary search with lg=${lg} for array size ${n}`
    });
    
    for (let i = lg - 1; i >= 0; i--) {
        if (arr[pos] === target) {
            steps.push({
                action: 'found',
                index: pos,
                value: arr[pos],
                array: [...arr],
                description: `Target ${target} found at index ${pos}!`
            });
            return steps;
        }
        
        const bit = 1 << i;
        const new_pos = pos | bit;
        
        if (new_pos < n) {
            steps.push({
                action: 'check_bit',
                pos: pos,
                new_pos: new_pos,
                bit: i,
                value: arr[new_pos],
                array: [...arr],
                description: `Checking bit ${i}: pos=${pos}, new_pos=${new_pos}, value=${arr[new_pos]}`
            });
            
            if (arr[new_pos] <= target) {
                pos = new_pos;
                steps.push({
                    action: 'set_bit',
                    pos: pos,
                    array: [...arr],
                    description: `Set bit ${i}: new position ${pos}`
                });
            }
        }
    }
    
    if (arr[pos] === target) {
        steps.push({
            action: 'found',
            index: pos,
            value: arr[pos],
            array: [...arr],
            description: `Target ${target} found at index ${pos}!`
        });
    } else {
        steps.push({
            action: 'not_found',
            array: [...arr],
            description: `Target ${target} not found in the array`
        });
    }
    
    return steps;
}

function hashSearch(arr, target) {
    const steps = [];
    const hashTable = new Map();
    
    // Build hash table
    for (let i = 0; i < arr.length; i++) {
        hashTable.set(arr[i], i);
        steps.push({
            action: 'hash_insert',
            key: arr[i],
            index: i,
            array: [...arr],
            description: `Inserted ${arr[i]} at hash index for value ${arr[i]}`
        });
    }
    
    // Search in hash table
    steps.push({
        action: 'hash_lookup',
        target: target,
        array: [...arr],
        description: `Looking up ${target} in hash table`
    });
    
    if (hashTable.has(target)) {
        const index = hashTable.get(target);
        steps.push({
            action: 'found',
            index: index,
            value: target,
            array: [...arr],
            description: `Target ${target} found at index ${index} using hash lookup!`
        });
    } else {
        steps.push({
            action: 'not_found',
            array: [...arr],
            description: `Target ${target} not found in hash table`
        });
    }
    
    return steps;
}

function bfsSearch(arr, target) {
    const steps = [];
    // Simulate BFS on array as if it's a binary tree
    const queue = [0]; // Start from root (index 0)
    const visited = new Set();
    
    steps.push({
        action: 'bfs_start',
        queue: [...queue],
        array: [...arr],
        description: 'Starting BFS traversal from root (index 0)'
    });
    
    while (queue.length > 0) {
        const index = queue.shift();
        
        if (visited.has(index) || index >= arr.length) {
            continue;
        }
        
        visited.add(index);
        
        steps.push({
            action: 'bfs_visit',
            index: index,
            value: arr[index],
            queue: [...queue],
            array: [...arr],
            description: `BFS visiting index ${index}, value: ${arr[index]}`
        });
        
        if (arr[index] === target) {
            steps.push({
                action: 'found',
                index: index,
                value: arr[index],
                array: [...arr],
                description: `Target ${target} found at index ${index} using BFS!`
            });
            return steps;
        }
        
        // Add children (left: 2*i+1, right: 2*i+2)
        const leftChild = 2 * index + 1;
        const rightChild = 2 * index + 2;
        
        if (leftChild < arr.length) {
            queue.push(leftChild);
        }
        if (rightChild < arr.length) {
            queue.push(rightChild);
        }
        
        steps.push({
            action: 'bfs_enqueue',
            queue: [...queue],
            array: [...arr],
            description: `Added children to queue: ${leftChild < arr.length ? leftChild : 'none'}, ${rightChild < arr.length ? rightChild : 'none'}`
        });
    }
    
    steps.push({
        action: 'not_found',
        array: [...arr],
        description: `Target ${target} not found using BFS`
    });
    
    return steps;
}

function dfsSearch(arr, target) {
    const steps = [];
    const visited = new Set();
    
    function dfsRecursive(index) {
        if (index >= arr.length || visited.has(index)) {
            return false;
        }
        
        visited.add(index);
        
        steps.push({
            action: 'dfs_visit',
            index: index,
            value: arr[index],
            array: [...arr],
            description: `DFS visiting index ${index}, value: ${arr[index]}`
        });
        
        if (arr[index] === target) {
            steps.push({
                action: 'found',
                index: index,
                value: arr[index],
                array: [...arr],
                description: `Target ${target} found at index ${index} using DFS!`
            });
            return true;
        }
        
        // Visit children (left: 2*i+1, right: 2*i+2)
        const leftChild = 2 * index + 1;
        const rightChild = 2 * index + 2;
        
        if (leftChild < arr.length && dfsRecursive(leftChild)) {
            return true;
        }
        if (rightChild < arr.length && dfsRecursive(rightChild)) {
            return true;
        }
        
        return false;
    }
    
    steps.push({
        action: 'dfs_start',
        array: [...arr],
        description: 'Starting DFS traversal from root (index 0)'
    });
    
    if (!dfsRecursive(0)) {
        steps.push({
            action: 'not_found',
            array: [...arr],
            description: `Target ${target} not found using DFS`
        });
    }
    
    return steps;
}

// Visualization Functions

function renderSearchArray(data) {
    searchContainer.innerHTML = '';
    
    const arrayDiv = document.createElement('div');
    arrayDiv.className = 'd-flex justify-content-center align-items-center flex-wrap';
    arrayDiv.style.minHeight = '200px';
    
    data.forEach((value, index) => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'search-element';
        elementDiv.id = `element-${index}`;
        elementDiv.innerHTML = `
            <div class="element-value">${value}</div>
            <div class="element-index">${index}</div>
        `;
        arrayDiv.appendChild(elementDiv);
    });
    
    searchContainer.appendChild(arrayDiv);
    
    // Add CSS for search elements
    const style = document.createElement('style');
    style.textContent = `
        .search-element {
            width: 60px;
            height: 60px;
            border: 2px solid #007bff;
            margin: 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: white;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        .element-value {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }
        .element-index {
            font-size: 10px;
            color: #666;
            margin-top: 2px;
        }
        .search-element.checking {
            background: #ffc107;
            border-color: #fd7e14;
            transform: scale(1.1);
        }
        .search-element.found {
            background: #28a745;
            border-color: #20c997;
            color: white;
            transform: scale(1.2);
        }
        .search-element.bounds-left {
            background: #17a2b8;
            border-color: #138496;
            color: white;
        }
        .search-element.bounds-right {
            background: #6f42c1;
            border-color: #5a32a3;
            color: white;
        }
        .search-element.bounds-mid {
            background: #fd7e14;
            border-color: #e55a00;
            color: white;
        }
    `;
    
    if (!document.getElementById('search-styles')) {
        style.id = 'search-styles';
        document.head.appendChild(style);
    }
}

function highlightElements(indices, className) {
    // Reset all elements
    document.querySelectorAll('.search-element').forEach(el => {
        el.className = 'search-element';
    });
    
    // Highlight specified elements
    if (indices && indices.length > 0) {
        indices.forEach(index => {
            const element = document.getElementById(`element-${index}`);
            if (element) {
                element.classList.add(className);
            }
        });
    }
}

function updateStepInfo(message) {
    document.getElementById('stepInfo').innerHTML = `<strong>Step ${currentStep + 1}:</strong> ${message}`;
}

function updateStepCounter() {
    document.getElementById('currentStep').textContent = `Step: ${currentStep}`;
    document.getElementById('totalSteps').textContent = `Total: ${animationSteps.length}`;
}

function updateComplexityInfo() {
    const algorithm = document.getElementById('algorithm').value;
    const complexityElement = document.getElementById('complexityInfo');
    
    const complexities = {
        'linear_search': { time: 'O(n)', space: 'O(1)', desc: 'Checks each element sequentially' },
        'binary_search': { time: 'O(log n)', space: 'O(1)', desc: 'Divides search space in half' },
        'ternary_search': { time: 'O(log₃ n)', space: 'O(1)', desc: 'Divides into three parts' },
        'jump_search': { time: 'O(√n)', space: 'O(1)', desc: 'Jumps by √n steps' },
        'interpolation_search': { time: 'O(log log n)', space: 'O(1)', desc: 'Uses value distribution' },
        'exponential_search': { time: 'O(log n)', space: 'O(1)', desc: 'Exponential bound + binary search' },
        'fibonacci_search': { time: 'O(log n)', space: 'O(1)', desc: 'Uses Fibonacci numbers' },
        'sentinel_search': { time: 'O(n)', space: 'O(1)', desc: 'Linear search with sentinel' },
        'meta_binary_search': { time: 'O(log n)', space: 'O(1)', desc: 'One-sided binary search' },
        'hash_search': { time: 'O(1) avg', space: 'O(n)', desc: 'Hash table lookup' },
        'bfs_search': { time: 'O(n)', space: 'O(n)', desc: 'Breadth-first traversal' },
        'dfs_search': { time: 'O(n)', space: 'O(h)', desc: 'Depth-first traversal' }
    };
    
    const info = complexities[algorithm];
    complexityElement.innerHTML = `
        <small>
            <strong>Time:</strong> <span class="complexity-time">${info.time}</span><br>
            <strong>Space:</strong> <span class="complexity-space">${info.space}</span><br>
            <em>${info.desc}</em>
        </small>
    `;
}

// Animation Controls

function playAnimation() {
    if (animationSteps.length === 0) {
        alert('Please start searching first');
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
    updateStepCounter();
    
    setTimeout(() => {
        if (isPlaying) {
            runAnimation();
        }
    }, animationSpeed);
}

function executeStep(step) {
    updateStepInfo(step.description);
    
    switch (step.action) {
        case 'check':
        case 'compare':
            highlightElements([step.index], 'checking');
            break;
        case 'found':
            highlightElements([step.index], 'found');
            break;
        case 'set_bounds':
            const indices = [];
            if (step.left !== undefined) indices.push(step.left);
            if (step.mid !== undefined) indices.push(step.mid);
            if (step.mid1 !== undefined) indices.push(step.mid1);
            if (step.mid2 !== undefined) indices.push(step.mid2);
            if (step.right !== undefined) indices.push(step.right);
            highlightElements(indices, 'bounds-mid');
            break;
        case 'jump':
        case 'interpolate':
            highlightElements([step.index || step.pos], 'checking');
            break;
        default:
            if (step.index !== undefined) {
                highlightElements([step.index], 'checking');
            }
    }
    
    setTimeout(() => {
        if (step.action !== 'found') {
            highlightElements([], '');
        }
    }, animationSpeed - 100);
}

function pauseAnimation() {
    isPlaying = false;
}

function stepForward() {
    if (currentStep < animationSteps.length) {
        executeStep(animationSteps[currentStep]);
        currentStep++;
        updateStepCounter();
    }
}

function resetAnimation() {
    isPlaying = false;
    currentStep = 0;
    updateStepCounter();
    if (searchData.length > 0) {
        renderSearchArray(searchData);
        updateStepInfo('Animation reset. Click Play to start.');
    }
}

function generateRandomArray() {
    const size = Math.floor(Math.random() * 10) + 5;
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 50) + 1);
    }
    array.sort((a, b) => a - b); // Keep sorted for binary search algorithms
    document.getElementById('arrayInput').value = array.join(',');
    
    // Set random target
    const randomTarget = array[Math.floor(Math.random() * array.length)];
    document.getElementById('targetInput').value = randomTarget;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSearching();
});