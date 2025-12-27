// Comprehensive Sorting Visualizer JavaScript

let sortingData = [];
let animationSteps = [];
let currentStep = 0;
let isPlaying = false;
let animationSpeed = 500;
let svg;

function initializeSorting() {
    svg = d3.select('#sortingSvg');
    updateComplexityInfo();
    
    // Speed control
    document.getElementById('speedControl').addEventListener('input', function() {
        animationSpeed = 2100 - parseInt(this.value);
    });
    
    // Algorithm change listener
    document.getElementById('algorithm').addEventListener('change', updateComplexityInfo);
}

async function startSorting() {
    const algorithm = document.getElementById('algorithm').value;
    const arrayInput = document.getElementById('arrayInput').value;
    
    if (!arrayInput.trim()) {
        alert('Please enter an array');
        return;
    }
    
    try {
        sortingData = arrayInput.split(',').map(x => parseInt(x.trim()));
        if (sortingData.some(isNaN)) {
            throw new Error('Invalid numbers in array');
        }
    } catch (error) {
        alert('Please enter valid comma-separated numbers');
        return;
    }
    
    if (sortingData.length > 20) {
        alert('Please use arrays with 20 or fewer elements');
        return;
    }
    
    renderBars(sortingData);
    updateStepInfo('Generating sorting steps...');
    
    // Generate steps based on algorithm
    animationSteps = generateSortingSteps(algorithm, [...sortingData]);
    currentStep = 0;
    
    updateStepCounter();
    updateStepInfo('Ready to start animation. Click Play to begin.');
}

function generateSortingSteps(algorithm, arr) {
    switch (algorithm) {
        case 'bubble_sort': return bubbleSort(arr);
        case 'selection_sort': return selectionSort(arr);
        case 'insertion_sort': return insertionSort(arr);
        case 'merge_sort': return mergeSort(arr);
        case 'quick_sort': return quickSort(arr);
        case 'heap_sort': return heapSort(arr);
        case 'counting_sort': return countingSort(arr);
        case 'radix_sort': return radixSort(arr);
        case 'bucket_sort': return bucketSort(arr);
        case 'shell_sort': return shellSort(arr);
        case 'comb_sort': return combSort(arr);
        case 'pigeonhole_sort': return pigeonholeSort(arr);
        case 'cycle_sort': return cycleSort(arr);
        default: return [];
    }
}

// Sorting Algorithm Implementations

function bubbleSort(arr) {
    const steps = [];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            steps.push({
                action: 'compare',
                indices: [j, j + 1],
                values: [arr[j], arr[j + 1]],
                array: [...arr],
                description: `Comparing ${arr[j]} and ${arr[j + 1]}`
            });
            
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                steps.push({
                    action: 'swap',
                    indices: [j, j + 1],
                    values: [arr[j], arr[j + 1]],
                    array: [...arr],
                    description: `Swapped ${arr[j + 1]} and ${arr[j]}`
                });
            }
        }
    }
    
    steps.push({
        action: 'complete',
        array: [...arr],
        description: 'Bubble Sort completed!'
    });
    
    return steps;
}

function selectionSort(arr) {
    const steps = [];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        
        steps.push({
            action: 'select_min',
            index: i,
            array: [...arr],
            description: `Finding minimum element from position ${i}`
        });
        
        for (let j = i + 1; j < n; j++) {
            steps.push({
                action: 'compare',
                indices: [minIdx, j],
                values: [arr[minIdx], arr[j]],
                array: [...arr],
                description: `Comparing ${arr[minIdx]} with ${arr[j]}`
            });
            
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                steps.push({
                    action: 'new_min',
                    index: minIdx,
                    value: arr[minIdx],
                    array: [...arr],
                    description: `New minimum found: ${arr[minIdx]}`
                });
            }
        }
        
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            steps.push({
                action: 'swap',
                indices: [i, minIdx],
                values: [arr[i], arr[minIdx]],
                array: [...arr],
                description: `Placed ${arr[i]} in position ${i}`
            });
        }
    }
    
    steps.push({
        action: 'complete',
        array: [...arr],
        description: 'Selection Sort completed!'
    });
    
    return steps;
}

function insertionSort(arr) {
    const steps = [];
    
    for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;
        
        steps.push({
            action: 'select_key',
            index: i,
            value: key,
            array: [...arr],
            description: `Inserting ${key} into sorted portion`
        });
        
        while (j >= 0 && arr[j] > key) {
            steps.push({
                action: 'compare',
                indices: [j, j + 1],
                values: [arr[j], key],
                array: [...arr],
                description: `${arr[j]} > ${key}, shifting right`
            });
            
            arr[j + 1] = arr[j];
            steps.push({
                action: 'shift',
                from: j,
                to: j + 1,
                value: arr[j + 1],
                array: [...arr],
                description: `Shifted ${arr[j + 1]} to position ${j + 1}`
            });
            j--;
        }
        
        arr[j + 1] = key;
        steps.push({
            action: 'insert',
            index: j + 1,
            value: key,
            array: [...arr],
            description: `Inserted ${key} at position ${j + 1}`
        });
    }
    
    steps.push({
        action: 'complete',
        array: [...arr],
        description: 'Insertion Sort completed!'
    });
    
    return steps;
}

function quickSort(arr, low = 0, high = arr.length - 1, steps = []) {
    if (low < high) {
        const pi = partition(arr, low, high, steps);
        quickSort(arr, low, pi - 1, steps);
        quickSort(arr, pi + 1, high, steps);
    }
    
    if (steps.length > 0 && steps[steps.length - 1].action !== 'complete') {
        steps.push({
            action: 'complete',
            array: [...arr],
            description: 'Quick Sort completed!'
        });
    }
    
    return steps;
}

function partition(arr, low, high, steps) {
    const pivot = arr[high];
    steps.push({
        action: 'select_pivot',
        index: high,
        value: pivot,
        array: [...arr],
        description: `Selected pivot: ${pivot}`
    });
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        steps.push({
            action: 'compare',
            indices: [j, high],
            values: [arr[j], pivot],
            array: [...arr],
            description: `Comparing ${arr[j]} with pivot ${pivot}`
        });
        
        if (arr[j] <= pivot) {
            i++;
            if (i !== j) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                steps.push({
                    action: 'swap',
                    indices: [i, j],
                    values: [arr[i], arr[j]],
                    array: [...arr],
                    description: `Swapped ${arr[i]} and ${arr[j]}`
                });
            }
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
        action: 'place_pivot',
        indices: [i + 1, high],
        array: [...arr],
        description: `Placed pivot ${pivot} at position ${i + 1}`
    });
    
    return i + 1;
}

function mergeSort(arr, left = 0, right = arr.length - 1, steps = []) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        steps.push({
            action: 'divide',
            left: left,
            mid: mid,
            right: right,
            array: [...arr],
            description: `Dividing array from ${left} to ${right}`
        });
        
        mergeSort(arr, left, mid, steps);
        mergeSort(arr, mid + 1, right, steps);
        merge(arr, left, mid, right, steps);
    }
    
    if (steps.length > 0 && steps[steps.length - 1].action !== 'complete') {
        steps.push({
            action: 'complete',
            array: [...arr],
            description: 'Merge Sort completed!'
        });
    }
    
    return steps;
}

function merge(arr, left, mid, right, steps) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
        steps.push({
            action: 'compare',
            indices: [k],
            values: [leftArr[i], rightArr[j]],
            array: [...arr],
            description: `Merging: comparing ${leftArr[i]} and ${rightArr[j]}`
        });
        
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        
        steps.push({
            action: 'merge',
            index: k,
            value: arr[k],
            array: [...arr],
            description: `Placed ${arr[k]} at position ${k}`
        });
        k++;
    }
    
    while (i < leftArr.length) {
        arr[k] = leftArr[i];
        steps.push({
            action: 'merge',
            index: k,
            value: arr[k],
            array: [...arr],
            description: `Placed remaining ${arr[k]} at position ${k}`
        });
        i++;
        k++;
    }
    
    while (j < rightArr.length) {
        arr[k] = rightArr[j];
        steps.push({
            action: 'merge',
            index: k,
            value: arr[k],
            array: [...arr],
            description: `Placed remaining ${arr[k]} at position ${k}`
        });
        j++;
        k++;
    }
}

function heapSort(arr) {
    const steps = [];
    const n = arr.length;
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i, steps);
    }
    
    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        steps.push({
            action: 'swap',
            indices: [0, i],
            array: [...arr],
            description: `Moved ${arr[i]} to sorted position`
        });
        
        heapify(arr, i, 0, steps);
    }
    
    steps.push({
        action: 'complete',
        array: [...arr],
        description: 'Heap Sort completed!'
    });
    
    return steps;
}

function heapify(arr, n, i, steps) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        steps.push({
            action: 'heapify',
            indices: [i, largest],
            array: [...arr],
            description: `Heapifying: swapped ${arr[largest]} and ${arr[i]}`
        });
        
        heapify(arr, n, largest, steps);
    }
}

// Additional sorting algorithms with simplified implementations
function countingSort(arr) {
    const steps = [];
    const max = Math.max(...arr);
    const count = new Array(max + 1).fill(0);
    
    // Count occurrences
    for (let i = 0; i < arr.length; i++) {
        count[arr[i]]++;
        steps.push({
            action: 'count',
            value: arr[i],
            array: [...arr],
            description: `Counting occurrence of ${arr[i]}`
        });
    }
    
    // Reconstruct array
    let index = 0;
    for (let i = 0; i <= max; i++) {
        while (count[i] > 0) {
            arr[index] = i;
            steps.push({
                action: 'place',
                index: index,
                value: i,
                array: [...arr],
                description: `Placed ${i} at position ${index}`
            });
            index++;
            count[i]--;
        }
    }
    
    steps.push({
        action: 'complete',
        array: [...arr],
        description: 'Counting Sort completed!'
    });
    
    return steps;
}

function shellSort(arr) {
    const steps = [];
    const n = arr.length;
    
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        steps.push({
            action: 'set_gap',
            gap: gap,
            array: [...arr],
            description: `Using gap of ${gap}`
        });
        
        for (let i = gap; i < n; i++) {
            const temp = arr[i];
            let j = i;
            
            while (j >= gap && arr[j - gap] > temp) {
                steps.push({
                    action: 'compare',
                    indices: [j - gap, j],
                    array: [...arr],
                    description: `Comparing elements ${gap} positions apart`
                });
                
                arr[j] = arr[j - gap];
                steps.push({
                    action: 'shift',
                    from: j - gap,
                    to: j,
                    array: [...arr],
                    description: `Shifted element by gap ${gap}`
                });
                j -= gap;
            }
            
            arr[j] = temp;
            steps.push({
                action: 'insert',
                index: j,
                value: temp,
                array: [...arr],
                description: `Inserted ${temp} at position ${j}`
            });
        }
    }
    
    steps.push({
        action: 'complete',
        array: [...arr],
        description: 'Shell Sort completed!'
    });
    
    return steps;
}

// Simplified implementations for remaining algorithms
function radixSort(arr) {
    const steps = [];
    const max = Math.max(...arr);
    
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        steps.push({
            action: 'digit_sort',
            digit: exp,
            array: [...arr],
            description: `Sorting by digit at position ${exp}`
        });
        countingSortByDigit(arr, exp, steps);
    }
    
    steps.push({
        action: 'complete',
        array: [...arr],
        description: 'Radix Sort completed!'
    });
    
    return steps;
}

function countingSortByDigit(arr, exp, steps) {
    const output = new Array(arr.length);
    const count = new Array(10).fill(0);
    
    for (let i = 0; i < arr.length; i++) {
        count[Math.floor(arr[i] / exp) % 10]++;
    }
    
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
        count[Math.floor(arr[i] / exp) % 10]--;
    }
    
    for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
    }
}

function bucketSort(arr) {
    const steps = [];
    const n = arr.length;
    const buckets = Array.from({ length: n }, () => []);
    
    // Distribute elements into buckets
    for (let i = 0; i < n; i++) {
        const bucketIndex = Math.floor(arr[i] / 10);
        buckets[Math.min(bucketIndex, n - 1)].push(arr[i]);
        steps.push({
            action: 'distribute',
            value: arr[i],
            bucket: bucketIndex,
            array: [...arr],
            description: `Placed ${arr[i]} in bucket ${bucketIndex}`
        });
    }
    
    // Sort individual buckets and concatenate
    let index = 0;
    for (let i = 0; i < n; i++) {
        if (buckets[i].length > 0) {
            buckets[i].sort((a, b) => a - b);
            for (let j = 0; j < buckets[i].length; j++) {
                arr[index] = buckets[i][j];
                steps.push({
                    action: 'collect',
                    index: index,
                    value: arr[index],
                    array: [...arr],
                    description: `Collected ${arr[index]} from bucket ${i}`
                });
                index++;
            }
        }
    }
    
    steps.push({
        action: 'complete',
        array: [...arr],
        description: 'Bucket Sort completed!'
    });
    
    return steps;
}

function combSort(arr) {
    const steps = [];
    let gap = arr.length;
    let swapped = true;
    
    while (gap !== 1 || swapped) {
        gap = Math.max(1, Math.floor(gap / 1.3));
        swapped = false;
        
        steps.push({
            action: 'set_gap',
            gap: gap,
            array: [...arr],
            description: `Using gap of ${gap}`
        });
        
        for (let i = 0; i < arr.length - gap; i++) {
            steps.push({
                action: 'compare',
                indices: [i, i + gap],
                array: [...arr],
                description: `Comparing elements ${gap} positions apart`
            });
            
            if (arr[i] > arr[i + gap]) {
                [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
                swapped = true;
                steps.push({
                    action: 'swap',
                    indices: [i, i + gap],
                    array: [...arr],
                    description: `Swapped elements at distance ${gap}`
                });
            }
        }
    }
    
    steps.push({
        action: 'complete',
        array: [...arr],
        description: 'Comb Sort completed!'
    });
    
    return steps;
}

function pigeonholeSort(arr) {
    const steps = [];
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min + 1;
    const holes = new Array(range).fill(0);
    
    // Count occurrences
    for (let i = 0; i < arr.length; i++) {
        holes[arr[i] - min]++;
        steps.push({
            action: 'count',
            value: arr[i],
            array: [...arr],
            description: `Counting ${arr[i]} in pigeonhole ${arr[i] - min}`
        });
    }
    
    // Reconstruct array
    let index = 0;
    for (let i = 0; i < range; i++) {
        while (holes[i] > 0) {
            arr[index] = i + min;
            steps.push({
                action: 'place',
                index: index,
                value: arr[index],
                array: [...arr],
                description: `Placed ${arr[index]} from pigeonhole ${i}`
            });
            index++;
            holes[i]--;
        }
    }
    
    steps.push({
        action: 'complete',
        array: [...arr],
        description: 'Pigeonhole Sort completed!'
    });
    
    return steps;
}

function cycleSort(arr) {
    const steps = [];
    let writes = 0;
    
    for (let cycleStart = 0; cycleStart < arr.length - 1; cycleStart++) {
        let item = arr[cycleStart];
        let pos = cycleStart;
        
        // Find position where we put the item
        for (let i = cycleStart + 1; i < arr.length; i++) {
            if (arr[i] < item) {
                pos++;
            }
        }
        
        if (pos === cycleStart) {
            continue;
        }
        
        // Skip duplicates
        while (item === arr[pos]) {
            pos++;
        }
        
        if (pos !== cycleStart) {
            [item, arr[pos]] = [arr[pos], item];
            writes++;
            steps.push({
                action: 'cycle_write',
                indices: [cycleStart, pos],
                array: [...arr],
                description: `Cycle write: placed ${arr[pos]} at position ${pos}`
            });
        }
        
        // Rotate rest of the cycle
        while (pos !== cycleStart) {
            pos = cycleStart;
            
            for (let i = cycleStart + 1; i < arr.length; i++) {
                if (arr[i] < item) {
                    pos++;
                }
            }
            
            while (item === arr[pos]) {
                pos++;
            }
            
            if (item !== arr[pos]) {
                [item, arr[pos]] = [arr[pos], item];
                writes++;
                steps.push({
                    action: 'cycle_write',
                    indices: [cycleStart, pos],
                    array: [...arr],
                    description: `Cycle write: placed ${arr[pos]} at position ${pos}`
                });
            }
        }
    }
    
    steps.push({
        action: 'complete',
        array: [...arr],
        description: `Cycle Sort completed with ${writes} writes!`
    });
    
    return steps;
}

// Visualization Functions

function renderBars(data) {
    svg.selectAll('*').remove();
    
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = parseInt(svg.style('width')) - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    const maxValue = Math.max(...data);
    
    const xScale = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([0, width])
        .padding(0.1);
    
    const yScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([height, 0]);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Draw bars
    g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('id', (d, i) => `bar-${i}`)
        .attr('x', (d, i) => xScale(i))
        .attr('y', d => yScale(d))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d));
    
    // Add value labels
    g.selectAll('.bar-label')
        .data(data)
        .enter().append('text')
        .attr('class', 'bar-label')
        .attr('id', (d, i) => `label-${i}`)
        .attr('x', (d, i) => xScale(i) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#333')
        .text(d => d);
}

function updateBars(newData) {
    const maxValue = Math.max(...newData);
    const height = 300 - 60;
    
    const yScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([height, 0]);
    
    svg.selectAll('.bar')
        .data(newData)
        .transition()
        .duration(200)
        .attr('y', d => yScale(d) + 20)
        .attr('height', d => height - yScale(d));
    
    svg.selectAll('.bar-label')
        .data(newData)
        .transition()
        .duration(200)
        .attr('y', d => yScale(d) + 15)
        .text(d => d);
}

function highlightBars(indices, className) {
    svg.selectAll('.bar').attr('class', 'bar');
    if (indices && indices.length > 0) {
        indices.forEach(index => {
            svg.select(`#bar-${index}`).attr('class', `bar ${className}`);
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
        'bubble_sort': { time: 'O(n²)', space: 'O(1)', desc: 'Compares adjacent elements' },
        'selection_sort': { time: 'O(n²)', space: 'O(1)', desc: 'Finds minimum element' },
        'insertion_sort': { time: 'O(n²)', space: 'O(1)', desc: 'Inserts into sorted portion' },
        'merge_sort': { time: 'O(n log n)', space: 'O(n)', desc: 'Divide and conquer' },
        'quick_sort': { time: 'O(n log n)', space: 'O(log n)', desc: 'Pivot-based partitioning' },
        'heap_sort': { time: 'O(n log n)', space: 'O(1)', desc: 'Uses heap data structure' },
        'counting_sort': { time: 'O(n + k)', space: 'O(k)', desc: 'Counts element occurrences' },
        'radix_sort': { time: 'O(d × n)', space: 'O(n + k)', desc: 'Sorts by digit position' },
        'bucket_sort': { time: 'O(n + k)', space: 'O(n)', desc: 'Distributes into buckets' },
        'shell_sort': { time: 'O(n log n)', space: 'O(1)', desc: 'Gap-based insertion sort' },
        'comb_sort': { time: 'O(n²)', space: 'O(1)', desc: 'Improved bubble sort with gaps' },
        'pigeonhole_sort': { time: 'O(n + k)', space: 'O(k)', desc: 'Uses pigeonhole principle' },
        'cycle_sort': { time: 'O(n²)', space: 'O(1)', desc: 'Minimizes memory writes' }
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
        alert('Please start sorting first');
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
    
    if (step.array) {
        updateBars(step.array);
    }
    
    switch (step.action) {
        case 'compare':
            highlightBars(step.indices, 'bar-comparing');
            break;
        case 'swap':
            highlightBars(step.indices, 'bar-swapping');
            break;
        case 'select_pivot':
            highlightBars([step.index], 'bar-pivot');
            break;
        case 'complete':
            highlightBars([], 'bar-sorted');
            svg.selectAll('.bar').attr('class', 'bar bar-sorted');
            break;
        default:
            if (step.indices) {
                highlightBars(step.indices, 'bar-comparing');
            }
    }
    
    setTimeout(() => {
        if (step.action !== 'complete') {
            svg.selectAll('.bar').attr('class', 'bar');
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
    if (sortingData.length > 0) {
        renderBars(sortingData);
        updateStepInfo('Animation reset. Click Play to start.');
    }
}

function generateRandomArray() {
    const size = Math.floor(Math.random() * 10) + 5;
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    document.getElementById('arrayInput').value = array.join(',');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSorting();
});