from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .data_structures import DSAArray, DSALinkedList, DSABinaryTree, DSAStack, DSAQueue
from .algorithms import SortingAlgorithms, SearchingAlgorithms, GraphAlgorithms, ExpressionEvaluator, ExpressionConverter
import uuid

# Global storage for active data structures (in production, use Redis/Database)
active_structures = {}

@api_view(['POST'])
def array_operations(request):
    serializer = ArrayOperationSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        session_id = request.data.get('session_id', str(uuid.uuid4()))
        
        if session_id not in active_structures:
            active_structures[session_id] = DSAArray(data.get('size', 10))
        
        array_obj = active_structures[session_id]
        
        try:
            if data['operation'] == 'insert':
                result = array_obj.insert(data['index'], data['value'])
            elif data['operation'] == 'delete':
                result = array_obj.delete(data['index'])
            elif data['operation'] == 'search':
                result = array_obj.search(data['value'])
            
            result['session_id'] = session_id
            return Response(result, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def linked_list_operations(request):
    serializer = LinkedListOperationSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        session_id = request.data.get('session_id', str(uuid.uuid4()))
        
        if session_id not in active_structures:
            list_type = data.get('list_type', 'singly')
            active_structures[session_id] = DSALinkedList(list_type)
        
        ll_obj = active_structures[session_id]
        
        try:
            if data['operation'] == 'insert_beginning':
                result = ll_obj.insert_at_beginning(data['value'])
            elif data['operation'] == 'insert_end':
                result = ll_obj.insert_at_end(data['value'])
            elif data['operation'] == 'delete':
                result = ll_obj.delete_by_value(data['value'])
            
            result['session_id'] = session_id
            return Response(result, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def binary_tree_operations(request):
    session_id = request.data.get('session_id', str(uuid.uuid4()))
    value = request.data.get('value')
    
    if session_id not in active_structures:
        active_structures[session_id] = DSABinaryTree()
    
    tree_obj = active_structures[session_id]
    
    try:
        result = tree_obj.insert(value)
        result['session_id'] = session_id
        return Response(result, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def sorting_algorithms(request):
    serializer = SortingSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        
        try:
            if data['algorithm'] == 'bubble_sort':
                steps = SortingAlgorithms.bubble_sort(data['array'])
            elif data['algorithm'] == 'quick_sort':
                steps = SortingAlgorithms.quick_sort(data['array'])
            elif data['algorithm'] == 'merge_sort':
                steps = SortingAlgorithms.merge_sort(data['array'])
            
            return Response({
                'algorithm': data['algorithm'],
                'original_array': data['array'],
                'steps': steps,
                'total_steps': len(steps)
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def searching_algorithms(request):
    serializer = SearchingSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        
        try:
            if data['algorithm'] == 'linear_search':
                steps = SearchingAlgorithms.linear_search(data['array'], data['target'])
            elif data['algorithm'] == 'binary_search':
                steps = SearchingAlgorithms.binary_search(data['array'], data['target'])
            elif data['algorithm'] == 'interpolation_search':
                steps = SearchingAlgorithms.interpolation_search(data['array'], data['target'])
            elif data['algorithm'] == 'exponential_search':
                steps = SearchingAlgorithms.exponential_search(data['array'], data['target'])
            
            return Response({
                'algorithm': data['algorithm'],
                'array': data['array'],
                'target': data['target'],
                'steps': steps,
                'total_steps': len(steps)
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def graph_traversal(request):
    serializer = GraphTraversalSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        
        try:
            if data['algorithm'] == 'bfs':
                steps = GraphAlgorithms.bfs(data['graph'], data['start_node'])
            elif data['algorithm'] == 'dfs':
                steps = GraphAlgorithms.dfs(data['graph'], data['start_node'])
            
            return Response({
                'algorithm': data['algorithm'],
                'graph': data['graph'],
                'start_node': data['start_node'],
                'steps': steps,
                'total_steps': len(steps)
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_structure_state(request, session_id):
    if session_id in active_structures:
        structure = active_structures[session_id]
        
        if isinstance(structure, DSAArray):
            return Response({
                'type': 'array',
                'data': structure.data,
                'size': structure.size
            })
        elif isinstance(structure, DSALinkedList):
            return Response({
                'type': 'linked_list',
                'data': structure._get_list_state(),
                'size': structure.size
            })
        elif isinstance(structure, DSABinaryTree):
            return Response({
                'type': 'binary_tree',
                'data': structure._get_tree_state()
            })
        elif isinstance(structure, DSAStack):
            return Response({
                'type': 'stack',
                'data': structure.items,
                'size': len(structure.items)
            })
        elif isinstance(structure, DSAQueue):
            return Response({
                'type': 'queue',
                'data': structure.items,
                'size': len(structure.items)
            })
    
    return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def stack_operations(request):
    serializer = StackOperationSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        session_id = request.data.get('session_id', str(uuid.uuid4()))
        
        if session_id not in active_structures:
            active_structures[session_id] = DSAStack()
        
        stack_obj = active_structures[session_id]
        
        try:
            if data['operation'] == 'push':
                if not data.get('value'):
                    return Response({'error': 'Value required for push'}, status=status.HTTP_400_BAD_REQUEST)
                result = stack_obj.push(data['value'])
            elif data['operation'] == 'pop':
                result = stack_obj.pop()
            elif data['operation'] == 'peek':
                result = stack_obj.peek()
            
            result['session_id'] = session_id
            return Response(result, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def queue_operations(request):
    serializer = QueueOperationSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        session_id = request.data.get('session_id', str(uuid.uuid4()))
        
        if session_id not in active_structures:
            active_structures[session_id] = DSAQueue()
        
        queue_obj = active_structures[session_id]
        
        try:
            if data['operation'] == 'enqueue':
                if not data.get('value'):
                    return Response({'error': 'Value required for enqueue'}, status=status.HTTP_400_BAD_REQUEST)
                result = queue_obj.enqueue(data['value'])
            elif data['operation'] == 'dequeue':
                result = queue_obj.dequeue()
            elif data['operation'] == 'front':
                result = queue_obj.front()
            
            result['session_id'] = session_id
            return Response(result, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def expression_evaluation(request):
    serializer = ExpressionSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        
        try:
            steps = ExpressionEvaluator.evaluate_postfix(data['expression'])
            
            return Response({
                'expression': data['expression'],
                'steps': steps,
                'total_steps': len(steps)
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def expression_conversion(request):
    serializer = ExpressionConversionSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        
        try:
            conversion_type = data['conversion_type']
            expression = data['expression']
            
            if conversion_type == 'infix_to_postfix':
                steps = ExpressionConverter.infix_to_postfix(expression)
            elif conversion_type == 'infix_to_prefix':
                steps = ExpressionConverter.infix_to_prefix(expression)
            elif conversion_type == 'postfix_to_infix':
                steps = ExpressionConverter.postfix_to_infix(expression)
            elif conversion_type == 'postfix_to_prefix':
                steps = ExpressionConverter.postfix_to_prefix(expression)
            elif conversion_type == 'prefix_to_infix':
                steps = ExpressionConverter.prefix_to_infix(expression)
            elif conversion_type == 'prefix_to_postfix':
                steps = ExpressionConverter.prefix_to_postfix(expression)
            
            return Response({
                'conversion_type': conversion_type,
                'input_expression': expression,
                'steps': steps,
                'total_steps': len(steps)
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def tree_traversal(request):
    serializer = TreeTraversalSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        session_id = request.data.get('session_id')
        
        if session_id not in active_structures or not isinstance(active_structures[session_id], DSABinaryTree):
            return Response({'error': 'No binary tree found in session'}, status=status.HTTP_400_BAD_REQUEST)
        
        tree_obj = active_structures[session_id]
        
        try:
            if data['traversal_type'] == 'inorder':
                result = tree_obj.inorder_traversal()
            elif data['traversal_type'] == 'preorder':
                result = tree_obj.preorder_traversal()
            elif data['traversal_type'] == 'postorder':
                result = tree_obj.postorder_traversal()
            
            return Response({
                'traversal_type': data['traversal_type'],
                'result': result,
                'tree_state': tree_obj._get_tree_state()
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def clear_session(request, session_id):
    if session_id in active_structures:
        del active_structures[session_id]
        return Response({'message': 'Session cleared'}, status=status.HTTP_200_OK)
    
    return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)