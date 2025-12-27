from rest_framework import serializers
from .models import DataStructure, Algorithm, VisualizationSession

class DataStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataStructure
        fields = '__all__'

class AlgorithmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Algorithm
        fields = '__all__'

class VisualizationSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisualizationSession
        fields = '__all__'

class ArrayOperationSerializer(serializers.Serializer):
    operation = serializers.ChoiceField(choices=['insert', 'delete', 'search'])
    index = serializers.IntegerField(required=False)
    value = serializers.CharField(required=False)
    size = serializers.IntegerField(default=10)

class LinkedListOperationSerializer(serializers.Serializer):
    operation = serializers.ChoiceField(choices=['insert_beginning', 'insert_end', 'delete'])
    value = serializers.CharField()
    list_type = serializers.ChoiceField(choices=['singly', 'doubly', 'circular'], default='singly')

class StackOperationSerializer(serializers.Serializer):
    operation = serializers.ChoiceField(choices=['push', 'pop', 'peek'])
    value = serializers.CharField(required=False)

class QueueOperationSerializer(serializers.Serializer):
    operation = serializers.ChoiceField(choices=['enqueue', 'dequeue', 'front'])
    value = serializers.CharField(required=False)

class SortingSerializer(serializers.Serializer):
    algorithm = serializers.ChoiceField(choices=['bubble_sort', 'quick_sort', 'merge_sort'])
    array = serializers.ListField(child=serializers.IntegerField())

class SearchingSerializer(serializers.Serializer):
    algorithm = serializers.ChoiceField(choices=['linear_search', 'binary_search', 'interpolation_search', 'exponential_search'])
    array = serializers.ListField(child=serializers.IntegerField())
    target = serializers.IntegerField()

class ExpressionSerializer(serializers.Serializer):
    expression = serializers.CharField()

class ExpressionConversionSerializer(serializers.Serializer):
    expression = serializers.CharField()
    conversion_type = serializers.ChoiceField(choices=[
        'infix_to_postfix', 'infix_to_prefix',
        'postfix_to_infix', 'postfix_to_prefix', 
        'prefix_to_infix', 'prefix_to_postfix'
    ])
    
class TreeTraversalSerializer(serializers.Serializer):
    traversal_type = serializers.ChoiceField(choices=['inorder', 'preorder', 'postorder'])



class GraphTraversalSerializer(serializers.Serializer):
    algorithm = serializers.ChoiceField(choices=['bfs', 'dfs'])
    graph = serializers.DictField()
    start_node = serializers.CharField()