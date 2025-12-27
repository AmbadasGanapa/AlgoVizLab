from typing import List, Dict, Any, Tuple
import time

class ExpressionConverter:
    @staticmethod
    def infix_to_postfix(expression: str) -> List[Dict]:
        steps = []
        stack = []
        output = []
        precedence = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}
        tokens = ExpressionConverter._tokenize(expression)
        
        for i, token in enumerate(tokens):
            steps.append({
                'action': 'read_token',
                'token': token,
                'stack': stack.copy(),
                'output': output.copy(),
                'step': len(steps)
            })
            
            if token.isalnum():
                output.append(token)
                steps.append({
                    'action': 'add_operand',
                    'token': token,
                    'stack': stack.copy(),
                    'output': output.copy(),
                    'step': len(steps)
                })
            elif token == '(':
                stack.append(token)
                steps.append({
                    'action': 'push_paren',
                    'token': token,
                    'stack': stack.copy(),
                    'output': output.copy(),
                    'step': len(steps)
                })
            elif token == ')':
                while stack and stack[-1] != '(':
                    op = stack.pop()
                    output.append(op)
                    steps.append({
                        'action': 'pop_operator',
                        'operator': op,
                        'stack': stack.copy(),
                        'output': output.copy(),
                        'step': len(steps)
                    })
                if stack:
                    stack.pop()  # Remove '('
                steps.append({
                    'action': 'remove_paren',
                    'stack': stack.copy(),
                    'output': output.copy(),
                    'step': len(steps)
                })
            else:  # Operator
                while (stack and stack[-1] != '(' and 
                       stack[-1] in precedence and
                       precedence[stack[-1]] >= precedence[token]):
                    op = stack.pop()
                    output.append(op)
                    steps.append({
                        'action': 'pop_higher_precedence',
                        'operator': op,
                        'current_token': token,
                        'stack': stack.copy(),
                        'output': output.copy(),
                        'step': len(steps)
                    })
                stack.append(token)
                steps.append({
                    'action': 'push_operator',
                    'operator': token,
                    'stack': stack.copy(),
                    'output': output.copy(),
                    'step': len(steps)
                })
        
        while stack:
            op = stack.pop()
            output.append(op)
            steps.append({
                'action': 'pop_remaining',
                'operator': op,
                'stack': stack.copy(),
                'output': output.copy(),
                'step': len(steps)
            })
        
        steps.append({
            'action': 'complete',
            'result': ' '.join(output),
            'step': len(steps)
        })
        return steps
    
    @staticmethod
    def infix_to_prefix(expression: str) -> List[Dict]:
        steps = []
        # Reverse expression and swap parentheses
        tokens = ExpressionConverter._tokenize(expression)
        reversed_tokens = []
        for token in reversed(tokens):
            if token == '(':
                reversed_tokens.append(')')
            elif token == ')':
                reversed_tokens.append('(')
            else:
                reversed_tokens.append(token)
        
        # Convert to postfix
        postfix_steps = ExpressionConverter.infix_to_postfix(' '.join(reversed_tokens))
        
        # Reverse the result
        for step in postfix_steps:
            if step['action'] == 'complete':
                result_tokens = step['result'].split()
                step['result'] = ' '.join(reversed(result_tokens))
            steps.append(step)
        
        return steps
    
    @staticmethod
    def postfix_to_infix(expression: str) -> List[Dict]:
        steps = []
        stack = []
        tokens = expression.split()
        
        for token in tokens:
            steps.append({
                'action': 'read_token',
                'token': token,
                'stack': [str(s) for s in stack],
                'step': len(steps)
            })
            
            if token.isalnum():
                stack.append(token)
                steps.append({
                    'action': 'push_operand',
                    'token': token,
                    'stack': [str(s) for s in stack],
                    'step': len(steps)
                })
            else:
                if len(stack) >= 2:
                    b = stack.pop()
                    a = stack.pop()
                    result = f"({a} {token} {b})"
                    stack.append(result)
                    steps.append({
                        'action': 'combine',
                        'operand1': str(a),
                        'operand2': str(b),
                        'operator': token,
                        'result': result,
                        'stack': [str(s) for s in stack],
                        'step': len(steps)
                    })
        
        steps.append({
            'action': 'complete',
            'result': str(stack[0]) if stack else '',
            'step': len(steps)
        })
        return steps
    
    @staticmethod
    def prefix_to_infix(expression: str) -> List[Dict]:
        steps = []
        stack = []
        tokens = expression.split()
        
        for token in reversed(tokens):
            steps.append({
                'action': 'read_token',
                'token': token,
                'stack': [str(s) for s in stack],
                'step': len(steps)
            })
            
            if token.isalnum():
                stack.append(token)
                steps.append({
                    'action': 'push_operand',
                    'token': token,
                    'stack': [str(s) for s in stack],
                    'step': len(steps)
                })
            else:
                if len(stack) >= 2:
                    a = stack.pop()
                    b = stack.pop()
                    result = f"({a} {token} {b})"
                    stack.append(result)
                    steps.append({
                        'action': 'combine',
                        'operand1': str(a),
                        'operand2': str(b),
                        'operator': token,
                        'result': result,
                        'stack': [str(s) for s in stack],
                        'step': len(steps)
                    })
        
        steps.append({
            'action': 'complete',
            'result': str(stack[0]) if stack else '',
            'step': len(steps)
        })
        return steps
    
    @staticmethod
    def postfix_to_prefix(expression: str) -> List[Dict]:
        # Convert postfix to infix, then infix to prefix
        infix_steps = ExpressionConverter.postfix_to_infix(expression)
        infix_result = infix_steps[-1]['result']
        prefix_steps = ExpressionConverter.infix_to_prefix(infix_result)
        return infix_steps + prefix_steps
    
    @staticmethod
    def prefix_to_postfix(expression: str) -> List[Dict]:
        # Convert prefix to infix, then infix to postfix
        infix_steps = ExpressionConverter.prefix_to_infix(expression)
        infix_result = infix_steps[-1]['result']
        postfix_steps = ExpressionConverter.infix_to_postfix(infix_result)
        return infix_steps + postfix_steps
    
    @staticmethod
    def _tokenize(expression: str) -> List[str]:
        tokens = []
        i = 0
        while i < len(expression):
            if expression[i].isspace():
                i += 1
            elif expression[i].isalnum():
                token = ''
                while i < len(expression) and expression[i].isalnum():
                    token += expression[i]
                    i += 1
                tokens.append(token)
            else:
                tokens.append(expression[i])
                i += 1
        return tokens

class ExpressionEvaluator:
    @staticmethod
    def evaluate_postfix(expression: str) -> List[Dict]:
        steps = []
        stack = []
        tokens = expression.split()
        
        for i, token in enumerate(tokens):
            steps.append({
                'action': 'read_token',
                'token': token,
                'stack': stack.copy(),
                'step': len(steps)
            })
            
            if token.isdigit():
                stack.append(int(token))
                steps.append({
                    'action': 'push_operand',
                    'token': token,
                    'stack': stack.copy(),
                    'step': len(steps)
                })
            else:
                if len(stack) >= 2:
                    b = stack.pop()
                    a = stack.pop()
                    result = ExpressionEvaluator._calculate(a, b, token)
                    stack.append(result)
                    steps.append({
                        'action': 'calculate',
                        'operand1': a,
                        'operand2': b,
                        'operator': token,
                        'result': result,
                        'stack': stack.copy(),
                        'step': len(steps)
                    })
        
        steps.append({
            'action': 'complete',
            'final_result': stack[0] if stack else 0,
            'step': len(steps)
        })
        return steps
    
    @staticmethod
    def _calculate(a: int, b: int, op: str) -> int:
        if op == '+': return a + b
        elif op == '-': return a - b
        elif op == '*': return a * b
        elif op == '/': return a // b if b != 0 else 0
        return 0

class SortingAlgorithms:
    @staticmethod
    def merge_sort(arr: List[int]) -> List[Dict]:
        steps = []
        arr_copy = arr.copy()
        SortingAlgorithms._merge_sort_recursive(arr_copy, 0, len(arr_copy) - 1, steps)
        return steps
    
    @staticmethod
    def _merge_sort_recursive(arr: List[int], left: int, right: int, steps: List[Dict]):
        if left < right:
            mid = (left + right) // 2
            steps.append({
                'action': 'divide',
                'left': left,
                'mid': mid,
                'right': right,
                'array': arr.copy(),
                'step': len(steps)
            })
            
            SortingAlgorithms._merge_sort_recursive(arr, left, mid, steps)
            SortingAlgorithms._merge_sort_recursive(arr, mid + 1, right, steps)
            SortingAlgorithms._merge(arr, left, mid, right, steps)
    
    @staticmethod
    def _merge(arr: List[int], left: int, mid: int, right: int, steps: List[Dict]):
        left_arr = arr[left:mid + 1]
        right_arr = arr[mid + 1:right + 1]
        
        i = j = 0
        k = left
        
        while i < len(left_arr) and j < len(right_arr):
            if left_arr[i] <= right_arr[j]:
                arr[k] = left_arr[i]
                i += 1
            else:
                arr[k] = right_arr[j]
                j += 1
            
            steps.append({
                'action': 'merge',
                'position': k,
                'value': arr[k],
                'array': arr.copy(),
                'step': len(steps)
            })
            k += 1
        
        while i < len(left_arr):
            arr[k] = left_arr[i]
            steps.append({
                'action': 'merge',
                'position': k,
                'value': arr[k],
                'array': arr.copy(),
                'step': len(steps)
            })
            i += 1
            k += 1
        
        while j < len(right_arr):
            arr[k] = right_arr[j]
            steps.append({
                'action': 'merge',
                'position': k,
                'value': arr[k],
                'array': arr.copy(),
                'step': len(steps)
            })
            j += 1
            k += 1
    
    @staticmethod
    def bubble_sort(arr: List[int]) -> List[Dict]:
        steps = []
        arr_copy = arr.copy()
        n = len(arr_copy)
        
        for i in range(n):
            for j in range(0, n - i - 1):
                steps.append({
                    'action': 'compare',
                    'indices': [j, j + 1],
                    'values': [arr_copy[j], arr_copy[j + 1]],
                    'array': arr_copy.copy(),
                    'step': len(steps)
                })
                
                if arr_copy[j] > arr_copy[j + 1]:
                    arr_copy[j], arr_copy[j + 1] = arr_copy[j + 1], arr_copy[j]
                    steps.append({
                        'action': 'swap',
                        'indices': [j, j + 1],
                        'values': [arr_copy[j], arr_copy[j + 1]],
                        'array': arr_copy.copy(),
                        'step': len(steps)
                    })
        
        steps.append({
            'action': 'complete',
            'array': arr_copy,
            'step': len(steps)
        })
        return steps
    
    @staticmethod
    def quick_sort(arr: List[int]) -> List[Dict]:
        steps = []
        arr_copy = arr.copy()
        
        def partition(low: int, high: int) -> int:
            pivot = arr_copy[high]
            steps.append({
                'action': 'select_pivot',
                'pivot_index': high,
                'pivot_value': pivot,
                'array': arr_copy.copy(),
                'step': len(steps)
            })
            
            i = low - 1
            for j in range(low, high):
                steps.append({
                    'action': 'compare_with_pivot',
                    'compare_index': j,
                    'pivot_index': high,
                    'array': arr_copy.copy(),
                    'step': len(steps)
                })
                
                if arr_copy[j] <= pivot:
                    i += 1
                    if i != j:
                        arr_copy[i], arr_copy[j] = arr_copy[j], arr_copy[i]
                        steps.append({
                            'action': 'swap',
                            'indices': [i, j],
                            'array': arr_copy.copy(),
                            'step': len(steps)
                        })
            
            arr_copy[i + 1], arr_copy[high] = arr_copy[high], arr_copy[i + 1]
            steps.append({
                'action': 'place_pivot',
                'indices': [i + 1, high],
                'array': arr_copy.copy(),
                'step': len(steps)
            })
            return i + 1
        
        def quick_sort_recursive(low: int, high: int):
            if low < high:
                pi = partition(low, high)
                quick_sort_recursive(low, pi - 1)
                quick_sort_recursive(pi + 1, high)
        
        quick_sort_recursive(0, len(arr_copy) - 1)
        steps.append({
            'action': 'complete',
            'array': arr_copy,
            'step': len(steps)
        })
        return steps

class SearchingAlgorithms:
    @staticmethod
    def interpolation_search(arr: List[int], target: int) -> List[Dict]:
        steps = []
        left, right = 0, len(arr) - 1
        
        while left <= right and target >= arr[left] and target <= arr[right]:
            if left == right:
                if arr[left] == target:
                    steps.append({'action': 'found', 'index': left, 'value': arr[left], 'step': len(steps)})
                else:
                    steps.append({'action': 'not_found', 'target': target, 'step': len(steps)})
                return steps
            
            pos = left + ((target - arr[left]) * (right - left)) // (arr[right] - arr[left])
            pos = max(left, min(pos, right))
            
            steps.append({
                'action': 'interpolate',
                'left': left,
                'right': right,
                'pos': pos,
                'array': arr.copy(),
                'step': len(steps)
            })
            
            if arr[pos] == target:
                steps.append({'action': 'found', 'index': pos, 'value': arr[pos], 'step': len(steps)})
                return steps
            
            if arr[pos] < target:
                left = pos + 1
            else:
                right = pos - 1
        
        steps.append({'action': 'not_found', 'target': target, 'step': len(steps)})
        return steps
    
    @staticmethod
    def exponential_search(arr: List[int], target: int) -> List[Dict]:
        steps = []
        
        if arr[0] == target:
            steps.append({'action': 'found', 'index': 0, 'value': arr[0], 'step': len(steps)})
            return steps
        
        bound = 1
        while bound < len(arr) and arr[bound] <= target:
            steps.append({
                'action': 'expand_bound',
                'bound': bound,
                'value': arr[bound],
                'step': len(steps)
            })
            bound *= 2
        
        left = bound // 2
        right = min(bound, len(arr) - 1)
        
        while left <= right:
            mid = (left + right) // 2
            steps.append({
                'action': 'binary_search',
                'left': left,
                'right': right,
                'mid': mid,
                'step': len(steps)
            })
            
            if arr[mid] == target:
                steps.append({'action': 'found', 'index': mid, 'value': arr[mid], 'step': len(steps)})
                return steps
            elif arr[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        steps.append({'action': 'not_found', 'target': target, 'step': len(steps)})
        return steps
    
    @staticmethod
    def linear_search(arr: List[int], target: int) -> List[Dict]:
        steps = []
        for i, value in enumerate(arr):
            steps.append({
                'action': 'check',
                'index': i,
                'value': value,
                'target': target,
                'found': value == target,
                'array': arr.copy(),
                'step': len(steps)
            })
            if value == target:
                steps.append({
                    'action': 'found',
                    'index': i,
                    'value': value,
                    'step': len(steps)
                })
                return steps
        
        steps.append({
            'action': 'not_found',
            'target': target,
            'step': len(steps)
        })
        return steps
    
    @staticmethod
    def binary_search(arr: List[int], target: int) -> List[Dict]:
        steps = []
        left, right = 0, len(arr) - 1
        
        while left <= right:
            mid = (left + right) // 2
            steps.append({
                'action': 'set_bounds',
                'left': left,
                'right': right,
                'mid': mid,
                'array': arr.copy(),
                'step': len(steps)
            })
            
            steps.append({
                'action': 'compare',
                'mid': mid,
                'mid_value': arr[mid],
                'target': target,
                'step': len(steps)
            })
            
            if arr[mid] == target:
                steps.append({
                    'action': 'found',
                    'index': mid,
                    'value': arr[mid],
                    'step': len(steps)
                })
                return steps
            elif arr[mid] < target:
                left = mid + 1
                steps.append({
                    'action': 'search_right',
                    'new_left': left,
                    'step': len(steps)
                })
            else:
                right = mid - 1
                steps.append({
                    'action': 'search_left',
                    'new_right': right,
                    'step': len(steps)
                })
        
        steps.append({
            'action': 'not_found',
            'target': target,
            'step': len(steps)
        })
        return steps

class GraphAlgorithms:
    @staticmethod
    def bfs(graph: Dict[str, List[str]], start: str) -> List[Dict]:
        steps = []
        visited = set()
        queue = [start]
        
        steps.append({
            'action': 'initialize',
            'start': start,
            'queue': queue.copy(),
            'visited': list(visited),
            'step': len(steps)
        })
        
        while queue:
            node = queue.pop(0)
            if node not in visited:
                visited.add(node)
                steps.append({
                    'action': 'visit',
                    'node': node,
                    'queue': queue.copy(),
                    'visited': list(visited),
                    'step': len(steps)
                })
                
                for neighbor in graph.get(node, []):
                    if neighbor not in visited and neighbor not in queue:
                        queue.append(neighbor)
                        steps.append({
                            'action': 'enqueue',
                            'neighbor': neighbor,
                            'queue': queue.copy(),
                            'visited': list(visited),
                            'step': len(steps)
                        })
        
        steps.append({
            'action': 'complete',
            'visited': list(visited),
            'step': len(steps)
        })
        return steps
    
    @staticmethod
    def dfs(graph: Dict[str, List[str]], start: str) -> List[Dict]:
        steps = []
        visited = set()
        stack = [start]
        
        steps.append({
            'action': 'initialize',
            'start': start,
            'stack': stack.copy(),
            'visited': list(visited),
            'step': len(steps)
        })
        
        while stack:
            node = stack.pop()
            if node not in visited:
                visited.add(node)
                steps.append({
                    'action': 'visit',
                    'node': node,
                    'stack': stack.copy(),
                    'visited': list(visited),
                    'step': len(steps)
                })
                
                for neighbor in reversed(graph.get(node, [])):
                    if neighbor not in visited:
                        stack.append(neighbor)
                        steps.append({
                            'action': 'push',
                            'neighbor': neighbor,
                            'stack': stack.copy(),
                            'visited': list(visited),
                            'step': len(steps)
                        })
        
        steps.append({
            'action': 'complete',
            'visited': list(visited),
            'step': len(steps)
        })
        return steps