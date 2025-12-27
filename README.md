# AlgoVizLab - Interactive Data Structure and Algorithm Visualizer

A comprehensive Django-based web application for visualizing data structures and algorithms with interactive animations and step-by-step execution.

## Features

### Data Structures
- **Array**: Insert, delete, search operations with visual feedback
- **Linked List**: Dynamic node creation with pointer animations
- **Binary Tree**: Binary search tree with insertion visualization
- **Stack & Queue**: LIFO and FIFO operations (extensible)

### Algorithms
- **Sorting**: Bubble Sort, Quick Sort with step-by-step animations
- **Searching**: Linear Search, Binary Search with comparison highlighting
- **Graph Traversal**: BFS, DFS with node visitation tracking

### Interactive Features
- Real-time operation execution
- Animation controls (play, pause, step-forward, reset)
- Speed adjustment for animations
- Complexity analysis display
- Operation logging and history
- Responsive design for all devices

## Technology Stack

- **Backend**: Django 4.2, Django REST Framework
- **Frontend**: HTML5, CSS3, Bootstrap 5, D3.js
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Real-time**: Django Channels, WebSockets
- **Caching**: Redis (optional)

## Installation

### Prerequisites
- Python 3.8+
- Node.js (for frontend dependencies)
- Redis (optional, for caching)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AlgoViz-Lab
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Run development server**
   ```bash
   python manage.py runserver
   ```

7. **Access the application**
   - Open http://127.0.0.1:8000 in your browser
   - Admin panel: http://127.0.0.1:8000/admin

## Usage Guide

### Array Visualization
1. Navigate to Array section
2. Set array size and initialize
3. Perform insert/delete/search operations
4. Watch real-time visual feedback

### Linked List Operations
1. Go to Linked List visualizer
2. Insert nodes at beginning/end
3. Delete nodes by value
4. Observe pointer animations

### Sorting Algorithms
1. Access Sorting section
2. Input array or generate random data
3. Select algorithm (Bubble Sort/Quick Sort)
4. Use animation controls to step through

### Binary Tree
1. Open Binary Tree visualizer
2. Insert numeric values
3. Watch tree structure build dynamically
4. Observe BST properties maintained

## API Endpoints

### Data Structure Operations
- `POST /api/dsa/array/` - Array operations
- `POST /api/dsa/linked-list/` - Linked list operations
- `POST /api/dsa/binary-tree/` - Binary tree operations

### Algorithm Execution
- `POST /api/dsa/sorting/` - Sorting algorithms
- `POST /api/dsa/searching/` - Searching algorithms
- `POST /api/dsa/graph-traversal/` - Graph algorithms

### Session Management
- `GET /api/dsa/session/<id>/` - Get session state
- `DELETE /api/dsa/session/<id>/clear/` - Clear session

## Project Structure

```
AlgoViz-Lab/
├── dsa_buddy/              # Main Django project
│   ├── settings.py         # Django settings
│   ├── urls.py            # URL configuration
│   ├── dsa/               # DSA operations app
│   │   ├── models.py      # Data models
│   │   ├── views.py       # API views
│   │   ├── data_structures.py  # Core DS implementations
│   │   └── algorithms.py  # Algorithm implementations
│   └── visualization/     # Frontend app
│       ├── views.py       # Template views
│       └── urls.py        # Frontend URLs
├── templates/             # HTML templates
├── static/               # CSS, JavaScript, images
│   ├── css/              # Stylesheets
│   └── js/               # JavaScript files
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Extending the Application

### Adding New Data Structures
1. Implement class in `dsa/data_structures.py`
2. Add API endpoint in `dsa/views.py`
3. Create frontend template
4. Add JavaScript visualizer

### Adding New Algorithms
1. Implement in `dsa/algorithms.py`
2. Add serializer in `dsa/serializers.py`
3. Create API view
4. Build frontend interface

### Customizing Animations
- Modify CSS classes in `static/css/style.css`
- Update D3.js animations in respective JS files
- Adjust timing in `AnimationController` class

## Performance Considerations

- Array operations: O(1) for access, O(n) for search
- Linked list: O(1) for insertion at head, O(n) for search
- Binary tree: O(log n) average, O(n) worst case
- Sorting: Varies by algorithm (O(n²) to O(n log n))

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

## Roadmap

### Upcoming Features
- Graph data structure visualization
- Advanced sorting algorithms (Merge Sort, Heap Sort)
- Dynamic programming visualizations
- Algorithm complexity analyzer
- Code generation for operations
- Export/import functionality
- Mobile app version

### Performance Improvements
- WebSocket real-time updates
- Caching for large datasets
- Progressive loading
- Optimized animations