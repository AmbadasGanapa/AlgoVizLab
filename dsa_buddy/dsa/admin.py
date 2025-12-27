from django.contrib import admin
from .models import DataStructure, Algorithm, VisualizationSession

@admin.register(DataStructure)
class DataStructureAdmin(admin.ModelAdmin):
    list_display = ['name', 'structure_type', 'created_at']
    list_filter = ['structure_type', 'created_at']
    search_fields = ['name']

@admin.register(Algorithm)
class AlgorithmAdmin(admin.ModelAdmin):
    list_display = ['name', 'algorithm_type', 'complexity_time', 'complexity_space']
    list_filter = ['algorithm_type']
    search_fields = ['name']

@admin.register(VisualizationSession)
class VisualizationSessionAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'data_structure', 'algorithm', 'current_step', 'created_at']
    list_filter = ['created_at']
    search_fields = ['session_id']