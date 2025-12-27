import json
from typing import List, Dict, Any, Optional

class Node:
    def __init__(self, data: Any, next_node=None):
        self.data = data
        self.next = next_node
        self.id = id(self)

class TreeNode:
    def __init__(self, data: Any, left=None, right=None):
        self.data = data
        self.left = left
        self.right = right
        self.id = id(self)

class DSAArray:
    def __init__(self, size: int = 10):
        self.data = [None] * size
        self.size = size
        
    def insert(self, index: int, value: Any) -> Dict:
        if 0 <= index < self.size:
            old_value = self.data[index]
            self.data[index] = value
            return {
                'action': 'insert',
                'index': index,
                'value': value,
                'old_value': old_value,
                'array': self.data.copy()
            }
        raise IndexError("Index out of bounds")
    
    def delete(self, index: int) -> Dict:
        if 0 <= index < self.size:
            old_value = self.data[index]
            self.data[index] = None
            return {
                'action': 'delete',
                'index': index,
                'old_value': old_value,
                'array': self.data.copy()
            }
        raise IndexError("Index out of bounds")
    
    def search(self, value: Any) -> Dict:
        steps = []
        for i, item in enumerate(self.data):
            steps.append({'index': i, 'value': item, 'comparing': True})
            if item == value:
                steps.append({'index': i, 'value': item, 'found': True})
                return {'action': 'search', 'found': True, 'index': i, 'steps': steps}
        return {'action': 'search', 'found': False, 'steps': steps}

class DoublyNode:
    def __init__(self, data: Any, next_node=None, prev_node=None):
        self.data = data
        self.next = next_node
        self.prev = prev_node
        self.id = id(self)

class DSALinkedList:
    def __init__(self, list_type='singly'):
        self.head = None
        self.tail = None
        self.size = 0
        self.list_type = list_type  # 'singly', 'doubly', 'circular'
    
    def insert_at_beginning(self, data: Any) -> Dict:
        if self.list_type == 'doubly':
            new_node = DoublyNode(data)
            if self.head:
                new_node.next = self.head
                self.head.prev = new_node
            else:
                self.tail = new_node
            self.head = new_node
        else:
            new_node = Node(data, self.head)
            if self.list_type == 'circular' and self.size > 0:
                current = self.head
                while current.next != self.head:
                    current = current.next
                current.next = new_node
                new_node.next = self.head
            self.head = new_node
            if self.list_type == 'circular' and self.size == 0:
                new_node.next = new_node
        
        self.size += 1
        return {
            'action': 'insert_beginning',
            'data': data,
            'node_id': new_node.id,
            'list_type': self.list_type,
            'list_state': self._get_list_state()
        }
    
    def insert_at_end(self, data: Any) -> Dict:
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            if self.list_type == 'circular':
                new_node.next = new_node
        else:
            if self.list_type == 'circular':
                current = self.head
                while current.next != self.head:
                    current = current.next
                current.next = new_node
                new_node.next = self.head
            else:
                current = self.head
                while current.next:
                    current = current.next
                current.next = new_node
        self.size += 1
        return {
            'action': 'insert_end',
            'data': data,
            'node_id': new_node.id,
            'list_state': self._get_list_state()
        }
    
    def delete_by_value(self, data: Any) -> Dict:
        if not self.head:
            return {'action': 'delete', 'found': False, 'list_state': self._get_list_state()}
        
        if self.head.data == data:
            deleted_id = self.head.id
            if self.list_type == 'circular' and self.size > 1:
                current = self.head
                while current.next != self.head:
                    current = current.next
                current.next = self.head.next
            self.head = self.head.next
            self.size -= 1
            return {
                'action': 'delete',
                'found': True,
                'deleted_id': deleted_id,
                'list_state': self._get_list_state()
            }
        
        current = self.head
        while current.next and current.next.data != data:
            current = current.next
        
        if current.next:
            deleted_id = current.next.id
            current.next = current.next.next
            self.size -= 1
            return {
                'action': 'delete',
                'found': True,
                'deleted_id': deleted_id,
                'list_state': self._get_list_state()
            }
        
        return {'action': 'delete', 'found': False, 'list_state': self._get_list_state()}
    
    def _get_list_state(self) -> List[Dict]:
        nodes = []
        if not self.head:
            return nodes
        
        current = self.head
        position = 0
        visited = set()
        
        while current and current.id not in visited:
            visited.add(current.id)
            node_data = {
                'id': current.id,
                'data': current.data,
                'position': position,
                'has_next': current.next is not None,
                'has_prev': hasattr(current, 'prev') and current.prev is not None,
                'is_circular': False
            }
            
            if self.list_type == 'circular' and current.next == self.head:
                node_data['is_circular'] = True
                node_data['has_next'] = True
            
            nodes.append(node_data)
            current = current.next
            position += 1
            
            if self.list_type == 'circular' and current == self.head:
                break
                
        return nodes

class DSAStack:
    def __init__(self):
        self.items = []
    
    def push(self, item: Any) -> Dict:
        self.items.append(item)
        return {
            'action': 'push',
            'item': item,
            'stack_state': self.items.copy(),
            'size': len(self.items)
        }
    
    def pop(self) -> Dict:
        if not self.items:
            return {'action': 'pop', 'error': 'Stack is empty', 'stack_state': []}
        
        item = self.items.pop()
        return {
            'action': 'pop',
            'item': item,
            'stack_state': self.items.copy(),
            'size': len(self.items)
        }
    
    def peek(self) -> Dict:
        if not self.items:
            return {'action': 'peek', 'error': 'Stack is empty', 'item': None}
        
        return {
            'action': 'peek',
            'item': self.items[-1],
            'stack_state': self.items.copy()
        }

class DSAQueue:
    def __init__(self):
        self.items = []
    
    def enqueue(self, item: Any) -> Dict:
        self.items.append(item)
        return {
            'action': 'enqueue',
            'item': item,
            'queue_state': self.items.copy(),
            'size': len(self.items)
        }
    
    def dequeue(self) -> Dict:
        if not self.items:
            return {'action': 'dequeue', 'error': 'Queue is empty', 'queue_state': []}
        
        item = self.items.pop(0)
        return {
            'action': 'dequeue',
            'item': item,
            'queue_state': self.items.copy(),
            'size': len(self.items)
        }
    
    def front(self) -> Dict:
        if not self.items:
            return {'action': 'front', 'error': 'Queue is empty', 'item': None}
        
        return {
            'action': 'front',
            'item': self.items[0],
            'queue_state': self.items.copy()
        }

class DSABinaryTree:
    def __init__(self):
        self.root = None
    
    def insert(self, data: Any) -> Dict:
        if not self.root:
            self.root = TreeNode(data)
            return {
                'action': 'insert',
                'data': data,
                'node_id': self.root.id,
                'tree_state': self._get_tree_state()
            }
        
        return self._insert_recursive(self.root, data)
    
    def _insert_recursive(self, node: TreeNode, data: Any) -> Dict:
        if data < node.data:
            if not node.left:
                node.left = TreeNode(data)
                return {
                    'action': 'insert',
                    'data': data,
                    'node_id': node.left.id,
                    'parent_id': node.id,
                    'position': 'left',
                    'tree_state': self._get_tree_state()
                }
            return self._insert_recursive(node.left, data)
        else:
            if not node.right:
                node.right = TreeNode(data)
                return {
                    'action': 'insert',
                    'data': data,
                    'node_id': node.right.id,
                    'parent_id': node.id,
                    'position': 'right',
                    'tree_state': self._get_tree_state()
                }
            return self._insert_recursive(node.right, data)
    
    def _get_tree_state(self) -> Dict:
        if not self.root:
            return {'nodes': [], 'edges': []}
        
        nodes = []
        edges = []
        self._traverse_for_state(self.root, nodes, edges, 0, 0)
        return {'nodes': nodes, 'edges': edges}
    
    def _traverse_for_state(self, node: TreeNode, nodes: List, edges: List, x: int, y: int, level: int = 0):
        if not node:
            return
        
        nodes.append({
            'id': node.id,
            'data': node.data,
            'x': x,
            'y': y,
            'level': level
        })
        
        spacing = max(80 - level * 15, 30)
        
        if node.left:
            edges.append({'from': node.id, 'to': node.left.id, 'type': 'left'})
            self._traverse_for_state(node.left, nodes, edges, x - spacing, y + 80, level + 1)
        
        if node.right:
            edges.append({'from': node.id, 'to': node.right.id, 'type': 'right'})
            self._traverse_for_state(node.right, nodes, edges, x + spacing, y + 80, level + 1)
    
    def inorder_traversal(self) -> List[Any]:
        result = []
        self._inorder(self.root, result)
        return result
    
    def preorder_traversal(self) -> List[Any]:
        result = []
        self._preorder(self.root, result)
        return result
    
    def postorder_traversal(self) -> List[Any]:
        result = []
        self._postorder(self.root, result)
        return result
    
    def _inorder(self, node: TreeNode, result: List):
        if node:
            self._inorder(node.left, result)
            result.append(node.data)
            self._inorder(node.right, result)
    
    def _preorder(self, node: TreeNode, result: List):
        if node:
            result.append(node.data)
            self._preorder(node.left, result)
            self._preorder(node.right, result)
    
    def _postorder(self, node: TreeNode, result: List):
        if node:
            self._postorder(node.left, result)
            self._postorder(node.right, result)
            result.append(node.data)