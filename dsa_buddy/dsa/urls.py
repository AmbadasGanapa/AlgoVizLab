from django.urls import path
from . import views

urlpatterns = [
    path('array/', views.array_operations, name='array_operations'),
    path('linked-list/', views.linked_list_operations, name='linked_list_operations'),
    path('binary-tree/', views.binary_tree_operations, name='binary_tree_operations'),
    path('stack/', views.stack_operations, name='stack_operations'),
    path('queue/', views.queue_operations, name='queue_operations'),
    path('sorting/', views.sorting_algorithms, name='sorting_algorithms'),
    path('searching/', views.searching_algorithms, name='searching_algorithms'),
    path('graph-traversal/', views.graph_traversal, name='graph_traversal'),
    path('expression/', views.expression_evaluation, name='expression_evaluation'),
    path('expression-conversion/', views.expression_conversion, name='expression_conversion'),
    path('tree-traversal/', views.tree_traversal, name='tree_traversal'),
    path('session/<str:session_id>/', views.get_structure_state, name='get_structure_state'),
    path('session/<str:session_id>/clear/', views.clear_session, name='clear_session'),
]