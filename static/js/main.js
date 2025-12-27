// Main JavaScript utilities for DSA Buddy

// Global configuration
const API_BASE_URL = '/api/dsa';
let currentSessionId = null;

// Utility functions
function generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9);
}

function updateStatus(elementId, status, message) {
    const statusElement = document.getElementById(elementId);
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `badge bg-${getStatusColor(status)}`;
    }
}

function getStatusColor(status) {
    const colors = {
        'ready': 'secondary',
        'running': 'warning',
        'complete': 'success',
        'success': 'success',
        'error': 'danger'
    };
    return colors[status] || 'secondary';
}

function logOperation(message, type = 'info') {
    const logContainer = document.getElementById('operationLog');
    if (logContainer) {
        const logEntry = document.createElement('div');
        logEntry.className = `alert alert-${type} alert-sm mb-1`;
        logEntry.innerHTML = `<small>${new Date().toLocaleTimeString()}: ${message}</small>`;
        
        if (logContainer.firstChild && logContainer.firstChild.classList.contains('text-muted')) {
            logContainer.innerHTML = '';
        }
        
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    if (!themeToggle || !themeIcon) {
        console.log('Theme toggle elements not found');
        return;
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        console.log('Theme changed to:', newTheme);
    });
    
    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        console.log('Theme set to:', theme);
    }
}

// API helper functions
async function makeAPICall(endpoint, data = null, method = 'GET') {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        };
        
        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'API call failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Animation utilities
class AnimationController {
    constructor() {
        this.isPlaying = false;
        this.currentStep = 0;
        this.steps = [];
        this.speed = 500;
        this.intervalId = null;
    }
    
    loadSteps(steps) {
        this.steps = steps;
        this.currentStep = 0;
        this.updateStepDisplay();
    }
    
    play() {
        if (this.isPlaying || this.currentStep >= this.steps.length) return;
        
        this.isPlaying = true;
        this.intervalId = setInterval(() => {
            if (this.currentStep < this.steps.length) {
                this.executeStep(this.steps[this.currentStep]);
                this.currentStep++;
                this.updateStepDisplay();
            } else {
                this.pause();
            }
        }, this.speed);
    }
    
    pause() {
        this.isPlaying = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    stepForward() {
        if (this.currentStep < this.steps.length) {
            this.executeStep(this.steps[this.currentStep]);
            this.currentStep++;
            this.updateStepDisplay();
        }
    }
    
    reset() {
        this.pause();
        this.currentStep = 0;
        this.updateStepDisplay();
        this.resetVisualization();
    }
    
    setSpeed(speed) {
        this.speed = speed;
        if (this.isPlaying) {
            this.pause();
            this.play();
        }
    }
    
    updateStepDisplay() {
        const currentStepElement = document.getElementById('currentStep');
        const totalStepsElement = document.getElementById('totalSteps');
        
        if (currentStepElement) {
            currentStepElement.textContent = `Step: ${this.currentStep}`;
        }
        if (totalStepsElement) {
            totalStepsElement.textContent = `Total: ${this.steps.length}`;
        }
    }
    
    executeStep(step) {
        // Override in specific visualizers
        console.log('Executing step:', step);
    }
    
    resetVisualization() {
        // Override in specific visualizers
        console.log('Resetting visualization');
    }
}

// D3.js utilities
function createSVGElement(containerId, width = '100%', height = 300) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    container.innerHTML = '';
    return d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
}

function animateElement(selection, properties, duration = 300) {
    return selection.transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .style('opacity', properties.opacity || 1)
        .attr('transform', properties.transform || null)
        .style('fill', properties.fill || null);
}

// Input validation
function validateInput(value, type, min = null, max = null) {
    if (!value && value !== 0) return false;
    
    switch (type) {
        case 'number':
            const num = parseInt(value);
            if (isNaN(num)) return false;
            if (min !== null && num < min) return false;
            if (max !== null && num > max) return false;
            return true;
        case 'array':
            try {
                const arr = value.split(',').map(x => parseInt(x.trim()));
                return arr.every(x => !isNaN(x));
            } catch {
                return false;
            }
        default:
            return true;
    }
}

// Initialize session on page load
document.addEventListener('DOMContentLoaded', function() {
    currentSessionId = generateSessionId();
    initThemeToggle();
    console.log('DSA Buddy initialized with session:', currentSessionId);
});