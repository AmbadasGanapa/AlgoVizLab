from django.shortcuts import render

def home(request):
    return render(request, 'visualization/home.html')

def array_visualizer(request):
    return render(request, 'visualization/array.html')

def linked_list_visualizer(request):
    return render(request, 'visualization/linked_list.html')

def binary_tree_visualizer(request):
    return render(request, 'visualization/binary_tree.html')

def sorting_visualizer(request):
    return render(request, 'visualization/sorting.html')

def searching_visualizer(request):
    return render(request, 'visualization/searching.html')

def graph_visualizer(request):
    return render(request, 'visualization/graph.html')

def stack_visualizer(request):
    return render(request, 'visualization/stack.html')

def queue_visualizer(request):
    return render(request, 'visualization/queue.html')

def expression_visualizer(request):
    return render(request, 'visualization/expression.html')

def recursion_visualizer(request):
    return render(request, 'visualization/recursion.html')

def avl_tree_visualizer(request):
    return render(request, 'visualization/avl_tree.html')

def mst_visualizer(request):
    return render(request, 'visualization/mst.html')

def bitwise_visualizer(request):
    return render(request, 'visualization/bitwise.html')

def number_conversion_visualizer(request):
    return render(request, 'visualization/number_conversion.html')