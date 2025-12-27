from django.db import models
import json

class DataStructure(models.Model):
    STRUCTURE_TYPES = [
        ('array', 'Array'),
        ('linked_list', 'Linked List'),
        ('stack', 'Stack'),
        ('queue', 'Queue'),
        ('binary_tree', 'Binary Tree'),
        ('graph', 'Graph'),
    ]
    
    name = models.CharField(max_length=100)
    structure_type = models.CharField(max_length=20, choices=STRUCTURE_TYPES)
    data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.structure_type})"

class Algorithm(models.Model):
    ALGORITHM_TYPES = [
        ('sorting', 'Sorting'),
        ('searching', 'Searching'),
        ('graph_traversal', 'Graph Traversal'),
        ('dynamic_programming', 'Dynamic Programming'),
    ]
    
    name = models.CharField(max_length=100)
    algorithm_type = models.CharField(max_length=20, choices=ALGORITHM_TYPES)
    complexity_time = models.CharField(max_length=50)
    complexity_space = models.CharField(max_length=50)
    description = models.TextField()
    
    def __str__(self):
        return self.name

class VisualizationSession(models.Model):
    session_id = models.CharField(max_length=100, unique=True)
    data_structure = models.ForeignKey(DataStructure, on_delete=models.CASCADE, null=True, blank=True)
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE, null=True, blank=True)
    steps = models.JSONField(default=list)
    current_step = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Session {self.session_id}"