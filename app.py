from flask import Flask, jsonify, request, render_template
import json
import os
from datetime import datetime

app = Flask(__name__)

# 数据文件路径
DATA_FILE = 'tasks.json'

# 确保数据文件存在
def ensure_data_file():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)

# 加载任务数据
def load_tasks():
    ensure_data_file()
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

# 保存任务数据
def save_tasks(tasks):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(tasks, f, ensure_ascii=False, indent=2)

# 根路由，返回HTML页面
@app.route('/')
def index():
    return render_template('index.html')

# API: 获取所有任务
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = load_tasks()
    return jsonify(tasks)

# API: 添加任务
@app.route('/api/tasks', methods=['POST'])
def add_task():
    task_data = request.json
    tasks = load_tasks()
    
    new_task = {
        'id': str(datetime.now().timestamp()),
        'title': task_data['title'],
        'description': task_data.get('description', ''),
        'category': task_data.get('category', 'other'),
        'priority': task_data.get('priority', 'medium'),
        'dueDate': task_data.get('dueDate', None),
        'completed': False,
        'createdAt': datetime.now().isoformat()
    }
    
    tasks.append(new_task)
    save_tasks(tasks)
    return jsonify(new_task), 201

# API: 更新任务
@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    task_data = request.json
    tasks = load_tasks()
    
    task_index = next((i for i, t in enumerate(tasks) if t['id'] == task_id), None)
    if task_index is None:
        return jsonify({'error': 'Task not found'}), 404
    
    tasks[task_index].update(task_data)
    save_tasks(tasks)
    return jsonify(tasks[task_index])

# API: 删除任务
@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    tasks = load_tasks()
    
    task_index = next((i for i, t in enumerate(tasks) if t['id'] == task_id), None)
    if task_index is None:
        return jsonify({'error': 'Task not found'}), 404
    
    deleted_task = tasks.pop(task_index)
    save_tasks(tasks)
    return jsonify(deleted_task)

# API: 切换任务完成状态
@app.route('/api/tasks/<task_id>/toggle', methods=['PATCH'])
def toggle_task(task_id):
    tasks = load_tasks()
    
    task_index = next((i for i, t in enumerate(tasks) if t['id'] == task_id), None)
    if task_index is None:
        return jsonify({'error': 'Task not found'}), 404
    
    tasks[task_index]['completed'] = not tasks[task_index]['completed']
    save_tasks(tasks)
    return jsonify(tasks[task_index])

if __name__ == '__main__':
    # 创建templates目录（如果不存在）
    if not os.path.exists('templates'):
        os.makedirs('templates')
    
    # 创建默认任务数据
    if not os.path.exists(DATA_FILE):
        default_tasks = [
            {
                'id': '1',
                'title': '完成项目报告',
                'description': '准备下周会议的项目进度报告',
                'category': 'work',
                'priority': 'high',
                'dueDate': (datetime.now().date().isoformat()),
                'completed': False,
                'createdAt': datetime.now().isoformat()
            },
            {
                'id': '2',
                'title': '学习Python高级特性',
                'description': '阅读关于装饰器和生成器的教程',
                'category': 'study',
                'priority': 'medium',
                'dueDate': (datetime.now().date().isoformat()),
                'completed': False,
                'createdAt': datetime.now().isoformat()
            },
            {
                'id': '3',
                'title': '购买生日礼物',
                'description': '为朋友准备生日礼物',
                'category': 'life',
                'priority': 'medium',
                'dueDate': (datetime.now().date().isoformat()),
                'completed': False,
                'createdAt': datetime.now().isoformat()
            }
        ]
        save_tasks(default_tasks)
    
    app.run(debug=True, host='0.0.0.0', port=5000)