from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('array/', views.array_visualizer, name='array_visualizer'),
    path('linked-list/', views.linked_list_visualizer, name='linked_list_visualizer'),
    path('binary-tree/', views.binary_tree_visualizer, name='binary_tree_visualizer'),
    path('sorting/', views.sorting_visualizer, name='sorting_visualizer'),
    path('searching/', views.searching_visualizer, name='searching_visualizer'),
    path('graph/', views.graph_visualizer, name='graph_visualizer'),
    path('stack/', views.stack_visualizer, name='stack_visualizer'),
    path('queue/', views.queue_visualizer, name='queue_visualizer'),
    path('expression/', views.expression_visualizer, name='expression_visualizer'),
    path('recursion/', views.recursion_visualizer, name='recursion_visualizer'),
    path('avl-tree/', views.avl_tree_visualizer, name='avl_tree_visualizer'),
    path('mst/', views.mst_visualizer, name='mst_visualizer'),
    path('bitwise/', views.bitwise_visualizer, name='bitwise_visualizer'),
    path('number-conversion/', views.number_conversion_visualizer, name='number_conversion_visualizer'),
]